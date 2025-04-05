const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const assetRoutes = require("./routes/assetRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const transferRoutes = require("./routes/transferRoutes");
const currencyRoutes = require("./routes/currencyRoutes");
const seedCurrencies = require("./utils/seedCurrencies");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
seedCurrencies();
app.use(cors());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Статус</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #0d1117;
          color: #58a6ff;
          font-family: 'Arial', sans-serif;
          text-align: center;
          flex-direction: column;
          overflow: hidden;
        }

        .glow-ring {
          width: 80px;
          height: 80px;
          margin-bottom: 1%;
          border-radius: 50%;
          border: 5px solid rgba(88, 166, 255, 0.5);
          box-shadow: 0 0 20px #58a6ff;
          animation: pulse 2s infinite alternate ease-in-out;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 20px #58a6ff, 0 0 40px rgba(88, 166, 255, 0.5);
          }
          100% {
            transform: scale(1.2);
            box-shadow: 0 0 40px #58a6ff, 0 0 80px rgba(88, 166, 255, 0.7);
          }
        }

        h1 {
          margin-top: 20px;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 1px;
          text-transform: uppercase;
          opacity: 0;
          animation: fadeIn 2s ease-in-out forwards;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>
    </head>
    <body>
      <div class="glow-ring"></div>
      <h1>Server run</h1>
    </body>
    </html>
  `);
});


app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/currencies", currencyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
 
