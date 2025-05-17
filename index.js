const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SSLCommerzPayment = require("sslcommerz-lts");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Demo Credentials (Sandbox)
const store_id = "testbox";
const store_passwd = "qwerty";
const is_live = false; // true = production, false = sandbox

// Payment initialization route
app.post("/init", async (req, res) => {
  const { name, phone, amount } = req.body;

  if (!name || !phone || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const tran_id = "TRAN_" + Math.random().toString(36).substr(2, 9);
  const data = {
    total_amount: amount,
    currency: "BDT",
    tran_id: tran_id,
    success_url: "https://example.netlify.app/success.html",
    fail_url: "https://example.netlify.app/fail.html",
    cancel_url: "https://example.netlify.app/cancel.html",
    ipn_url: "https://example.netlify.app/ipn.html",
    shipping_method: "NO",
    product_name: "Demo Product",
    product_category: "Demo",
    product_profile: "general",
    cus_name: name,
    cus_email: "demo@email.com",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: phone
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  try {
    const apiResponse = await sslcz.init(data);
    return res.json(apiResponse);
  } catch (err) {
    return res.status(500).json({
      error: "Payment initialization failed",
      message: err.message,
    });
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("SSLCommerz Sandbox Payment Gateway is running!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
