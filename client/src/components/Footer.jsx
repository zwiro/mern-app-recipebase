import { AiFillGithub } from "react-icons/ai"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="mt-auto flex w-full items-center justify-center border-t border-zinc-700 bg-zinc-800 px-6 py-4 text-sm font-bold text-light-orange lg:text-base">
      <p>Recipebase 2023 &copy;</p>
      <Link to="https://github.com/zwiro" className="ml-auto">
        <AiFillGithub />
      </Link>
    </footer>
  )
}

export default Footer
