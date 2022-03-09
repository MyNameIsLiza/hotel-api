const express = require('express');

const app = express();
app.use(express.json());

const dotenv = require('dotenv').config();

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

require('./initDB')();

app.get('/', (req, res) => {
    res.send(`Hello`);
})

const roomTypeRouter = require("./routes/roomTypeRouter");
const roomRouter = require("./routes/roomRouter");
const clientRouter = require("./routes/clientRouter");
const orderRouter = require("./routes/orderRouter");

app.use("/api/room_types", roomTypeRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/clients", clientRouter);
app.use("/api/orders", orderRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('Server started on port ' + PORT + '...');
});

