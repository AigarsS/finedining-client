import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import RecipeDataService from "../services/recipes.service";
import { Table } from 'react-bootstrap'
import Select from "react-select";
import axios from "axios";

const AddRecipe = () => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      ingredients: [{ name: "", quantity: 0, unit: "" }],
      cookingSteps: [{ stepNumber: 1, description: "" }]
    }}
  );

  const { fields: ingredientFields, append: ingredientAppend, remove: ingredientRemove } = useFieldArray({
    control,
    name: "ingredients"
  });

  const { fields: stepFields, append: stepAppend, remove: stepRemove } = useFieldArray({
    control,
    name: "cookingSteps"
  });

  const [unitData, setUnitData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      axios.get('http://localhost:8080/api/default_values/units')
      .then((response) => {
        setUnitData(response.data);
      })
    };
    fetchData();
  }, []);
  const options = 
  unitData.map((unit) => (
    { value: unit.denotation, label: unit.denotation }
  ))

  const [categoryData, setCategoryData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      axios.get('http://localhost:8080/api/default_values/product_categories')
      .then((response) => {
        setCategoryData(response.data);
      })
    };
    fetchData();
  }, []);
  const categoryOptions = 
  categoryData.map((category) => (
    { value: category.name, label: category.name }
  ))

  const onSubmit = data => {

    const images =
      data.cookingSteps.map((cookingStep) => {
        return cookingStep.image[0]
      })

    data.cookingSteps.map((cookingStep) => {

      cookingStep.image = {
        name: cookingStep.image[0] && cookingStep.image[0].name
      } 
    }
    )
    
    console.log(data)


    const files = [data.myimage[0], ...images]

    data.ingredients.map((ingredient) => {
      ingredient.unit = ingredient.unit.value
      ingredient.category = ingredient.category.value
    })
    const json = JSON.stringify(data);
    console.log(json)
    let formData = new FormData();
    const blob = new Blob([json], {
      type: 'application/json'
    });
    
    formData.append('properties', blob);

    for (const file of files) {
      file && formData.append('files', file, file.name);
    }

    RecipeDataService.createRecipe(formData);
  }
   
  return (
    <div className="col-md-12">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <div className="form-group">
              <label className="font-weight-bold" htmlFor="title">Recipe Title</label>
              <input type="text" name="title" id="title" className="form-control" ref={register} placeholder="Recipe Title"/>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12 img-placeholder d-flex">
            <div className="col-md-6 offset-md-3 align-self-center">
              <label htmlFor="myimage"><strong> Upload Recipe Title Image</strong></label>
              <input type="file" name="myimage" ref={register} />
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
              <div className="row">
                <div className="col">
                    <div className="form-group">
                      <label className="font-weight-bold" htmlFor="description">Recipe Description</label>
                        <textarea className="form-control" name="description" id="description" rows="3" placeholder="Recipe Description" ref={register}></textarea>
                    </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label className="font-weight-bold" htmlFor="cookingTime">Cooking Time: </label>
                    <input type="text" name="cookingTime" id="cookingTime" className="form-control"placeholder="seconds" ref={register} />
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                      <label className="font-weight-bold" htmlFor="servingsPerRecipe">Servings Per Recipe: </label>
                      <input type="text" name="servingsPerRecipe" id="servingsPerRecipe" className="form-control" placeholder="servings per recipe" ref={register} />
                    </div>
                </div>
              </div>
            </div>
        </div>
        <hr className="divider"></hr>
        <div className="row ">
            <div className="col-md-1 col-sm-12">
              <h5 className="pt-1">Ingredients</h5>
              </div>
            <div className="col-md-3 col-sm-12">
            <button
              className="btn btn-outline-dark  ml-4 mb-3 btn-round pl-3 pr-3"
              type="button"
              onClick={() => ingredientAppend({ name: "", quantity: 0, unit: "" })}
            >
              Add
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
              <Table striped size="sm">
                <thead>
                  <tr>
                    <th scope="col" className="w-10">Nr.</th>
                    <th scope="col" className="w-25">Name</th>
                    <th scope="col" className="w-25">Quanity</th>
                    <th scope="col" className="w-15">Unit</th>
                    <th scope="col" className="w-15">Category</th>
                    <th scope="col" className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientFields.map((item, index) => (
                    <tr key={item.id}>
                      <th scope="row"> <h5 className="p-2">{`${index+1}.`}</h5></th>
                      <td className="pt-2">
                        <input
                          type="text"
                          className="form-control input-sm"
                          name={`ingredients[${index}].product`}
                          ref={register()}
                          defaultValue={`${item.name}`}
                        />
                      </td>

                      <td className="pt-2" >
                        <Controller
                          as={<input />}
                          type="text"
                          className="form-control input-sm"
                          name={`ingredients[${index}].quantity`}
                          control={control}
                          defaultValue={`${item.quantity}`}
                        />
                      </td>
                      <td className="pt-2">
                        <Controller
                          as={Select}
                          options={options} 
                          name={`ingredients[${index}].unit`}
                          control={control}
                          onChange={([selected]) => {
                            return { value: selected };
                          }}
                          defaultValue={`${item.unit}`}
                        />
                      </td>
                      <td className="pt-2">
                        <Controller
                          as={Select}
                          options={categoryOptions} 
                          name={`ingredients[${index}].category`}
                          control={control}
                          onChange={([selected]) => {
                            return { value: selected };
                          }}
                          defaultValue={`${item.category}`}
                        />
                      </td>
                      <td>
                        <button type="button" className="btn btn-outline-dark mt-1 ml-4 btn-round" onClick={() => ingredientRemove(index)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </Table>
          </div>
        </div>
        <hr className="divider"></hr>
        <div className="row pb-3">
            <div className="col-md-2 col-sm-12">
              <h5 className="pt-1">Cooking Steps</h5>
              </div>
            <div className="col-md-3 col-sm-12">
            <button
              className="btn btn-outline-dark  btn-round pl-3 pr-3"
              type="button"
              onClick={() => stepAppend({ stepNumber: 1, description: "", image: null })}
            >
              Add
            </button>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-1"><strong> Step Nr.</strong></div>
          <div className="col-md-6"><strong> Description</strong></div>
          <div className="col-md-3"><strong> Image</strong></div>
          <div className="col-md-2"></div>
        </div>
        {stepFields.map((item, index) => (
          <div className="row mb-2" key={item.id}>
            <div className="col-md-1">
              <input
                type="number"
                className="form-control input-sm"
                name={`cookingSteps[${index}].stepNumber`}
                ref={register()}
                defaultValue={`${item.stepNumber}`}
              />
            </div>
            <div className="col-md-6">
              <input
                  type="text"
                  className="form-control input-sm"
                  name={`cookingSteps[${index}].description`}
                  ref={register()}
                  defaultValue={`${item.description}`}
                />
            </div>
            <div className="col-md-3">
              <input className="mt-1" type="file" name={`cookingSteps[${index}].image`} ref={register}/>
            </div>

            <div className="col-md-2">
              <button type="button" className="btn btn-outline-dark mb-1 ml-4 btn-round" onClick={() => stepRemove(index)}>Delete</button>
              </div>
          </div>
        ))}
        <hr className="divider"></hr>
        <button type="submit" className="btn btn-outline-dark mt-1 mb-1 ml-4 btn-round">Submit</button>
        <hr className="divider"></hr>
      </form>
    </div>
  );
}

export default AddRecipe;
