import { Outlet } from "react-router";
import Navbar from "./components/public/Navbar.jsx";
import Footer from "./components/public/Footer.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
