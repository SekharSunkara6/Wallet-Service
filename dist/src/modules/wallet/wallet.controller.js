"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const wallet_service_1 = require("./wallet.service");
const idempotency_service_1 = require("../idempotency/idempotency.service");
const uuid_1 = require("uuid");
class WalletController {
    static async topUp(req, res) {
        const idempotencyKey = req.headers["idempotency-key"] || (0, uuid_1.v4)();
        const cached = await (0, idempotency_service_1.checkIdempotency)(idempotencyKey);
        if (cached)
            return res.json(cached);
        const { userId, assetId, amount } = req.body;
        const reference = (0, uuid_1.v4)();
        const result = await wallet_service_1.WalletService.creditUser(userId, assetId, amount, reference);
        await (0, idempotency_service_1.storeIdempotency)(idempotencyKey, result);
        res.json(result);
    }
    static async bonus(req, res) {
        const { userId, assetId, amount } = req.body;
        const reference = `bonus-${(0, uuid_1.v4)()}`;
        const result = await wallet_service_1.WalletService.creditUser(userId, assetId, amount, reference);
        res.json(result);
    }
    static async spend(req, res) {
        const idempotencyKey = req.headers["idempotency-key"] || (0, uuid_1.v4)();
        const cached = await (0, idempotency_service_1.checkIdempotency)(idempotencyKey);
        if (cached)
            return res.json(cached);
        const { userId, assetId, amount } = req.body;
        const reference = (0, uuid_1.v4)();
        const result = await wallet_service_1.WalletService.debitUser(userId, assetId, amount, reference);
        await (0, idempotency_service_1.storeIdempotency)(idempotencyKey, result);
        res.json(result);
    }
    static async getBalance(req, res) {
        const userId = String(req.params.userId);
        const assetId = String(req.params.assetId);
        const wallet = await wallet_service_1.WalletService.getWallet(userId, assetId);
        const balance = await wallet_service_1.WalletService.getBalance(wallet.id);
        res.json({ walletId: wallet.id, balance });
    }
}
exports.WalletController = WalletController;
