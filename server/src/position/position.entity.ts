import { Ship } from 'src/ship/ship.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
//===========================================================================================================

@Entity()
export class Position {
	@PrimaryGeneratedColumn({ name: 'position_id' })
	id: number;

	@ManyToOne(() => Ship, (ship) => ship.positions)
	ship: Ship;

	@Column()
	latitude: string;

	@Column()
	longitude: string;

	@Column()
	course: number;

	@Column({ default: false })
	isReaded: boolean;

	@Column({ type: 'timestamp with time zone' })
	latestTime: Date;

	@CreateDateColumn({ type: 'timestamp with time zone' })
	createdAt: Date;
}

/*
369970203
2022-04-22 00:05
21.2183
-157.9137
151
*/