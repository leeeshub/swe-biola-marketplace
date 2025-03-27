import React, { useEffect } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

let navigate;

const { Text, Title } = Typography;

const onFinish = async (values) => {
  console.log("Success:", values);
  try {
    const response = await fetch("http://localhost:4000/signup", {
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

const SignUp = () => {
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
        <div >
            <Title>SIGN UP</Title>

            <Form
                name="signup"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                {/* Name Field */}
                <Form.Item name="name" label="Name"
                    rules={[{ required: true, message: 'Please enter your name!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="email" label="Email"
                    rules={[{ required: true, message: 'Please enter your email!' }]}>
                    <Input placeholder="e.g., john.doe@biola.edu" suffix={<Button type="primary">CONFIRM</Button>} />
                </Form.Item>

                <Form.Item name="password" label="Password"
                    rules={[
                        { required: true, message: 'Please enter your password' },
                        {
                            pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/,
                            message: 'Password must be at least 8 characters, include at least 1 letter, 1 number, and 1 special character (!@#$%^&*()).',
                        },
                    ]}
                >
                    <Input.Password suffix={<Button type="primary">CONFIRM</Button>} />
                </Form.Item>

                <Form.Item name="passwordConfirm" label="Password Confirmation"
                    rules={[
                        { required: true, message: 'Please confirm your password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>

            <Text>
                Already have an account? <Link to="/login">Login</Link>
            </Text>
        </div>
    );
}

const CheckSessionID = async (nav) => {
  // Send a HTTPS Post request to the server, with the body being the session id cookie
  const response = await fetch("http://localhost:5000/checkSession", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session_id: Cookies.get("Session_ID") }),
  });

  // If the session id was valid, then it would redirect from the main page
  if (response.status === 200) {
    console.log("Switching");
    // This is where it would redirect, since we don't have a main page the testing was done with the signup link
    nav("/");
  }
};

export default SignUp;
