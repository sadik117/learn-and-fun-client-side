import { createBrowserRouter } from "react-router";
import Mainlayout from "../components/layouts/MainLayout";
import Home from "../components/pages/Home";
import ErrorPage from "../components/pages/ErrorPage";
import Login from "../Authentication/Login";
import Registration from "../Authentication/Registration";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout></Mainlayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/auth",
        children: [
          {
            path: "/auth/login",
            Component: Login,
          },
          {
            path: "/auth/signup",
            Component: Registration,
          },
        ],
      },
    ],
  },
]);
