import * as aes from "aes-js";

const key = aes.utils.utf8.toBytes(process.env.AES_KEY);

export const encryptData = async (dataToEncrypted: string) => {
    const bytesInfo = aes.utils.utf8.toBytes(dataToEncrypted);
    const aesCtr = new aes.ModeOfOperation.ctr(key);
    const encryptedBytes = aesCtr.encrypt(bytesInfo);
    const encryptedHex = aes.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
};

export const decryptData = async (encryptedHex: string) => {
    const encryptedBytes = aes.utils.hex.toBytes(encryptedHex);
    const aesCtr = new aes.ModeOfOperation.ctr(key);
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return aes.utils.utf8.fromBytes(decryptedBytes);
};