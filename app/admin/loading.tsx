export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-24 w-full rounded-box" />
        ))}
      </div>
      <div className="skeleton h-64 w-full rounded-box" />
    </div>
  );
}
