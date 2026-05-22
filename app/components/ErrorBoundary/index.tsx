"use client";

import { ErrorFallback } from "@components/ErrorFallback";
import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  resetKey: number;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, resetKey: 0 };

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState((state) => ({
      hasError: false,
      resetKey: state.resetKey + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />;
    }

    return <div key={this.state.resetKey}>{this.props.children}</div>;
  }
}

export { ErrorBoundary };
