// idempotency.service.ts

import db from "../../config/db";

// Check if idempotency key exists
export async function checkIdempotency(key: string): Promise<JsonValue | null> {
  const record = await db.idempotencyKey.findUnique({ where: { key } });
  return record?.data || null; // <-- use 'data' here
}

// Store response against idempotency key
export async function storeIdempotency(key: string, result: any) {
  return db.idempotencyKey.create({
    data: {
      key,
      data: result, // <-- use 'data' instead of 'response'
    },
  });
}