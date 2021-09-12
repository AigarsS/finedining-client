import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Card, Col, Row } from 'react-bootstrap'
import RecipeDataService from "../services/recipes.service"
 
function RecipesList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    RecipeDataService.getAllRecipes().then(
      (response) => {
        setIsLoading(false);
        setData(response.data);
      },
      (error) => {
        const _data =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setData(_data);
      }
    );
  }, []);

  const rows = [...Array( Math.ceil(data.length / 3) )];
  const recipesRows = rows.map((row, index) => data.slice(index * 3, index * 3 + 3));

  return (  
    <Col>
      { isLoading ? (
        <div>Loading ...</div>
      ) : (
        recipesRows.map((row, rowIndex) => (
          <Row key={rowIndex}>
            { row.map((recipe, index) =>
              <Card className="recipe-card m-2" key={index}>
                <Card.Body className="pb-1 text-center">
                  <h6> {recipe.title} </h6>
                </Card.Body>
                <div className="m-2">
                  <img className="recipe-img" alt="Recipe Title" src={`data:image/png;base64,${recipe.image.data}`}/>
                </div>
                <Link to={`recipes/${recipe.id}`} className="stretched-link"></Link>
              </Card>
            )}
          </Row>
        ))
      )}
    </Col>
  );
}
 
export default RecipesList;