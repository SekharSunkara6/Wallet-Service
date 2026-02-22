"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Assets
    const gold = await prisma.asset.upsert({
        where: { name: "Gold Coins" },
        update: {},
        create: { name: "Gold Coins" },
    });
    const diamond = await prisma.asset.upsert({
        where: { name: "Diamonds" },
        update: {},
        create: { name: "Diamonds" },
    });
    // Users
    const alice = await prisma.user.upsert({
        where: { email: "alice@example.com" },
        update: {},
        create: { name: "Alice", email: "alice@example.com" },
    });
    const bob = await prisma.user.upsert({
        where: { email: "bob@example.com" },
        update: {},
        create: { name: "Bob", email: "bob@example.com" },
    });
    // System wallet (Treasury)
    const treasury = await prisma.wallet.upsert({
        where: { id: "treasury" }, // use a fixed ID for uniqueness
        update: {},
        create: {
            id: "treasury",
            assetId: gold.id,
            userId: null, // now allowed if nullable
        },
    });
    // User wallets
    await prisma.wallet.upsert({
        where: { userId_assetId: { userId: alice.id, assetId: gold.id } },
        update: {},
        create: { assetId: gold.id, userId: alice.id },
    });
    await prisma.wallet.upsert({
        where: { userId_assetId: { userId: bob.id, assetId: gold.id } },
        update: {},
        create: { assetId: gold.id, userId: bob.id },
    });
    console.log("✅ Seed complete!");
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
