import mongoose, { Schema } from "mongoose"

const RecipeSchema = new mongoose.Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    cuisine: String,
    image: {
      type: String,
      default: "",
    },
    ingredients: {
      type: Array,
      default: [],
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    comments: {
      type: Array,
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    stars: {
      type: Map,
      of: Boolean,
    },
  },
  { timestamps: true }
)

const Recipe = mongoose.model("Recipe", RecipeSchema)
export default Recipe
