import { AiOutlineHeart, AiFillHeart, AiFillEye } from "react-icons/ai"
import { BiCommentDetail } from "react-icons/bi"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setRecipe, setRecipes } from "../state"
import "react-tooltip/dist/react-tooltip.css"
import { Tooltip as ReactTooltip } from "react-tooltip"

function Recipe({
  _id,
  title,
  image,
  tags,
  author,
  createdAt,
  likes,
  views,
  comments,
  dashboard,
  type,
}) {
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.user?._id)
  const token = useSelector((state) => state.token)
  const navigate = useNavigate()
  const URL = import.meta.env.VITE_URL || "localhost:3001"

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  }

  const likeRecipe = async () => {
    const res = await fetch(`http://${URL}/recipes/${_id}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
    const updatedRecipe = await res.json()
    dashboard
      ? dispatch(setRecipes({ recipes: updatedRecipe }))
      : dispatch(setRecipe({ recipe: updatedRecipe }))
  }

  return (
    <motion.div
      variants={item}
      className={`${
        dashboard ? "w-80" : "w-auto"
      } flex max-w-2xl snap-center flex-col gap-4 rounded border border-zinc-700 bg-zinc-800 p-4 shadow-md`}
    >
      <p className="truncate font-bold hover:underline">
        <Link to={`/recipes/${_id}`}>{title}</Link>
      </p>
      <div className="max-h-96 overflow-hidden rounded transition-all duration-1000 hover:shadow-xl hover:shadow-black">
        <Link to={`/recipes/${_id}`}>
          <img
            src={image}
            alt="Recipe's image"
            className="h-72 w-full rounded object-cover transition-all duration-1000 ease-linear hover:scale-125"
          />
        </Link>
      </div>
      <p className="truncate text-zinc-400">
        {tags.map((tag, i) => (
          <Link
            to={`/recipes/tag/${tag}`}
            className="cursor-pointer hover:text-light-orange"
            onClick={() => navigate(`/recipes/tag/${tag}`)}
            key={`${tag}-${i}`}
          >
            #{tag}&nbsp;
          </Link>
        ))}
      </p>
      <div className="flex justify-between gap-4 text-zinc-400">
        <p className="text-light-orange">
          by{" "}
          <Link to={`/users/${author._id}`} className="hover:underline">
            {author.name}
          </Link>
        </p>
        <p>{new Date(createdAt).toLocaleDateString("en-UK")}</p>
      </div>
      <div className="flex items-center gap-1 md:gap-4">
        <motion.button
          whileTap={{ scale: 2 }}
          onClick={token && likeRecipe}
          className="flex items-center gap-1"
          id={`like-button-${_id}-${type}`}
        >
          {!Boolean(likes[userId]) ? (
            <AiOutlineHeart className="transition-all hover:scale-125 hover:fill-red-500" />
          ) : (
            <AiFillHeart className="fill-red-500" />
          )}
          {Object.keys(likes).length ? Object.keys(likes).length : "0"}
        </motion.button>
        <ReactTooltip
          anchorId={`like-button-${_id}-${type}`}
          place="bottom"
          content={
            token
              ? !Boolean(likes[userId])
                ? "Like this recipe"
                : "Unlike this recipe"
              : "Please log in to like this recipe"
          }
        />
        <Link to={`/recipes/${_id}`}>
          <button
            className="flex items-center gap-1"
            id={`comment-button-${_id}-${type}`}
          >
            <BiCommentDetail className="transition-colors hover:fill-blue-500" />{" "}
            {comments.length ? comments.length : "0"}
          </button>
        </Link>
        <ReactTooltip
          anchorId={`comment-button-${_id}-${type}`}
          place="bottom"
          content={`${
            token
              ? "Comment this recipe"
              : "Please log in to comment this recipe"
          }`}
        />
        <div className="flex items-center gap-1">
          <AiFillEye className="transition-colors hover:fill-light-orange" />{" "}
          {views ? views : "0"}
        </div>
        <button
          onClick={() => navigate(`/recipes/${_id}`)}
          className="ml-auto rounded border border-transparent bg-light-orange px-4 py-2 text-sm font-bold text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange lg:text-base"
        >
          See recipe
        </button>
      </div>
    </motion.div>
  )
}

export default Recipe
