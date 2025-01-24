// Performance monitoring utilities
export const measurePerformance = (
  componentName: string,
  startTime: number
) => {
  const endTime = performance.now();
  const renderTime = endTime - startTime;

  if (renderTime > 16.67) {
    // Frame budget (60fps)
    console.warn(
      `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
    );
  }
};

// Custom hook for monitoring component performance
export const usePerformanceMonitor = (componentName: string) => {
  if (process.env.NODE_ENV === "development") {
    const startTime = performance.now();
    return () => measurePerformance(componentName, startTime);
  }
  return () => {};
};

// Helper for logging expensive re-renders
export const logRerender = (
  componentName: string,
  props: Record<string, unknown>
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Re-render in ${componentName}`, {
      props,
      timestamp: new Date().toISOString(),
    });
  }
};
