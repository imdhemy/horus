export type UploadedFile = {
  buffer: ArrayBuffer;
  file: File;
};

export const createReadFile = (createReader: () => FileReader) =>
  async function readFile(file: File): Promise<UploadedFile> {
    return new Promise((resolve, reject) => {
      const reader = createReader();

      reader.onload = () =>
        resolve({ buffer: reader.result as ArrayBuffer, file });
      reader.onerror = () => reject(reader.error);

      reader.readAsArrayBuffer(file);
    });
  };

export const readFile = createReadFile(() => new FileReader());
