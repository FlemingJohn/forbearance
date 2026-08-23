import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import solc from "solc";

const CONTRACT_DIR = join("contracts", "src");
const OUTPUT_DIR = join("contracts", "out");

const sources = [
  "IBlockProver.sol",
  "EvidenceDecoder.sol",
  "ForbearanceRegistry.sol",
];

interface CompilerMessage {
  severity: string;
  formattedMessage: string;
}

function readSources() {
  const entries: Record<string, { content: string }> = {};

  for (const name of sources) {
    entries[name] = {
      content: readFileSync(join(CONTRACT_DIR, name), "utf8"),
    };
  }

  return entries;
}

function findImport(path: string) {
  try {
    return { contents: readFileSync(join(CONTRACT_DIR, path), "utf8") };
  } catch {
    return { error: `Cannot find ${path}` };
  }
}

function run() {
  const input = {
    language: "Solidity",
    sources: readSources(),
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
      outputSelection: {
        "*": { "*": ["abi", "evm.bytecode.object"] },
      },
    },
  };

  const output = JSON.parse(
    solc.compile(JSON.stringify(input), { import: findImport }),
  );

  const messages = (output.errors ?? []) as CompilerMessage[];
  const failures = messages.filter((message) => message.severity === "error");

  for (const message of messages) {
    console.log(message.formattedMessage.trim());
  }

  if (failures.length > 0) {
    console.error(`\nCompilation failed with ${failures.length} errors`);
    process.exitCode = 1;
    return;
  }

  const contract =
    output.contracts["ForbearanceRegistry.sol"].ForbearanceRegistry;

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(
    join(OUTPUT_DIR, "ForbearanceRegistry.json"),
    `${JSON.stringify(
      { abi: contract.abi, bytecode: `0x${contract.evm.bytecode.object}` },
      null,
      2,
    )}\n`,
  );

  console.log("Compiled ForbearanceRegistry");
  console.log("  abi entries:", contract.abi.length);
  console.log(
    "  bytecode size:",
    contract.evm.bytecode.object.length / 2,
    "bytes",
  );
}

run();
