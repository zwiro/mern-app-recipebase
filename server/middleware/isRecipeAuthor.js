import Recipe from "../models/Recipe.js"

export const isRecipeAuthor = async (req, res, next) => {
  try {
    const { recipeId } = req.params
    const userId = req.user.id
    const recipe = await Recipe.findById(recipeId)
    if (recipe.author.equals(userId)) {
      next()
    }
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
