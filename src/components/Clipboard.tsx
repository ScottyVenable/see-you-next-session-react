import { useState } from 'react';
import { useGame } from '../state/useGame';
import type { TokenSlot } from '../types';
import { TokenPill } from './TokenPill';

const slots: { id: TokenSlot; label: string }[] = [
  { id: 'clipboard', label: 'Clipboard' },
  { id: 'symptoms', label: 'Observed Symptoms' },
  { id: 'stated', label: 'Patient Stated' },
  { id: 'diagnosis', label: 'Final Diagnosis Evidence' },
];

export function Clipboard({ compact = false }: { compact?: boolean }) {
  const { state, dispatch } = useGame();
  const [selected, setSelected] = useState<string | undefined>();
  const selectedToken = state.tokens.find((token) => token.id === selected);
  const assign = (tokenId: string, slot: TokenSlot) => {
    dispatch({ type: 'ASSIGN_TOKEN', tokenId, slot });
    setSelected(tokenId);
  };

  return (
    <section className={`panel clipboard ${compact ? 'compact' : ''}`}>
      <div className="section-head">
        <div>
          <p className="eyebrow">Touchable token board</p>
          <h2>Clipboard</h2>
          <p className="muted">Tap a token, then tap a slot title. Drag tokens into slots on devices that support it.</p>
        </div>
        <span className="selected-hint" aria-live="polite">
          {selectedToken ? `Selected: ${selectedToken.label}` : 'No token selected'}
        </span>
      </div>
      <div className="slot-grid">
        {slots.map((slot) => (
          <div
            className="token-slot"
            key={slot.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const tokenId = event.dataTransfer.getData('text/token-id') || event.dataTransfer.getData('text/plain');
              if (tokenId) assign(tokenId, slot.id);
            }}
          >
            <button
              type="button"
              className="slot-title"
              disabled={!selected}
              onClick={() => selected && assign(selected, slot.id)}
              aria-label={selectedToken ? `Move ${selectedToken.label} to ${slot.label}` : `${slot.label}. Select a token first.`}
            >
              <span>{slot.label}</span>
              <small>{state.tokens.filter((token) => token.slot === slot.id).length} tokens</small>
            </button>
            <div className="token-stack">
              {state.tokens.filter((token) => token.slot === slot.id).map((token) => (
                <TokenPill
                  key={token.id}
                  token={token}
                  selected={token.id === selected}
                  actionLabel={`Select ${token.label} for slot assignment`}
                  onClick={() => setSelected(token.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
