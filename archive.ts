import {z} from "zod";
import * as fs from "fs";
import dotenv from "dotenv";
import prompt from "prompt";
import * as path from "path";
import {execSync} from "child_process";

dotenv.config({path: path.join(__dirname, ".env")});

const envSchema = z.object({
  ARCHIVE_SERVER: z.string(),
  ARCHIVE_DIR: z.string()
});

const inputSchema = z.strictObject({
  filename: z.string(),
  cleanup: z.boolean()
});

const env = envSchema.parse(process.env);

type Details = z.infer<typeof inputSchema>

const getDetails = async () => {
  prompt.start();
  prompt.message = 'Enter file details:\n';
  prompt.delimiter = '';
  return prompt.get({
    properties: {
      filename: {
        message: "Enter file name:",
        type: 'string',
        required: true
      },
      cleanup: {
        message: "Clean up?",
        type: "boolean",
        required: false,
        default: false
      }
    }
  });
};

const formatFilename = (filename: string) => filename.replace(" ", "_");
const getTarFilename = (filename: string) => `${filename}.tar.gz`;
const formatCwd = formatFilename(process.cwd()).substring(1);

const scaffoldArchive = (tar: string, cwd: string) => {
  execSync(`ssh ${env.ARCHIVE_SERVER} "cd '${env.ARCHIVE_DIR}' && mkdir -p '${cwd}'"`);
  const dir = path.join(env.ARCHIVE_DIR, formatCwd);
  return {
    dir,
    exists: execSync(`ssh ${env.ARCHIVE_SERVER} "cd '${dir}' && ls"`).toString().split("\n").includes(tar)
  };
};

const createTar = (details: Details) => {
  execSync(`tar -czvf "${getTarFilename(formatFilename(details.filename))}" "${details.filename}"`);
};

const copy = (tar: string, dir: string) => {
  execSync(`scp "${tar}" "${env.ARCHIVE_SERVER}:${dir}"`);
};

const cleanup = (tar: string, filename: string) => {
  const isDir = fs.lstatSync(filename).isDirectory();
  fs.rmSync(filename, {recursive: isDir});
  fs.rmSync(tar);
};

const run = async () => {
  const details = inputSchema.parse(await getDetails());
  const tar = getTarFilename(formatFilename(details.filename));
  const {dir, exists} = scaffoldArchive(tar, formatCwd);
  if (exists) throw new Error("File already exists");
  createTar(details);
  copy(tar, dir);
  if (!details.cleanup) return;
  cleanup(tar, details.filename);
};

run().catch(console.error);