import { Injectable } from '@nestjs/common';
import { AcronymEntity } from './acronyms.entity';
import { AcronymRepository } from './acronyms.repository';
import { CreateAcronymDto } from './dto/create-acronym.dto';
import { UpdateAcronymDto } from './dto/update-acronym.dto';

@Injectable()
export class AcronymService {
  constructor(private readonly acronymRepository: AcronymRepository) {}

  async loadJsonData(): Promise<any> {
    await this.acronymRepository.loadAcronyms();
    return 'Acronyms loaded to the database successfully!';
  }

  getAllAcronyms(page, limit, search): Promise<any> {
    return this.acronymRepository.getAllAcronyms(page, limit, search);
  }

  getAcronymByName(acronymName: string): Promise<any> {
    return this.acronymRepository.getAcronymByName(acronymName);
  }

  getRandomAcronyms(count: number): Promise<any> {
    return this.acronymRepository.getRandomAcronyms(count);
  }

  createAcronym(createAcronymDto: CreateAcronymDto): Promise<AcronymEntity> {
    return this.acronymRepository.createAcronym(createAcronymDto);
  }

  updateAcronym(
    acronym: string,
    updateAcronymDto: UpdateAcronymDto,
  ): Promise<AcronymEntity> {
    return this.acronymRepository.updateAcronym(acronym, updateAcronymDto);
  }

  deleteAcronym(acronym: string): Promise<any> {
    return this.acronymRepository.deleteAcronym(acronym);
  }
}
