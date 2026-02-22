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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 walletId:
 *                   type: string
 *                 balance:
 *                   type: number
 *             example:
 *               success: true
 *               message: "Wallet credited successfully"
 *               walletId: "8c43167d-f8d9-4440-8709-f62e46c5817c"
 *               balance: 1500
 */
router.post("/topup", WalletController.topUp);

/**
 * @swagger
 * /wallet/spend:
 *   post:
 *     summary: Spend from wallet
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
 *         description: Wallet debited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 walletId:
 *                   type: string
 *                 balance:
 *                   type: number
 *             example:
 *               success: true
 *               message: "Wallet debited successfully"
 *               walletId: "8c43167d-f8d9-4440-8709-f62e46c5817c"
 *               balance: 500
 */
router.post("/spend", WalletController.spend);

/**
 * @swagger
 * /wallet/bonus:
 *   post:
 *     summary: Add bonus to wallet
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
 *         description: Bonus added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 walletId:
 *                   type: string
 *                 balance:
 *                   type: number
 *             example:
 *               success: true
 *               message: "Bonus added successfully"
 *               walletId: "8c43167d-f8d9-4440-8709-f62e46c5817c"
 *               balance: 2000
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
 *     responses:
 *       200:
 *         description: Returns wallet balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 walletId:
 *                   type: string
 *                 balance:
 *                   type: number
 *             example:
 *               walletId: "8c43167d-f8d9-4440-8709-f62e46c5817c"
 *               balance: 1500
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
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Returns wallet transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 walletId:
 *                   type: string
 *                 page:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *             example:
 *               success: true
 *               walletId: "8c43167d-f8d9-4440-8709-f62e46c5817c"
 *               page: 1
 *               limit: 10
 *               transactions: [
 *                 {
 *                   id: "tx1",
 *                   amount: 1000,
 *                   type: "CREDIT",
 *                   reference: "abc123",
 *                   createdAt: "2026-02-22T00:00:00.000Z"
 *                 }
 *               ]
 */
router.get("/:userId/:assetId/transactions", WalletController.getTransactions);

export default router;