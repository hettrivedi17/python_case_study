import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl text-center border border-red-100">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">System Hiccup</h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed">
              Something went wrong while loading this page. Our engineers have been notified.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:scale-105 transition-all"
            >
              Return to Safety
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
