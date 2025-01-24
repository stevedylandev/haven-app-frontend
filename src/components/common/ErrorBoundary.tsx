import { Component, ErrorInfo, ReactNode } from "react";
import toast from "react-hot-toast";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    toast.error("Something went wrong. Please try again later.");
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-[200px] items-center justify-center text-center p-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Oops, something went wrong!
              </h2>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
