export default function ProductLoading() {
  return (
    <div className="container-page animate-pulse pb-24 pt-32 sm:pt-36">
      <div className="mb-8 h-4 w-64 rounded bg-gunmetal" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-square rounded-md border border-steel bg-charcoal" />

        <div className="flex flex-col gap-6">
          <div>
            <div className="h-3 w-40 rounded bg-gunmetal" />
            <div className="mt-3 h-10 w-3/4 rounded bg-gunmetal" />
          </div>
          <div className="h-3 w-24 rounded bg-gunmetal" />
          <div className="h-9 w-40 rounded bg-gunmetal" />
          <div className="flex flex-col gap-2">
            <div className="h-3 w-full rounded bg-gunmetal" />
            <div className="h-3 w-5/6 rounded bg-gunmetal" />
            <div className="h-3 w-2/3 rounded bg-gunmetal" />
          </div>
          <div className="h-14 rounded-full bg-gunmetal" />
          <div className="h-40 rounded border border-steel bg-charcoal" />
        </div>
      </div>
    </div>
  );
}
