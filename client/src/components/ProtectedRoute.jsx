import { Navigate } from "react-router-dom";
import useUserStore from "../Store/userStore";

const ProtectedRoute = ({ children }) => {
  const { user } = useUserStore();

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
