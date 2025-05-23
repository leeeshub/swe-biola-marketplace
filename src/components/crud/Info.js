import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import Header from '../common/Header';
import Footer from '../common/Footer';
import './crud.css';

const Info = () => {
  const [data, setData] = useState(null);

  let post_id = useParams().post;

  const nav = useNavigate();

  if (post_id === undefined) {
    console.log("Lacking a post_id");
    nav("/");
    post_id = 1;
  }
  console.log(post_id);

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
        console.log(data);
      } catch (error) {
        message.error("Unable to connect to server");
      }
    };
    getPosts();
  }, []); // Don't remove these brackets even though it has squiggly lines under it

  const defaultImage = "https://picsum.photos/700/500";

  if (data === null) {
    return <div> Loading...</div>;
  }

  const mailToLink = `mailto:${data.email}?subject=Interested%20in%20your%20post%20"${data.post_title}"`;

  return (
      <>
          <Header />

          <div
              style={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh", // Ensures it stretches full height of screen
              }}
          >
              <div
                  style={{
                      flex: 1, // Let this grow to fill remaining space if needed
                      display: "flex",
                      flexWrap: "wrap",
                      backgroundColor: "#1e1e1e",
                      color: "white",
                      padding: "5rem",
                      justifyContent: "center",
                  }}
              >
                  <div style={{ flex: "1 1 300px", maxWidth: 600, paddingRight: 30 }}>
                      <img
                          src={data.image_url}
                          alt={data.post_title}
                          style={{ width: "100%", borderRadius: "10px", objectFit: "cover" }}
                      />
                  </div>

                  <div
                      style={{
                          flex: "1 1 300px",
                          padding: "1rem",
                          maxWidth: 500,
                          paddingLeft: 30,
                      }}
                  >
                      <h2 style={{ color: "#f87171", fontSize: "2rem", fontWeight: "bold" }}>
                          ${data.price}
                      </h2>
                      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                          {data.post_title}
                      </h1>
                      <p style={{ margin: "1rem 0" }}>{data.description}</p>

                      <p style={{ fontSize: "20px", fontStyle: "italic", color: "#ccc" }}>
                          #{data.category}
                      </p>

                      <div
                          style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginTop: "2rem",
                          }}
                      >
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                              <UserOutlined
                                  style={{
                                      fontSize: "2rem",
                                      background: "#444",
                                      padding: "0.5rem",
                                      borderRadius: "50%",
                                  }}
                              />
                              <div>
                                  <p style={{ margin: 0, fontWeight: "bold" }}>{data.name}</p>
                                  <p style={{ margin: 0, color: "#aaa" }}>{data.email}</p>
                              </div>
                          </div>
                          <a href={mailToLink} target="_blank" rel="noopener noreferrer">
                              <Button type="primary" danger>
                                  EMAIL
                              </Button>
                          </a>
                      </div>
                  </div>
              </div>
          </div>
      </>


  );
};

export default Info;
