import { useSelector, useDispatch } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { TiDelete } from "react-icons/ti"
import "react-tooltip/dist/react-tooltip.css"
import { Tooltip as ReactTooltip } from "react-tooltip"
import { setRecipes } from "../state"
import { motion } from "framer-motion"
import avatar from "../images/avatar.png"

function Comment({ author, comment, date, id, setRecipe }) {
  const { recipeId } = useParams()
  const token = useSelector((state) => state.token)
  const userId = useSelector((state) => state.user?._id)
  const isCommentAuthor = Boolean(userId === author._id)
  const dispatch = useDispatch()
  const URL = import.meta.env.VITE_URL || "localhost:3001"

  const deleteComment = async (commentId) => {
    const res = await fetch(`http://${URL}/recipes/${recipeId}/${commentId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
    const updatedRecipe = await res.json()
    dispatch(setRecipes({ recipes: updatedRecipe }))
    setRecipe(updatedRecipe)
  }
  return (
    <motion.div
      animate={{ height: [0, 100] }}
      className="group mx-16 mt-2 flex flex-col"
    >
      <div className="mb-2 flex items-center gap-2">
        <Link to={`/users/${author._id}`}>
          {author.image ? (
            <img
              src={author.image}
              alt="User's image"
              className="h-8 w-8 rounded-full transition-all hover:scale-125"
            />
          ) : (
            <img src={avatar} alt="" className="h-8 w-8"></img>
          )}
        </Link>
        <p className="font-bold text-light-orange hover:underline">
          <Link to={`/users/${author._id}`}>{author.name}</Link>
        </p>
        <p className="ml-auto text-sm text-zinc-400">
          {new Date(date).toLocaleDateString("en-UK")}
        </p>
      </div>
      <div className="flex justify-between border-b border-zinc-700">
        <p className="mb-2 flex-1">{comment}</p>
        {isCommentAuthor && (
          <>
            <TiDelete
              onClick={() => deleteComment(id)}
              className="my-2 h-4 w-4 cursor-pointer self-end opacity-0 hover:text-red-500 group-hover:opacity-100 lg:h-6 lg:w-6"
              id={`delete-button-${id}`}
            >
              delete
            </TiDelete>
            <ReactTooltip
              anchorId={`delete-button-${id}`}
              place="bottom"
              content="Delete this comment"
            />
          </>
        )}
      </div>
    </motion.div>
  )
}

export default Comment
