import { useReportWebVitals } from "next/web-vitals";

export default function WebVitals() {
  useReportWebVitals((metric) => {
    // only print in development environment
    if (process.env.NODE_ENV === "development") {
      console.log(metric);
    }
  });

  return <></>;
}
