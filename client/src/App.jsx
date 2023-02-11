import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import { useSelector } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Footer from "./components/Footer"
import React, { Suspense } from "react"
import LoadingPage from "./components/LoadingPage"

function App() {
  const isAuth = Boolean(useSelector((state) => state.token))
  const CuisinePage = React.lazy(() => import("./pages/CuisinePage"))
  const RegisterPage = React.lazy(() => import("./pages/RegisterPage"))
  const RecipesPage = React.lazy(() => import("./pages/RecipesPage"))
  const RecipePage = React.lazy(() => import("./pages/RecipePage"))
  const HomePage = React.lazy(() => import("./pages/HomePage"))
  const ProfilePage = React.lazy(() => import("./pages/ProfilePage"))
  const FavouritesPage = React.lazy(() => import("./pages/FavouritesPage"))
  const SearchPage = React.lazy(() => import("./pages/SearchPage"))
  const TagPage = React.lazy(() => import("./pages/TagPage"))
  const ErrorPage = React.lazy(() => import("./pages/ErrorPage"))

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900">
      <BrowserRouter>
        <Navbar />
        <ToastContainer limit={1} autoClose={1000} />
        <main className="grid place-items-center">
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/recipes/:recipeId" element={<RecipePage />} />
              <Route
                path="/user/favourites"
                element={isAuth ? <FavouritesPage /> : <HomePage />}
              />
              <Route
                path="/recipes/search/:searchedPhrase"
                element={<SearchPage />}
              />
              <Route path="/recipes/tag/:tagName" element={<TagPage />} />
              <Route
                path="/recipes/cuisine/:cuisineName"
                element={<CuisinePage />}
              />
              <Route path="/users/:userId" element={<ProfilePage />} />
              <Route
                path="/auth/register"
                element={!isAuth ? <RegisterPage /> : <Navigate to="/" />}
              />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
