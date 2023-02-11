import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import cloudinary from "../cloudinary/index.js"

export const register = async (req, res) => {
  try {
    const { name, email, password, age, location } = req.body
    const checkUser = await User.findOne().or([
      { email: email },
      { name: name },
    ])
    if (checkUser) {
      return res.status(400).send({ err: "User already exists." })
    }
    const image =
      req.file &&
      (await cloudinary.uploader.upload(req.file.path, {
        folder: "user-images",
        transformation: [
          { width: 200, height: 200, gravity: "face", crop: "thumb" },
        ],
      }))
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)
    const newUser = new User({
      name,
      email,
      password: passwordHash,
      image: req.file && image.secure_url,
      age,
      location,
      favourites: [],
    })
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) return res.status(400).json({ err: "Invalid credentials!" })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ err: "Invalid credentials!" })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    delete user.password
    res.status(200).json({ token, user })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
