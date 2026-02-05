import { ENV } from "../../config/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../prisma/generated/client";

const connectionString = `${ENV.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });

export class PrismaService extends PrismaClient {
  constructor() {
    super({ adapter });
  }

  dbInit() {
    try {
      const start = Date.now();
      this.$connect();
      console.log(`Db started (${Date.now() - start}ms)`);
    } catch (e) {
      console.log("Db error!");
      this.$disconnect();
    }
  }
}

export const prismaService = new PrismaService();
prismaService.dbInit();
