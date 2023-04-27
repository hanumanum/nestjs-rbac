export const RegexLib = {
	betweenTwo: (text: string, left: string, right: string): string[] => {
		const regex = new RegExp('(?<=\\' + left + ').+?(?=\\' + right + ')', 'g');
		const matches = text.match(regex);
		return matches;
	},
	removeSpecialChars: (str: string) => {
		return str.replace(/(\r\n|\n|\r)/gm, '');
	}
};
