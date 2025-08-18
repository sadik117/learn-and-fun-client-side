import { createBrowserRouter } from "react-router";
import Mainlayout from "../components/layouts/MainLayout";
import Home from "../components/pages/Home";
import ErrorPage from "../components/pages/ErrorPage";
import Login from "../Authentication/Login";
import Registration from "../Authentication/Registration";
import PrivateRoute from "../Authentication/PrivateRoute";
import MyProfile from "../components/pages/MyProfile";
import Learn from "../components/pages/Learn";
import PlayAndWin from "../components/pages/PlayAndWin";
import InviteAndEarn from "../components/pages/InviteAndEarn";
import AdminDashboard from "../Admin/AdminDashboard";
import AdminRoute from "../Admin/AdminRoute";
import Members from "../Admin/Members";
import Pendings from "../Admin/PendingUsers";
import Payments from "../Admin/Payments";
import MemberProfile from "../Admin/MemberProfile";

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
      {
        path: "/myprofile",
        element: (
          <PrivateRoute>
            <MyProfile></MyProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "/learn",
        element: (
          <PrivateRoute>
            <Learn></Learn>
          </PrivateRoute>
        ),
      },
      {
        path: "/playNwin",
        element: (
          <PrivateRoute>
            <PlayAndWin></PlayAndWin>
          </PrivateRoute>
        ),
      },
      {
        path: "/invite",
        element: (
          <PrivateRoute>
            <InviteAndEarn></InviteAndEarn>
          </PrivateRoute>
        ),
      },
      {
        path: "/admin-dashboard",
        element: (
          <PrivateRoute>
            <AdminDashboard></AdminDashboard>
          </PrivateRoute>
        ),
        children: [
          {
            path: "members",
            element: (
              <AdminRoute>
                <Members></Members>
              </AdminRoute>
            ),
          },
          {
            path: "pending",
            element: (
              <AdminRoute>
                <Pendings></Pendings>
              </AdminRoute>
            ),
          },
          {
            path: "payments",
            element: (
              <AdminRoute>
                <Payments></Payments>
              </AdminRoute>
            ),
          },
        ],
      },
      {
        path: "/members/profile/:email",
        element: (
          <AdminRoute>
            <MemberProfile></MemberProfile>
          </AdminRoute>
        ),
      },
    ],
  },
]);
