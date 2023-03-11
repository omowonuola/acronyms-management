import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AcronymEntity } from './acronyms.entity';
import { AcronymService } from './acronyms.service';

@Controller('api/acronym')
@ApiTags('acronym')
export class AcronymController {
  private logger = new Logger('AcronymController');
  constructor(private acronymService: AcronymService) {}

  @Get('/loadjson')
  @ApiOperation({ summary: 'Load Json File' })
  @ApiResponse({
    description: 'load all json file into the database',
    type: AcronymEntity,
  })
  loadJsonData(): Promise<any> {
    return this.acronymService.loadJsonData();
  }

  @Get('/:acronymName')
  @ApiOperation({ summary: 'Get A Acronym In The Database' })
  @ApiResponse({
    description: 'return a particular acronym record',
    type: AcronymEntity,
  })
  async getAcronymByName(@Param('acronymName') acronymName: string) {
    return this.acronymService.getAcronymByName(acronymName);
  }

  @Get('/:allAcronyms')
  @ApiOperation({ summary: 'Get All Paginated Acronyms In The Database' })
  @ApiResponse({ description: 'return all records', type: AcronymEntity })
  getAllAcronyms(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.acronymService.getAllAcronyms(page, limit, search);
  }
}
