import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Logger, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcronymEntity, paginationResponse } from './acronyms.entity';
import * as fs from 'fs';

export class AcronymRepository {
  private readonly logger = new Logger(AcronymRepository.name);
  constructor(
    @InjectRepository(AcronymEntity)
    private acronymEntity: Repository<AcronymEntity>,
  ) {}

  async loadAcronyms() {
    const data = fs.readFileSync('src/acronym.json', 'utf8');
    const acronyms = JSON.parse(data);

    for (const acronym of acronyms) {
      const newAcronym = new AcronymEntity();
      newAcronym.definition = acronym[Object.keys(acronym)[0]];
      newAcronym.acronym = Object.keys(acronym)[0];
      await this.acronymEntity.save(newAcronym);
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
        queryBuilder = queryBuilder
          .where('acronym.acronym ILIKE :acronym', { acronym: `%${search}%` })
          .orWhere('acronym.definition ILIKE :definition', {
            definition: `%${search}%`,
          });
      }

      const [rows, count] = await queryBuilder
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      if (!rows || rows.length === 0) {
        throw new NotFoundException('No Acronyms Found');
      }
      return {
        total: count,
        page: page,
        pageSize: limit,
        data: rows,
      };
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
}
