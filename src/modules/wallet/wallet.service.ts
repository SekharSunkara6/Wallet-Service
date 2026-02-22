import prisma from "../../config/db";
import { Prisma, LedgerType } from "@prisma/client";
import { logger } from "../../utils/logger";

export class WalletService {

  static async getWallet(userId: string, assetId: string) {
    const wallet = await prisma.wallet.findFirst({
      where: { userId, assetId },
    });

    if (!wallet) throw new Error("Wallet not found");
    return wallet;
  }

  static async getBalance(
  walletId: string,
  tx?: Prisma.TransactionClient
) {
  const client = tx || prisma;

  const result = await client.ledgerEntry.aggregate({
    _sum: { amount: true },
    where: { walletId },
  });

  return result._sum.amount || 0;
}

  static async creditUser(
    userId: string,
    assetId: string,
    amount: number,
    reference: string
  ) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      let wallet = await tx.wallet.findFirst({
  where: { userId, assetId },
});

if (!wallet) {
  wallet = await tx.wallet.create({
    data: {
      userId,
      assetId,
    },
  });
}

      const systemWallet = await tx.wallet.findFirst({
  where: { userId: "system", assetId },
});

      if (!systemWallet) throw new Error("System wallet not found");

      await tx.ledgerEntry.createMany({
  data: [
    {
      walletId: wallet.id,
      amount,
      type: LedgerType.CREDIT,
      reference,
    },
    {
      walletId: systemWallet.id,
      amount: -amount,
      type: LedgerType.DEBIT,
      reference,
    },
  ],
});

      const balance = await this.getBalance(wallet.id, tx);
      logger.info(`Topup: User ${userId} credited ${amount} ${assetId}`);
      return {
        walletId: wallet.id,
        balance,
      };
    });
  }

  static async debitUser(
    userId: string,
    assetId: string,
    amount: number,
    reference: string
  ) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      const wallet = await tx.wallet.findFirst({
        where: { userId, assetId },
      });

      if (!wallet) throw new Error("Wallet not found");

      const balance = await this.getBalance(wallet.id, tx);

      if (balance < amount) {
        throw new Error("Insufficient balance");
      }

      const systemWallet = await tx.wallet.findFirst({
  where: { userId: "system", assetId },
});

      if (!systemWallet) throw new Error("System wallet not found");

      await tx.ledgerEntry.createMany({
  data: [
    {
      walletId: wallet.id,
      amount: -amount,
      type: LedgerType.DEBIT,
      reference,
    },
    {
      walletId: systemWallet.id,
      amount,
      type: LedgerType.CREDIT,
      reference,
    },
  ],
});

      const newBalance = await this.getBalance(wallet.id, tx);
      logger.info(`Spend: User ${userId} debited ${amount} ${assetId}`);
      return {
        walletId: wallet.id,
        balance: newBalance,
      };
    });
  }
    static async getTransactions(
  walletId: string,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;

  return prisma.ledgerEntry.findMany({
    where: { walletId },
    orderBy: { createdAt: "desc" },
    skip: skip,
    take: limit,
  });
}
}