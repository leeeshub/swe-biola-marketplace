import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { message,} from "antd";
import "./common.css";


import Cookies from "js-cookie";


const Header = () => {
    const [data, setData] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const getPosts = async () => {
            try {
                const response = await fetch("http://localhost:4000/checksession", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ session_id: Cookies.get("Session_ID") }),
                });
                console.log(response.status);

                setData(response.status);
                //console.log(data);
            } catch (error) {
                message.error("Unable to connect to server");
            }
        };
        getPosts();
        
    }, [location]); // Don't remove these brackets even though it has squiggly lines under it

    if (data === null) {
        return (
            <header className="header p-4">
                <div className="container">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <Link
                            to="/"
                            className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
                        >
                            <img
                                src="/images/biola-logo.png"
                                alt="Logo"
                                width="200"
                                className="me-4"
                            />
                        </Link>

                        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                            <li>
                                <Link to="/login" className="nav-link px-2 me-4 tab">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="nav-link px-2 tab">
                                    Add Post
                                </Link>
                            </li>
                        </ul>

                        <div className="text-end">
                            <Link to="/login" className="btn me-2 login-btn">
                                Login
                            </Link>
                            <Link to="/signup" className="btn signup-btn">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
    else if (data === 200) {
        return (
            <header className="header p-4">
                <div className="container">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <Link
                            to="/"
                            className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
                        >
                            <img
                                src="/images/biola-logo.png"
                                alt="Logo"
                                width="200"
                                className="me-4"
                            />
                        </Link>

                        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                            <li>
                                <Link to="/profile" className="nav-link px-2 me-4 tab">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/add-post" className="nav-link px-2 tab">
                                    Add Post
                                </Link>
                            </li>
                        </ul>

                        <div className="text-end">
                            <Link to="/logout" className="btn me-2 login-btn">
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="header p-4">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <Link
                        to="/"
                        className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
                    >
                        <img
                            src="/images/biola-logo.png"
                            alt="Logo"
                            width="200"
                            className="me-4"
                        />
                    </Link>

                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li>
                            <Link to="/login" className="nav-link px-2 me-4 tab">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/login" className="nav-link px-2 tab">
                                Add Post
                            </Link>
                        </li>
                    </ul>

                    <div className="text-end">
                        <Link to="/login" className="btn me-2 login-btn">
                            Login
                        </Link>
                        <Link to="/signup" className="btn signup-btn">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );

  
};

export default Header;
