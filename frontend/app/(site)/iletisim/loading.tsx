export default function ContactLoading() {
  return (
    <div className="container-page animate-pulse pb-24 pt-32 sm:pt-36">
      <div className="max-w-2xl">
        <div className="h-3 w-20 rounded bg-gunmetal" />
        <div className="mt-2 h-10 w-72 rounded bg-gunmetal" />
        <div className="mt-4 h-3 w-full rounded bg-gunmetal" />
      </div>

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex gap-4">
              <div className="size-11 shrink-0 rounded-full bg-gunmetal" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-3 w-24 rounded bg-gunmetal" />
                <div className="h-3 w-40 rounded bg-gunmetal" />
              </div>
            </div>
          ))}
        </div>
        <div className="min-h-[24rem] rounded-lg border border-steel bg-charcoal" />
      </div>
    </div>
  );
}
