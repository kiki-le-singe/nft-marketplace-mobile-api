import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Prisma, Category } from '@prisma/client';
import { CategoryService } from 'src/services/category/category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':id')
  async getCategoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Category> {
    const category = await this.categoryService.category(
      { id },
      {
        include: {
          creations: true,
        },
      },
    );

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  @Get()
  async getCategories(): Promise<Category[]> {
    return this.categoryService.categories({});
  }

  @Post()
  async createCategory(
    @Body() data: Prisma.CategoryCreateInput,
  ): Promise<Category> {
    try {
      const newCategory = await this.categoryService.createCategory(data);

      return newCategory;
    } catch (error) {
      console.error('Error creating Category:', error);

      throw new InternalServerErrorException('Failed to create Category');
    }
  }

  @Put(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    try {
      const updatedCategory = await this.categoryService.updateCategory({
        where: { id },
        data,
      });

      if (!updatedCategory) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return updatedCategory;
    } catch (error) {
      console.error('Error updating Category:', error);

      throw new InternalServerErrorException('Failed to update Category');
    }
  }

  @Delete(':id')
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Category> {
    try {
      const deletedCategory = await this.categoryService.deleteCategory({
        id,
      });

      if (!deletedCategory) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return deletedCategory;
    } catch (error) {
      console.error('Error deleting Category:', error);

      throw new InternalServerErrorException('Failed to delete Category');
    }
  }
}
