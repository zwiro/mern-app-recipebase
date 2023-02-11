import Recipe from "../models/Recipe.js"

export const isCommentAuthor = async (req, res, next) => {
  try {
    const { recipeId, commentId } = req.params
    const userId = req.user.id
    const recipe = await Recipe.findById(recipeId)
    const comment = recipe.comments.find(
      (comment) => comment.id.toString() === commentId
    )
    if (comment.author._id === userId) {
      next()
    }
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
