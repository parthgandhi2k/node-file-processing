import path from "path";

export const getFileType = (filePath: string) => path.extname(filePath).slice(1);
