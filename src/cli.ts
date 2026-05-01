import { addDecision } from "./commands/addDecision.js";
import { updateDecision } from "./commands/updateDecision.js";
import { getDecision } from "./commands/getDecision.js";

const [, , cmd, ...args] = process.argv;

async function main() {
  switch (cmd) {
    case "add:decision":
      await addDecision(args);
      break;

    case "update:decision":
      await updateDecision(args);
      break;

    case "get:decision":
      await getDecision(args);
      break;

    default:
      console.log("Commands:");
      console.log("add:decision <id> <title> <choice> <reason>");
      console.log("update:decision <id> <choice> <reason>");
      console.log("get:decision <id>");
  }
}

main();
