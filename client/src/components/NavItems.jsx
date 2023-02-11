import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { setLogout } from "../state"
import LoginForm from "./LoginForm"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"

function NavItems() {
  const [loginFormVisible, setLoginFormVisible] = useState(false)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    setLoginFormVisible(false)
  }, [user])

  return (
    <>
      <ul className="mx-auto flex items-center justify-center gap-4 lg:gap-20">
        <li className="relative">
          <Link
            to="/"
            className="after:absolute after:top-full after:left-0 after:h-1 after:w-0 after:bg-red-500 after:transition-all after:hover:w-full"
          >
            Dashboard
          </Link>
        </li>
        <li className="relative">
          <Link
            to="/recipes"
            className="after:absolute after:top-full after:left-0 after:h-1 after:w-0 after:bg-red-500 after:transition-all after:hover:w-full"
          >
            All recipes
          </Link>
        </li>
        {user && (
          <>
            <li className="relative">
              <Link
                to={`user/favourites`}
                className="after:absolute after:top-full after:left-0 after:h-1 after:w-0 after:bg-red-500 after:transition-all after:hover:w-full"
              >
                Favourites
              </Link>
            </li>
          </>
        )}
      </ul>
      <div className="flex justify-center">
        {!user ? (
          <>
            <button
              onClick={() => setLoginFormVisible((prevState) => !prevState)}
              className="mr-6 ml-4 hover:brightness-110"
            >
              Sign In
            </button>
            <button className="rounded border border-transparent bg-light-orange px-4 py-2 text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange">
              <Link to="/auth/register">Sign Up</Link>
            </button>
          </>
        ) : (
          <div className="relative">
            <Link
              to={`/users/${user._id}`}
              className="mr-4 hover:brightness-110"
            >
              {user.name}
            </Link>
            <button
              onClick={() => {
                dispatch(setLogout())
                navigate("/")
              }}
              className="mx-auto hover:brightness-110"
            >
              Sign Out
            </button>
          </div>
        )}
        <AnimatePresence>
          {loginFormVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoginForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default NavItems
