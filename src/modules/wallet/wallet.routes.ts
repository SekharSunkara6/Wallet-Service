import { Router } from "express";
import { WalletController } from "./wallet.controller";

const router = Router();

// Test route for browser
router.get("/", (req, res) => {
  res.send("Wallet Service is running! Use Postman to test API endpoints.");
});

/**
 * @swagger
 * /wallet/topup:
 *   post:
 *     summary: Top up wallet
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               assetId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Wallet credited successfully
 */
router.post("/topup", WalletController.topUp);
/**
 * @swagger
 * /wallet/spend:
 *   post:
 *     summary: Spend from wallet
 *     tags: [Wallet]
 */
router.post("/spend", WalletController.spend);
/**
 * @swagger
 * /wallet/bonus:
 *   post:
 *     summary: Add bonus to wallet
 *     tags: [Wallet]
 */
router.post("/bonus", WalletController.bonus);
/**
 * @swagger
 * /wallet/{userId}/{assetId}/balance:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/:userId/:assetId/balance", WalletController.getBalance);
/**
 * @swagger
 * /wallet/{userId}/{assetId}/transactions:
 *   get:
 *     summary: Get wallet transactions
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/:userId/:assetId/transactions", WalletController.getTransactions);

export default router;