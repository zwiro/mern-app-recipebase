import { useDispatch, useSelector } from "react-redux"
import { setRecipes } from "../../state"
import Recipe from "../../components/Recipe"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import RecipesGrid from "../../components/RecipesGrid"
import RecipePlaceholder from "../../components/RecipePlaceholder"

function SearchPage() {
  const dispatch = useDispatch()
  const recipes = useSelector((state) => state.recipes)
  const { searchedPhrase } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const URL = import.meta.env.VITE_URL || "localhost:3001"

  const getSearchedRecipes = async () => {
    setIsLoading(true)
    const res = await fetch(
      `https://${URL}/recipes/search/?search=${searchedPhrase}`,
      {
        method: "GET",
      }
    )
    const data = await res.json()
    dispatch(setRecipes({ recipes: data }))
    setIsLoading(false)
  }

  useEffect(() => {
    getSearchedRecipes()
  }, [])

  return (
    <RecipesGrid isSearchPage>
      {!isLoading ? (
        recipes.length ? (
          recipes.map((recipe) => <Recipe key={recipe._id} {...recipe} />)
        ) : (
          <p className="text-center">No recipes found!</p>
        )
      ) : (
        <RecipePlaceholder />
      )}
    </RecipesGrid>
  )
}

export default SearchPage
