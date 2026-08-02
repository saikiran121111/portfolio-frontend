import LoadingMark from "@/components/portfolio/loading/LoadingMark";

export default function Loading() {
  return (
    <main className="route-loading" aria-live="polite" aria-busy="true">
      <div className="route-loading-content" role="status" aria-label="Loading page">
        <LoadingMark className="route-loading-mark" />
      </div>
    </main>
  );
}
