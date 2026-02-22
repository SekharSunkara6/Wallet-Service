import express from "express";
import walletRoutes from "./modules/wallet/wallet.routes";
import { errorHandler } from "./middlewares/error.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wallet Service API",
      version: "1.0.0",
      description: "Ledger-based Wallet Backend API",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./src/modules/**/*.ts"], // where swagger reads route comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wallet Service</title>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          text-align: center;
          width: 400px;
        }
        h1 { margin-bottom: 10px; }
        p { color: #555; }
        a {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>💰 Wallet Service API</h1>
        <p>Ledger-Based Backend System</p>
        <a href="/docs">View API Documentation</a>
      </div>
    </body>
    </html>
  `);
});
app.use("/wallet", walletRoutes);
app.use(errorHandler);

export default app;