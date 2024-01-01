import fs from 'fs/promises';
import path from 'path';

export const fileType = (file: string) =>
  `.${path.basename(file).split('.').pop()}`;
export const fileName = (file: string) =>
  path.basename(file).split('.').slice(0, -1).join('.');

export const listFiles = (
  src: string,
  validFileTypes: string[],
): Promise<string[]> =>
  fs.readdir(src).then((files) =>
    files
      .reduce(async (total: Promise<string[]>, file) => {
        const fullPath = path.join(src, file);
        await fs
          .lstat(path.join(src, file))
          .then((stats) =>
            total.then(async (totalValue) =>
              stats.isDirectory()
                ? totalValue.push(
                    ...(await listFiles(fullPath, validFileTypes)),
                  )
                : totalValue.push(fullPath),
            ),
          );
        return total;
      }, (async () => [])())
      .then((flatFiles) =>
        flatFiles.filter((file: string) =>
          validFileTypes.includes(fileType(file)),
        ),
      ),
  );

export const pathToPagePath = (src: string) => {
  const name = fileName(src);
  let dirName = path.dirname(src);
  if (dirName === '.') dirName = '';
  return `/${name === 'index' ? dirName : path.join(dirName, name)}`;
};
