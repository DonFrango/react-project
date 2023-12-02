import { AuthContext } from "../context/AuthContext";
import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router";

const PrivateRoute = () => {
    let { user, hasUser } = useContext(AuthContext);
    return hasUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;