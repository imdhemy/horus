export const createReadFile = (createReader: () => FileReader) =>
  async function readFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = createReader();

      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);

      reader.readAsArrayBuffer(file);
    });
  };

export const readFile = createReadFile(() => new FileReader());
