import React, { useState, useEffect } from "react";
import { Link, Route, Switch } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/style.css"

import RecipesList from "./components/RecipesList";
import Recipe from "./components/Recipe";
import AddRecipe from "./components/AddRecipe";
import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/recipes"} className="navbar-brand mr-4 ml-4 pt-0 pb-0 logo">
          finedining
        </Link>

        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/recipes"} className="nav-link">
                Visas Receptes
            </Link>
          </li>
          {currentUser && (
            <li className="nav-item">
              <Link to={"/recipes/add"} className="nav-link">
                Pievienot Recepti
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path={["/", "/recipes"]} component={RecipesList} />
            <Route exact path="/recipes/add" component={AddRecipe} />
            <Route path="/recipes/:id" component={Recipe} />
        </Switch>
      </div>
    </div>
  );
};

export default App;