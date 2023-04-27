import { TObject } from './object.utils';
export const errorLogger = (err: any) => {
	console.log('\x1b[31m%s\x1b[0m', "\n--->>> START OF ERROR LOGGER ...." + new Date())
	const calledFunction = () => {
		const callStack = new Error().stack.split('at ');
		return callStack[3].replace("\n", "");
	};

	console.log('\x1b[31m%s\x1b[0m', "CALLED FUNCTION:")
	console.log(calledFunction());
	console.log("Error:", err);
	console.log('\x1b[31m%s\x1b[0m', `END OF ERROR LOGGER\n`)
	//return;
};


export enum EnumArrayLoggerMode {
	PRESERVE_FILEDS = 'PRESERVE_FILEDS',
	REMOVE_FIELDS = 'REMOVE_FIELDS'
}

export const arrayLogger = (arrayOfObjects: TObject[], title: string, fields: string[] = [], loggerMode: EnumArrayLoggerMode = EnumArrayLoggerMode.PRESERVE_FILEDS) => {
	if (!arrayOfObjects || !Array.isArray(arrayOfObjects) || arrayOfObjects.length === 0) {
		console.log(arrayOfObjects)
		return
	}

	if (fields.length === 0) {
		console.table(arrayOfObjects)
		return
	}

	const arrayOfPartialObjects = arrayOfObjects.map((v) => {
		return Object
			.keys(v)
			.reduce((acc, key) => {
				if (loggerMode === EnumArrayLoggerMode.PRESERVE_FILEDS && fields.includes(key)) {
					acc[key] = v[key]
				}
				else if (loggerMode === EnumArrayLoggerMode.REMOVE_FIELDS && !fields.includes(key)) {
					acc[key] = v[key]
				}
				return acc
			}, {})
	});

	console.log(`\n--->>> Start Of Objects Logger: ${title}` + new Date())
	console.table(arrayOfPartialObjects)
	console.log(`\n--->>> End Of Objects Logger\n`)
}