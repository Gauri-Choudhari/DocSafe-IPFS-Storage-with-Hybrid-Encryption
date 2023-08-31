import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const PrivateRoute = () => {
    
    const { user } = useContext(UserContext);
    
    return (
    !user?<Navigate to="/metamaskauth"/>:<Outlet/>
    )
};

export default PrivateRoute;