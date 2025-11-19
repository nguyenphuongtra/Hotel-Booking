const Contact = require("../models/Contact");
const { sendReplyEmail } = require("../services/mail.service");

exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Gửi liên hệ thành công!",
      data: contact,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Admin: lấy tất cả liên hệ
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Admin: xem 1 liên hệ
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact)
      return res.status(404).json({ success: false, message: "Không tìm thấy liên hệ." });

    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Admin phản hồi và gửi email
exports.replyContact = async (req, res) => {
  try {
    const { replyMessage } = req.body;

    const contact = await Contact.findById(req.params.id);
    if (!contact)
      return res.status(404).json({ success: false, message: "Không tìm thấy liên hệ." });

    // Gửi email phản hồi
    await sendReplyEmail(contact.email, "Phản hồi từ khách sạn", replyMessage);

    contact.status = "replied";
    contact.replyMessage = replyMessage;
    await contact.save();

    res.json({ success: true, message: "Đã phản hồi liên hệ!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Admin xóa liên hệ
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact)
      return res.status(404).json({ success: false, message: "Không tìm thấy liên hệ." });

    res.json({ success: true, message: "Đã xóa liên hệ." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
