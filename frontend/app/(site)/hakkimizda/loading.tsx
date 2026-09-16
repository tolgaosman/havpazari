export default function AboutLoading() {
  return (
    <div className="animate-pulse pb-24 pt-32 sm:pt-36">
      <div className="container-page max-w-2xl">
        <div className="h-3 w-24 rounded bg-gunmetal" />
        <div className="mt-2 h-10 w-3/4 rounded bg-gunmetal" />
        <div className="mt-4 h-3 w-full rounded bg-gunmetal" />
      </div>

      <div className="mt-14 h-[50vh] w-full bg-charcoal sm:h-[60vh]" />

      <div className="container-page mt-20 sm:mt-28">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-40 rounded-lg border border-steel bg-charcoal" />
          ))}
        </div>
      </div>
    </div>
  );
}
