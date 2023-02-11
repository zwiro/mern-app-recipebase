import { useState } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setRecipes } from "../state"

function Comments({ children, setRecipe }) {
  const [comment, setComment] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const { recipeId } = useParams()
  const token = useSelector((state) => state.token)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const URL = import.meta.env.VITE_URL || "localhost:3001"

  const addComment = async (e) => {
    e.preventDefault()
    if (comment) {
      setIsLoading(true)
      const date = new Date()
      const res = await fetch(`http://${URL}/recipes/${recipeId}/comment`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author: user, comment, date }),
      })
      const updatedRecipe = await res.json()
      dispatch(setRecipes({ recipes: updatedRecipe }))
      setRecipe(updatedRecipe)
      setComment("")
      setIsLoading(false)
    } else return
  }
  return (
    <div className="my-6 flex w-11/12 flex-col items-center justify-center rounded bg-zinc-900 p-4 text-white shadow-inner shadow-black md:w-1/2">
      <div className="w-full">
        {user && (
          <form
            onSubmit={addComment}
            className="flex flex-col items-center justify-center gap-4 border-b border-zinc-700 pb-4 md:flex-row"
          >
            <label className="block text-center" htmlFor="comment">
              Leave a comment
            </label>
            <textarea
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className="my-2 w-full rounded border border-zinc-700 bg-zinc-800 px-2 font-normal"
              name="comment"
              id="comment"
              cols=""
              rows="2"
            ></textarea>
            <button
              className="rounded border border-transparent bg-light-orange p-2 text-sm font-bold text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange"
              type="submit"
            >
              {!isLoading ? (
                "Submit"
              ) : (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
            </button>
          </form>
        )}
        {children && children.length ? (
          <div>{children}</div>
        ) : (
          <p className="my-2 text-center">There are no comments yet.</p>
        )}
      </div>
    </div>
  )
}

export default Comments
