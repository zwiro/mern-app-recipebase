import Recipe from "../models/Recipe.js"
import User from "../models/User.js"
import cloudinary from "../cloudinary/index.js"
import mongoose from "mongoose"

export const createRecipe = async (req, res) => {
  try {
    const { author, title, cuisine, ingredients, tags, description } = req.body
    const image = await cloudinary.uploader.upload(req.file.path, {
      folder: "recipe-images",
      transformation: [{ width: 800, height: 800, crop: "fill" }],
    })
    const newRecipe = new Recipe({
      author,
      title,
      cuisine,
      image: image.secure_url,
      ingredients: ingredients.split(","),
      tags: tags.split(","),
      description,
      comments: [],
      views: 0,
      likes: {},
      stars: {},
    })
    await newRecipe.save()
    const recipes = await Recipe.find()
    res.status(201).json(recipes)
  } catch (err) {
    res.status(409).json({ msg: err.message })
  }
}

export const editRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params
    const { title, cuisine, ingredients, tags, description, image, newImage } =
      req.body
    const imagePath = image.split("/")
    if (newImage) {
      await cloudinary.uploader.destroy(
        `${imagePath[7]}/${imagePath[8].slice(0, -4)}`,
        function (error, result) {
          console.log(result)
        }
      )
    }
    const updatedImage =
      req.file &&
      (await cloudinary.uploader.upload(req.file.path, {
        folder: "recipe-images",
        transformation: [{ width: 800, height: 800, crop: "fill" }],
      }))
    const recipe = await Recipe.findByIdAndUpdate(
      recipeId,
      {
        title,
        cuisine,
        ingredients: ingredients.split(","),
        tags: tags.split(","),
        description,
        image: req.file && updatedImage.secure_url,
      },
      { new: true }
    ).populate("author")
    await recipe.save()
    res.status(200).json(recipe)
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}

export const getAllRecipes = async (req, res) => {
  const { limit, sortBy, skip } = req.query
  let sort
  if (sortBy === "views") {
    sort = { views: -1 }
  } else {
    sort = { createdAt: -1 }
  }
  try {
    const recipes = await Recipe.find()
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("author")
    res.status(200).json(recipes)
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}

export const getRecipe = async (req, res) => {
  const { recipeId } = req.params
  try {
    const recipe = await Recipe.findById(recipeId).populate("author")
    res.status(200).json(recipe)
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}

export const likeRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params
    const { userId } = req.body
    const recipe = await Recipe.findById(recipeId)
    const isLiked = recipe.likes.get(userId)
    if (isLiked) {
      recipe.likes.delete(userId)
    } else {
      recipe.likes.set(userId, true)
    }
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { likes: recipe.likes },
      { new: true }
    ).populate("author")
    res.status(200).json(updatedRecipe)
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}

export const addRecipeToFavourites = async (req, res) => {
  try {
    const { recipeId } = req.params
    const { userId } = req.body
    const user = await User.findById(userId)
    const recipe = await Recipe.findById(recipeId)
    const isStared = recipe.stars.get(userId)
    if (isStared) {
      recipe.stars.delete(userId)
      user.favourites.pull(recipe)
    } else {
      recipe.stars.set(userId, true)
      user.favourites.push(recipe)
    }
    await User.findByIdAndUpdate(userId, {
      favourites: user.favourites,
    })
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { stars: recipe.stars },
      { new: true }
    ).populate("author")
    res.status(200).json(updatedRecipe)
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}

export const deleteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params
    await Recipe.findByIdAndDelete(recipeId)
    const recipes = await Recipe.find()
    res.status(200).json(recipes)
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}

export const addComment = async (req, res) => {
  try {
    const { recipeId } = req.params
    const { author, comment, date } = req.body
    const newComment = {
      id: new mongoose.Types.ObjectId(),
      author,
      comment,
      date,
    }
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { $push: { comments: newComment } },
      { new: true }
    ).populate("author")
    res.status(201).json(updatedRecipe)
  } catch (err) {
    res.status(409).json({ msg: err.message })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { recipeId, commentId } = req.params
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      {
        $pull: { comments: { id: mongoose.Types.ObjectId(commentId) } },
      },
      { new: true }
    )
    res.status(200).json(updatedRecipe)
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}

export const searchRecipes = async (req, res) => {
  try {
    const { search, tag, cuisine } = req.query
    let find
    if (search) {
      find = { title: { $regex: search, $options: "i" } }
    } else if (tag) {
      find = { tags: tag }
    } else if (cuisine) {
      find = { cuisine: cuisine }
    }
    const recipes = await Recipe.find(find)
      .collation({
        locale: `en`,
        strength: 2,
      })
      .populate("author")
    res.status(200).json(recipes)
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}

export const incrementViews = async (req, res) => {
  try {
    const { recipeId } = req.params
    const recipe = await Recipe.findById(recipeId).populate("author")
    recipe.views++
    await recipe.save()
    res.status(200).json(recipe)
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}

export const getPopularTags = async (req, res) => {
  try {
    const tags = await Recipe.aggregate(
      [
        {
          $unwind: "$tags",
        },
        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ],
      function (err, result) {
        if (err) {
          console.error(err)
        } else {
          console.log(result[0]._id)
        }
      }
    )
    res.status(200).json(tags)
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}
