import { AiOutlineLoading3Quarters } from "react-icons/ai"

function LoadingPage() {
  return (
    <div className="absolute top-1/3">
      <AiOutlineLoading3Quarters className="h-48 w-48 animate-spin text-light-orange" />
    </div>
  )
}

export default LoadingPage
