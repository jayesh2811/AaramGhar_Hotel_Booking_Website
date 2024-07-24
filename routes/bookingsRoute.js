const express = require("express");
const router = express.Router();
const Booking = require("../models/booking.js");
const Room = require("../models/room.js");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51Peu7mRtQzwbUFpF5cGEPGEx8Yxmmigxftqg9XqsnlXf8Rd6HEiyeG0BIFDdjFEc2xcuiGSBtxba2saREedIGFTm00DW73wcgo"
);
const moment = require("moment");

router.post("/bookroom", async (req, res) => {
  const { room, userid, fromdate, todate, totalamount, totaldays, token } =
    req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalamount * 100,
        customer: customer.id,
        currency: "INR",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      const formattedFromDate = moment(fromdate, "DD-MM-YYYY").format(
        "DD-MM-YYYY"
      );
      const formattedToDate = moment(todate, "DD-MM-YYYY").format("DD-MM-YYYY");

      const newBooking = new Booking({
        room: room.name,
        roomid: room._id,
        userid,
        fromdate: formattedFromDate,
        todate: formattedToDate,
        totalamount,
        totaldays,
        transactionId: "1234",
      });

      const booking = await newBooking.save();
      res.send("Room Booked Successfully");

      const roomtemp = await Room.findOne({ _id: room._id });

      roomtemp.currBookings.push({
        bookingid: booking._id,
        fromdate: formattedFromDate,
        todate: formattedToDate,
        userid: userid,
        status: booking.status,
      });

      await roomtemp.save();
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/getbookingsbyuserid", async (req, res) => {
  const userid = req.body.userid;

  try {
    const bookings = await Booking.find({ userid: userid });
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;

  try {
    const bookingitem = await Booking.findOne({ _id: bookingid });
    bookingitem.status = "Cancelled";
    await bookingitem.save();

    const room = await Room.findOne({ _id: roomid });

    const bookings = room.currBookings;

    const temp = bookings.filter(
      (booking) => booking.bookingid.toString() !== bookingid
    );
    room.currBookings = temp;

    await room.save();
    res.send("Booking Cancelled Succesfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
