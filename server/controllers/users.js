import User from "../models/User.js"
import Recipe from "../models/Recipe.js"

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)
    res.status(200).json(user)
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: err.message })
  }
}

export const getUserRecipes = async (req, res) => {
  try {
    const { userId } = req.params
    const userRecipes = await Recipe.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author")
    res.status(200).json(userRecipes)
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}

export const getUserLikes = async (req, res) => {
  try {
    const { userId } = req.params
    const count = await Recipe.aggregate([
      {
        $project: {
          likesArray: {
            $filter: {
              input: { $objectToArray: "$likes" },
              as: "like",
              cond: { $eq: ["$$like.v", true] },
            },
          },
        },
      },
      { $match: { "likesArray.k": userId } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ])
    res.status(200).json({ count: count[0].count })
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}

export const getUserComments = async (req, res) => {
  try {
    const { userId } = req.params
    const count = await Recipe.countDocuments({ "comments.author._id": userId })
    res.status(200).json({ count })
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}

export const getUserFavouriteRecipes = async (req, res) => {
  try {
    const { userId } = req.params
    const userFavouriteRecipes = await User.findById(userId).populate({
      path: "favourites",
      populate: { path: "author" },
    })
    res.status(200).json(userFavouriteRecipes)
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}

export const editUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findByIdAndUpdate(id, { ...req.body.user })
    await user.save()
    res.status(200).json(user)
  } catch (err) {
    res.status(404).json({ msg: err.message })
  }
}
