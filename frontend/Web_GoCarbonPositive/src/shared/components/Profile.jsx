import { Navigate } from "react-router-dom";
import useAuth from "@contexts/AuthContext";
import profileConfig from "@config/profileConfig";

const Profile = () => {
  const { role, authLoading } = useAuth();

  if (authLoading) return null;

  const config = profileConfig[role];
  if (!config?.route) return null;

  return <Navigate to={config.route} replace />;
};

export default Profile;
