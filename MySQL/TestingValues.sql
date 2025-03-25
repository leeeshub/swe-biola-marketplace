TRUNCATE TABLE UserProfiles;

INSERT INTO UserProfiles (name, email, password) VALUES 
    ("Test User1", "testing.email@gmail.com", "testPassword"),
    ("Testing", "testing123@gmail.com", "123"),
    ("123Tester", "123testing@gmail.com", "testtesttest"),
    ("testing.user", "testing@gmail.com", "test123");


TRUNCATE TABLE Posts;

INSERT INTO Posts (user_id, post_title, price, type, category, status, created_at) VALUES 
    (1, "Looking to sell my book", 5.00, True, "Book", "Listed", now()),
    (2, "Looking to sell my chair", 15.00, True, "Furniture", "Listed", now());


TRUNCATE TABLE Items;

INSERT INTO Items (post_id, item, description, author, isbn) VALUES
    (1, "Into to Software Engineering", "The book for software engineering CSCI 440", "SWEBOK", 1234),
    (2, "Chair", "A little used, but still in good condition", NULL, NULL);