import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  findAll() {
    const categories = this.categoryModel.find().exec();
    return categories;
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findOne({ _id: id }).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findByName(name: string) {
    const category = await this.categoryModel.findOne({ name });
    if (!category) {
      throw new NotFoundException(`Category with name ${name} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findOneAndUpdate(
      { _id: id },
      { $set: updateCategoryDto },
      { new: true },
    );
    return category;
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    return category.deleteOne();
  }
}
