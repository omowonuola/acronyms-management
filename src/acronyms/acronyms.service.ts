import { Body, Injectable } from '@nestjs/common';
import { AcronymRepository } from './acronyms.repository';

@Injectable()
export class AcronymService {
  constructor(private readonly currencyRepository: AcronymRepository) {}

  async loadJsonData(): Promise<any> {
    console.log('error');
    await this.currencyRepository.loadAcronyms();
    return 'Acronyms loaded successfully!';
  }
}
