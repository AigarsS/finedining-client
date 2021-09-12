import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import RecipeDataService from "../services/recipes.service"

const Recipe = () =>{
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    RecipeDataService.getRecipe(id).then(
      (response) => {
        setRecipe(response.data);
      },
      (error) => {
        const _recipe =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setRecipe(_recipe);
      }
    );
  }, []);

  return (
    <div>
      { recipe == null ? (
        <div>Loading ...</div>
      ) : (
        <div>
        <div className="container pt-4">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <h4>{recipe.title}</h4>
            </div>
          </div>
          <div className="row pb-3">
            <div className="col-md-6 col-sm-12 pl-3 pr-3">
              <img className="recipe-tumbnail"  alt="Recipe Title" src={`data:image/jpg;base64,${recipe.image.data}`}/>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row">
                <h6>Apraksts</h6>
              </div>
              <div className="row">
                <div className="col">
                  {recipe.description}    
                </div>
              </div>
              <div className="row pt-3">
                <h6>Gatavošanas ilgums</h6>
              </div>
              <div className="row">
                <div className="col-6">
                  {`${recipe.cookingTime/60} min`}
                </div>
              </div>
            </div>
          </div>
          <hr className="divider"></hr>
          <div className="row ">
            <div className="col-md-6 col-sm-12">
              <h6>Sastāvdaļas</h6>
              </div>
          </div>
          <div className="row">             
            <div className="col-md-6">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th scope="col">Nr.</th>
                    <th scope="col">Nosaukums</th>
                    <th scope="col">Daudzums</th>
                    <th scope="col">Mērv.</th>
                  </tr>
                </thead>
                <tbody>
                  { recipe.ingredients.map((ingredient, index) =>
                    <tr key={index}>
                      <th scope="row">{index+1}</th>
                      <td>{ingredient.product}</td>
                      <td>{ingredient.quantity}</td>
                      <td>{ingredient.unit}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <hr className="divider"></hr>
          <div className="row ">
            <div className="col-md-6 col-sm-12">
              <h6>Pagatavošana</h6>
            </div>
          </div>
          <div className="row pt-3">
            { recipe.cookingSteps.map((step, index) =>
              <div key={index} className="col-12">
                <div className="row">
                  <div className="col-12">
                    <h6>{`Solis #${step.stepNumber}`}</h6>
                  </div>
                </div>
                <div className="row">
                  { step.image && (step.image.data != null) ? (
                    <div className="col-4">
                      <img className="recipe-tumbnail"  alt="Recipe Title" src={`data:image/jpg;base64,${step.image.data}`}/>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="col-8">
                    {step.description}
                  </div>    
                </div>
                <hr className="divider"></hr>
              </div>
              )
            }
          </div>
        </div> 
      </div>)}
    </div>
  );
}

export default Recipe;