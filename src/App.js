import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/authentication/Login";
import SignUp from "./components/authentication/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;