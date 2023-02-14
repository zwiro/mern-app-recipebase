import Dropzone from "react-dropzone"
import { useFormik } from "formik"
import * as yup from "yup"
import { AiFillFileAdd, AiOutlineLoading3Quarters } from "react-icons/ai"
import { TiDelete } from "react-icons/ti"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { setRecipes } from "../state"
import { toast } from "react-toastify"
import Select from "react-select"
import cuisines from "../../../server/cuisines.js"

function NewRecipeForm({ closeForm }) {
  const [ingredients, setIngredients] = useState([])
  const [tags, setTags] = useState([])
  const [tag, setTag] = useState("")
  const [ingredient, setIngredient] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const userId = useSelector((state) => state.user?._id)
  const token = useSelector((state) => state.token)
  const dispatch = useDispatch()
  const options = cuisines.sort((a, b) => a.value.localeCompare(b.value))
  const URL = import.meta.env.VITE_URL || "http://localhost:3001"

  const addRecipe = async (values) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("author", userId)
    for (let value in values) {
      formData.append(value, values[value])
    }
    if (formik.values.image) {
      formData.append("image", values.image.name)
    }
    const savedRecipe = await fetch(`${URL}/recipes/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
    const recipes = await savedRecipe.json()
    const sortedRecipes = recipes.reverse()
    dispatch(setRecipes({ recipes: sortedRecipes }))
    closeForm()
    toast.success("Success!", { position: toast.POSITION.TOP_CENTER })
    setIsLoading(false)
  }

  const addIngredient = (e) => {
    e.preventDefault()
    if (ingredient.trim()) {
      setIngredients((prevIngredients) => [...prevIngredients, ingredient])
      setIngredient("")
      formik.setFieldValue("ingredients", [
        ...formik.values.ingredients,
        ingredient,
      ])
    }
  }

  const removeIngredient = (ingredient) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((item) => item !== ingredient)
    )
    formik.setFieldValue(
      "ingredients",
      formik.values.ingredients.filter((item) => item !== ingredient)
    )
  }

  const addTag = (e) => {
    e.preventDefault()
    if (tag.trim()) {
      setTags((prevTags) => [...prevTags, tag[0] === "#" ? tag.slice(1) : tag])
      setTag("")
      formik.setFieldValue("tags", [
        ...formik.values.tags,
        tag[0] === "#" ? tag.slice(1) : tag,
      ])
    }
  }

  const removeTag = (tag) => {
    setTags((prevTags) => prevTags.filter((item) => item !== tag))
    formik.setFieldValue(
      "tags",
      formik.values.tags.filter((item) => item !== tag)
    )
  }

  const formik = useFormik({
    initialValues: {
      title: "",
      cuisine: "",
      ingredients: [],
      description: "",
      image: "",
      tags: [],
    },
    validationSchema: yup.object({
      title: yup.string().trim().required("Title is required"),
      cuisine: yup.string().required("Cuisine is required."),
      ingredients: yup
        .array()
        .of(yup.string().trim())
        .min(1, "Must have at least one ingredient"),
      description: yup.string().trim().required("Description is required."),
      image: yup.string().required("Image is required."),
      tags: yup
        .array()
        .of(yup.string().trim())
        .min(1, "Must have at least one tag"),
    }),
    onSubmit: (values) => addRecipe(values),
  })

  return (
    <div className="mx-auto my-4 w-11/12 rounded bg-zinc-900 p-8 shadow-inner shadow-black md:w-3/4">
      <form
        onSubmit={formik.handleSubmit}
        className=" flex flex-col [&>input]:my-1 [&>input]:rounded [&>input]:border [&>input]:border-zinc-700 [&>input]:bg-zinc-800 [&>input]:p-2 [&>textarea]:my-1 [&>textarea]:rounded [&>textarea]:border [&>textarea]:border-zinc-700 [&>textarea]:bg-zinc-800 [&>textarea]:p-2"
      >
        <h2 className="mb-2 text-center text-lg font-bold text-light-orange">
          Share your recipe!
        </h2>
        <label htmlFor="title" className="mt-4 border-t border-zinc-700 pt-4">
          Recipe's name
        </label>
        <input
          type="text"
          name="title"
          placeholder="Mushroom stir fry with broccoli"
          onChange={formik.handleChange}
          value={formik.values.title}
          onBlur={formik.handleBlur}
        />
        <p
          className={
            formik.touched.title && formik.errors.title
              ? "text-xs text-red-700"
              : "text-xs text-green-700"
          }
        >
          {formik.touched.title && formik.errors.title
            ? formik.errors.title
            : formik.touched.title && "Looking good!"}
        </p>
        <label htmlFor="react-select-3-input" className="mt-4">
          Cuisine
        </label>
        <Select
          name="cuisine"
          onChange={(option) => formik.setFieldValue("cuisine", option.value)}
          onBlur={formik.handleBlur}
          options={options}
          className="my-1"
          styles={{
            control: (base) => {
              return {
                ...base,
                borderColor: "rgb(63 63 70)",
                backgroundColor: "rgb(39 39 42)",
              }
            },
            option: (base) => {
              return {
                ...base,
                backgroundColor: "rgb(39 39 42)",
              }
            },
            singleValue: (base) => {
              return { ...base, color: "white", padding: "0" }
            },
            input: (base) => {
              return { ...base, color: "white" }
            },
          }}
        />
        <p
          htmlFor="cuisine"
          className={
            formik.touched.cuisine && formik.errors.cuisine
              ? "text-xs text-red-700"
              : "text-xs text-green-700"
          }
        >
          {formik.touched.cuisine && formik.errors.cuisine
            ? formik.errors.cuisine
            : formik.touched.cuisine && "Looking good!"}
        </p>
        <div className="my-1">
          <label htmlFor="ingredients" className="mt-4 block">
            Ingredients
          </label>
          <input
            type="text"
            name="ingredients"
            placeholder="4 garlic cloves"
            onChange={(e) => setIngredient(e.target.value.replace(/[,]/g, ""))}
            className="my-1 rounded border border-zinc-700 bg-zinc-800 p-2"
            value={ingredient}
            onBlur={formik.handleBlur}
          />
          <button
            className="ml-2 rounded border border-transparent bg-light-orange px-4 py-2 text-sm font-bold text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange lg:text-base"
            onClick={addIngredient}
          >
            Add
          </button>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, i) => (
              <span
                onClick={() => removeIngredient(ingredient)}
                key={`${ingredient}-${i}`}
                className="group relative mt-2 flex rounded-2xl bg-light-orange px-4 py-2 font-bold text-black transition-all hover:cursor-pointer hover:bg-red-500"
              >
                {ingredient}
                <TiDelete className="absolute right-0 top-0 opacity-0 transition-all group-hover:opacity-100" />
              </span>
            ))}
          </div>
          <p
            className={
              formik.touched.ingredients && formik.errors.ingredients
                ? "text-xs text-red-700"
                : "text-xs text-green-700"
            }
          >
            {formik.touched.ingredients && formik.errors.ingredients
              ? formik.errors.ingredients
              : formik.touched.ingredients && "Looking good!"}
          </p>
        </div>
        <label htmlFor="description" className="mt-4">
          Preparation
        </label>
        <textarea
          className="my-1"
          name="description"
          id="description"
          cols="30"
          rows="5"
          placeholder="1. In a small bowl, mix..."
          onChange={formik.handleChange}
          value={formik.values.description}
          onBlur={formik.handleBlur}
        ></textarea>
        <p
          className={
            formik.touched.description && formik.errors.description
              ? "text-xs text-red-700"
              : "text-xs text-green-700"
          }
        >
          {formik.touched.description && formik.errors.description
            ? formik.errors.description
            : formik.touched.description && "Looking good!"}
        </p>
        <label htmlFor="image" className="mt-4">
          Add an image
        </label>
        <Dropzone
          acceptedFiles=".jpg,.jped,.png"
          className="my-1"
          multiple={false}
          onDrop={(acceptedFiles) =>
            formik.setFieldValue("image", acceptedFiles[0])
          }
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} name="image" />
              {!formik.values.image ? (
                <p
                  className={`my-1 flex cursor-pointer items-center justify-center rounded border border-zinc-700 bg-zinc-800 p-6 ${
                    !formik.values.image && formik.touched.image
                      ? "text-red-700"
                      : "text-zinc-400"
                  }`}
                >
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
        <div className="my-1 border-b border-zinc-700 pb-4">
          <label htmlFor="tags" className="mt-4 block">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            placeholder="vegan"
            onChange={(e) => setTag(e.target.value.replace(/[,]/g, ""))}
            className="my-1 rounded border border-zinc-700 bg-zinc-800 p-2"
            value={tag}
            onBlur={formik.handleBlur}
          />
          <button
            className="ml-2 rounded border border-transparent bg-light-orange px-4 py-2 text-sm font-bold text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange lg:text-base"
            onClick={addTag}
          >
            Add
          </button>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                onClick={() => removeTag(tag)}
                key={`${tag}-${i}`}
                className="group relative mt-2 flex rounded-2xl bg-light-orange px-4 py-2 font-bold text-black transition-all hover:cursor-pointer hover:bg-red-500"
              >
                #{tag}
                <TiDelete className="absolute right-0 top-0 opacity-0 transition-all group-hover:opacity-100" />
              </span>
            ))}
          </div>
          <p
            className={
              formik.touched.tags && formik.errors.tags
                ? "text-xs text-red-700"
                : "text-xs text-green-700"
            }
          >
            {formik.touched.tags && formik.errors.tags
              ? formik.errors.tags
              : formik.touched.tags && "Looking good!"}
          </p>
        </div>
        <div className="my-4 flex justify-center gap-8">
          <button
            disabled={isLoading && true}
            onClick={(e) => {
              e.preventDefault()
              closeForm()
            }}
            className="px-4 py-2 font-bold transition-all hover:text-red-500"
          >
            Cancel
          </button>
          <button
            disabled={isLoading && true}
            type="submit"
            className="rounded border border-transparent bg-light-orange px-4 py-2 text-sm font-bold text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange lg:text-base"
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewRecipeForm
