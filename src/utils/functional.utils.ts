export const combine = (result, nextFun) => nextFun(result);

export const pipe =
	(...fns) =>
		(x) =>
			fns.reduce(combine, x);

export const distinct = (value, index, self) => {
	return self.indexOf(value) === index;
};

export const deNullifyValue = (val: string | number | boolean | undefined | null) => (val === 'null' || val === 'NULL' || val === null ? 0 : val);

export const initArray = (len: number, initalValue: any) => {
	return [...Array(len)].map(() => {
		return { ...initalValue };
	});
};
