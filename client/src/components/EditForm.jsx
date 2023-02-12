import { useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Dropzone from "react-dropzone"
import { useFormik } from "formik"
import * as yup from "yup"
import { setRecipes } from "../state"
import Select from "react-select"
import cuisines from "../../../server/cuisines.js"
import { TiDelete } from "react-icons/ti"
import { AiFillFileAdd, AiOutlineLoading3Quarters } from "react-icons/ai"
import { motion } from "framer-motion"

function EditForm({ recipe, setIsEditing, setRecipe }) {
  const options = cuisines.sort((a, b) => a.value.localeCompare(b.value))
  const [isLoading, setIsLoading] = useState(false)
  const [ingredients, setIngredients] = useState(recipe.ingredients)
  const [ingredient, setIngredient] = useState("")
  const [tag, setTag] = useState("")
  const [tags, setTags] = useState(recipe.tags)
  const dispatch = useDispatch()
  const { recipeId } = useParams()
  const token = useSelector((state) => state.token)
  const URL = import.meta.env.VITE_URL || "http://localhost:3001"

  const editRecipe = async (values) => {
    setIsLoading(true)
    const formData = new FormData()
    for (let value in values) {
      formData.append(value, values[value])
    }
    if (formik.values.newImage) {
      formData.append("newImage", values.newImage.name)
    }
    const savedRecipe = await fetch(`${URL}/recipes/${recipeId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    const updatedRecipe = await savedRecipe.json()
    dispatch(setRecipes({ recipes: updatedRecipe }))
    setRecipe(updatedRecipe)
    setIsEditing(false)
    setIsLoading(false)
  }

  const formik = useFormik({
    initialValues: {
      title: recipe.title,
      cuisine: recipe.cuisine,
      ingredients: recipe.ingredients,
      description: recipe.description,
      image: recipe.image,
      newImage: "",
      tags: recipe.tags,
    },
    validationSchema: yup.object({
      title: yup.string().required("Title is required"),
      cuisine: yup.string().required("Cuisine is required."),
      ingredients: yup
        .array()
        .of(yup.string())
        .min(1, "Must have at least 1 ingredient"),
      description: yup.string().required("Description is required."),
      tags: yup.array().of(yup.string()).min(1, "Must have at least 1 tag"),
    }),
    onSubmit: (values) => editRecipe(values),
  })

  const addIngredient = (e) => {
    e.preventDefault()
    if (ingredient) {
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
    if (tag) {
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

  return (
    <>
      <motion.form
        initial={{ rotate: 360 }}
        animate={{ rotate: 0 }}
        exit={{ rotate: -360 }}
        transition={{ duration: 0.5 }}
        onSubmit={formik.handleSubmit}
        className={`mt-24 flex w-11/12 flex-col rounded bg-zinc-900 text-sm text-white shadow-inner shadow-black md:w-3/4 md:text-base`}
      >
        <img
          src={recipe.image}
          alt=""
          className="h-16 w-full rounded-t object-cover opacity-10"
        />
        <div className="px-4 py-2 md:px-8">
          <div className="my-2 flex flex-col gap-4 border-b border-zinc-700 pb-2 md:flex-row">
            <img
              src={recipe.image}
              alt="Recipe's image"
              className="h-72 rounded object-cover lg:h-96 lg:w-1/2 "
            />
            <div className="flex flex-grow flex-col">
              <div className="flex flex-col items-start justify-start lg:flex-row lg:justify-between">
                <Select
                  defaultValue={{ label: formik.values.cuisine }}
                  onChange={(option) =>
                    formik.setFieldValue("cuisine", option.value)
                  }
                  onBlur={formik.handleBlur}
                  options={options}
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
                <p className="my-2 text-zinc-400 lg:my-0">
                  Added&nbsp;
                  {new Date(recipe.createdAt).toLocaleDateString("en-UK")}
                </p>
              </div>
              <div>
                <label htmlFor="title">Recipe's name</label>
                <input
                  name="title"
                  onChange={formik.handleChange}
                  value={formik.values.title}
                  onBlur={formik.handleBlur}
                  className="my-1 block rounded border border-zinc-700 bg-zinc-800 p-2"
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
              </div>
              <div className="flex flex-col border-b border-zinc-700 pb-2">
                <div>
                  <label htmlFor="tags" className="block">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="Tags"
                    onChange={(e) => setTag(e.target.value.replace(/[,]/g, ""))}
                    className="rounded border border-zinc-700 bg-zinc-800 p-2"
                    value={tag}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    className="ml-2 rounded border border-transparent bg-light-orange px-4 py-2 text-sm font-bold text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange lg:text-base"
                    onClick={addTag}
                  >
                    Add
                  </button>
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
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <span
                        onClick={() => removeTag(tag)}
                        key={`${tag}-${i}`}
                        className="group relative mt-2 flex rounded-2xl bg-light-orange px-4 py-2 text-xs font-bold text-black transition-all hover:cursor-pointer hover:bg-red-500"
                      >
                        #{tag}
                        <TiDelete className="absolute right-0 top-0 opacity-0 transition-all group-hover:opacity-100" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <h2 className="my-2 text-lg font-bold">Ingredients</h2>
              <div>
                <input
                  type="text"
                  name="ingredients"
                  placeholder="Ingredients"
                  onChange={(e) =>
                    setIngredient(e.target.value.replace(/[,]/g, ""))
                  }
                  className="rounded border border-zinc-700 bg-zinc-800 p-2"
                  value={ingredient}
                  onBlur={formik.handleBlur}
                />
                <button
                  className="ml-2 rounded border border-transparent bg-light-orange px-4 py-2 text-sm font-bold text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange lg:text-base"
                  onClick={addIngredient}
                >
                  Add
                </button>
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
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, i) => (
                    <span
                      onClick={() => removeIngredient(ingredient)}
                      key={`${ingredient}-${i}`}
                      className="group relative mt-2 flex rounded-2xl bg-light-orange px-4 py-2 text-xs font-bold text-black transition-all hover:cursor-pointer hover:bg-red-500"
                    >
                      {ingredient}
                      <TiDelete className="absolute right-0 top-0 opacity-0 transition-all group-hover:opacity-100" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <h2 className="my-2 text-lg font-bold">How to prepare</h2>
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="5"
            placeholder="Describe your recipe"
            onChange={formik.handleChange}
            value={formik.values.description}
            onBlur={formik.handleBlur}
            className="my-1 w-full rounded border border-zinc-700 bg-zinc-800 p-2"
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
          <Dropzone
            acceptedFiles=".jpg,.jped,.png"
            className="my-1"
            multiple={false}
            onDrop={(acceptedFiles) =>
              formik.setFieldValue("newImage", acceptedFiles[0])
            }
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} name="newImage" />
                {!formik.values.newImage ? (
                  <p className="formik.values.newImage && formik.touched.newImage mb-3 flex cursor-pointer items-center justify-center rounded border border-zinc-700 bg-zinc-800 p-6 text-zinc-400">
                    Add or drop an image to change existing one
                    <AiFillFileAdd className="ml-2 inline fill-light-orange" />
                  </p>
                ) : (
                  <div>
                    <p className="my-1 flex cursor-pointer items-center rounded border border-zinc-700 bg-zinc-800 p-2">
                      {formik.values.newImage.name &&
                        `${formik.values.newImage.name?.slice(
                          0,
                          10
                        )}...${formik.values.newImage.name?.slice(-3)}`}
                      {formik.values.newImage.name && (
                        <TiDelete
                          className="ml-auto inline hover:fill-red-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            formik.setFieldValue("newImage", "")
                          }}
                        />
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Dropzone>
          <div className="flex justify-end gap-2 pb-4">
            <button
              type="submit"
              className="rounded border border-transparent bg-light-orange px-4 py-2 text-sm font-bold text-zinc-800 transition-all hover:border-light-orange hover:bg-zinc-800 hover:text-light-orange lg:text-base"
            >
              {!isLoading ? (
                "Save"
              ) : (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
            </button>
            <button
              disabled={isLoading && true}
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded border border-transparent bg-red-500 px-4 py-2 text-sm font-bold text-zinc-800 transition-all hover:border-red-500 hover:bg-zinc-800 hover:text-red-500 lg:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.form>
    </>
  )
}
export default EditForm
