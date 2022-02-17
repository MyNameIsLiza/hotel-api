const express = require("express");
const router = express.Router();
const RoomController = require("../controllers/roomController.js");


router.post("/", RoomController.addRoom);
router.patch("/", RoomController.editRoom);
router.get("/", RoomController.getRooms);
router.get("/:id", RoomController.getRoom);
router.delete("/:id", RoomController.deleteRoom);

module.exports = router;
