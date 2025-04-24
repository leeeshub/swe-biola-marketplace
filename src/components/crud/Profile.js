import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Dropdown,
  Menu,
  Typography,
  Space,
  Button,
  message,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import {
  FilterOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";

const { Meta } = Card;
const { Title, Text } = Typography;

const BlankData = new Array(9).fill(null).map((_, index) => ({
  id: index + 1,
  name: "John Doe",
  created_at: "Feb 6 2025",
  title: "Item Name",
  description:
    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
}));

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const Profile = () => {
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("1"); // Default filter

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch("http://localhost:4000/getProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id: Cookies.get("Session_ID") }),
        });
        const message = await response.json();

        console.log(message.response);

        setData(message.response);
        console.log(data);
      } catch (error) {
        message.error("Unable to connect to server");
      }
    };
    getPosts();
  }, []); // Don't remove these brackets even though it has squiggly lines under it

  const handleDelete = async (postId) => {
    // Comment out the real request
    // try {
    //   const response = await fetch("http://localhost:4000/deletePost", {
    //     method: "DELETE",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ post_id: postId }),
    //   });

    //   const result = await response.json();

    //   if (result.success) {
    //     message.success("Post deleted");
    //     setData((prev) => prev.filter((item) => item.post_id !== postId));
    //   } else {
    //     message.error("Failed to delete post");
    //   }
    // } catch (error) {
    //   message.error("Server error");
    // }

    // Mocked delete for testing
    message.success(`Pretending to delete post #${postId}`);
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.key);
  };

  const { SubMenu } = Menu;

  const filterMenu = (
    <Menu onClick={handleFilterChange}>
      <SubMenu title="Price">
        <Menu.Item key="1">Low to High</Menu.Item>
        <Menu.Item key="2">High to Low</Menu.Item>
      </SubMenu>
      <SubMenu title="Category">
        <Menu.Item key="clothes">Clothes</Menu.Item>
        <Menu.Item key="electronics">Electronics</Menu.Item>
        <Menu.Item key="books">Books</Menu.Item>
        <Menu.Item key="furniture">Furniture</Menu.Item>
        <Menu.Item key="other">Other</Menu.Item>
      </SubMenu>
      <Menu.Item key="3">Newest</Menu.Item>
    </Menu>
  );

  // ***CHANGE DATA TO QUERY ITEM NAMES FROM ALL POSTS IN DATABASE***

  // Filter items based on search query and selected filter

  let filteredData = null;

  if (data === null) {
    console.log("Loading");
  } else {
    console.log("retrieved");
    console.log(data);
    console.log(BlankData);
    filteredData = data
      // Category filter (clothes)
      .filter((item) => {
        if (selectedFilter === "clothes") {
          return item.category === "clothes";
        } else if (selectedFilter === "electronics") {
          return item.category === "electronics";
        } else if (selectedFilter === "books") {
          return item.category === "books";
        } else if (selectedFilter === "furniture") {
          return item.category === "furniture";
        } else if (selectedFilter === "other") {
          return item.category === "other";
        }
        return true; // No category filter applied
      })
      .filter(
        (item) =>
          !searchQuery ||
          (item.post_title &&
            item.post_title.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        if (selectedFilter === "1") {
          return a.price - b.price;
        } else if (selectedFilter === "2") {
          return b.price - a.price;
        } else if (selectedFilter === "3") {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
      });
  }

  if (filteredData === null) {
    return <div> Loading...</div>;
  }
  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        <strong>Welcome, {filteredData[0].name}</strong>
      </Title>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
          gap: "1rem",
        }}
      >
        <Input.Search
          placeholder="Search by item name"
          allowClear
          enterButton={<SearchOutlined />}
          style={{ maxWidth: 400 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search state
        />

        <Dropdown overlay={filterMenu} trigger={["click"]}>
          <Button icon={<FilterOutlined />}>Filter</Button>
        </Dropdown>
      </div>

      <Row gutter={[24, 24]}>
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8}>
              <Card
                hoverable
                cover={
                  <Link to={"/info/" + item.post_id}>
                    <div
                      style={{
                        height: 150,
                        backgroundColor: "#ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        alt="placeholder"
                        src={item.image_url}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          opacity: 0.75,
                        }}
                      />
                    </div>
                  </Link>
                }
              >
                <Space direction="vertical" size={4} style={{ width: "100%" }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.name} � {formatter.format(new Date(item.created_at))}
                  </Text>

                  <Link
                    to={"/info/" + item.post_id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <Text strong>{item.post_title}</Text>
                    <Text strong>${item.price}</Text>
                  </Link>

                  <Text type="secondary">{item.description}</Text>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "0.5rem",
                    }}
                  >
                    <Link to={`/update/${item.post_id}`}>
                      <Button icon={<EditOutlined />}>Edit</Button>
                    </Link>
                    <Popconfirm
                      title="Are you sure you want to delete this post?"
                      onConfirm={() => handleDelete(item.post_id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                </Space>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Text
              type="secondary"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "2rem",
              }}
            >
              No items found.
            </Text>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Profile;
