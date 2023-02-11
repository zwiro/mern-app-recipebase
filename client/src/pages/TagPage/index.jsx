import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import RecipesGrid from "../../components/RecipesGrid"
import Recipe from "../../components/Recipe"
import { setRecipes } from "../../state"
import { useEffect, useState } from "react"
import RecipePlaceholder from "../../components/RecipePlaceholder"

function TagPage() {
  const [isLoading, setIsLoading] = useState(false)
  const recipes = useSelector((state) => state.recipes)
  const dispatch = useDispatch()
  const { tagName } = useParams()
  const URL = import.meta.env.VITE_URL || "localhost:3001"

  const getTaggedRecipes = async () => {
    setIsLoading(true)
    const res = await fetch(`http://${URL}/recipes/search/?tag=${tagName}`, {
      method: "GET",
    })
    const data = await res.json()
    dispatch(setRecipes({ recipes: data }))
    setIsLoading(false)
  }

  useEffect(() => {
    getTaggedRecipes()
  }, [])

  return (
    <RecipesGrid isTagPage tagName={tagName}>
      {!isLoading ? (
        recipes.length &&
        recipes.map((recipe) => <Recipe key={recipe._id} {...recipe} />)
      ) : (
        <RecipePlaceholder />
      )}
    </RecipesGrid>
  )
}

export default TagPage
