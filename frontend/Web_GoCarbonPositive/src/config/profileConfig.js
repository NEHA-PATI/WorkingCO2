import UserProfile from "../components/user/UserProfile";
import OrgProfile from "../components/org/OrgProfile";
import AdminProfile from "../components/admin/AdminProfile";

const profileConfig = {
    user: {
        component: UserProfile,
    },
    organization: {
        component: OrgProfile,
    },
    admin: {
        component: AdminProfile,
    },
};

export default profileConfig;
