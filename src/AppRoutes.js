import { Routes, Route, useLocation } from "react-router-dom";
import MainPage from "./components/home/Main";
import Login from "./components/authentication/Login";
import SignUp from "./components/authentication/SignUp";
import Logout from "./components/authentication/Logout";
import AddPost from './components/crud/AddPost';
import EditPost from './components/crud/EditPost';
import Info from './components/crud/Info';
import Header from './components/common/Header';
import Profile from './components/crud/Profile';

function AppRoutes() {
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="logout" element={<Logout />} />
        <Route path="add-post" element={<AddPost />} />
        <Route path="update" element={<EditPost />} />
        <Route path="update/:post" element={<EditPost />} />
        <Route path="profile" element={<Profile />} />
        <Route path="info" element={<Info />} />
        <Route path="info/:post" element={<Info />} />
      </Routes>
    </>
  );
}

export default AppRoutes;