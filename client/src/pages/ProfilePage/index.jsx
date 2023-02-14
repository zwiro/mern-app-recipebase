import { useDispatch, useSelector } from "react-redux"
import { setRecipes } from "../../state"
import Recipe from "../../components/Recipe"
import { AnimatePresence, motion } from "framer-motion"
import { IoIosAddCircle } from "react-icons/io"
import { useEffect, useState } from "react"
import NewRecipeForm from "../../components/NewRecipeForm"
import RecipePlaceholder from "../../components/RecipePlaceholder"
import { useNavigate, useParams } from "react-router-dom"
import { AiFillPlusCircle, AiFillHeart } from "react-icons/ai"
import { BiComment } from "react-icons/bi"
import avatar from "../../images/avatar.png"

function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const closeForm = () => setNewRecipeFormVisible(false)
  const [newRecipeFormVisible, setNewRecipeFormVisible] = useState(false)
  const [userLikes, setUserLikes] = useState([])
  const [userComments, setUserComments] = useState([])
  const dispatch = useDispatch()
  const recipes = useSelector((state) => state.recipes)
  const user = useSelector((state) => state.user)
  const { userId } = useParams()
  const [profile, setProfile] = useState({})
  const navigate = useNavigate()
  const URL = import.meta.env.VITE_URL || "http://localhost:3001"

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const getUser = async () => {
    const res = await fetch(`${URL}/users/${userId}`, {
      method: "GET",
    })
    const data = await res.json()
    if (data.msg) {
      navigate("/error")
    }
    setProfile(data)
  }

  const getUserLikes = async () => {
    const res = await fetch(`${URL}/users/${userId}/likes`)
    const data = await res.json()
    setUserLikes(data)
  }

  const getUserComments = async () => {
    const res = await fetch(`${URL}/users/${userId}/comments`)
    const data = await res.json()
    setUserComments(data)
  }

  const getUserRecipes = async () => {
    const res = await fetch(`${URL}/users/${userId}/recipes`, {
      method: "GET",
    })
    const data = await res.json()
    dispatch(setRecipes({ recipes: data }))
  }

  useEffect(() => {
    getUser()
    getUserRecipes()
    getUserLikes()
    getUserComments()
  }, [userId])

  return (
    <div className="mt-24 w-full text-sm text-white md:w-3/4 md:text-base">
      {user?._id === profile?._id && (
        <div className="flex">
          <button
            onClick={() => setNewRecipeFormVisible((prevState) => !prevState)}
            className="mx-auto flex items-center gap-1 rounded border border-transparent bg-light-orange px-4 py-2 text-sm font-bold text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange lg:text-base"
          >
            <IoIosAddCircle />
            Add a new recipe
          </button>
        </div>
      )}
      <AnimatePresence>
        {newRecipeFormVisible && user && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <NewRecipeForm closeForm={closeForm} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="m-3 flex flex-col items-center gap-16 rounded bg-zinc-900 p-8 shadow-inner shadow-black md:flex-row md:items-center">
        {profile.image ? (
          <img
            src={profile.image}
            className="h-24 w-24 rounded-full lg:h-auto lg:w-auto"
            alt=""
          />
        ) : (
          <img src={avatar} alt="" className="h-24 lg:h-48"></img>
        )}
        <div>
          <p className="text-xl font-bold">{profile?.name}</p>
          <p>{profile?.location}</p>
          <p>{profile?.age} years old</p>
        </div>
        <div className="flex flex-col items-center gap-4 md:ml-auto lg:flex-row">
          <p className="lg:-translate-y-12">
            <AiFillPlusCircle className="mr-2 inline text-xl text-light-orange" />{" "}
            Added{" "}
            <span className="font-bold text-light-orange">
              {recipes.length}
            </span>{" "}
            recipes
          </p>
          <p>
            <AiFillHeart className="mr-2 inline text-xl text-red-500" />{" "}
            Liked&nbsp;
            <span className="font-bold text-red-500">
              {userLikes.count ? userLikes.count : "0"}
            </span>{" "}
            recipes
          </p>
          <p className="lg:translate-y-12">
            <BiComment className="mr-2 inline text-xl text-blue-500" />{" "}
            Commented{" "}
            <span className="font-bold text-blue-500">
              {userComments.count}
            </span>{" "}
            recipes
          </p>
        </div>
      </div>
      <div className="m-3 rounded bg-zinc-900 p-8 shadow-inner shadow-black">
        <h2 className="my-2 text-lg font-bold text-light-orange">
          User's recipes
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-fluid gap-4"
        >
          {!isLoading ? (
            recipes.length ? (
              recipes.map((recipe) => <Recipe key={recipe._id} {...recipe} />)
            ) : (
              <p className="text-center">
                This user has not added any recipes yet
              </p>
            )
          ) : (
            <RecipePlaceholder />
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
