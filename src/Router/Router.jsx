import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import Main from "../Components/Main";
import Login from "../Pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
    ],
  },
]);
