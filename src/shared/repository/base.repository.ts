import {
  AnyKeys,
  AnyObject,
  Document,
  FilterQuery,
  Model,
  ObjectId,
  UpdateQuery,
} from 'mongoose';
import { uuid } from '../utils/common.utils';

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly baseModel: Model<T>) {}

  async findOne(
    filterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.baseModel
      .findOne(filterQuery, {
        ...projection,
      })
      .exec();
  }

  async find(
    filterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T[] | null> {
    return this.baseModel
      .find(filterQuery, {
        ...projection,
      })
      .exec();
  }

  async findById(
    id: string | ObjectId,
    projection?: Record<string, unknown>,
  ): Promise<T> {
    return this.baseModel.findById(id, { ...projection }).exec();
  }

  async create(createModelData: AnyKeys<T> | AnyObject): Promise<T> {
    const createModelDataWithId = { id: uuid(), ...createModelData };
    return this.baseModel.create(createModelDataWithId);
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.baseModel.findOneAndUpdate(filterQuery, updateQuery, {
      new: true,
    });
  }

  async findByIdAndUpdate(
    id: string | ObjectId,
    updateQuery: UpdateQuery<T>,
  ): Promise<T> {
    return this.baseModel.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });
  }

  async deleteOne(filterQuery: FilterQuery<T>): Promise<boolean> {
    const deleted = await this.baseModel.deleteOne(filterQuery);
    return deleted.deletedCount === 1;
  }
}
