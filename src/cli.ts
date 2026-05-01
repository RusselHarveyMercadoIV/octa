import { addDecision } from "./commands/addDecision.js";
import { updateDecision } from "./commands/updateDecision.js";
import { getDecision } from "./commands/getDecision.js";

import { addConstraint } from "./commands/addConstraint.js";
import { validate } from "./commands/validate.js";
import { init } from "./commands/init/init.js";
import { ciValidate } from "./commands/ciValidate.js";
import { buildContext } from "./commands/context/buildContext.js";

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
Octa CLI

DECISIONS
  decision:add <id> <title> <choice> <reason>
  decision:update <id> <choice> <reason>
  decision:get <id>

CONSTRAINTS
  constraint:add <id> <rule> <pattern>

SYSTEM
  validate
      `);
  }
}

main();
