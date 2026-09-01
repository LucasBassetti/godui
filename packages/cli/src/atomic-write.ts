import { randomUUID } from "node:crypto";
import {
  closeSync,
  fsyncSync,
  openSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";

/** Replace a file without exposing a partially written version to readers. */
export function writeFileAtomically(filePath: string, contents: string): void {
  const directory = dirname(filePath);
  const temporaryPath = join(
    directory,
    `.${basename(filePath)}.${randomUUID()}.tmp`,
  );
  let fileDescriptor: number | undefined;
  let temporaryFileCreated = false;

  let mode = 0o666;
  try {
    mode = statSync(filePath).mode & 0o777;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  try {
    fileDescriptor = openSync(temporaryPath, "wx", mode);
    temporaryFileCreated = true;
    writeFileSync(fileDescriptor, contents, "utf8");
    fsyncSync(fileDescriptor);
    closeSync(fileDescriptor);
    fileDescriptor = undefined;
    renameSync(temporaryPath, filePath);
  } catch (error) {
    if (fileDescriptor !== undefined) {
      try {
        closeSync(fileDescriptor);
      } catch {
        // Preserve the original write or replacement error.
      }
    }
    if (temporaryFileCreated) {
      try {
        unlinkSync(temporaryPath);
      } catch {
        // Preserve the original write or replacement error.
      }
    }
    throw error;
  }
}
