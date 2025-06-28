import { Outlet } from "react-router";
import "./App.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-160px)]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
