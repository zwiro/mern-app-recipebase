import { useDispatch, useSelector } from "react-redux"
import { setRecipes } from "../../state"
import Recipe from "../../components/Recipe"
import { useEffect, useState } from "react"
import RecipePlaceholder from "../../components/RecipePlaceholder"
import RecipesGrid from "../../components/RecipesGrid"
import { BsFillArrowRightCircleFill } from "react-icons/bs"

function RecipesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState("recent")
  const [limit, setLimit] = useState(20)
  const [skip, setSkip] = useState(0)
  const [allRecipes, setAllRecipes] = useState([])
  const [recipesCount, setRecipesCount] = useState()
  const dispatch = useDispatch()
  const recipes = useSelector((state) => state.recipes)
  const URL = import.meta.env.VITE_URL || "localhost:3001"

  const getRecipes = async () => {
    setIsLoading(true)
    const res = await fetch(`https://${URL}/recipes/`, {
      method: "GET",
    })
    const recipes = await res.json()
    dispatch(setRecipes({ recipes }))
    setRecipesCount(recipes.length)
    setIsLoading(false)
  }

  const sort = (type) => {
    setSortBy(type)
  }

  useEffect(() => {
    {
      if (recipes.length) {
        setAllRecipes(recipes.slice(skip, limit))
      }
    }
  }, [skip])

  useEffect(() => {
    getRecipes()
  }, [])

  useEffect(() => {
    if (recipes.length) {
      switch (sortBy) {
        case "recent":
          dispatch(
            setRecipes({
              recipes: [...recipes].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              ),
            })
          )

          break
        case "views":
          dispatch(
            setRecipes({
              recipes: [...recipes].sort((a, b) => b.views - a.views),
            })
          )

          break
        case "comments":
          dispatch(
            setRecipes({
              recipes: [...recipes].sort(
                (a, b) => b.comments.length - a.comments.length
              ),
            })
          )

          break
        case "likes":
          dispatch(
            setRecipes({
              recipes: [...recipes].sort(
                (a, b) =>
                  Object.keys(b.likes).length - Object.keys(a.likes).length
              ),
            })
          )

          break
      }
    }
  }, [sortBy])

  useEffect(() => {
    setSkip(0)
    setLimit(20)
    {
      if (recipes) {
        setAllRecipes(recipes.slice(skip, limit))
      }
    }
  }, [recipes])

  return (
    <RecipesGrid sort={sort} sortBy={sortBy} isAllRecipesPage>
      {!isLoading ? (
        allRecipes.length &&
        allRecipes.map((recipe) => (
          <Recipe key={recipe._id} {...recipe} isAllRecipesPage />
        ))
      ) : (
        <RecipePlaceholder />
      )}
      <div className="col-span-full flex justify-between">
        {skip > 0 && (
          <button
            onClick={() => {
              setSkip((prevSkip) => prevSkip - 20)
              setLimit((prevLimit) => prevLimit - 20)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="flex items-center gap-2 rounded border border-transparent bg-light-orange px-4 py-2 text-sm font-bold text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange lg:text-base"
          >
            <BsFillArrowRightCircleFill className="inline rotate-180" />{" "}
            Previous
          </button>
        )}
        {limit <= recipesCount && (
          <button
            onClick={() => {
              setSkip((prevSkip) => prevSkip + 20)
              setLimit((prevLimit) => prevLimit + 20)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="ml-auto flex items-center gap-2 rounded border border-transparent bg-light-orange px-4 py-2 text-sm font-bold text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange lg:text-base"
          >
            Next <BsFillArrowRightCircleFill className="inline" />
          </button>
        )}
      </div>
    </RecipesGrid>
  )
}

export default RecipesPage
