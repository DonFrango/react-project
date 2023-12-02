import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Home from './pages/Home/Home';
import Account from './pages/Account/Account';
import Layout from './components/Layout/Layout';
import "./components/Css/global.css";
import {AuthProvider} from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';



const router = createBrowserRouter([
  
  {
    path:"/",
    element: (<AuthProvider>
                  <Layout />
              </AuthProvider>
    ),
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
      {
        path: "",
        element: <PrivateRoute />,
        children: [
          {
            path: "/home",
            element: <Home />,
          },
          {
            path: "/account",
            element: <Account />,
          }
        ],
      },
    ],
  },
]);


function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
