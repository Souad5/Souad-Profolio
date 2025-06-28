import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import App from "../App";
import Home from "../Pages/Home";
import About from "../Pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <div>Page Not Found</div>,
    children: [
        {
            index: true,
            element:<Home/>
        },
        
    ]
  },
]);

export default router