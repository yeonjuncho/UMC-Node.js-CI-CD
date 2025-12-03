import dotenv from "dotenv";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

dotenv.config();

// PrismaClient 인스턴스 생성 및 export
export const prisma = new PrismaClient();