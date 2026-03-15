export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="animate-pulse space-y-8">
        {/* Title skeleton */}
        <div className="text-center space-y-4">
          <div className="h-10 bg-warm-white rounded-lg w-64 mx-auto" />
          <div className="h-5 bg-warm-white rounded-lg w-96 mx-auto" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] bg-warm-white rounded-lg" />
              <div className="h-5 bg-warm-white rounded w-3/4" />
              <div className="h-4 bg-warm-white rounded w-1/2" />
              <div className="h-4 bg-warm-white rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
