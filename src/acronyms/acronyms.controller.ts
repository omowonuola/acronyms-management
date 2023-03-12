import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AcronymEntity } from './acronyms.entity';
import { AcronymService } from './acronyms.service';
import { AcronymFilterDto } from './dto/acronym-filter.dto';
import { CreateAcronymDto } from './dto/create-acronym.dto';
import { UpdateAcronymDto } from './dto/update-acronym.dto';

@Controller('api/acronym')
@ApiTags('acronym')
// @ApiBearerAuth()
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

  @Get('allAcronyms')
  @ApiOperation({ summary: 'Get All Paginated Acronyms In The Database' })
  @ApiResponse({ description: 'return all records', type: AcronymEntity })
  getAllAcronyms(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    // @Query() filterDto: AcronymFilterDto,
  ) {
    this.logger.verbose(`User retrieving all acronyms. Filter: ${search}`);
    return this.acronymService.getAllAcronyms(page, limit, search);
  }

  @Get('/:acronymName')
  @ApiOperation({ summary: 'Get A Acronym In The Database' })
  @ApiResponse({
    description: 'return a particular acronym record',
    type: AcronymEntity,
  })
  async getAcronymByName(@Param('acronymName') acronymName: string) {
    this.logger.verbose(`User retrieving a acronym. Filter: ${acronymName}`);
    return this.acronymService.getAcronymByName(acronymName);
  }

  @Get('/random/:count')
  @ApiOperation({ summary: 'Get Random Count Of Acronyms From The Database' })
  @ApiResponse({
    description: 'return random count of records',
    type: AcronymEntity,
  })
  getRandomAcronyms(@Param('count') count: number) {
    this.logger.verbose(
      `User retrieving a random count of acronyms. Filter: ${count}`,
    );
    return this.acronymService.getRandomAcronyms(count);
  }

  @Post()
  @ApiOperation({ summary: 'Create new Acronym' })
  @ApiResponse({
    description: 'return the details of the newly created acronym',
    type: AcronymEntity,
  })
  createAcronym(@Body() createAcronymDto: CreateAcronymDto) {
    this.logger.verbose(
      `User creating a new acronym with the definition. Data: ${JSON.stringify(
        createAcronymDto,
      )}`,
    );
    return this.acronymService.createAcronym(createAcronymDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/update/:acronym')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update Existing Acronym' })
  @ApiResponse({
    description: 'return the details of the updated acronym',
    type: AcronymEntity,
  })
  updateAcronym(
    @Param('acronym') acronym: string,
    @Body() updateAcronymDto: UpdateAcronymDto,
  ) {
    this.logger.verbose(
      `User updating an existing acronym definition. Data: ${JSON.stringify(
        updateAcronymDto,
      )}`,
    );
    return this.acronymService.updateAcronym(acronym, updateAcronymDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/:deleteAcronym')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete Existing Acronym' })
  @ApiResponse({
    description: 'remove an existing record from the database',
    type: AcronymEntity,
  })
  deleteAcronym(@Param('deleteAcronym') acronym: string): Promise<void> {
    this.logger.verbose(
      `User deleting an existing acronym and the definition. Data: ${JSON.stringify(
        acronym,
      )}`,
    );
    return this.acronymService.deleteAcronym(acronym);
  }
}
