import http from "../http-common";
import authHeader from "./auth-header";

  const getAllRecipes = () => {
    return http.get("/recipes");
  }

  const getRecipe = (id) => {
    return http.get(`/recipes/${id}`);
  }

  const createRecipe = (data) => {
    return http.post("/recipes", data, { headers: authHeader() });
  }

export default {
  getAllRecipes,
  getRecipe,
  createRecipe
};