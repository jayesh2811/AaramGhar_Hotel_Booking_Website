const express = require('express');
const app = express();

const dbConfif = require("./db.js");
const roomsRoute = require("./routes/roomsRoute.js");
const usersRoute = require("./routes/usersRoute.js");
const bookingRoute = require("./routes/bookingsRoute.js");

app.use(express.json());
app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);
app.use("/api/bookings", bookingRoute);

const port = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));