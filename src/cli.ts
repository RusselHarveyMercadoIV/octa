import { addDecision } from "./commands/addDecision.js";
import { updateDecision } from "./commands/updateDecision.js";
import { getDecision } from "./commands/getDecision.js";

import { addConstraint } from "./commands/addConstraint.js";
import { validate } from "./commands/validate.js";
import { init } from "./commands/init/init.js";
import { ciValidate } from "./commands/ciValidate.js";
import { buildContext } from "./commands/context/buildContext.js";
import { doctor } from "./commands/doctor.js";
import { watch } from "./commands/watch.js";
import { install } from "./commands/install.js";
import { sync } from "./commands/sync.js";
import { query } from "./commands/query.js";
import { approve, reject, deprecate } from "./commands/lifecycle.js";

const [, , cmd, ...args] = process.argv;

async function main() {
  switch (cmd) {
    // --------------------
    // DECISIONS
    // --------------------
    case "decision:add":
      await addDecision(args);
      break;

    case "decision:update":
      await updateDecision(args);
      break;

    case "decision:get":
      await getDecision(args);
      break;

    case "approve":
      await approve(args);
      break;

    case "reject":
      await reject(args);
      break;

    case "deprecate":
      await deprecate(args);
      break;

    // --------------------
    // CONSTRAINTS
    // --------------------
    case "constraint:add":
      await addConstraint(args);
      break;

    // --------------------
    // SYSTEM
    // --------------------

    case "ci":
      await ciValidate();
      break;

    case "validate":
      await validate();
      break;

    case "doctor":
      await doctor();
      break;

    case "watch":
      await watch();
      break;

    case "install":
      await install();
      break;

    case "sync":
      await sync();
      break;

    case "query":
      await query(args);
      break;

    // --------------------
    // INITIALIZE
    // --------------------
    case "init":
      await init();
      break;

    // --------------------
    // CONTEXT
    // --------------------
    case "context":
      await buildContext(args.join(" "));
      break;

    // --------------------
    // HELP
    // --------------------
    default:
      console.log(`
Usage: octa <command> [args]

DECISIONS
  decision:add <id> <title> <choice> <reason>
  decision:update <id> <choice> <reason>
  decision:get <id>

CONSTRAINTS
  constraint:add <id> <rule> <pattern> [recommendation]

SYSTEM
  doctor
  validate
  watch
  install
  sync
  query

GOVERNANCE
  approve <id>
  reject <id> [reason]
  deprecate <id> [--replaced-by <new-id>]
      `);
  }
}


main();
