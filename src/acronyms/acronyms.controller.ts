import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AcronymEntity } from './acronyms.entity';
import { AcronymService } from './acronyms.service';
import { CreateAcronymDto } from './dto/create-acronym.dto';
import { UpdateAcronymDto } from './dto/update-acronym.dto';

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

  @Get('allAcronyms')
  @ApiOperation({ summary: 'Get All Paginated Acronyms In The Database' })
  @ApiResponse({ description: 'return all records', type: AcronymEntity })
  getAllAcronyms(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.acronymService.getAllAcronyms(page, limit, search);
  }

  @Get('/random/:count')
  @ApiOperation({ summary: 'Get Random Count Of Acronyms From The Database' })
  @ApiResponse({
    description: 'return random count of records',
    type: AcronymEntity,
  })
  getRandomAcronyms(@Param('count') count: number) {
    return this.acronymService.getRandomAcronyms(count);
  }

  @Post()
  @ApiOperation({ summary: 'Create new Acronym' })
  @ApiResponse({
    description: 'return the details of the newly created acronym',
    type: AcronymEntity,
  })
  createAcronym(@Body() createAcronymDto: CreateAcronymDto) {
    return this.acronymService.createAcronym(createAcronymDto);
  }

  @Patch('/:acronym')
  @ApiOperation({ summary: 'Update Existing Acronym' })
  @ApiResponse({
    description: 'return the details of the updated acronym',
    type: AcronymEntity,
  })
  updateAcronym(
    @Param('acronym') acronym: string,
    @Body() updateAcronymDto: UpdateAcronymDto,
  ) {
    return this.acronymService.updateAcronym(acronym, updateAcronymDto);
  }
}
