// Login.js
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography, message } from "antd";
import Cookies from "js-cookie";
import "./auth.css";

let navigate;

const { Text } = Typography;

const onFinish = async (values) => {
  try {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values), // Send the form data (username and password)
    });

    const data = await response.json();

    if (response.status === 200) {
      message.success(data.message); // Show success message
      // Do something with the user data (e.g., save in state, redirect)

      Cookies.set("Session_ID", data.session, { expires: 1 });

      CheckSessionID(navigate);
    } else {
      message.error(data.message); // Show error message
    }
  } catch (error) {
    message.error("An error occurred while logging in.");
  }
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Login = () => {
    // This is the React datatype that to redirect the page
    navigate = useNavigate();

    // On the page load
    useEffect(() => {
        // console.log('Test');
        // If the user has a session id cookie, then check if it is valid
        if (Cookies.get("Session_ID") !== undefined) {
            CheckSessionID(navigate);
        }
    });

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/images/auth-logo.png" alt="Biola University Logo" className="logo-img" />
      </div>

      <div className="login-right">
        <Typography.Title level={1}>LOGIN</Typography.Title>
        <Form name="login" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input placeholder="User ID" className="custom-input"/>
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" className="custom-input"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button custom-button">Login</Button>
          </Form.Item>
        </Form>
        <Text>Don’t have an account? <Link to="/signup">Sign Up</Link></Text>
      </div>
    </div>
  );
};

const CheckSessionID = async (nav) => {
    console.log(Cookies.get("Session_ID"))
  // Send a HTTPS Post request to the server, with the body being the session id cookie
  const response = await fetch("http://localhost:4000/checkSession", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session_id: Cookies.get("Session_ID") }),
  });
    console.log(response);

  // If the session id was valid, then it would redirect from the main page
  if (response.status === 200) {
    console.log("Switching");
    // This is where it would redirect
    nav("/");
  }
};

export default Login;