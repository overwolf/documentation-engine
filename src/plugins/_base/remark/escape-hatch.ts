import fs from 'fs-extra';
import path from 'path';

export type EscapeHatchEntry = {
  key: string;
  content: string;
};

export type EscapeHatch = (...entries: EscapeHatchEntry[]) => void;

export default async function CommitEscapeHatches(
  basePath: string,
  entries: EscapeHatchEntry[],
) {
  return Promise.all(
    entries.map((value) =>
      fs.outputFile(path.join(basePath, value.key), value.content, {
        encoding: 'utf-8',
      }),
    ),
  );
}
