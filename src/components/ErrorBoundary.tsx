import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryState {
  message?: string;
  name?: string;
  detailsOpen: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { detailsOpen: false };

  static getDerivedStateFromError(error: Error) {
    return { name: error.name, message: error.message, detailsOpen: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Clinical workstation failure', error, errorInfo);
  }

  render() {
    if (this.state.message) {
      return (
        <main className="app-shell">
          <section className="panel error-panel">
            <p className="eyebrow">Workstation recovery</p>
            <h1>Session paused</h1>
            <p>The interface hit a recoverable boundary. Current state was not silently discarded.</p>
            <div className="error-readout">
              <strong>{this.state.name ?? 'Error'}</strong>
              <span>{this.state.message}</span>
            </div>
            <div className="button-row">
              <button type="button" onClick={() => window.location.reload()}>Reload workstation</button>
              <button type="button" className="secondary" onClick={() => this.setState({ detailsOpen: !this.state.detailsOpen })}>
                {this.state.detailsOpen ? 'Hide details' : 'Show details'}
              </button>
            </div>
            {this.state.detailsOpen && (
              <p className="muted">If this repeats, capture the visible screen, the last action taken, and the console readout.</p>
            )}
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
