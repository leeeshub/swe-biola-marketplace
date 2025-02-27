CREATE DATABASE IF NOT EXISTS StudentMarketplace;

USE StudentMarketplace;

CREATE TABLE IF NOT EXISTS UserProfiles (
    user_id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    
    PRIMARY KEY (user_id)    
);

CREATE TABLE IF NOT EXISTS Posts (
    post_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_title VARCHAR(255) NOT NULL,
    price NUMERIC(12,2),
    type BOOL,
    category VARCHAR(80),
    status VARCHAR(80),
    created_at DATETIME,

    PRIMARY KEY (post_id),
    FOREIGN KEY (user_id) REFERENCES UserProfiles(user_id)
);

CREATE TABLE IF NOT EXISTS Items (
    item_id INT AUTO_INCREMENT,
    post_id INT NOT NULL,
    item VARCHAR(255) NOT NULL,
    description TEXT,
    author VARCHAR(255),
    isbn INT,

    PRIMARY KEY (item_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
);

CREATE TABLE IF NOT EXISTS Images (
    image_id INT AUTO_INCREMENT,
    post_id INT NOT NULL,
    image_name varchar(255) NOT NULL,
    image_url varchar(255) NOT NULL,
    image_alt_text varchar(255),

    PRIMARY KEY (image_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
);

CREATE TABLE IF NOT EXISTS Messages (
    message_id INT AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    message_content TEXT,
    created_at DATETIME,

    PRIMARY KEY (message_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id),
    FOREIGN KEY (user_id) REFERENCES UserProfiles(user_id)
);


CREATE USER IF NOT EXISTS 'viewer'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT ON * TO 'viewer'@'localhost';