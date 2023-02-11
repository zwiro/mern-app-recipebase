import { useNavigate } from "react-router-dom"
import useMediaQuery from "../hooks/useMediaQuery"
import { GiHamburgerMenu } from "react-icons/gi"
import logo from "../images/logo.png"
import { useEffect, useState } from "react"
import NavItems from "./NavItems"
import { AnimatePresence, motion } from "framer-motion"
import { Link } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [sideMenuVisible, setSideMenuVisible] = useState(false)
  const [searchedPhrase, setSearchedPhrase] = useState("")

  const searchRecipes = async () => {
    navigate(`/recipes/search/${searchedPhrase}`)
  }

  useEffect(() => {
    if (isDesktop) {
      setSideMenuVisible(false)
    }
  }, [isDesktop])

  return (
    <nav className="fixed top-0 z-30 flex w-full items-center border-b border-zinc-700 bg-zinc-800 px-6 py-4 text-sm font-bold text-light-orange lg:text-base">
      <Link to="/">
        <div className="group flex items-center">
          <img
            className="h-8 transition-all group-hover:rotate-[360deg] lg:h-12"
            src={logo}
            alt=""
          />
          <p className="mx-4 font-['Lobster'] text-xl font-normal text-light-red transition-all group-hover:-skew-y-12 group-hover:brightness-125 lg:text-2xl">
            recipebase
          </p>
        </div>
      </Link>
      {!isDesktop ? (
        <GiHamburgerMenu
          className="ml-auto"
          size={40}
          onClick={() => setSideMenuVisible((prevState) => !prevState)}
        />
      ) : (
        <>
          <NavItems />
          <form onSubmit={searchRecipes}>
            <input
              onChange={(e) => setSearchedPhrase(e.target.value)}
              value={searchedPhrase}
              className="ml-6 rounded border border-zinc-700 bg-zinc-800 px-2 font-normal text-white placeholder:text-light-orange"
              type="text"
              placeholder="🔎 Search..."
            />
          </form>
        </>
      )}
      <AnimatePresence>
        {sideMenuVisible && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="absolute top-full right-0 rounded rounded-bl-xl border border-zinc-700 bg-zinc-800 [&>ul]:m-8 [&>ul]:flex-col [&>ul]:gap-12 [&>div]:p-4 "
          >
            <NavItems />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
