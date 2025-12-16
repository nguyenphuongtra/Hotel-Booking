const express = require("express");
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  replyContact,
  deleteContact,
} = require("../controllers/contact.controller");

router.post("/", createContact);

router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.post("/:id/reply", replyContact);
router.delete("/:id", deleteContact);

module.exports = router;
