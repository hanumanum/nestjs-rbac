import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export enum EnumSettingTypes {
	STRING = 'string',
	FLOAT = 'float',
	INTEGER = 'integer',
	DATE = 'date',
	OBJECT = 'object'
}

@Entity({ name: 'settings' })
export class SettingsEntity extends BaseEntity {
	@PrimaryColumn('varchar')
	setting_name: string;

	@Column()
	setting_value: string;

	@Column()
	setting_type: EnumSettingTypes;

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
	updated_at: Date;
}
