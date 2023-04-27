import { keysStringsToKeys, deepEqual, TObject, clearKeysFromObject } from './object.utils';

export const uniqueObjectPriorityQueue = (prioretizeBy: string, liveMilliseconds: number) => {
    let storage = []
    const metaFields = ['_han_TTL', '_han_processed']

    const sorter = (a, b) => {
        if (a[prioretizeBy] < b[prioretizeBy]) return -1
        if (a[prioretizeBy] > b[prioretizeBy]) return 1
        return 0
    }

    const filterOlds = (item) => {
        return item._han_TTL > Date.now()
    }

    const clearRedundants = () => {
        storage = storage.filter(filterOlds)
    }

    const clearAll = () => {
        storage = []
    }

    const put = (obj: TObject) => {
        const _obj = { ...obj, _han_TTL: Date.now() + liveMilliseconds, _han_processed: false }

        if (!storage.find((item) => deepEqual(item, _obj, metaFields))) {
            storage.push(_obj)
            storage.sort(sorter)
            clearRedundants()
        }
    }

    const get = () => {
        for (let i = 0; i < storage.length; i++) {
            if (!storage[i]._han_processed) {
                storage[i]._han_processed = true
                return storage[i]
            }
        }
    }

    const getAll = () => {
        const result = []
        for (let i = 0; i < storage.length; i++) {
            if (!storage[i]._han_processed) {
                storage[i]._han_processed = true
                result.push(storage[i])
            }
        }

        return result.map((item) => {
            return clearKeysFromObject(item, metaFields)
        })
    }

    const showContent = (showFields: Array<string>) => {
        const truncated = storage.map((item) => {
            const _item = {}
            showFields.map((field) => {
                _item[field] = keysStringsToKeys(item, field)
            })
            return _item
        })

        console.table(truncated)
    }

    return {
        put,
        get,
        getAll,
        clearAll,
        clearRedundants,
        showContent
    }
}