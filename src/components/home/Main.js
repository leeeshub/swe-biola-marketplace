import React from 'react';
import { Row, Col, Card, Input, Dropdown, Menu, Typography, Space, Button } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Title, Text } = Typography;

const data = new Array(9).fill(null).map((_, index) => ({
  id: index + 1,
  author: 'John Doe',
  date: 'Feb 6 2025',
  title: 'Item Name',
  description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
}));

const filterMenu = (
  <Menu
    items={[
      { key: '1', label: 'Price: Low to High' },
      { key: '2', label: 'Price: High to Low' },
      { key: '3', label: 'Newest' },
    ]}
  />
);

const Main = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center' }}>
        Right now,<br />at <strong>Biola Marketplace</strong>
      </Title>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <Input.Search
          placeholder="Search"
          allowClear
          enterButton={<SearchOutlined />}
          style={{ maxWidth: 400 }}
        />

        <Dropdown overlay={filterMenu} trigger={['click']}>
          <Button icon={<FilterOutlined />}>Filter</Button>
        </Dropdown>
      </div>

      <Row gutter={[24, 24]}>
        {data.map(item => (
          <Col key={item.id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              cover={
                <div style={{
                  height: 150,
                  backgroundColor: '#ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img alt="placeholder" src="https://img.icons8.com/ios/100/image.png" style={{ width: 50, opacity: 0.5 }} />
                </div>
              }
            >
              <Space direction="vertical" size={4}>
                <Text type="secondary" style={{ fontSize: 12 }}>{item.author} • {item.date}</Text>
                <Text strong>{item.title}</Text>
                <Text type="secondary">{item.description}</Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Main;