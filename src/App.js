import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/home/Main';
import Login from "./components/authentication/Login";
import SignUp from "./components/authentication/SignUp";
import AddPost from './components/crud/AddPost';
import EditPost from './components/crud/EditPost';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="add-post" element={<AddPost />} />
        <Route path="update" element={<EditPost />} />
        {/* need a post id for the update page */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;