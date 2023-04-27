import * as bcrypt from 'bcrypt';
import { createCipheriv, createDecipheriv } from 'crypto';

const ROUNDS = 10;
const algorithm = 'aes-256-cbc'; //Using AES encryption
/*DO NOT REMOVE this part, for referance */ /*
see in src/utils/encryption.utils.secret.ts
//*/

//This is just euristics, or dirty hack :D
const isEncryptedValue = (text, divider) => {
	return text.length % divider === 0 ? true : false;
};

export const hashMake = async (str: string): Promise<string> => {
	if (str === undefined || str.length === 0) throw new Error('No string provided for hashing');
	const hash = await bcrypt.hash(str, ROUNDS);
	return hash;
};

export const hashCompare = async (str: string, hash: string): Promise<boolean> => {
	return await bcrypt.compare(str, hash);
};

export const encrypt = (text: string): string => {
	const { iv_hex, key_hex } = global.encKey;
	if (text === undefined || text === null) return null;

	const iv = Buffer.from(iv_hex, 'hex');
	const key = Buffer.from(key_hex, 'hex');
	const cipher = createCipheriv(algorithm, Buffer.from(key), iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return encrypted.toString('hex');
};

export const decrypt = (text: string): string => {
	const { iv_hex, key_hex } = global.encKey;
	if (text === undefined || text === null) return null;

	const iv = Buffer.from(iv_hex, 'hex');
	const key = Buffer.from(key_hex, 'hex');
	const decipher = createDecipheriv(algorithm, Buffer.from(key), iv);

	const encryptedText = Buffer.from(text, 'hex');
	const decrypted = decipher.update(encryptedText);

	return Buffer.concat([decrypted, decipher.final()]).toString();
};

export const encryptedField = {
	transformer: {
		to(n: string) {
			return encrypt(n);
		},
		from(n: string) {
			return isEncryptedValue(n, 32) ? decrypt(n) : n;
		}
	}
};

export const encryptedFieldHistorycal = {
	transformer: {
		to(n: string) {
			return n;
		},
		from(n: string) {
			return isEncryptedValue(n, 32) ? decrypt(n) : n;
		}
	}
};
