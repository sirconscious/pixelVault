export default function StoreLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="skeleton mb-8 h-10 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton aspect-video w-full rounded-box" />
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
