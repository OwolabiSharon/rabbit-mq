import { Logger, NotFoundException } from '@nestjs/common';
import {
  Repository,
  FindOneOptions,
  FindOptionsWhere,
  DataSource,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from '../models';

export abstract class AbstractRepository<TDocument extends BaseEntity> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Repository<TDocument>,
    private readonly dataSource: DataSource, //might be needed for running transactions
  ) {}

  async create(document: TDocument): Promise<TDocument> {
    const createdDocument = await this.model.save(document);
    return createdDocument;
  }

  async findOne(filterOptions: FindOneOptions): Promise<TDocument> {
    const document = await this.model.findOne(filterOptions);

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterOptions);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async findAndUpdate(
    filterOptions: FindOptionsWhere<TDocument>,
    updateDocument: QueryDeepPartialEntity<TDocument>,
  ): Promise<TDocument> {
    const updateResult = await this.model
      .createQueryBuilder()
      .update(updateDocument)
      .where(filterOptions)
      .returning('*')
      .execute();

    const updatedDocument = updateResult
      .generatedMaps[0] as unknown as TDocument;

    if (!updatedDocument) {
      this.logger.warn('Document not found with filterQuery', filterOptions);
      throw new NotFoundException('Document not found.');
    }

    return updatedDocument;
  }
}
