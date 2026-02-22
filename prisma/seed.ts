import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Create Assets
  const assets = [
    { id: "usd", name: "US Dollar" },
    { id: "btc", name: "Bitcoin" },
    { id: "eth", name: "Ethereum" },
  ];

  for (const a of assets) {
    await prisma.asset.upsert({
      where: { id: a.id },
      update: {},
      create: a,
    });
  }
  console.log("✅ Test assets created");

  // 2️⃣ Create Users
  const users = [
    { id: "123", name: "Alice", email: "alice@example.com" },
    { id: "456", name: "Bob", email: "bob@example.com" },
    { id: "789", name: "Charlie", email: "charlie@example.com" },
    { id: "system", name: "System", email: "system@example.com" }, // system user
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: u,
    });
  }
  console.log("✅ Test users created");

  // 3️⃣ Create User Wallets
  const wallets = [
    { userId: "123", assetId: "usd", balance: 1000 },
    { userId: "456", assetId: "btc", balance: 2 },
    { userId: "789", assetId: "eth", balance: 5 },
  ];

  for (const w of wallets) {
    await prisma.wallet.upsert({
      where: { userId_assetId: { userId: w.userId, assetId: w.assetId } },
      update: {},
      create: w,
    });
  }
  console.log("✅ Test wallets created");

  // 4️⃣ Create System Wallets (for your system operations)
  const systemWallets = [
    { userId: "system", assetId: "usd", balance: 0 },
    { userId: "system", assetId: "btc", balance: 0 },
    { userId: "system", assetId: "eth", balance: 0 },
  ];

  for (const sw of systemWallets) {
    await prisma.wallet.upsert({
      where: { userId_assetId: { userId: sw.userId, assetId: sw.assetId } },
      update: {},
      create: sw,
    });
  }
  console.log("✅ System wallets created");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());