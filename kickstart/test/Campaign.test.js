// test/Campaign.test.js
const Web3 = require("web3").default;; // Correct import
const ganache = require("ganache");
const assert = require("assert");

// Use Ganache provider with higher gas limit
const web3 = new Web3(ganache.provider({ gasLimit: 10000000 }));

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
  // Get test accounts from Ganache
  accounts = await web3.eth.getAccounts();

  // Deploy Factory contract
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: 3000000 });

  // Deploy a Campaign directly to avoid code size issues
  campaign = await new web3.eth.Contract(compiledCampaign.abi)
    .deploy({ data: compiledCampaign.bytecode, arguments: [100, accounts[0]] }) // minimumContribution, manager
    .send({ from: accounts[0], gas: 3000000 });

  campaignAddress = campaign.options.address;
});

describe("Campaign Contract", () => {
  it("deploys a factory", () => {
    assert.ok(factory.options.address);
  });

  it("deploys a campaign", () => {
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("allows people to contribute and marks them as approvers", async () => {
    await campaign.methods
      .contribute()
      .send({ value: web3.utils.toWei("0.2", "ether"), from: accounts[1] });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert.equal(isContributor, true);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ value: web3.utils.toWei("0.05", "ether"), from: accounts[1] });
      assert(false, "Contribution should have failed"); // Should not reach here
    } catch (err) {
      assert(err);
    }
  });

  it("creates a request", async () => {

        console.log("1");
       await campaign.methods
      .createRequest(
       toBytes32("Buy materials"),
        web3.utils.toWei("1", "ether"),
        accounts[0]
      )
      .send({ from: accounts[0], gas: 3000000 });

        const result = await campaign.methods.getRequest(0).call();

        const description = bytes32ToString(result.description);

        const request = {
          description: description,
          value: result.value,
          recipient: result.recipient,
          complete: result.complete,
          approvalCount: result.approvalCount,
        };

        assert.equal(request.description, "Buy materials");
        assert.equal(request.value, web3.utils.toWei("1", "ether"));
        assert.equal(request.recipient, accounts[0]);
        assert.equal(request.complete, false);
        assert.equal(request.approvalCount, "0");
   
});

function toBytes32(text) {
  return web3.utils.padRight(web3.utils.utf8ToHex(text), 64);
}

function bytes32ToString(bytes32Str) {
  return web3.utils.hexToUtf8(bytes32Str).replace(/\0+$/, "");
}

});
