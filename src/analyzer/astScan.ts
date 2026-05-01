import fs from "fs";
import ts from "typescript";

export function scanFile(filePath: string) {
  const code = fs.readFileSync(filePath, "utf-8");

  const sourceFile = ts.createSourceFile(
    filePath,
    code,
    ts.ScriptTarget.Latest,
    true,
  );

  const imports: string[] = [];

  function visit(node: ts.Node) {
    // import x from 'y'
    if (ts.isImportDeclaration(node)) {
      const module = node.moduleSpecifier.getText().replace(/['"]/g, "");
      imports.push(module);
    }

    // const x = require('y')
    if (ts.isCallExpression(node) && node.expression.getText() === "require") {
      const arg = node.arguments[0];
      if (arg && ts.isStringLiteral(arg)) {
        imports.push(arg.text);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return {
    file: filePath,
    imports,
  };
}
