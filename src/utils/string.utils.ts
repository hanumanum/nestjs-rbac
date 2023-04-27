export enum TypeTextIdentificationLogic {
	AND,
	OR
}

export const StrLib = {
	replaceAll: (text: string, findString: string, replaceWith: string): string => {
		return text.split(findString).join(replaceWith);
	},
	capitalize: (text: string): string => {
		return text.charAt(0).toUpperCase() + text.slice(1);
	},
	underscorize: (text: string): string => {
		return text.split(' ').join('_');
	},
	clear: (text: string, charsToRemove: string[]): string => {
		charsToRemove.map((v) => {
			text = StrLib.replaceAll(text, v, '');
		});
		return text;
	},
	isJsonString: (str: string): boolean => {
		try {
			const json = JSON.parse(str);
			return typeof json === 'object';
		} catch (e) {
			return false;
		}
	},
	isHexString: (str: string): boolean => {
		const s = str.toUpperCase();
		const n = s.length;
		for (let i = 0; i < n; i++) {
			const ch = s[i];
			if ((ch < '0' || ch > '9') && (ch < 'A' || ch > 'F')) {
				return false;
			}
		}
		return true;
	},
	makeRandomString: (length: number, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
		let result = '';
		const charactersLength = characters.length;

		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
};

export const errorHasSubstrings = (err: any, texts: string[], logic: TypeTextIdentificationLogic) => {
	if (!err || texts.length === 0) return false;

	const details = JSON.parse(err.details);
	const detailText = details.detail;

	const mapped = texts.map((str) => detailText.includes(str));

	if (logic === TypeTextIdentificationLogic.AND) return !mapped.includes(false);
	if (logic === TypeTextIdentificationLogic.OR) return mapped.includes(true);
};
