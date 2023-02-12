import { useDispatch, useSelector } from "react-redux"
import { setRecipes } from "../../state"
import Recipe from "../../components/Recipe"
import { useEffect, useState } from "react"
import RecipePlaceholder from "../../components/RecipePlaceholder"
import RecipesGrid from "../../components/RecipesGrid"

function FavouritesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)
  const token = useSelector((state) => state.token)
  const recipes = useSelector((state) => state.recipes)
  const dispatch = useDispatch()
  const URL = import.meta.env.VITE_URL || "http://localhost:3001"

  const getUserFavouriteRecipes = async () => {
    setIsLoading(true)
    const res = await fetch(`${URL}/users/${user._id}/favourites`, {
      method: "GET",
      headers: { Authorization: `Bearer: ${token}` },
    })
    const data = await res.json()
    dispatch(setRecipes({ recipes: data.favourites }))
    setIsLoading(false)
  }

  useEffect(() => {
    getUserFavouriteRecipes()
  }, [])

  return (
    <RecipesGrid isFavouritesPage>
      {!isLoading ? (
        recipes.length ? (
          recipes.map((recipe) => <Recipe key={recipe._id} {...recipe} />)
        ) : (
          <p className="text-center">You have no favourite recipes!</p>
        )
      ) : (
        <RecipePlaceholder />
      )}
    </RecipesGrid>
  )
}

export default FavouritesPage
