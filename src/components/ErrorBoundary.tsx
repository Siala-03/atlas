import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error("Atlas storefront crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-cream px-4">
          <div className="max-w-md text-center">
            <h1 className="font-serif text-3xl font-semibold text-ink">Something went wrong</h1>
            <p className="mt-3 text-ink/60">
              We hit an unexpected error. Please refresh the page — if this keeps
              happening, contact the Atlas team.
            </p>
            <button
              onClick={() => window.location.assign("/")}
              className="mt-6 rounded-full bg-burgundy-800 px-6 py-3 text-sm font-semibold text-cream hover:bg-burgundy-900">
              Reload storefront
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
