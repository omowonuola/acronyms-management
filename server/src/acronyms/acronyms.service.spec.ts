import { Test, TestingModule } from '@nestjs/testing';
import { AcronymRepository } from './acronyms.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AcronymEntity } from './acronyms.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('AcronymRepository', () => {
  let acronymRepository: AcronymRepository;
  let acronymEntity: Repository<AcronymEntity>;
  let fsMock: typeof fs;

  beforeEach(async () => {
    fsMock = {
      readFileSync: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcronymRepository,
        {
          provide: getRepositoryToken(AcronymEntity),
          useClass: Repository,
        },
        {
          provide: 'fs',
          useValue: fsMock,
        },
      ],
    }).compile();

    acronymRepository = module.get<AcronymRepository>(AcronymRepository);
    acronymEntity = module.get<Repository<AcronymEntity>>(
      getRepositoryToken(AcronymEntity),
    );
  });

  describe('loadAcronyms', () => {
    it('should load acronyms from JSON file and save to database', async () => {
      const readFileSyncMock = jest.fn();
      (readFileSyncMock as jest.Mock).mockReturnValue(
        '{"ABC": "Acme Business Company"}',
      );
      const fsMock = {
        readFileSync: readFileSyncMock,
      } as unknown as typeof import('fs');
      jest.spyOn(acronymEntity, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(acronymEntity, 'save').mockResolvedValueOnce({} as any);

      await acronymRepository.loadAcronyms();

      expect(fsMock.readFileSync).toHaveBeenCalledWith(
        'src/acronym.json',
        'utf8',
      );
    });
  });

  describe('getAcronymByName', () => {
    it('should return the acronym with the given name', async () => {
      const acronymName = 'TEST';
      const acronymEntityInstance = new AcronymEntity();
      acronymEntityInstance.id = 1;
      acronymEntityInstance.acronym = acronymName;
      jest
        .spyOn(acronymEntity, 'findOne')
        .mockResolvedValueOnce(acronymEntityInstance);

      const result = await acronymRepository.getAcronymByName(acronymName);

      expect(result).toEqual(acronymEntityInstance);
      expect(acronymEntity.findOne).toHaveBeenCalledWith({
        where: { acronym: acronymName },
      });
    });

    it('should throw a NotFoundException if the acronym is not found', async () => {
      const acronymName = 'TEST';
      jest.spyOn(acronymEntity, 'findOne').mockResolvedValueOnce(undefined);

      await expect(
        acronymRepository.getAcronymByName(acronymName),
      ).rejects.toThrow(
        new NotFoundException(`Acronym '${acronymName}' not found`),
      );
    });
  });

  describe('getRandomAcronyms', () => {
    it('should return an array of acronyms with the given count', async () => {
      const count = 3;
      const totalCount = 5;
      const acronyms = [
        { id: 1, acronym: 'AAA' },
        { id: 2, acronym: 'BBB' },
        { id: 3, acronym: 'CCC' },
        { id: 4, acronym: 'DDD' },
        { id: 5, acronym: 'EEE' },
      ];
      jest.spyOn(acronymEntity, 'count').mockResolvedValue(totalCount);
      jest.spyOn(acronymEntity.createQueryBuilder(), 'skip').mockReturnThis();
      jest.spyOn(acronymEntity.createQueryBuilder(), 'take').mockReturnThis();
      jest
        .spyOn(acronymEntity.createQueryBuilder(), 'orderBy')
        .mockReturnThis();
      jest.spyOn(acronymEntity.createQueryBuilder(), 'getOne');

      const result = await acronymRepository.getRandomAcronyms(count);

      expect(result).toHaveLength(count);
      expect(acronymEntity.count).toHaveBeenCalledTimes(1);
      expect(acronymEntity.createQueryBuilder().skip).toHaveBeenCalledTimes(
        count,
      );
      expect(acronymEntity.createQueryBuilder().take).toHaveBeenCalledTimes(
        count,
      );
      expect(acronymEntity.createQueryBuilder().orderBy).toHaveBeenCalledTimes(
        count,
      );
      expect(acronymEntity.createQueryBuilder().getOne).toHaveBeenCalledTimes(
        count,
      );
    });

    it('should throw a NotFoundException if the count is greater than the total number of acronyms', async () => {
      const count = 10;
      const totalCount = 5;
      jest.spyOn(acronymEntity, 'count').mockResolvedValue(totalCount);

      await expect(acronymRepository.getRandomAcronyms(count)).rejects.toThrow(
        new NotFoundException(
          `Only ${totalCount} acronyms found in the database.`,
        ),
      );
    });
  });

  describe('createAcronym', () => {
    it('should create a new acronym', async () => {
      const createAcronymDto = {
        acronym: 'API',
        definition: 'Application Programming Interface',
      };

      const acronymEntityMock = new AcronymEntity();
      acronymEntityMock.acronym = 'API';
      acronymEntityMock.definition = 'Application Programming Interface';

      jest.spyOn(acronymEntity, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(acronymEntity, 'create').mockReturnValue(acronymEntityMock);
      jest.spyOn(acronymEntity, 'save').mockResolvedValue(acronymEntityMock);

      const result = await acronymRepository.createAcronym(createAcronymDto);

      expect(result).toEqual(acronymEntityMock);
    });

    it('should throw a ConflictException if the acronym already exists', async () => {
      const createAcronymDto = {
        acronym: 'API',
        definition: 'Application Programming Interface',
      };

      const acronymEntityMock = new AcronymEntity();
      acronymEntityMock.acronym = 'API';

      jest.spyOn(acronymEntity, 'findOne').mockResolvedValue(acronymEntityMock);

      await expect(
        acronymRepository.createAcronym(createAcronymDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updateAcronym', () => {
    const acronym = 'LOL';
    const updateAcronymDto = { acronym, definition: 'Laugh Out Loud' };
    const existingAcronym = new AcronymEntity();
    existingAcronym.acronym = acronym;
    existingAcronym.definition = 'Laughing Out Loud';

    it('should update the acronym definition', async () => {
      jest.spyOn(acronymEntity, 'findOne').mockResolvedValue(existingAcronym);
      jest.spyOn(acronymEntity, 'save').mockResolvedValue(existingAcronym);

      const result = await acronymRepository.updateAcronym(
        acronym,
        updateAcronymDto,
      );

      expect(acronymEntity.findOne).toHaveBeenCalledWith({
        where: { acronym },
      });
      expect(acronymEntity.save).toHaveBeenCalledWith(existingAcronym);
      expect(result).toEqual(existingAcronym);
      expect(existingAcronym.definition).toEqual(updateAcronymDto.definition);
    });

    it('should throw NotFoundException if acronym not found', async () => {
      jest.spyOn(acronymEntity, 'findOne').mockResolvedValue(undefined);

      await expect(
        acronymRepository.updateAcronym(acronym, updateAcronymDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAcronym', () => {
    it('should delete an acronym successfully', async () => {
      const acronymToDelete = new AcronymEntity();
      acronymToDelete.acronym = 'ABC';
      acronymToDelete.definition = 'Alpha Bravo Charlie';
      jest.spyOn(acronymEntity, 'findOne').mockResolvedValue(acronymToDelete);
      jest.spyOn(acronymEntity, 'remove').mockResolvedValue(undefined);

      const result = await acronymRepository.deleteAcronym(
        acronymToDelete.acronym,
      );

      expect(acronymEntity.findOne).toHaveBeenCalledWith({
        where: { acronym: acronymToDelete.acronym },
      });
      expect(acronymEntity.remove).toHaveBeenCalledWith(acronymToDelete);
      expect(result).toEqual(
        `Acronym ${acronymToDelete.acronym} has been sucessfully deleted`,
      );
    });

    it('should throw NotFoundException when the acronym does not exist', async () => {
      const acronymToDelete = new AcronymEntity();
      acronymToDelete.acronym = 'ABC';
      acronymToDelete.definition = 'Alpha Bravo Charlie';
      jest.spyOn(acronymEntity, 'findOne').mockResolvedValue(undefined);

      await expect(
        acronymRepository.deleteAcronym(acronymToDelete.acronym),
      ).rejects.toThrow(NotFoundException);
      expect(acronymEntity.findOne).toHaveBeenCalledWith({
        where: { acronym: acronymToDelete.acronym },
      });
      expect(acronymEntity.remove).not.toHaveBeenCalled();
    });
  });
});
