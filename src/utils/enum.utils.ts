export const enumToDicitionary = (_enum) => {
	return Object.keys(_enum).map((v) => {
		return {
			label: v,
			value: _enum[v]
		};
	});
};


export const enumToDicitionaryStringValues = (_enum) => {
	return Object
		.keys(_enum)
		.filter((v) => typeof _enum[v] === 'string')
		.map((v) => {
			return {
				label: _enum[v],
				value: v
			};
		});
};
