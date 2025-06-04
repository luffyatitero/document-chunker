import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can log error here
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-600 p-4">Something went wrong: {String(this.state.error)}</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;