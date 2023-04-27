import { deNullifyValue } from './functional.utils';

export type TObject = Record<string, any>;

export enum EnumFieldsFilterMode {
    preserve,
    remove
}

export type TRanameFieldsConfig = {
    fieldName: string;
    to: string;
};

export type TFieldAndFunctionConfg = {
    fieldName: string;
    funct: (d: any) => any;
};

export const objectFieldsFilter = (object: TObject, mode: EnumFieldsFilterMode, keys: string[]) => {
    if (keys.length === 0) return object;

    const _obj = { ...object };

    const filterer = (key) => (mode === EnumFieldsFilterMode.preserve ? keys.includes(key) : !keys.includes(key));
    const reducer = (newObj, n) => {
        return {
            ...newObj,
            [n]: _obj[n]
        };
    };

    return Object.keys(_obj).filter(filterer).reduce(reducer, {});
};

export const objectRenameFields = (object: TObject, config: TRanameFieldsConfig[]) => {
    if (config.length === 0) return object;

    const _obj = { ...object };
    config.map((v) => {
        _obj[v.to] = _obj[v.fieldName];
        delete _obj[v.fieldName];
    });
    return _obj;
};

export const addFields = (object: TObject, config: TFieldAndFunctionConfg[]) => {
    if (config.length === 0) return object;

    const _obj = { ...object };
    config.map((v) => {
        _obj[v.fieldName] = v.funct(_obj);
    });

    return _obj;
};


export const transformValueBy = (object: TObject, config: TFieldAndFunctionConfg[]) => {
    if (config.length === 0)
        return object;

    const _obj = { ...object };
    config.map((v) => {
        _obj[v.fieldName] = v.funct(_obj);
    });

    return _obj;
};


export const deNullifyAll = (data: any[]) => {
    return data.map((obj) => {
        return Object.keys(obj).reduce((acc, key) => {
            return {
                ...acc,
                [key]: deNullifyValue(obj[key])
            };
        }, {});
    });
};


//Be carefull with this function,
//1. keyToNotFlatten work only for first level
//2. keys with same name will be overriden
export const objectFlatten = (obj: TObject, keyToNotFlatten?: string) => {
    let notFlatten = null;
    if (keyToNotFlatten && keyToNotFlatten in obj) {
        notFlatten = obj[keyToNotFlatten];
        delete obj[keyToNotFlatten];
    }

    const result = {};

    for (const i in obj) {
        if (typeof obj[i] === 'object' && !Array.isArray(obj[i])) {
            const temp = objectFlatten(obj[i], keyToNotFlatten);
            for (const j in temp) {
                result[j] = temp[j];
            }
        } else {
            result[i] = obj[i];
        }
    }

    if (notFlatten) {
        result[keyToNotFlatten] = notFlatten;
    }
    return result;
};

/* const dddd = {
    dada1: 'ssAS',
    babab1: 'ddasd',
    maka1: {
        ma2: 'ssAS',
        ba2: 'ddasd',
        gc2: {
            ma3: 'ssAS',
            za3: 'ddasd',
            mza3: 'ssAS'
        }
    },
    mamaka1: {
        ma2: 'ssAS',
        dd2: 'ddasd',
        kj2: {
            m3: [1, 2, 3],
            z3: 'ddasd',
            a3: true
        }
    }
};
 */


export const deepEqual = (a: object, b: object, ingoreFields: Array<string>) => {
    if ((typeof a == 'object' && a != null) &&
        (typeof b == 'object' && b != null)) {

        if (Object.keys(a).length !== Object.keys(b).length)
            return false

        for (const key in a) {
            if (ingoreFields.includes(key))
                continue;

            if (!(key in b) || !deepEqual(a[key], b[key], ingoreFields))
                return false;
        }

        for (const key in b) {
            if (ingoreFields.includes(key))
                continue;

            if (!(key in a) || !deepEqual(b[key], a[key], ingoreFields))
                return false;
        }

        return true;
    }
    else {
        return a === b;
    }
}


export const keysStringsToKeys = (obj: object, keyString: string) => {
    return keyString
        .split('.')
        .reduce((o, i) => o[i], obj)
}


export const clearKeysFromObject = (obj: TObject, keys: Array<string>) => {
    return Object.keys(obj).reduce((prev, current) => {
        if (!keys.includes(current)) {
            return {
                ...prev,
                [current]: obj[current]
            }
        }
        else {
            return {
                ...prev
            }
        }
    }, {})
}
