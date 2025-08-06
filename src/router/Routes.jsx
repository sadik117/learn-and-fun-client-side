import { createBrowserRouter } from "react-router";
import Mainlayout from "../components/layouts/MainLayout";
import Home from "../components/pages/Home";
import ErrorPage from "../components/pages/ErrorPage";

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
    ],
  },
]);
