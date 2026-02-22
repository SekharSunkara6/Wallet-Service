"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIdempotency = checkIdempotency;
exports.storeIdempotency = storeIdempotency;
const db_1 = __importDefault(require("../../config/db"));
async function checkIdempotency(key) {
    const record = await db_1.default.idempotencyKey.findUnique({ where: { key } });
    return record ? JSON.parse(record.response) : null;
}
async function storeIdempotency(key, response) {
    await db_1.default.idempotencyKey.create({
        data: {
            key,
            response: JSON.stringify(response),
        },
    });
}
