import { Component } from "react";

/**
 * Catches render errors in a subtree and renders a fallback instead of
 * unmounting the whole app. Useful around independent sections so a single
 * component failure degrades gracefully rather than blanking the page.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Section render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}