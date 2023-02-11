function RecipePlaceholder() {
  return (
    <div
      className="flex w-72
       animate-pulse snap-center flex-col gap-4 rounded border border-zinc-700 bg-zinc-800 p-4 shadow-md lg:w-80"
    >
      <p className="h-6 w-16 bg-zinc-900 font-bold"></p>
      <div className="max-h-96 overflow-hidden rounded transition-all duration-1000">
        <div
          className="h-72 w-full rounded bg-zinc-900 object-cover transition-all 
          duration-1000 ease-linear"
        ></div>
      </div>
      <p className="h-6 w-16 truncate bg-zinc-900"></p>
      <div className="flex justify-between gap-4">
        <p className="h-6 w-16 bg-zinc-900"></p>
        <p className="h-6 w-16 bg-zinc-900"></p>
      </div>
      <div className="flex items-center gap-1 md:gap-4">
        <button className="flex h-6 w-8 items-center gap-1 bg-zinc-900"></button>
        <button className="flex h-6 w-8 items-center gap-1 bg-zinc-900"></button>
        <div className="flex h-6 w-8 items-center gap-1 bg-zinc-900"></div>
        <button className="ml-auto h-6 w-16 bg-zinc-900"></button>
      </div>
    </div>
  )
}

export default RecipePlaceholder
