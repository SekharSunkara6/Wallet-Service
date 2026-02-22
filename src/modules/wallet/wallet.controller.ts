import { Request, Response } from "express";
import { WalletService } from "./wallet.service";
import { checkIdempotency, storeIdempotency } from "../idempotency/idempotency.service";
import { v4 as uuidv4 } from "uuid";

export class WalletController {
  static async topUp(req: Request, res: Response) {
    const idempotencyKey = req.headers["idempotency-key"] as string || uuidv4();
    const cached = await checkIdempotency(idempotencyKey);
    if (cached) return res.json(cached);

    const { userId, assetId, amount } = req.body;
    const reference = uuidv4();

    const result = await WalletService.creditUser(userId, assetId, amount, reference);
    await storeIdempotency(idempotencyKey, result);
    res.json(result);
  }

  static async bonus(req: Request, res: Response) {
    const { userId, assetId, amount } = req.body;
    const reference = `bonus-${uuidv4()}`;
    const result = await WalletService.creditUser(userId, assetId, amount, reference);
    res.json(result);
  }

  static async spend(req: Request, res: Response) {
    const idempotencyKey = req.headers["idempotency-key"] as string || uuidv4();
    const cached = await checkIdempotency(idempotencyKey);
    if (cached) return res.json(cached);

    const { userId, assetId, amount } = req.body;
    const reference = uuidv4();
    const result = await WalletService.debitUser(userId, assetId, amount, reference);
    await storeIdempotency(idempotencyKey, result);
    res.json(result);
  }

  static async getBalance(req: Request, res: Response) {
  const userId = String(req.params.userId);
  const assetId = String(req.params.assetId);

  const wallet = await WalletService.getWallet(userId, assetId);
  const balance = await WalletService.getBalance(wallet.id);

  res.json({ walletId: wallet.id, balance });
}
static async getTransactions(req: Request, res: Response) {
  const userId = String(req.params.userId);
  const assetId = String(req.params.assetId);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const wallet = await WalletService.getWallet(userId, assetId);

  const transactions = await WalletService.getTransactions(
    wallet.id,
    page,
    limit
  );

  res.json({
    success: true,
    walletId: wallet.id,
    page,
    limit,
    transactions,
  });
}
}