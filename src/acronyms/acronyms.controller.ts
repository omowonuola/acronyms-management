import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AcronymEntity } from './acronyms.entity';
import { AcronymService } from './acronyms.service';

@Controller('acronym')
@ApiTags('acronym')
export class AcronymController {
  private logger = new Logger('AcronymController');
  constructor(private acronymService: AcronymService) {}

  @Get()
  @ApiOperation({ summary: 'Load Json File' })
  @ApiResponse({
    description: 'load all json file into the database',
    type: AcronymEntity,
  })
  loadJsonData(): Promise<any> {
    return this.acronymService.loadJsonData();
  }
}
