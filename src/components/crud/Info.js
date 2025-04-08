import React from 'react';
import { Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Info = ({ post }) => {
  const {
    title = 'Selling my chair',
    description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    price = 50,
    category = 'furniture',
    image,
    user = {
      name: 'John Doe',
      email: 'john.doe@biola.edu',
    }
  } = post || {};

  const defaultImage = 'https://picsum.photos/700/500';

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      backgroundColor: '#1e1e1e',
      color: 'white',
      padding: '2rem 0',
      justifyContent: 'center',
    }}>
      <div style={{ flex:'1 1 300px', maxWidth:700 }}>
        <img
          src={image || defaultImage}
          alt={title}
          style={{ width:'100%', borderRadius: '10px', objectFit:'cover' }}
        />
      </div>

      <div style={{ flex:'1 1 300px', padding:'1rem', maxWidth:500 }}>
        <h2 style={{ color:'#f87171', fontSize:'1.5rem' }}>${price}</h2>
        <h1 style={{ fontSize:'2rem', fontWeight:'bold' }}>{title}</h1>
        <p style={{ margin:'1rem 0' }}>{description}</p>

        <p style={{ fontStyle: 'italic', color: '#ccc' }}>#{category}</p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '2rem'
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <UserOutlined style={{ fontSize: '2rem', background:'#444', padding:'0.5rem', borderRadius:'50%' }} />
            <div>
              <p style={{ margin:0, fontWeight: 'bold' }}>{user.name}</p>
              <p style={{ margin:0, color: '#aaa' }}>{user.email}</p>
            </div>
          </div>
          <Button type="primary" danger>CHAT</Button>
        </div>
      </div>
    </div>
  );
};

export default Info;