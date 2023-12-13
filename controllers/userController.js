const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createUser = expressAsyncHandler(async (req, res) => {
  const { password, name, email, address, prevOrders } = req.body;
  if (!password || !name || !email || !address) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    password: hashPassword,
    name,
    email,
    address,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      prevOrders: prevOrders,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = expressAsyncHandler(async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email) {
    res.status(400);
    throw new Error("Please add all required fields");
  }
  // Check for user
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      prevOrders: user.prevOrders,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

const addOrder = expressAsyncHandler(async (req, res) => {
  const items = req.body;
  const { email } = req.user;

  if (!items || !email) {
    res.status(400);
    throw new Error("An error occured!");
  }

  // Find user
  const user = await User.findOne({ email });

  // start setting new order info
  const date = new Date().toLocaleString("en-SA", {
    timeZone: "Asia/Riyadh",
    hour12: false,
  });
  const orderDate = date.split(",")[0].trim();
  const orderTime = date.split(",")[1].trim();

  let totalPrice = 0;
  for (let item of items) {
    totalPrice = totalPrice + item.price * item.qty;
  }

  const newOrder = {
    orderDate,
    orderTime,
    totalPrice,
    items,
  };

  // push new order and add it to the previos ones
  const updatedUser = await User.findOneAndUpdate(
    { email },
    { prevOrders: [... user.prevOrders, newOrder] },
    {
      new: true,
    }
  );

  // console.log(updatedUser);
  res.status(201).send('Successfully added the order');
});

const getOrders = expressAsyncHandler(async (req, res) => {
  const { email } = req.user;

  if (!email) {
    res.status(400);
    throw new Error("An error occured!");
  }

  // Find user
  const user = await User.findOne({ email });

  const response = {
    prevOrders: user.prevOrders,
    prevReservations: user.prevReservations
  }

  // console.log(updatedUser);
  res.status(201).json(response);
});


const addReservation = expressAsyncHandler(async (req, res) => {
  const reservation = req.body;
  const { email } = req.user;

  if (!reservation || !email) {
    res.status(400);
    throw new Error("An error occured!");
  }

  // Find user
  const user = await User.findOne({ email });

  // start setting new order info
  const date = new Date().toLocaleString("en-SA", {
    timeZone: "Asia/Riyadh",
    hour12: false,
  });
  const reservationDate = date.split(",")[0].trim();
  const reservationTime = date.split(",")[1].trim();

  const newReservation = {
    reservationDate,
    reservationTime,
    reservation,
  };

  // push new order and add it to the previos ones
  const updatedUser = await User.findOneAndUpdate(
    { email },
    { prevReservations: [... user.prevReservations, newReservation] },
    {
      new: true,
    }
  );

  console.log(updatedUser);
  res.status(201).send('Successfully added the reservation');
});

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

module.exports = { createUser, loginUser, addOrder, getOrders, addReservation };
