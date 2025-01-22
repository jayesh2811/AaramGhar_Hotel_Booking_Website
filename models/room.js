const { timeStamp } = require("console");
const mongoose = require("mongoose");
const { type } = require("os");

const roomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    maxCount: {
      type: Number,
      required: true,
    },

    phoneNumber: {
      type: Number,
      required: true,
    },

    rentPerDay: {
      type: Number,
      required: true,
    },

    imgUrls: [],

    currBookings: [],

    type: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    amenities: [],

    location: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
  },
  {
    timeStamp: true,
  }
);

const RoomModel = mongoose.model("rooms", roomSchema);

module.exports = RoomModel;
