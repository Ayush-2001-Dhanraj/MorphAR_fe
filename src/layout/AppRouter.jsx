import { createBrowserRouter } from "react-router-dom";
import Layout from "./index";
import Main from "../pages/Main";
import ProtectedRoute from "../components/ProtectedRoute";
import Tripo from "../pages/Tripo";
import AudioToModel from "../pages/AudioToModel";
import Sketch from "../pages/Sketch";
import NotFound from "../pages/NotFound";
import ViewModel from "../pages/ViewModel";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Main />,
      },
      {
        path: "tripo",
        element: (
          <ProtectedRoute>
            <Tripo />
          </ProtectedRoute>
        ),
      },
      {
        path: "text",
        element: (
          <ProtectedRoute>
            <AudioToModel />
          </ProtectedRoute>
        ),
      },
      {
        path: "sketch",
        element: (
          <ProtectedRoute>
            <Sketch />
          </ProtectedRoute>
        ),
      },
      {
        path: "view",
        element: (
          <ProtectedRoute>
            <ViewModel />
          </ProtectedRoute>
        ),
      },
      {
        path: "*", // Catch-all route for 404
        element: <NotFound />,
      },
    ],
  },
]);

export default AppRouter;
