import Recipes from "../../components/Recipes"
import Recipe from "../../components/Recipe"
import NewRecipeForm from "../../components/NewRecipeForm"
import { IoIosAddCircle } from "react-icons/io"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { AnimatePresence, motion } from "framer-motion"
import Hero from "../../components/Hero"

function HomePage() {
  const [popularRecipes, setPopularRecipes] = useState([])
  const [latestRecipes, setLatestRecipes] = useState([])
  const closeForm = () => setNewRecipeFormVisible(false)
  const [newRecipeFormVisible, setNewRecipeFormVisible] = useState(false)
  const user = useSelector((state) => state.user)
  const recipes = useSelector((state) => state.recipes)
  const URL = process.env.URL || "localhost:3001"

  const getLatestRecipes = async () => {
    const res = await fetch(`http://${URL}/recipes/?limit=10&sortBy=recent`, {
      method: "GET",
    })
    const data = await res.json()
    setLatestRecipes(data)
  }

  const getPopularRecipes = async () => {
    const res = await fetch(`http://${URL}/recipes/?limit=10&sortBy=views`, {
      method: "GET",
    })
    const data = await res.json()
    setPopularRecipes(data)
  }

  useEffect(() => {
    getLatestRecipes()
    getPopularRecipes()
  }, [recipes])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-24 flex w-full flex-col overflow-hidden text-sm text-white md:w-3/4 md:text-base"
    >
      <Hero />
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
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NewRecipeForm closeForm={closeForm} />
          </motion.div>
        )}
      </AnimatePresence>
      <Recipes title="Latest recipes">
        {latestRecipes.length &&
          latestRecipes.map((recipe) => (
            <Recipe {...recipe} key={recipe._id} type="popular" dashboard />
          ))}
      </Recipes>
      <Recipes title="Most popular recipes">
        {popularRecipes.length &&
          popularRecipes.map((recipe) => (
            <Recipe {...recipe} key={recipe._id} type="popular" dashboard />
          ))}
      </Recipes>
    </motion.div>
  )
}

export default HomePage
