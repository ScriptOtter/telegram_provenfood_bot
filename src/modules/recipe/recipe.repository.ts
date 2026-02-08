import {
  FoodGroupCreateInput,
  FoodGroupModel,
  RecipeCreateInput,
  RecipeModel,
  RecipeUpdateInput,
} from "../../../prisma/generated/models";
import { prismaService } from "../../infrastructure/prisma/prisma.client";

class RecipeRepository {
  private async isOwnerFoodGroup(
    telegramId: string,
    foodGroupId: string,
  ): Promise<boolean> {
    try {
      const foodGroup = await prismaService.foodGroup.findUnique({
        where: { id: foodGroupId },
      });
      if (!foodGroup) return false;
      return foodGroup.ownerId === telegramId;
    } catch (e) {
      console.error("=== RecipeRepository, isOwnerFoodGroup ===");
      return false;
    }
  }

  public async findRecipeById(id: string): Promise<RecipeModel | null> {
    try {
      return await prismaService.recipe.findUnique({ where: { id } });
    } catch (e) {
      console.error("=== RecipeRepository, findRecipeById ===");
      return null;
    }
  }

  public async createRecipe(
    data: RecipeCreateInput,
  ): Promise<RecipeModel | null> {
    try {
      return await prismaService.recipe.create({ data });
    } catch (e) {
      console.error("=== RecipeRepository, createRecipe ===", e);
      return null;
    }
  }

  public async createFoodGroup(
    data: FoodGroupCreateInput,
  ): Promise<FoodGroupModel | null> {
    try {
      return await prismaService.foodGroup.create({ data });
    } catch (e) {
      console.error("=== RecipeRepository, createFoodGroup ===");
      return null;
    }
  }

  public async findFoodGroupByTelegramId(
    telegramId: string,
  ): Promise<FoodGroupModel | null> {
    try {
      return await prismaService.foodGroup.findFirst({
        where: { ownerId: telegramId },
      });
    } catch (e) {
      console.error("=== RecipeRepository, findFoodGroupByTelegramId ===");
      return null;
    }
  }

  public async getMyFoodGroups(
    telegramId: string,
  ): Promise<FoodGroupModel[] | null> {
    try {
      return await prismaService.foodGroup.findMany({
        where: { ownerId: telegramId },
      });
    } catch (e) {
      console.error("=== RecipeRepository, getMyFoodGroups ===");
      return null;
    }
  }

  public async addRecipeInFoodGroup(
    telegramId: string,
    recipeId: string,
    foodGroupId: string,
  ): Promise<boolean> {
    try {
      const ownerGroup = await this.isOwnerFoodGroup(telegramId, foodGroupId);
      if (!ownerGroup) return false;
      await prismaService.foodGroup.update({
        where: { id: foodGroupId },
        data: { recipe: { connect: { id: recipeId } } },
      });
      return true;
    } catch (e) {
      console.error("=== RecipeRepository, addRecipeInFoodGroup ===");
      return false;
    }
  }

  public async deleteRecipeFromFoodGroup(
    telegramId: string,
    recipeId: string,
    foodGroupId: string,
  ): Promise<boolean> {
    try {
      const ownerGroup = await this.isOwnerFoodGroup(telegramId, foodGroupId);
      if (!ownerGroup) return false;
      await prismaService.foodGroup.update({
        where: { id: foodGroupId },
        data: { recipe: { disconnect: { id: recipeId } } },
      });
      return true;
    } catch (e) {
      console.error("=== RecipeRepository, deleteRecipeFromFoodGroup ===");
      return false;
    }
  }

  public async updateRecipeInFoodGroup(
    telegramId: string,
    recipeId: string,
    foodGroupId: string,
    data: RecipeUpdateInput,
  ): Promise<boolean> {
    try {
      const ownerGroup = await this.isOwnerFoodGroup(telegramId, foodGroupId);
      if (!ownerGroup) return false;
      await prismaService.recipe.update({
        where: { id: recipeId },
        data,
      });
      return true;
    } catch (e) {
      console.error("=== RecipeRepository, updateRecipeInFoodGroup ===");
      return false;
    }
  }
}

export const recipeRepository = new RecipeRepository();
