import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ship } from './ship.entity';
import { Repository } from 'typeorm';
import { CreateShipDto } from './ship-create.dto';
import { UpdateShipDto } from './ship-update.dto';
//===========================================================================================================


@Injectable()
export class ShipService {
	constructor(
		@InjectRepository(Ship) private readonly shipRepository: Repository<Ship>,
	) { }


	async findAll() {
		return await this.shipRepository.find();
	}

	async findAllByEdit() {
		const shipsFull = await this.shipRepository.find({ order: { acronym: 'ASC' } });
		const shipsResult = shipsFull.map(obj => {
			const data = {
				id: obj.id,
				mmsi: obj.mmsi,
				name: obj.name,
				base: obj.base,
				acronym: obj.acronym,
				type: obj.type,
			}
			return data;
		})
		return shipsResult;
	}

	async findOneWithPagination(mmsi: number, page: number) {
		const ship = await this.shipRepository.find({
			relations: { positions: true },
			where: { mmsi },
		});

		ship.sort((a, b) => b.positions.length - a.positions.length);

		const { positions, ...shipData } = ship[0];
		positions.sort((a, b) => b.latestTime.getTime() - a.latestTime.getTime());
		return { ...shipData, positions };
	}

	async findOnebyMMSI(mmsi: number) {
		return await this.shipRepository.findOne({
			where: { mmsi },
		});
	}

	async create(shipData: CreateShipDto) {
		const checkShipMMSI = await this.shipRepository.findOne({
			where: { mmsi: shipData.mmsi },
		});

		if (checkShipMMSI) {
			throw new BadRequestException('Ошибка при сохранении данных. Возможно, такой MMSI уже есть в базе');
		}

		return await this.shipRepository.save(shipData);
	}

	async update(updateShipDto: UpdateShipDto) {
		const checkShipId = await this.shipRepository.findOne({
			where: { id: updateShipDto.id },
		});

		const checkShipMMSI = await this.shipRepository.findOne({
			where: { mmsi: updateShipDto.mmsi },
		});

		if (!checkShipId || checkShipId.mmsi !== checkShipMMSI.mmsi) {
			throw new BadRequestException('Ошибка при обновлении данных. Возможно, вы указали неправильный номер MMSI');
		}

		return await this.shipRepository
			.createQueryBuilder()
			.update(Ship)
			.set({
				mmsi: updateShipDto.mmsi,
				name: updateShipDto.name,
				base: updateShipDto.base,
				acronym: updateShipDto.acronym,
				type: updateShipDto.type,
			})
			.where("id = :id", { id: updateShipDto.id })
			.execute();
	}

	// remove(id: number) {
	// 	return `This action removes a #${id} ship`;
	// }
}
