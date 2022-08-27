import React, { createContext, useState, useEffect } from "react";
import ProductsAPI from "./api/ProductsAPI";
import UserAPI from "./api/UserAPI";
import CategoriesAPI from "./api/CategoriesAPI";

import { userRequest } from "./requestmethod";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const isloggedin = async () => {
         const is=await userRequest.get("/user/isloggedin");
         setToken(is.data);
        setTimeout(() => {
            isloggedin();
        }, 10 * 60 * 1000);
      };
      isloggedin();
    }
  }, []);

  const state = {
    productsAPI: ProductsAPI(),
    userAPI: UserAPI(token),
    categoriesAPI: CategoriesAPI(),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
