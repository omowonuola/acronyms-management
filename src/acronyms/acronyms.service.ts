import { Body, Injectable } from '@nestjs/common';
import { AcronymEntity } from './acronyms.entity';
import { AcronymRepository } from './acronyms.repository';
import { CreateAcronymDto } from './dto/create-acronym.dto';

@Injectable()
export class AcronymService {
  constructor(private readonly currencyRepository: AcronymRepository) {}

  async loadJsonData(): Promise<any> {
    await this.currencyRepository.loadAcronyms();
    return 'Acronyms loaded successfully!';
  }

  getAllAcronyms(page, limit, search): Promise<any> {
    return this.currencyRepository.getAllAcronyms(page, limit, search);
  }

  getAcronymByName(acronymName: string): Promise<any> {
    return this.currencyRepository.getAcronymByName(acronymName);
  }

  getRandomAcronyms(count: number): Promise<any> {
    return this.currencyRepository.getRandomAcronyms(count);
  }

  createAcronym(createAcronymDto: CreateAcronymDto): Promise<AcronymEntity> {
    return this.currencyRepository.createAcronym(createAcronymDto);
  }
}
