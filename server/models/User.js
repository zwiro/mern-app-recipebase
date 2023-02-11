import mongoose, { Schema } from "mongoose"

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  image: {
    type: String,
    default: "",
  },
  age: Number,
  location: String,
  favourites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],
})

const User = mongoose.model("User", UserSchema)
export default User
