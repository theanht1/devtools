import { Component, type ReactNode } from 'react';
import { Button } from './ui';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="widget-error p-2 text-danger">
          <p>Widget crashed: {this.state.error.message}</p>
          <Button onClick={() => this.setState({ error: null })}>Reset widget</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
