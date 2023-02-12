import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Tags() {
  const [tags, setTags] = useState()
  const URL = import.meta.env.VITE_URL || "http://localhost:3001"

  const getTags = async () => {
    const res = await fetch(`${URL}/recipes/tags`, {
      method: "GET",
    })
    const data = await res.json()
    setTags(data)
  }

  useEffect(() => {
    getTags()
  }, [])

  return (
    <div className="mx-auto mt-4 flex w-1/2 flex-col whitespace-nowrap rounded bg-zinc-900 p-4 text-xs text-white shadow-inner shadow-black md:w-3/4 md:flex-row lg:text-base">
      <p className="mb-2 font-bold md:mb-0 md:mr-8">Popular tags:</p>
      <ul className="flex w-full flex-col flex-wrap items-center gap-4 md:flex-row xl:text-base">
        {tags &&
          tags.map((tag, i) => (
            <Link key={`${tag._id}-${i}`} to={`/recipes/tag/${tag._id}`}>
              <li className="hover:text-light-orange">
                #{tag._id} ({tag.count})
              </li>
            </Link>
          ))}
      </ul>
    </div>
  )
}

export default Tags
