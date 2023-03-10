import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Logger, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcronymEntity } from './acronyms.entity';
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
}
