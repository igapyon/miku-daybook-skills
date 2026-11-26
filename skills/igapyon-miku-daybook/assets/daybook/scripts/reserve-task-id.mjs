#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import {
  assertUniqueRecordPaths,
  highestReservedTaskSequence,
  listCanonicalRecordFiles,
  TASK_ID_RESERVATIONS,
  validateIsoDate,
} from "./record-paths.mjs";

const usage = "Usage: node scripts/reserve-task-id.mjs --repo-root DIRECTORY\n"
  + "       (--date YYYY-MM-DD | --preserve task-YYYYMM-NNNNN)";

function writeReservation(directory, id) {
  fs.mkdirSync(directory, { recursive: true });
  if (!fs.lstatSync(directory).isDirectory()) {
    throw new Error(`Task ID reservations must be in a real directory: ${directory}`);
  }

  const target = path.join(directory, id);
  try {
    fs.writeFileSync(target, "", { flag: "wx" });
    return true;
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    if (!fs.lstatSync(target).isFile()) throw new Error(`Invalid task ID reservation: ${target}`);
    return false;
  }
}

function reserveTaskId(repoRoot, date) {
  const month = validateIsoDate(date, "--date").slice(0, 7).replace("-", "");
  let highest = highestReservedTaskSequence(repoRoot, month);
  const records = listCanonicalRecordFiles(repoRoot, ["task"]).filter((record) => record.idMonth === month);
  assertUniqueRecordPaths(records);
  for (const record of records) highest = Math.max(highest, record.sequence);

  const directory = path.join(repoRoot, TASK_ID_RESERVATIONS);
  for (let sequence = highest + 1; sequence <= 99999; sequence++) {
    const id = `task-${month}-${String(sequence).padStart(5, "0")}`;
    if (writeReservation(directory, id)) return id;
  }
  throw new Error(`No task IDs remain for ${month}`);
}

try {
  const { values } = parseArgs({ options: {
    "repo-root": { type: "string" },
    date: { type: "string" },
    preserve: { type: "string" },
    help: { type: "boolean" },
  } });
  if (values.help) {
    console.log(usage);
  } else {
    if (!values["repo-root"] || (values.date === undefined) === (values.preserve === undefined)) {
      throw new Error(usage);
    }
    const repoRoot = fs.realpathSync(values["repo-root"]);
    if (!fs.statSync(repoRoot).isDirectory()) throw new Error("--repo-root must be a directory");
    let id;
    if (values.preserve !== undefined) {
      id = values.preserve;
      const match = /^task-(\d{4})(\d{2})-(\d{5})$/.exec(id);
      if (!match || match[3] === "00000") throw new Error("--preserve must be a canonical task ID");
      validateIsoDate(`${match[1]}-${match[2]}-01`, "--preserve month");
      writeReservation(path.join(repoRoot, TASK_ID_RESERVATIONS), id);
    } else {
      id = reserveTaskId(repoRoot, values.date);
    }
    console.log(JSON.stringify({ id }));
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
