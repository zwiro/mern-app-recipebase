import express from "express"
import {
  getUser,
  getUserRecipes,
  getUserFavouriteRecipes,
  getUserLikes,
  getUserComments,
} from "../controllers/users.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// READ //
router.get("/:userId/recipes", getUserRecipes)
router.get("/:userId/favourites", getUserFavouriteRecipes)
router.get("/:userId/comments", getUserComments)
router.get("/:userId/likes", getUserLikes)
router.get("/:userId", getUser)

export default router
