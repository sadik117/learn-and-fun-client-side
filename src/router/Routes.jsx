import { createBrowserRouter } from "react-router-dom";
import Mainlayout from "../components/layouts/MainLayout";
import Home from "../components/pages/Home";
import ErrorPage from "../components/pages/ErrorPage";
import Login from "../Authentication/Login";
import Registration from "../Authentication/Registration";
import PrivateRoute from "../Authentication/PrivateRoute";
import MyProfile from "../components/pages/MyProfile";
import Learn from "../components/pages/Learn";
import PlayAndWin from "../components/pages/PlayAndWin";
import AdminDashboard from "../Admin/AdminDashboard";
import AdminRoute from "../Admin/AdminRoute";
import Members from "../Admin/Members";
import Pendings from "../Admin/PendingUsers";
import Payments from "../Admin/Payments";
import MemberProfile from "../Admin/MemberProfile";
import PaymentPage from "../components/pages/PaymentPage";
import WithdrawPage from "../components/pages/WithdrawPage";
import WithdrawRequests from "../Admin/WithdrawalRequests";
import AddCourse from "../Admin/AddCourse";


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
        path: "/makepayment",
        element: (
          <PrivateRoute>
            <PaymentPage></PaymentPage>
          </PrivateRoute>
        ),
      },
      {
        path: "/withdraw",
        element: (
          <PrivateRoute>
            <WithdrawPage></WithdrawPage>
          </PrivateRoute>
        ),
      },
      {
        path: "/admin-dashboard/*",
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
          {
            path: "withdrawals",
            element: (
              <AdminRoute>
                <WithdrawRequests></WithdrawRequests>
              </AdminRoute>
            ),
          },
          {
            path: "add-course",
            element: (
              <AdminRoute>
                <AddCourse></AddCourse>
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
