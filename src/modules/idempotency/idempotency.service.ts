// src/modules/idempotency/idempotency.service.ts
import db from "../../config/db";

// Check if an idempotency key exists
export async function checkIdempotency(key: string): Promise<any | null> {
  const record = await db.idempotencyKey.findUnique({ where: { key } });
  return record?.data || null;  // <-- use 'data' instead of 'response'
}

// Store API response against an idempotency key
export async function storeIdempotency(key: string, result: any) {
  return db.idempotencyKey.create({
    data: {
      key,
      data: result,  // <-- store the whole response here
    },
  });
}