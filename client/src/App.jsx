import { Outlet } from "react-router";
import Marquee from "./components/public/Marquee.jsx";
import Navbar from "./components/public/Navbar.jsx";
import Footer from "./components/public/Footer.jsx";
import CanvasCursor from "./components/public/CanvasCursor.jsx";

function App() {
  return (
    <>
      <CanvasCursor />
      <Marquee />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
