export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="skeleton mb-6 h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="skeleton aspect-square w-full rounded-box" />
        <div className="space-y-4">
          <div className="skeleton h-9 w-2/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
