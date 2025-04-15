import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/home/Main';
import Login from "./components/authentication/Login";
import SignUp from "./components/authentication/SignUp";
import AddPost from './components/crud/AddPost';
import EditPost from './components/crud/EditPost';
import Info from './components/crud/Info';
import Header from './components/common/Header';
import Profile from './components/crud/Profile';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="add-post" element={<AddPost />} />
        <Route path="update" element={<EditPost />} />
        <Route path="profile" element={<Profile />} />
        {/* need a post id for the update/info page */}
        <Route path="info" element={<Info />} />
        <Route path="info/:post" element={<Info />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;