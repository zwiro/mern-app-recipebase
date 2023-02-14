import { useFormik } from "formik"
import * as yup from "yup"
import Dropzone from "react-dropzone"
import { AiFillFileAdd, AiOutlineLoading3Quarters } from "react-icons/ai"
import { TiDelete } from "react-icons/ti"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useState } from "react"

function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const URL = import.meta.env.VITE_URL || "http://localhost:3001"

  const register = async (values) => {
    setIsLoading(true)
    const formData = new FormData()
    for (let value in values) {
      formData.append(value, values[value])
    }
    if (formik.values.image) {
      formData.append("image", values.image.name)
    }
    const savedUserResponse = await fetch(`${URL}/auth/register`, {
      method: "POST",
      body: formData,
    })
    const savedUser = await savedUserResponse.json()
    if (savedUser.err) {
      toast.error("User or email already exists!", {
        position: toast.POSITION.TOP_CENTER,
      })
      toast.clearWaitingQueue()
      setIsLoading(false)
      return
    }
    navigate("/")
    toast.success("Thank you for joining us! You can sign in now.", {
      position: toast.POSITION.TOP_CENTER,
    })
    setIsLoading(false)
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
      image: "",
      age: "",
      location: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .trim()
        .email("Invalid email address.")
        .required("Email is required."),
      password: yup
        .string()
        .trim()
        .min(6, "Must be at least 6 characters.")
        .max(20, "Must be 20 characters or less.")
        .required("Password is required."),
      name: yup
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .required("Name is required."),
      image: yup.string(),
      age: yup.number().trim(),
      location: yup.string().trim(),
    }),
    onSubmit: (values) => register(values),
  })

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="mt-48 w-3/4 rounded bg-zinc-900 p-8 text-white shadow-inner shadow-black md:grid md:w-1/2 md:min-w-fit md:gap-4 [&>div]:flex [&>div]:flex-col [&>div>input]:my-1 [&>div>input]:rounded [&>div>input]:border [&>div>input]:border-zinc-700 [&>div>input]:bg-zinc-800 [&>div>input]:p-2"
    >
      <h1 className="mb-2 text-center font-bold text-light-orange md:col-span-2">
        Sign up to join our community!
      </h1>
      <div>
        <label htmlFor="email">Email *</label>
        <input
          type="text"
          name="email"
          placeholder="yourname@example.com"
          onChange={formik.handleChange}
          value={formik.values.email}
          onBlur={formik.handleBlur}
        />
        <p
          className={
            formik.touched.email && formik.errors.email
              ? "text-xs text-red-700"
              : "text-xs text-green-700"
          }
        >
          {formik.touched.email && formik.errors.email
            ? formik.errors.email
            : formik.touched.email && "Looking good!"}
        </p>
      </div>
      <div>
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          name="password"
          placeholder="* * * * * *"
          autoComplete="current-password"
          onChange={formik.handleChange}
          value={formik.values.password}
          onBlur={formik.handleBlur}
        />
        <p
          className={
            formik.touched.password && formik.errors.password
              ? "text-xs text-red-700"
              : "text-xs text-green-700"
          }
        >
          {formik.touched.password && formik.errors.password
            ? formik.errors.password
            : formik.touched.password && "Looking good!"}
        </p>
      </div>
      <div>
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          name="name"
          placeholder="John"
          onChange={formik.handleChange}
          value={formik.values.name}
          onBlur={formik.handleBlur}
        />
        <p
          className={
            formik.touched.name && formik.errors.name
              ? "text-xs text-red-700"
              : "text-xs text-green-700"
          }
        >
          {formik.touched.name && formik.errors.name
            ? formik.errors.name
            : formik.touched.name && "Looking good!"}
        </p>
      </div>
      <div>
        <label htmlFor="image">Image</label>
        <Dropzone
          acceptedFiles=".jpg,.jped,.png"
          multiple={false}
          onDrop={(acceptedFiles) =>
            formik.setFieldValue("image", acceptedFiles[0])
          }
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} name="image" />
              {!formik.values.image ? (
                <p className="my-1 flex cursor-pointer items-center rounded border border-zinc-700 bg-zinc-800 p-2 text-zinc-400">
                  Add or drop an image
                  <AiFillFileAdd className="ml-2 inline fill-light-orange" />
                </p>
              ) : (
                <div>
                  <p className="my-1 flex cursor-pointer items-center rounded border border-zinc-700 bg-zinc-800 p-2">
                    {`${formik.values.image.name.slice(
                      0,
                      10
                    )}...${formik.values.image.name.slice(-3)}`}
                    <TiDelete
                      className="ml-auto inline hover:fill-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        formik.setFieldValue("image", "")
                      }}
                    />
                  </p>
                </div>
              )}
            </div>
          )}
        </Dropzone>
      </div>
      <div>
        <label htmlFor="age">Age</label>
        <input
          type="number"
          name="age"
          placeholder="24"
          onChange={formik.handleChange}
          value={formik.values.age}
          onBlur={formik.handleBlur}
        />
      </div>
      <div>
        <label htmlFor="location">Location</label>
        <input
          type="text"
          name="location"
          placeholder="London, UK"
          onChange={formik.handleChange}
          value={formik.values.location}
          onBlur={formik.handleBlur}
        />
      </div>
      <div className="col-span-2 mt-auto w-full border-b border-zinc-700 text-xs text-zinc-500">
        * required
      </div>
      <button
        disabled={isLoading && true}
        type="submit"
        className="mt-4 rounded border border-transparent bg-light-orange px-4 py-2 font-bold text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange md:col-span-2 md:place-self-center"
      >
        {!isLoading ? (
          "Sign Up"
        ) : (
          <AiOutlineLoading3Quarters className="animate-spin" />
        )}
      </button>
    </form>
  )
}

export default RegisterPage
