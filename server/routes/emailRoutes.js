import express from "express";
import sendEmail from "../utils/email/sendEmail.js";

const router = express.Router();

router.post("/test", async (req, res) => {
  try {
    await sendEmail(
      "akshaybachhav172@gmail.com",
      "SnapBazaar Test Email",
      "<h1>Email working successfully!</h1>",
    );

    res.status(200).json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

export default router;
