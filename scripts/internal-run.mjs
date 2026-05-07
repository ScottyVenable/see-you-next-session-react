import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync, cpSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cacheHome = process.env.XDG_CACHE_HOME?.trim() ? resolve(process.env.XDG_CACHE_HOME) : join(homedir(), '.cache');
const cacheRoot = join(cacheHome, 'see-you-next-session-work');
const depsRoot = join(cacheHome, 'see-you-next-session-deps');
const depsNodeModules = join(depsRoot, 'node_modules');
const workRoot = cacheRoot;
const command = process.argv[2];
const forwardedArgs = process.argv.slice(3);

function run(executable, args, options = {}) {
  const result = spawnSync(executable, args, {
    cwd: options.cwd ?? workRoot,
    stdio: 'inherit',
    env: {
      ...process.env,
      PATH: `${join(depsNodeModules, '.bin')}:${process.env.PATH ?? ''}`,
    },
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runNode(scriptPath, args) {
  run(process.execPath, [scriptPath, ...args]);
}

function packageHash() {
  const hash = createHash('sha256');
  hash.update(readFileSync(join(projectRoot, 'package.json')));
  hash.update(readFileSync(join(projectRoot, 'package-lock.json')));
  return hash.digest('hex');
}

function ensureDependencies() {
  mkdirSync(depsRoot, { recursive: true });
  const hashPath = join(depsRoot, '.package-hash');
  const currentHash = packageHash();
  const installedHash = existsSync(hashPath) ? readFileSync(hashPath, 'utf8').trim() : '';

  if (!existsSync(depsNodeModules) || installedHash !== currentHash) {
    cpSync(join(projectRoot, 'package.json'), join(depsRoot, 'package.json'));
    cpSync(join(projectRoot, 'package-lock.json'), join(depsRoot, 'package-lock.json'));
    run('npm', ['ci', '--no-audit', '--no-fund'], { cwd: depsRoot });
    writeFileSync(hashPath, currentHash);
  }
}

function shouldCopy(sourcePath) {
  const parts = relative(projectRoot, sourcePath).split(sep);

  if (parts.includes('node_modules') || parts.includes('.git')) {
    return false;
  }

  if (parts[0] === 'android' && parts.includes('build')) {
    return false;
  }

  return true;
}

function syncToWorktree() {
  rmSync(workRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  mkdirSync(workRoot, { recursive: true });
  cpSync(projectRoot, workRoot, {
    recursive: true,
    dereference: false,
    filter: shouldCopy,
  });
  rmSync(join(workRoot, 'node_modules'), { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  symlinkSync(depsNodeModules, join(workRoot, 'node_modules'), 'dir');
}

function copyBack(pathName) {
  const source = join(workRoot, pathName);
  const target = join(projectRoot, pathName);
  if (!existsSync(source)) {
    return;
  }
  rmSync(target, { recursive: true, force: true });
  cpSync(source, target, {
    recursive: true,
    dereference: false,
    filter: (sourcePath) => !relative(source, sourcePath).split(sep).includes('build'),
  });
}

function tsc() {
  runNode(join(depsNodeModules, 'typescript/bin/tsc'), ['-b']);
}

function vite(args) {
  runNode(join(depsNodeModules, 'vite/bin/vite.js'), args);
}

function vitest(args) {
  runNode(join(depsNodeModules, 'vitest/vitest.mjs'), args);
}

function eslint(args) {
  runNode(join(depsNodeModules, 'eslint/bin/eslint.js'), args);
}

function capacitor(args) {
  runNode(join(depsNodeModules, '@capacitor/cli/bin/capacitor'), args);
}

ensureDependencies();
syncToWorktree();

switch (command) {
  case 'dev':
    vite(forwardedArgs);
    break;
  case 'preview':
    vite(['preview', ...forwardedArgs]);
    break;
  case 'build':
    tsc();
    vite(['build', ...forwardedArgs]);
    copyBack('dist');
    break;
  case 'lint':
    eslint(['.', ...forwardedArgs]);
    break;
  case 'test':
    vitest(['run', ...forwardedArgs]);
    break;
  case 'test:watch':
    vitest(forwardedArgs);
    break;
  case 'android:add':
    capacitor(['add', 'android', ...forwardedArgs]);
    copyBack('android');
    break;
  case 'android:sync':
    tsc();
    vite(['build']);
    capacitor(['sync', 'android', ...forwardedArgs]);
    copyBack('dist');
    copyBack('android');
    break;
  case 'android:open':
    capacitor(['open', 'android', ...forwardedArgs]);
    break;
  default:
    console.error(`Unknown internal-run command: ${command ?? '(missing)'}`);
    process.exit(1);
}
