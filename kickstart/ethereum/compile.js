const path = require("path");
const fs = require("fs");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");
// Delete build folder if it exists
if (fs.existsSync(buildPath)) {
  fs.rmSync(buildPath, { recursive: true, force: true });
}
// Create build folder
fs.mkdirSync(buildPath, { recursive: true });

// Resolve path to Solidity file
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

// Solidity compiler input
const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

// Compile
const output = solc.compile(JSON.stringify(input));
const compiled = JSON.parse(output);

// Optional debug
if (compiled.errors) {
  compiled.errors.forEach((err) => console.error(err.formattedMessage));
}

// Extract contracts
const contracts = compiled.contracts["Campaign.sol"];
if (!contracts) throw new Error("No contracts found in compiled output");

// Write each contract to a separate JSON file in the build folder
for (let contractName in contracts) {
  const contract = contracts[contractName];
  const filePath = path.resolve(buildPath, `${contractName}.json`);
  fs.writeFileSync(
    filePath,
    JSON.stringify(
      {
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object,
      },
      null,
      2 // pretty print with 2 spaces
    )
  );
  console.log(`Saved ${contractName}.json in build folder`);
}

console.log("Compilation successful!");
