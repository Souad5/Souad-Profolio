import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import App from "../App";
import Home from "../Pages/Home";
import About from "../Pages/About";
import NotFound from "../Pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <NotFound/>,
    children: [
        {
            index: true,
            element:<Home/>
        },
        
    ]
  },
]);

export default router