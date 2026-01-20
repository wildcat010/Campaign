import web3 from "web3";

let cachedAccounts = null;

export async function getAccounts() {
  if (cachedAccounts) return cachedAccounts;
  cachedAccounts = await web3.eth.getAccounts();
  return cachedAccounts;
}
