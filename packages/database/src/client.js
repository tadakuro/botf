"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
let isConnected = false;
async function connectDatabase(uri) {
    if (isConnected)
        return;
    const mongoUri = uri ?? process.env.MONGODB_URI;
    if (!mongoUri)
        throw new Error('MONGODB_URI not set');
    await mongoose_1.default.connect(mongoUri);
    isConnected = true;
}
