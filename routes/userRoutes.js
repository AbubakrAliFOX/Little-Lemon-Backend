const express = require('express');
const router = express.Router();

//Controllers
const { createUser, loginUser, addReservation, addOrder, getOrders} = require("../controllers/userController.js");
const protect = require("../middleware/auth.js");

router.post("/register", createUser);
// .get(createUser)

router.post("/login", loginUser);

router.post("/order", protect, addOrder);

router.get("/order", protect, getOrders);

router.post("/reservations", protect, addReservation);

// router.get("/secret", protect, bro);
// router
//   .route("/login")
//   .get(users.renderLogin)
//   .post(
//     storeReturnTo,
//     passport.authenticate("local", {
//       failureFlash: true,
//       failureRedirect: "/login",
//     }),
//     users.login
//   );

// router.get("/logout", users.logout);

module.exports = router;
