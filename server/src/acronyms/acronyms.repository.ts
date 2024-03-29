import { Repository } from 'typeorm';
import {
  ConflictException,
  Logger,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcronymEntity, paginationResponse } from './acronyms.entity';
import * as fs from 'fs';
import { CreateAcronymDto } from './dto/create-acronym.dto';
import { UpdateAcronymDto } from './dto/update-acronym.dto';

export class AcronymRepository {
  private readonly logger = new Logger(AcronymRepository.name);
  constructor(
    @InjectRepository(AcronymEntity)
    private acronymEntity: Repository<AcronymEntity>,
  ) {}

  async loadAcronyms(): Promise<void> {
    try {
      const data = fs.readFileSync('src/acronym.json', 'utf8');
      const acronyms = JSON.parse(data);

      for (const acronym of acronyms) {
        // check for existing acronyms before loading the data
        const existingAcronym = await this.acronymEntity.findOne({
          where: { acronym: Object.keys(acronym)[0] },
        });
        if (existingAcronym) {
          // Skip creating a new entity if the acronym already exists
          continue;
        }
        const newAcronym = new AcronymEntity();
        newAcronym.definition = acronym[Object.keys(acronym)[0]];
        newAcronym.acronym = Object.keys(acronym)[0];
        await this.acronymEntity.save(newAcronym);
      }
    } catch (error) {
      this.logger.log(error);
    }
  }

  async getAllAcronyms(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ): Promise<paginationResponse> {
    try {
      const skip = (page - 1) * limit;
      let queryBuilder = this.acronymEntity.createQueryBuilder('acronym');
      if (search) {
        const searchParam = `%${search}%`;
        queryBuilder = queryBuilder.where(
          'LOWER(acronym.acronym) LIKE LOWER(:acronym)',
          {
            acronym: searchParam,
          },
        );
      }

      const [rows, count] = await queryBuilder
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      if (!rows || rows.length === 0) {
        throw new NotFoundException('No Acronyms Found');
      }

      const hasMore = count > skip + limit;
      const nextFrom = hasMore ? skip + limit : undefined;
      const response = {
        total: count,
        page: page,
        pageSize: limit,
        data: rows,
      };

      if (hasMore) {
        response['next'] = `?page=${nextFrom}&limit=${limit}&search=${search}`;
      }

      return response;
    } catch (error) {
      this.logger.log(error);
    }
  }

  async getAcronymByName(acronymName: string): Promise<AcronymEntity> {
    const result = await this.acronymEntity.findOne({
      where: { acronym: acronymName },
    });
    if (!result) {
      throw new NotFoundException(`Acronym '${acronymName}' not found`);
    }
    return result;
  }

  async getRandomAcronyms(count: number): Promise<AcronymEntity[]> {
    const totalCount = await this.acronymEntity.count();
    if (totalCount < count) {
      throw new NotFoundException(
        `Only ${totalCount} acronyms found in the database.`,
      );
    }

    const maxIndex = totalCount - 1;
    const randomIndices = [];
    let index;
    for (let i = 0; i < count; i++) {
      do {
        index = Math.floor(Math.random() * totalCount);
      } while (randomIndices.includes(index));
      randomIndices.push(index);
    }

    const acronyms = [];
    for (const randomIndex of randomIndices) {
      const acronym = await this.acronymEntity
        .createQueryBuilder('acronym')
        .skip(randomIndex)
        .take(10)
        .orderBy('id')
        .getOne();
      acronyms.push(acronym);
    }

    return acronyms;
  }

  async createAcronym(
    createAcronymDto: CreateAcronymDto,
  ): Promise<AcronymEntity> {
    const { acronym, definition } = createAcronymDto;

    // check for duplicate acronym in the database
    const acronymFound = await this.acronymEntity.findOne({
      where: { acronym },
    });

    if (acronymFound) {
      throw new ConflictException(`acronym with ${acronym} found`);
    }
    const newAcronym = this.acronymEntity.create({
      acronym,
      definition,
    });

    return await this.acronymEntity.save(newAcronym);
  }

  async updateAcronym(
    acronym: string,
    updateAcronymDto: UpdateAcronymDto,
  ): Promise<AcronymEntity> {
    const { definition } = updateAcronymDto;

    const updateAcronym = await this.acronymEntity.findOne({
      where: { acronym },
    });

    if (!updateAcronym) {
      throw new NotFoundException(`Acronym ${acronym} not found`);
    }
    updateAcronym.definition = definition;

    return await this.acronymEntity.save(updateAcronym);
  }

  async deleteAcronym(acronym: string): Promise<any> {
    const deleteAcronym = await this.acronymEntity.findOne({
      where: { acronym },
    });

    if (!deleteAcronym) {
      throw new NotFoundException(`Acronym ${acronym} not found`);
    }
    await this.acronymEntity.remove(deleteAcronym);
    return `Acronym ${acronym} has been sucessfully deleted`;
  }
}
