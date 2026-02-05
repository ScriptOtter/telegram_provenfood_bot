import { UserCreateInput, UserModel } from "../../../prisma/generated/models";
import { prismaService } from "../../infrastructure/prisma/prisma.client";

class UserRepository {
  async findUserById(telegramId: string): Promise<UserModel | null> {
    try {
      return await prismaService.user.findUnique({ where: { telegramId } });
    } catch (e) {
      console.error("=== UserRepository, findUserById ===");
      return null;
    }
  }

  async createUser(data: UserCreateInput): Promise<UserModel | null> {
    try {
      const user = await this.findUserById(data.telegramId);
      if (!user) return await prismaService.user.create({ data });
      return user;
    } catch (error) {
      console.error("=== UserRepository, createUser ===");
      return null;
    }
  }
}

export const userRepository = new UserRepository();
