const express = require("express");
const router = express.Router();
const ClientController = require("../controllers/clientController.js");


router.post("/", ClientController.addClient);
router.post("/login", ClientController.loginClient);
router.post("/search", ClientController.searchClients);
router.patch("/", ClientController.editClient);
router.get("/", ClientController.getClients);
router.get("/:id", ClientController.getClient);
router.delete("/:id", ClientController.deleteClient);

module.exports = router;
