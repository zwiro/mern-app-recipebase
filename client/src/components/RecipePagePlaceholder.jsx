import { AiOutlineLoading3Quarters } from "react-icons/ai"

function RecipePagePlaceholder() {
  return (
    <div
      className={`mt-24 grid h-[80vh] w-11/12 animate-pulse place-items-center rounded bg-zinc-900 text-sm text-white shadow-inner shadow-black md:w-3/4 md:text-base`}
    >
      <AiOutlineLoading3Quarters size={200} className="animate-spin" />
    </div>
  )
}

export default RecipePagePlaceholder
