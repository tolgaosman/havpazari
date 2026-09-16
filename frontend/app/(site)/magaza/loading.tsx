export default function ShopLoading() {
  return (
    <div className="container-page animate-pulse pb-24 pt-32 sm:pt-36">
      <div className="mb-10 flex flex-col gap-4">
        <div className="h-3 w-24 rounded bg-gunmetal" />
        <div className="h-10 w-64 rounded bg-gunmetal" />
        <div className="h-14 rounded border border-steel bg-charcoal" />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[15rem_1fr]">
        <div className="hidden flex-col gap-6 lg:flex">
          <div className="h-40 rounded bg-gunmetal" />
          <div className="h-32 rounded bg-gunmetal" />
          <div className="h-24 rounded bg-gunmetal" />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div className="aspect-[4/5] rounded-md bg-charcoal" />
              <div className="h-3 w-1/2 rounded bg-gunmetal" />
              <div className="h-4 w-3/4 rounded bg-gunmetal" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
