import React from "react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";

const PrivateRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); // null = cargando

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get("/users/get-user");
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) return <div>Loading...</div>; // Spinner o lo que quieras

  return isAuth ? children : <Navigate to="/auth/login" />;
};

export default PrivateRoute;
