-- Create Database
CREATE DATABASE FoodDonationDB;
GO

USE FoodDonationDB;
GO

-- Users Table
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Phone NVARCHAR(15),
    Password NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Food Donations Table
CREATE TABLE FoodDonations (
    DonationID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT,
    FoodName NVARCHAR(100),
    Category NVARCHAR(50),
    FoodType NVARCHAR(20),
    Quantity INT,
    NumberOfPeople INT,
    PickupAddress NVARCHAR(255),
    PickupTime DATETIME,
    Status NVARCHAR(30) DEFAULT 'Available',
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

-- NGOs Table
CREATE TABLE NGOs (
    NGOID INT IDENTITY(1,1) PRIMARY KEY,
    NGOName NVARCHAR(100),
    Email NVARCHAR(100),
    Phone NVARCHAR(15),
    Address NVARCHAR(255)
);
GO

-- Food Requests Table
CREATE TABLE FoodRequests (
    RequestID INT IDENTITY(1,1) PRIMARY KEY,
    DonationID INT,
    NGOID INT,
    RequestDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(30) DEFAULT 'Pending',
    FOREIGN KEY (DonationID) REFERENCES FoodDonations(DonationID),
    FOREIGN KEY (NGOID) REFERENCES NGOs(NGOID)
);
GO

-- Insert Sample Data
INSERT INTO Users (FullName, Email, Phone, Password, Role)
VALUES
('Selva Priya', 'selva@gmail.com', '9876543210', '123456', 'Donor'),
('Stella Persiya', 'stella@gmail.com', '9876543211', '123456', 'Donor'),
('Rahul Kumar', 'rahul@gmail.com', '9876543212', '123456', 'NGO'),
('Anitha Devi', 'anitha@gmail.com', '9876543213', '123456', 'Donor'),
('Vignesh R', 'vignesh@gmail.com', '9876543214', '123456', 'Admin');
GO

INSERT INTO NGOs (NGOName, Email, Phone, Address)
VALUES
('Helping Hands', 'help@gmail.com', '9876543201', 'Chennai'),
('Food For All', 'food@gmail.com', '9876543202', 'Madurai'),
('Care Foundation', 'care@gmail.com', '9876543203', 'Coimbatore'),
('Hope Trust', 'hope@gmail.com', '9876543204', 'Trichy'),
('Smile Foundation', 'smile@gmail.com', '9876543205', 'Salem');
GO

INSERT INTO FoodDonations (UserID, FoodName, Category, FoodType, Quantity, NumberOfPeople, PickupAddress, PickupTime)
VALUES
(1,'Rice','Lunch','Veg',20,40,'Chennai',GETDATE()),
(2,'Biryani','Dinner','Non-Veg',15,30,'Madurai',GETDATE()),
(3,'Bread','Breakfast','Veg',25,20,'Coimbatore',GETDATE()),
(4,'Chapati','Dinner','Veg',18,25,'Trichy',GETDATE()),
(5,'Lemon Rice','Lunch','Veg',30,50,'Salem',GETDATE());
GO

INSERT INTO FoodRequests (DonationID, NGOID, Status)
VALUES
(1,1,'Pending'),
(2,2,'Approved'),
(3,3,'Pending'),
(4,4,'Completed'),
(5,5,'Pending');
GO

SELECT * FROM Users;
SELECT * FROM FoodDonations;
SELECT * FROM NGOs;
SELECT * FROM FoodRequests;

ALTER TABLE Users
ADD ResetOTP NVARCHAR(10),
ResetOTPExpiry DATETIME;

SELECT * FROM Users;

SELECT Email, Password
FROM Users;

SELECT Email, Password
FROM Users
WHERE Email = 'gifty@gmail.com';


