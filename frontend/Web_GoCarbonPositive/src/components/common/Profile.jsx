import React from "react";
import useAuth from "../../auth/useAuth.jsx";
import profileConfig from "../../config/profileConfig";

const Profile = () => {
    const { role, authLoading } = useAuth();

    // Auth still resolving → render nothing
    if (authLoading) return null;

    const config = profileConfig[role];

    // Safety fallback (should never happen)
    if (!config) return null;

    const ProfileComponent = config.component;

    return <ProfileComponent />;
};

export default Profile;
