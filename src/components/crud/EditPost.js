import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Button, Upload, Select, message } from 'antd';
import { UploadOutlined, DollarOutlined } from '@ant-design/icons';
import Cookies from "js-cookie";
import Header from '../common/Header';
import Footer from '../common/Footer';
import './crud.css';

const { TextArea } = Input;
const { Option } = Select;

const EditPost = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState(null);
    const [fileList, setFileList] = useState([]);


    let post_id = useParams().post;

    const nav = useNavigate();

    if (post_id === undefined) {
        console.log("Lacking a post_id");
        nav('/');
        post_id = 1;
    }

    const navigate = useNavigate();;


    const onFinish = async (values) => {

        const formData = new FormData();
        formData.append('session_id', Cookies.get('Session_ID'));
        formData.append('title', values.title);
        formData.append('price', values.price);
        formData.append('category', values.category);
        formData.append('description', values.description);
        formData.append('post_id', post_id);

        if (fileList.length > 0) {
            formData.append('images', fileList[0].originFileObj); // Add the image file
        }
        try {
            const response = await fetch("http://localhost:4000/post-edit", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.status === 200) {
                message.success(data.message); // Show success message
                // Do something with the user data (e.g., save in state, redirect)

                CheckSessionID(navigate);

            } else {
                message.error(data.message); // Show error message
            }
        } catch (error) {
            message.error("An error occurred while logging in.");
        }
    };

    const onCancel = () => {
        //form.resetFields();
        navigate('/');
    };

    useEffect(() => {
        const getPosts = async () => {
            try {
                const response = await fetch("http://localhost:4000/getDetailed", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ post_id: post_id }),
                });
                const message = await response.json();

                console.log(message.response);
                setData(message.response[0]);    
            } catch (error) {
                message.error("Unable to connect to server");
            }
        };
        getPosts();
    }, []); // Don't remove these brackets even though it has squiggly lines under it

    if (data === null) {
        return <div> Loading...</div>;
    }
    return (
        <>
        <Header />
        <div className="circle-bg circle-1"></div>
        <div className="circle-bg circle-2"></div>
        <div className="circle-bg circle-3"></div>

        <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
            <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>
              Edit Your Post
            </h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ fontWeight: "bold" }}
                initialValues={{
                    title: data.post_title,
                    description: data.description,
                    price: data.price,
                    category: data.category,
                }}

            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Please enter a title' }]}
                    style={{ marginBottom: "20px" }}
                >
                    <Input placeholder="Enter title" 
                        style={{ height: "3rem" }}
                    />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please provide a description' }]}
                    style={{ marginBottom: "20px" }}
                >
                    <TextArea rows={7} placeholder="Please provide a detailed information" />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Please select a category' }]}
                    style={{ marginBottom: "20px" }}
                >
                    <Select placeholder="Select a category" style={{ height: "3rem"}}>
                        <Option value="clothes">Clothes</Option>
                        <Option value="electronics">Electronics</Option>
                        <Option value="books">Books</Option>
                        <Option value="furniture">Furniture</Option>
                        <Option value="other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    style={{ marginBottom: "20px" }}
                    rules={[{ required: true, message: 'Please enter a price' }]}
                >
                    <InputNumber
                        style={{ width: '100%', height: "3rem" }}
                        min={0}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        prefix={<DollarOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    label="Upload Image"
                    name="images"
                    valuePropName="fileList"
                    getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
                >
                    <Upload name="images" accept=".png, .jpg" listType="picture" maxCount={1} beforeUpload={() => false}
                        fileList={fileList}
                        onChange={({ fileList }) => {
                            // Ensure each file has originFileObj
                            const updatedList = fileList.map(file => ({
                                ...file,
                                originFileObj: file.originFileObj || file,
                            }));
                            setFileList(updatedList);
                        }}>
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button onClick={onCancel} className="btns">Cancel</Button>
                        <Button type="primary" htmlType="submit" className="btns">Submit</Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    </>
    );
};

const CheckSessionID = async (nav) => {
    // Send a HTTPS Post request to the server, with the body being the session id cookie
    const response = await fetch("http://localhost:4000/checkSession", {
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

export default EditPost;