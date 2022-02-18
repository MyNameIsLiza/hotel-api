const express = require("express");
const router = express.Router();
const ClientController = require("../controllers/clientController.js");
const OrderController = require("../controllers/orderController.js");
const RoomController = require("../controllers/roomController.js");

router.post("/api/rooms/", RoomController.addRoom);
router.patch("/api/rooms/:id", RoomController.editRoom);
router.get("/api/rooms/", RoomController.getRooms);
router.get("/api/rooms/:id", RoomController.getRoom);
router.delete("/api/rooms/:id", RoomController.deleteRoom);

router.post("/api/clients/", ClientController.addClient);
router.patch("/api/clients/:id", ClientController.editClient);
router.get("/api/clients/", ClientController.getClients);
router.get("/api/clients/:id", ClientController.getClient);
router.delete("/api/clients/:id", ClientController.deleteClient);

router.post("/api/orders/", OrderController.addOrder);
router.patch("/api/orders/:id", OrderController.editOrder);
router.get("/api/orders/", OrderController.getOrders);
router.get("/api/orders/:id", OrderController.getOrder);
router.delete("/api/orders/:id", OrderController.deleteOrder);