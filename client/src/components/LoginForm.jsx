import useMediaQuery from "../hooks/useMediaQuery"
import { useFormik } from "formik"
import * as yup from "yup"
import { useDispatch } from "react-redux"
import { setLogin } from "../state"
import { useState } from "react"

function LoginForm() {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const dispatch = useDispatch()
  const [isError, setIsError] = useState(false)
  const URL = import.meta.env.VITE_URL || "localhost:3001"

  const login = async (values) => {
    const loggedInResponse = await fetch(`http://${URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    const loggedIn = await loggedInResponse.json()
    if (loggedIn.err) {
      setIsError(true)
      return
    }
    if (loggedIn) {
      dispatch(setLogin({ user: loggedIn.user, token: loggedIn.token }))
    }
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      password: yup
        .string()
        .min(6, "Passwords must be at least 6 characters.")
        .max(20, "Password must be 20 characters or less.")
        .required("Password is required"),
    }),
    onSubmit: (values) => login(values),
  })

  return (
    <form
      onSubmit={formik.handleSubmit}
      className={`absolute top-full rounded-b-xl border border-zinc-700 bg-zinc-800 p-4 text-white shadow-md ${
        isDesktop ? "right-52" : "right-0 rounded-tl-xl rounded-br-none"
      }`}
    >
      <label htmlFor="email" className={`block text-sm font-normal`}>
        Email
      </label>
      <input
        type="text"
        name="email"
        placeholder="yourname@example.com"
        autoComplete="email"
        onChange={formik.handleChange}
        value={formik.values.email}
        onBlur={formik.handleBlur}
        className="my-2 w-full rounded border border-zinc-700 bg-zinc-800 px-2 font-normal"
      />
      <p className="text-xs text-red-700">
        {formik.touched.email && formik.errors.email ? formik.errors.email : ""}
      </p>
      <label htmlFor="password" className={`block text-sm font-normal`}>
        Password
      </label>
      <input
        type="password"
        name="password"
        placeholder="* * * * * *"
        autoComplete="current-password"
        onChange={formik.handleChange}
        value={formik.values.password}
        onBlur={formik.handleBlur}
        className="my-2 w-full rounded border border-zinc-700 bg-zinc-800 px-2 font-normal md:w-64"
      />
      <p className="text-xs text-red-700">
        {" "}
        {formik.touched.password && formik.errors.password
          ? formik.errors.password
          : isError
          ? "Invalid credentials"
          : ""}
      </p>
      <button
        type="submit"
        className="mt-2 rounded border border-transparent bg-light-orange p-2 text-sm text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange"
      >
        Sign In
      </button>
    </form>
  )
}

export default LoginForm
