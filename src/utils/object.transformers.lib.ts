//import { connector_v2 as IAppointmentsV2 } from '../grpc/proto/connector_v2/appointments';
import { TObject, objectFlatten } from './object.utils';
import { EnumFieldsFilterMode, objectFieldsFilter, objectRenameFields, addFields, transformValueBy, TRanameFieldsConfig, TFieldAndFunctionConfg } from './object.utils';

export { EnumFieldsFilterMode, TRanameFieldsConfig, TFieldAndFunctionConfg } from './object.utils'

export class ObjectTransformerLib {
	private data = null;
	constructor(entity: TObject | TObject[]) {
		this.data = entity;
	}

	getData() {
		return this.data;
	}

	flatten(keyToNotFlatten?: string) {
		if (Array.isArray(this.data))
			this.data = this.data.map((v) => objectFlatten(v, keyToNotFlatten));
		else
			this.data = objectFlatten(this.data, keyToNotFlatten);

		return this;
	}

	filterFields(mode: EnumFieldsFilterMode, keys: string[]): ObjectTransformerLib {
		if (Array.isArray(this.data))
			this.data = this.data.map((v) => objectFieldsFilter(v, mode, keys));
		else
			this.data = objectFieldsFilter(this.data, mode, keys);

		return this;
	}

	renameFields(config: TRanameFieldsConfig[]): ObjectTransformerLib {
		if (Array.isArray(this.data))
			this.data = this.data.map((v) => objectRenameFields(v, config));
		else
			this.data = objectRenameFields(this.data, config);

		return this;
	}

	addFields(config: TFieldAndFunctionConfg[]): ObjectTransformerLib {
		if (Array.isArray(this.data))
			this.data = this.data.map((v) => addFields(v, config));
		else
			this.data = addFields(this.data, config);
		return this;
	}

	transformValueBy(config: TFieldAndFunctionConfg[]): ObjectTransformerLib {
		if (Array.isArray(this.data))
			this.data = this.data.map((v) => transformValueBy(v, config));
		else
			this.data = transformValueBy(this.data, config);
		return this;
	}

}