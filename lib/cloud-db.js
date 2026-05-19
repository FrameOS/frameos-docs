import fs from "fs";
import path from "path";

export const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "frameos-cloud.json");

const EMPTY_DB = {
  users: [],
  sessions: [],
  backendAuthCodes: [],
  backendLinks: [],
  backups: [],
};

function cloneEmptyDb() {
  return JSON.parse(JSON.stringify(EMPTY_DB));
}

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(cloneEmptyDb(), null, 2));
  }
}

export function readDb() {
  ensureDb();
  const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  return { ...cloneEmptyDb(), ...parsed };
}

export function writeDb(db) {
  ensureDb();
  const tmpFile = `${DB_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2));
  fs.renameSync(tmpFile, DB_FILE);
}

export function mutateDb(mutator) {
  const db = readDb();
  const result = mutator(db);
  writeDb(db);
  return result;
}

export function publicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image || null,
    providers: user.providers || [],
    createdAt: user.createdAt,
  };
}

export function nowIso() {
  return new Date().toISOString();
}
