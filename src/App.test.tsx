/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { GameProvider } from './state/GameProvider';

describe('mobile-safe session flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts a session and collects text plus focus-mode visual clues by tapping buttons', () => {
    render(
      <GameProvider>
        <App />
      </GameProvider>,
    );

    fireEvent.click(screen.getByText(/accept gregory/i));
    expect(screen.getByText(/turn 1\/6/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /add persistent worry to clipboard/i }));
    expect(screen.getAllByText('Persistent worry').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /open focus mode/i }));
    expect(screen.getByText(/focus mode active/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /observe bitten nails/i }));
    expect(screen.getByRole('button', { name: /bitten nails collected/i })).toBeDisabled();
  });
});
