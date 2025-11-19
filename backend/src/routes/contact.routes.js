const express = require("express");
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  replyContact,
  deleteContact,
} = require("../controllers/contact.controller");

// Public (người dùng gửi liên hệ)
router.post("/", createContact);

// Admin (cần middleware kiểm tra admin)
router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.post("/:id/reply", replyContact);
router.delete("/:id", deleteContact);

module.exports = router;
