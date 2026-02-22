import prisma from "../../config/db";

export async function checkIdempotency(key: string) {
  const record = await prisma.idempotencyKey.findUnique({ where: { key } });
  return record ? JSON.parse(record.response) : null;
}

export async function storeIdempotency(key: string, response: any) {
  await prisma.idempotencyKey.create({
    data: {
      key,
      response: JSON.stringify(response),
    },
  });
}