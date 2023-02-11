import { AiOutlineLoading3Quarters } from "react-icons/ai"

function LoadingPage() {
  return (
    <div className="absolute top-1/4">
      <AiOutlineLoading3Quarters className="h-96 w-96 animate-spin text-light-orange" />
    </div>
  )
}

export default LoadingPage
