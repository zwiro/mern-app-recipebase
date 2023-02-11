import {
  AiOutlineHeart,
  AiFillHeart,
  AiFillEye,
  AiOutlineStar,
  AiFillStar,
} from "react-icons/ai"
import { BiCommentDetail, BiRightArrow } from "react-icons/bi"
import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import Comment from "../../components/Comment"
import Comments from "../../components/Comments"
import EditForm from "../../components/EditForm"
import "react-tooltip/dist/react-tooltip.css"
import { Tooltip as ReactTooltip } from "react-tooltip"
import RecipePagePlaceholder from "../../components/RecipePagePlaceholder"
import { AnimatePresence, motion } from "framer-motion"

function RecipePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isImageOpened, setIsImageOpened] = useState(false)
  const [recipe, setRecipe] = useState({})
  const navigate = useNavigate()
  const { recipeId } = useParams()
  const userId = useSelector((state) => state.user?._id)
  const token = useSelector((state) => state.token)
  const isRecipeAuthor = Boolean(recipe.author?._id === userId)
  const [isLoading, setIsLoading] = useState(false)
  const URL = import.meta.env.VITE_URL || "localhost:3001"

  const getRecipe = async () => {
    setIsLoading(true)
    const res = await fetch(`http://${URL}/recipes/${recipeId}`, {
      method: "GET",
    })
    const data = await res.json()
    if (data.msg) {
      navigate("/error")
    }
    setRecipe(data)
    setIsLoading(false)
  }

  const likeRecipe = async () => {
    const res = await fetch(`http://${URL}/recipes/${recipeId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
    const updatedRecipe = await res.json()
    setRecipe(updatedRecipe)
  }

  const starRecipe = async () => {
    const res = await fetch(`http://${URL}/recipes/${recipeId}/favourite`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
    const updatedRecipe = await res.json()
    setRecipe(updatedRecipe)
  }

  const deleteRecipe = async () => {
    await fetch(`http://${URL}/recipes/${recipeId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    navigate("/")
  }

  const incrementViews = async () => {
    const res = await fetch(`http://${URL}/recipes/${recipeId}/view`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    const updatedRecipe = await res.json()
    setRecipe(updatedRecipe)
  }

  useEffect(() => {
    incrementViews()
  }, [])

  useEffect(() => {
    getRecipe()
  }, [])

  useEffect(() => {
    if (isImageOpened) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  })

  return (
    <>
      <AnimatePresence>
        {isEditing && (
          <EditForm
            recipe={recipe}
            setIsEditing={setIsEditing}
            setRecipe={setRecipe}
          />
        )}
      </AnimatePresence>
      {!isEditing && !isLoading ? (
        <motion.div
          animate={{
            opacity: [0, 0.5, 1],
          }}
          transition={{ duration: 0.5 }}
          className={`mt-24 flex w-11/12 flex-col rounded bg-zinc-900 text-sm text-white shadow-inner shadow-black md:w-3/4 md:text-base`}
          onClick={() => setIsImageOpened(false)}
        >
          <img
            src={recipe.image}
            alt=""
            className="h-16 w-full rounded-t object-cover opacity-10"
          />
          <div className="px-4 py-2 md:px-8">
            <div className="my-2 flex flex-col gap-4 border-b border-zinc-700 pb-2">
              <AnimatePresence>
                {isImageOpened && (
                  <motion.div
                    initial={{ y: "-200%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-200%" }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-0 left-0 z-50 grid h-screen w-screen place-items-center bg-zinc-900/90"
                  >
                    <img
                      src={recipe.image}
                      alt="Recipe's image"
                      className="rounded"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex flex-grow flex-col">
                <div className="flex flex-col items-start justify-start lg:flex-row lg:justify-between">
                  <Link to={`/recipes/cuisine/${recipe.cuisine}`}>
                    <p className="w-fit rounded bg-light-orange p-1 text-sm font-bold text-zinc-800">
                      {recipe.cuisine}
                    </p>
                  </Link>
                  <p className="my-2 text-zinc-400 lg:my-0">
                    Added&nbsp;
                    {new Date(recipe.createdAt).toLocaleDateString("en-UK")}
                  </p>
                </div>
                <h2 className="my-2 text-2xl font-bold">{recipe.title}</h2>
                <div className="flex flex-col border-b border-zinc-700 pb-2 lg:flex-row lg:justify-between">
                  <Link
                    to={`/users/${recipe.author?._id}`}
                    className="text-light-orange hover:underline"
                  >
                    by {recipe.author?.name}
                  </Link>
                  <ul className="flex flex-wrap">
                    {recipe.tags &&
                      recipe.tags.map((tag, i) => (
                        <li
                          className="text-zinc-400 hover:text-light-orange"
                          key={`${tag}-${i}`}
                        >
                          <Link to={`/recipes/tag/${tag}`}>#{tag}&nbsp;</Link>
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="flex flex-col justify-between p-2 lg:flex-row">
                  <div>
                    <h2 className="my-2 text-lg font-bold">Ingredients</h2>
                    <ul className="my-2 flex flex-col flex-wrap [&>li:last-of-type]:mb-2">
                      {recipe.ingredients?.map((ingredient, i) => (
                        <li key={`${ingredient}-${i}`}>
                          <BiRightArrow className="inline fill-light-orange" />{" "}
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <img
                    src={recipe.image}
                    alt="Recipe's image"
                    className="h-96 cursor-zoom-in self-center rounded object-cover"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.scrollTo(0, 0)
                      setIsImageOpened(true)
                    }}
                  />
                </div>
              </div>
            </div>
            <h2 className="my-2 text-lg font-bold">How to prepare</h2>
            <p className="whitespace-pre-wrap border-b border-zinc-700 p-2 text-justify">
              {recipe.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 md:gap-8">
              <div>
                <motion.button
                  whileTap={{ scale: 2 }}
                  onClick={token && likeRecipe}
                  className="flex items-center gap-1"
                  id="like-button"
                >
                  {recipe.likes && !Boolean(recipe.likes[userId]) ? (
                    <AiOutlineHeart className="transition-colors hover:fill-red-500 md:text-2xl" />
                  ) : (
                    <AiFillHeart className="fill-red-500 transition-all hover:scale-125 md:text-2xl" />
                  )}
                  {recipe.likes && Object.keys(recipe.likes).length
                    ? Object.keys(recipe.likes).length
                    : "0"}
                </motion.button>
                <ReactTooltip
                  anchorId="like-button"
                  place="bottom"
                  content={
                    token
                      ? "Like this recipe"
                      : "Please sign in to like this recipe"
                  }
                />
              </div>
              <div>
                <button className="flex items-center gap-1">
                  <BiCommentDetail className="transition-colors hover:fill-blue-500 md:text-2xl" />{" "}
                  {recipe.comments?.length ? recipe.comments?.length : "0"}
                </button>
              </div>
              <div>
                <motion.button
                  whileTap={{ scale: 2 }}
                  onClick={token && starRecipe}
                  className="flex items-center gap-1"
                  id="star-button"
                >
                  {recipe.stars && !Boolean(recipe.stars[userId]) ? (
                    <AiOutlineStar className="transition-colors hover:fill-yellow-500 md:text-2xl" />
                  ) : (
                    <AiFillStar className="fill-yellow-500 md:text-2xl" />
                  )}
                  {recipe.stars && Object.keys(recipe.stars).length
                    ? Object.keys(recipe.stars).length
                    : "0"}
                </motion.button>
                <ReactTooltip
                  anchorId="star-button"
                  place="bottom"
                  content={
                    token
                      ? "Add this recipe to favourites"
                      : "Please log in to add this recipe to favourites"
                  }
                />
              </div>
              <div className="ml-auto flex items-center gap-1">
                <AiFillEye className="transition-colors hover:fill-light-orange md:text-2xl" />{" "}
                {recipe.views ? recipe.views : "0"}
              </div>
              {token && isRecipeAuthor && (
                <div className="flex gap-2 pb-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded border border-transparent bg-light-orange px-4 py-2 text-sm font-bold text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange lg:text-base"
                  >
                    Edit
                  </button>
                  <button
                    onClick={deleteRecipe}
                    className="rounded border border-transparent bg-red-500 px-4 py-2 text-sm font-bold text-zinc-800 transition-all hover:border-red-500 hover:bg-zinc-800 hover:text-red-500 lg:text-base"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        !isEditing && <RecipePagePlaceholder />
      )}
      <Comments setRecipe={setRecipe}>
        {recipe.comments &&
          recipe.comments.map((comment, i) => (
            <Comment
              key={`${comment}-${i}`}
              {...comment}
              setRecipe={setRecipe}
            />
          ))}
      </Comments>
    </>
  )
}
export default RecipePage
