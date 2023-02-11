import { useSelector } from "react-redux"
import { AnimatePresence, motion } from "framer-motion"
import { IoIosAddCircle } from "react-icons/io"
import { useState } from "react"
import NewRecipeForm from "./NewRecipeForm"
import Sorting from "./Sorting"
import Tags from "./Tags"

function RecipesGrid({
  children,
  isFavouritesPage,
  isSearchPage,
  isTagPage,
  tagName,
  isCuisinePage,
  cuisineName,
  isAllRecipesPage,
  sort,
  sortBy,
}) {
  const closeForm = () => setNewRecipeFormVisible(false)
  const [newRecipeFormVisible, setNewRecipeFormVisible] = useState(false)
  const user = useSelector((state) => state.user)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }
  return (
    <div className="mt-24 w-full text-sm text-white md:w-3/4 md:text-base">
      {user && (
        <div className="flex">
          <button
            onClick={() => setNewRecipeFormVisible((prevState) => !prevState)}
            className="mx-auto flex items-center gap-1 rounded border border-transparent bg-light-orange px-4 py-2 text-sm font-bold text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange lg:text-base"
          >
            <IoIosAddCircle />
            Add a new recipe
          </button>
        </div>
      )}
      <AnimatePresence>
        {newRecipeFormVisible && user && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <NewRecipeForm closeForm={closeForm} />
          </motion.div>
        )}
      </AnimatePresence>
      {isAllRecipesPage && <Tags />}
      {isAllRecipesPage && <Sorting sort={sort} sortBy={sortBy} />}
      <div className="m-3 rounded bg-zinc-900 p-8 shadow-inner shadow-black">
        <h2 className="my-2 text-lg font-bold text-light-orange">
          {isFavouritesPage
            ? "Your favourites"
            : isSearchPage
            ? "Search results"
            : isTagPage
            ? `Browse tag #${tagName}`
            : isCuisinePage
            ? `Browse ${cuisineName}`
            : "All recipes"}
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-fluid gap-4"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

export default RecipesGrid
