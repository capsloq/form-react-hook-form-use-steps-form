import { useSelect, HttpError } from "@pankod/refine-core"
import { useFieldArray, useStepsForm } from "@pankod/refine-react-hook-form"
import { IPost } from "interfaces"
import { MouseEventHandler } from "react"

const stepTitles = ["Title", "Status", "Category and content"]

export const PostCreate: React.FC = () => {
  const {
    refineCore: { onFinish, formLoading, queryResult },
    register,
    handleSubmit,
    control,
    formState: { errors,dirtyFields },
    steps: { currentStep, gotoStep },
  } = useStepsForm<IPost, HttpError, IPost>()

  const { update, replace } = useFieldArray({
    control: control,
    name: "names",
  })

  const { options } = useSelect({
    resource: "categories",
  })

  const changeFirstname = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    update(0, { firstname: `new firstname${Math.floor(Math.random() * 100)}` })
  }

  const renderFormByStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <label>Title: </label>
            <input
              {...register("title", {
                required: "This field is required",
              })}
            />
            {errors.title && <span>{errors.title.message}</span>}
          </>
        )
      case 1:
        return (
          <div>
            <h1>Dirty Fields: </h1>
            <p>{JSON.stringify(dirtyFields)}</p>
            <label>Status: </label>
            <select {...register("status")}>
              <option value="published">published</option>
              <option value="draft">draft</option>
              <option value="rejected">rejected</option>
            </select>

            <div>
              <label>names.0.firstname: </label>
              <input
                {...register("names.0.firstname", {
                  required: "This field is required",
                  
                })}
                disabled
              />
              <button onClick={(e) => changeFirstname(e)}>klick this to use update() from useFieldArray</button>
            </div>
          </div>
        )
      case 2:
        return (
          <>
            <label>Category: </label>
            <select
              {...register("category.id", {
                required: "This field is required",
              })}
            >
              {options?.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                >
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && <span>{errors.category.message}</span>}
            <br />
            <br />
            <label>Content: </label>
            <textarea
              {...register("content", {
                required: "This field is required",
              })}
              rows={10}
              cols={50}
            />
            {errors.content && <span>{errors.content.message}</span>}
          </>
        )
    }
  }

  if (formLoading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 36 }}>
        {stepTitles.map((title, index) => (
          <button
            key={index}
            onClick={() => gotoStep(index)}
            style={{
              backgroundColor: currentStep === index ? "lightgray" : "initial",
            }}
          >
            {index + 1} - {title}
          </button>
        ))}
      </div>
      <form autoComplete="off">{renderFormByStep(currentStep)}</form>
      <div style={{ display: "flex", gap: 8 }}>
        {currentStep > 0 && (
          <button
            onClick={() => {
              gotoStep(currentStep - 1)
            }}
          >
            Previous
          </button>
        )}
        {currentStep < stepTitles.length - 1 && (
          <button
            onClick={() => {
              gotoStep(currentStep + 1)
            }}
          >
            Next
          </button>
        )}
        {currentStep === stepTitles.length - 1 && <button onClick={handleSubmit(onFinish)}>Save</button>}
      </div>
    </div>
  )
}
