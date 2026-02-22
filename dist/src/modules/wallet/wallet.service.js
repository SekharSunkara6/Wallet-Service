"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const client_1 = require("@prisma/client");
class WalletService {
    static async getWallet(userId, assetId) {
        const wallet = await db_1.default.wallet.findFirst({
            where: { userId, assetId },
        });
        if (!wallet)
            throw new Error("Wallet not found");
        return wallet;
    }
    static async getBalance(walletId) {
        const result = await db_1.default.ledgerEntry.aggregate({
            _sum: { amount: true },
            where: { walletId },
        });
        return result._sum.amount || 0;
    }
    static async creditUser(userId, assetId, amount, reference) {
        return db_1.default.$transaction(async (tx) => {
            const wallet = await tx.wallet.findFirst({
                where: { userId, assetId },
            });
            if (!wallet)
                throw new Error("Wallet not found");
            const systemWallet = await tx.wallet.findFirst({
                where: { userId: null, assetId },
            });
            if (!systemWallet)
                throw new Error("System wallet not found");
            await tx.ledgerEntry.createMany({
                data: [
                    {
                        walletId: wallet.id,
                        amount,
                        type: client_1.LedgerType.CREDIT,
                        reference,
                    },
                    {
                        walletId: systemWallet.id,
                        amount: -amount,
                        type: client_1.LedgerType.DEBIT,
                        reference,
                    },
                ],
            });
            const balance = await this.getBalance(wallet.id);
            return {
                walletId: wallet.id,
                balance,
            };
        });
    }
    static async debitUser(userId, assetId, amount, reference) {
        return db_1.default.$transaction(async (tx) => {
            const wallet = await tx.wallet.findFirst({
                where: { userId, assetId },
            });
            if (!wallet)
                throw new Error("Wallet not found");
            const balance = await this.getBalance(wallet.id);
            if (balance < amount) {
                throw new Error("Insufficient balance");
            }
            const systemWallet = await tx.wallet.findFirst({
                where: { userId: null, assetId },
            });
            if (!systemWallet)
                throw new Error("System wallet not found");
            await tx.ledgerEntry.createMany({
                data: [
                    {
                        walletId: wallet.id,
                        amount: -amount,
                        type: client_1.LedgerType.DEBIT,
                        reference,
                    },
                    {
                        walletId: systemWallet.id,
                        amount,
                        type: client_1.LedgerType.CREDIT,
                        reference,
                    },
                ],
            });
            const newBalance = await this.getBalance(wallet.id);
            return {
                walletId: wallet.id,
                balance: newBalance,
            };
        });
    }
}
exports.WalletService = WalletService;
