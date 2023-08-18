import { useState } from "react";
import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className=" flex flex-row w-screen overflow-hidden default bg-kdark">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default App;
