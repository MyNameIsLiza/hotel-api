const express = require("express");
const router = express.Router();
const RoomTypeController = require("../controllers/roomTypeController.js");


router.post("/", RoomTypeController.addRoomType);
router.patch("/", RoomTypeController.editRoomType);
router.get("/", RoomTypeController.getRoomTypes);
router.get("/:id", RoomTypeController.getRoomType);
router.delete("/:id", RoomTypeController.deleteRoomType);

module.exports = router;
