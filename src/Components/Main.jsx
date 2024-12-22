import { Outlet } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";

const Main = () => {
  return (
    <div>
      <Dashboard></Dashboard>
      <Outlet></Outlet>
    </div>
  );
};

export default Main;
