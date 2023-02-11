import express from "express"
import {
  getAllRecipes,
  likeRecipe,
  addRecipeToFavourites,
  deleteRecipe,
  getRecipe,
  addComment,
  deleteComment,
  searchRecipes,
  incrementViews,
  getPopularTags,
} from "../controllers/recipes.js"
import { verifyToken } from "../middleware/auth.js"
import { isRecipeAuthor } from "../middleware/isRecipeAuthor.js"
import { isCommentAuthor } from "../middleware/isCommentAuthor.js"

const router = express.Router()

// READ //

router.get("/", getAllRecipes)
router.get("/tags", getPopularTags)
router.get("/search/", searchRecipes)
router.get("/:recipeId", getRecipe)

// UPDATE //
router.patch("/:recipeId/like", verifyToken, likeRecipe)
router.patch("/:recipeId/favourite", verifyToken, addRecipeToFavourites)
router.patch("/:recipeId/comment", verifyToken, addComment)
router.patch("/:recipeId/view", incrementViews)
router.patch(
  "/:recipeId/:commentId",
  verifyToken,
  isCommentAuthor,
  deleteComment
)

// DELETE //
router.delete("/:recipeId", verifyToken, isRecipeAuthor, deleteRecipe)

export default router
