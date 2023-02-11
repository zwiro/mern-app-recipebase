import { useRef } from "react"
import { RiArrowLeftCircleFill } from "react-icons/ri"
import { Link } from "react-router-dom"

function Recipes({ children, title }) {
  const scrollElement = useRef()
  return (
    <div className="relative">
      <div
        ref={scrollElement}
        className="mx-3 my-6 flex snap-x flex-col overflow-x-scroll scroll-smooth rounded bg-zinc-900 p-8 pb-12 shadow-inner shadow-black"
      >
        <h2 className="my-2 text-lg font-bold text-light-orange">{title}</h2>
        <div className="grid grid-flow-col gap-8 [&>:last-of-type]:relative [&>:last-of-type]:after:absolute [&>:last-of-type]:after:left-full [&>:last-of-type]:after:h-12 [&>:last-of-type]:after:w-8">
          {children}
        </div>
        <p className="absolute right-8 bottom-12 mt-8 font-bold text-light-orange hover:underline">
          <Link to="/recipes">See more</Link>
        </p>
        <button
          id="btn-scroll-left"
          className="absolute left-10 top-1/2 scale-[300%] text-light-orange"
          onClick={() => (scrollElement.current.scrollLeft -= 350)}
        >
          <RiArrowLeftCircleFill />
        </button>
        <button
          id="btn-scroll-right"
          className="absolute right-10 top-1/2 rotate-180 scale-[300%] text-light-orange"
          onClick={() => (scrollElement.current.scrollLeft += 350)}
        >
          <RiArrowLeftCircleFill />
        </button>
      </div>
    </div>
  )
}

export default Recipes
