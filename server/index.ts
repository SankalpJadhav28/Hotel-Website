import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);

// ================================
// MOCK CREATE ORDER
// ================================

app.post("/api/create-order", async (req, res) => {
  const { amount, currency = "INR" } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      error: "Invalid amount",
    });
  }

  const mockOrder = {
    id: `mock_order_${Date.now()}`,
    amount: Math.round(amount * 100),
    currency,
    receipt: `mock_receipt_${Date.now()}`,
  };

  res.json(mockOrder);
});

// ================================
// MOCK VERIFY PAYMENT
// ================================

app.post("/api/verify-payment", (req, res) => {
  res.json({
    success: true,
    payment_id: `mock_payment_${Date.now()}`,
  });
});

// ================================
// BOOKING INQUIRY
// ================================

app.post("/api/inquire", (req, res) => {
  try {
    const { name, phone, email, checkIn, checkOut, guests, roomType, message } =
      req.body;

    if (!name || !phone) {
      return res.status(400).json({
        error: "Name and phone are required",
      });
    }

    console.log("New booking inquiry:", {
      name,
      phone,
      email,
      checkIn,
      checkOut,
      guests,
      roomType,
      message,
    });

    res.json({
      success: true,
      message: "Inquiry received — our team will call you within 24 hours.",
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to save inquiry",
    });
  }
});

// ================================
// START SERVER
// ================================

const PORT = Number(process.env.PORT ?? 3001);

app.listen(PORT, () => {
  console.log(`Hotel Ashok backend running on http://localhost:${PORT}`);
});
