function Sorting({ sort, sortBy }) {
  const sortingTypes = [
    { name: "Recently added", value: "recent" },
    { name: "Most viewed", value: "views" },
    { name: "Most commented", value: "comments" },
    { name: "Most liked", value: "likes" },
  ]

  return (
    <div className="mx-auto mt-4 flex w-1/2 flex-col whitespace-nowrap rounded bg-zinc-900 p-4 text-xs text-white shadow-inner shadow-black md:w-3/4 md:flex-row lg:text-base">
      <p className="mb-2 font-bold md:mb-0 md:mr-8">Sort by:</p>
      <ul className="flex w-full flex-col items-center md:flex-row md:justify-between">
        {sortingTypes.map((type, i) => (
          <li
            key={`${type.name}-${i}`}
            onClick={() => sort(type.value)}
            className={`${
              sortBy === type.value && "font-bold text-light-orange"
            } cursor-pointer hover:text-light-orange`}
          >
            {type.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sorting
