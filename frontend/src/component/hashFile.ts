import CryptoJS from 'crypto-js';

export const hashFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const wordArray = CryptoJS.lib.WordArray.create(reader.result as ArrayBuffer);
        const hash = CryptoJS.SHA256(wordArray).toString();
        resolve(hash);
      };
      reader.readAsArrayBuffer(file);
    });
};