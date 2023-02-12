import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import RecipesGrid from "../../components/RecipesGrid"
import Recipe from "../../components/Recipe"
import { setRecipes } from "../../state"
import { useEffect, useState } from "react"
import RecipePlaceholder from "../../components/RecipePlaceholder"

function CuisinePage() {
  const [isLoading, setIsLoading] = useState(false)
  const recipes = useSelector((state) => state.recipes)
  const dispatch = useDispatch()
  const { cuisineName } = useParams()
  const URL = import.meta.env.VITE_URL || "localhost:3001"

  const getCuisineRecipes = async () => {
    setIsLoading(true)
    const res = await fetch(
      `https://${URL}/recipes/search/?cuisine=${cuisineName}`,
      {
        method: "GET",
      }
    )
    const data = await res.json()
    dispatch(setRecipes({ recipes: data }))
    setIsLoading(false)
  }

  useEffect(() => {
    getCuisineRecipes()
  }, [])

  return (
    <RecipesGrid isCuisinePage cuisineName={cuisineName}>
      {!isLoading ? (
        recipes.length &&
        recipes.map((recipe) => <Recipe key={recipe._id} {...recipe} />)
      ) : (
        <RecipePlaceholder />
      )}
    </RecipesGrid>
  )
}

export default CuisinePage
