import React, { useState } from "react";
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
} from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Title, Text } = Typography;

const data = new Array(9).fill(null).map((_, index) => ({
  id: index + 1,
  author: "John Doe",
  date: "Feb 6 2025",
  title: "Item Name",
  description:
    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
}));

const Main = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("1"); // Default filter

  const handleFilterChange = (e) => {
    setSelectedFilter(e.key);
  };

  const filterMenu = (
    <Menu onClick={handleFilterChange}>
      <Menu.Item key="1">Price: Low to High</Menu.Item>
      <Menu.Item key="2">Price: High to Low</Menu.Item>
      <Menu.Item key="3">Newest</Menu.Item>
    </Menu>
  );

  // ***CHANGE DATA TO QUERY ITEM NAMES FROM ALL POSTS IN DATABASE***

  // Filter items based on search query and selected filter
  const filteredData = data
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (selectedFilter === "1") {
        // Price: Low to High
        return a.price - b.price;
      } else if (selectedFilter === "2") {
        // Price: High to Low
        return b.price - a.price;
      } else if (selectedFilter === "3") {
        // Newest (sort by date)
        return new Date(b.date) - new Date(a.date);
      }
      return 0; // Default if no filter is applied
    });

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Welcome,
        <br />
        to <strong>Biola Marketplace</strong>
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
                      src="https://img.icons8.com/ios/100/image.png"
                      style={{ width: 50, opacity: 0.5 }}
                    />
                  </div>
                }
              >
                <Space direction="vertical" size={4}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.author} • {item.date}
                  </Text>
                  <Text strong>{item.title}</Text>
                  <Text type="secondary">{item.description}</Text>
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

export default Main;
