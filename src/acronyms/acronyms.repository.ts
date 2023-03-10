import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Logger, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcronymEntity } from './acronyms.entity';

export class AcronymRepository {
  private readonly logger = new Logger(AcronymRepository.name);
  constructor(
    @InjectRepository(AcronymEntity)
    private acronymEntity: Repository<AcronymEntity>,
  ) {}

  async getAllExchanges(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<void> {
    try {
      const skip = (page - 1) * limit;
      //   const where = {};
      //   if (startDate && endDate) {
      //     where['createdAt'] = Between(startDate, endDate);
      //   } else if (startDate) {
      //     where['createdAt'] = MoreThanOrEqual(startDate);
      //   } else if (endDate) {
      //     where['createdAt'] = LessThanOrEqual(endDate);
      //   }
      const [rows, count] = await this.acronymEntity.findAndCount({
        // where,
        skip,
        take: limit,
      });
      if (!rows || rows.length === 0) {
        throw new NotFoundException('No Live Rates Found');
      }
      // emit the data via websocket
      // this.server.emit('newDataAdded', {
      //   data: rows,
      //   total: count,
      //   page,
      //   pageSize: limit,
      //   startDate,
      //   endDate,
      // });
    } catch (error) {
      this.logger.log(error);
    }
  }

  async loadJsonData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);

    for (const item of data) {
      const keyValue = new AcronymEntity();
      keyValue.acronym = Object.keys(item)[0];
      keyValue.definition = item[keyValue.acronym];
      await this.acronymEntity.save(keyValue);
    }
  }
}
