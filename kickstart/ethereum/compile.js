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

fs.ensureDirSync(buildPath);

// Optional debug
if (compiled.errors) {
  compiled.errors.forEach((err) => console.error(err.formattedMessage));
}

// Extract contracts
const { CampaignFactory, Campaign } = compiled.contracts["Campaign.sol"];

// Safety checks
if (!CampaignFactory || !Campaign) {
  throw new Error("Contracts not found. Check Solidity version or file name.");
}

// Export both contracts
module.exports = {
  CampaignFactory: {
    abi: CampaignFactory.abi,
    bytecode: CampaignFactory.evm.bytecode.object,
  },
  Campaign: {
    abi: Campaign.abi,
    bytecode: Campaign.evm.bytecode.object,
  },
};
