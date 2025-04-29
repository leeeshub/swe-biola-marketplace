import React, {useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";

import Cookies from "js-cookie";



const Logout = () => {

    console.log("logout");
    Cookies.remove("Session_ID");

    const navigate = useNavigate();
    
    useEffect(() => {
        const getPosts = async () => {
            try {
                message.success("Logged out");
                navigate('/');
            } catch (error) {
                message.error("Unable to redirect");
            }
        };
        getPosts();
    }, []); // Don't remove these brackets even though it has squiggly lines under it


    return <div> Loading...</div>;


};

export default Logout;
