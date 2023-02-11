import express from "express"
import {
  getUser,
  getUserRecipes,
  getUserFavouriteRecipes,
} from "../controllers/users.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// READ //
router.get("/:userId/recipes", getUserRecipes)
router.get("/:userId/favourites", getUserFavouriteRecipes)
router.get("/:userId", getUser)

export default router
