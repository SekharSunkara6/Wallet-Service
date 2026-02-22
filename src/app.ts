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
app.use("/wallet", walletRoutes);
app.use(errorHandler);

export default app;