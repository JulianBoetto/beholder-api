export default class Beautifier {
    private beautificationMap: Record<string, Record<string, any>>;
    private floatKeysHashMap: Record<string, boolean>;

    beautifyArrayValues(data: any[], parentKey?: string | number) {
        const beautifedArray: any[] = [];
        for (const [key, val] of data.entries()) {
            const type = typeof val;
            if (Array.isArray(val)) {
                beautifedArray.push(this.beautifyArrayValues(val, parentKey || key));
            } else if (type === 'string' || type === 'number' || type === 'boolean') {
                beautifedArray.push(this.beautifyValueWithKey(parentKey || key, val));
            } else {
                beautifedArray.push(this.beautifyObjectValues(val));
            }
        }
        return beautifedArray;
    }

    beautifyObjectValues(data: any | any[]) {
        if (Array.isArray(data)) {
            return this.beautifyArrayValues(data);
        }
        const beautifedObject = {};
        for (const [key, val] of Object.entries(data)) {
            const type = typeof val;
            if (Array.isArray(val)) {
                beautifedObject[key] = this.beautifyArrayValues(val, key);
            } else if (key === 'e' && type === 'string') {
                beautifedObject['eventType'] = this.beautifyValueWithKey(key, val);
            } else if (type === 'object') {
                beautifedObject[key] = this.beautifyObjectValues(val);
            } else {
                beautifedObject[key] = this.beautifyValueWithKey(key, val);
            }
        }
        return beautifedObject;
    }

    beautifyValueWithKey(key: string | number, val: unknown) {
        if (typeof val === 'string' && this.floatKeysHashMap[key] && val !== '') {
            const result = parseFloat(val);
            if (isNaN(result)) {
                return val;
            }
            return result;
        }
        return val;
    }

    beautify(data: any, key?: string | number) {
        if (typeof key !== 'string' && typeof key !== 'number') {
            console.warn(
                `beautify(object, ${key}) is not valid key - beautification failed `,
                data,
                key
            );
            return data;
        }
        const knownBeautification = this.beautificationMap[key];
        if (!knownBeautification) {
            // console.log(`beautify unknown key(..., "${key}")`);
            if (Array.isArray(data)) {
                return this.beautifyArrayValues(data);
            }
            if (typeof data === 'object' && data !== null) {
                return this.beautifyObjectValues(data);
            }
            return this.beautifyValueWithKey(key, data);
        }
    }
}