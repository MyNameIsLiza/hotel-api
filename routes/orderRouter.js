const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController.js");


router.post("/", OrderController.addOrder);
router.post("/search", OrderController.searchOrders);
router.patch("/", OrderController.editOrder);
router.get("/", OrderController.getOrders);
router.get("/:id", OrderController.getOrder);
router.delete("/:id", OrderController.deleteOrder);

module.exports = router;
