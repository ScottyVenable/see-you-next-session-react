import type { Token } from '../types';

interface TokenPillProps {
  token: Token;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  actionLabel?: string;
}

export function TokenPill({ token, onClick, selected = false, disabled = false, actionLabel }: TokenPillProps) {
  return (
    <button
      type="button"
      className={`token-pill ${token.kind}${selected ? ' selected' : ''}`}
      draggable={!disabled}
      onClick={onClick}
      onDragStart={(event) => {
        event.dataTransfer.setData('text/token-id', token.id);
        event.dataTransfer.setData('text/plain', token.id);
        event.dataTransfer.effectAllowed = 'copyMove';
      }}
      title={token.description}
      aria-pressed={selected}
      aria-label={actionLabel ?? `${token.label}. ${token.kind} token. ${token.description}`}
      disabled={disabled}
    >
      <span>{token.label}</span>
      <small>{token.kind}</small>
    </button>
  );
}
