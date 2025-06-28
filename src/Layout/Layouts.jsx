import {
  createBrowserRouter,
} from "react-router";
import App from "../App";
import Home from "../Pages/Home";

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