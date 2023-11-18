const { ethers, artifacts } = require("hardhat");
const path = require("path");
const fs = require("fs");
const hre = require("hardhat");

async function main() {
  // Deploy the contracts
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", await deployer.getAddress());

  


  const userdep = await deployContract("UserInfo");
  const docdep = await deployContract("DocStorage");

  // Save frontend files
  saveFrontendFiles(userdep, docdep);

  console.log(`User Contract deployed to ${userdep.target}`);
  console.log(`Doc Contract deployed to ${docdep.target}`);
}

async function deployContract(contractName) {
  
  //const factory = await ethers.getContractFactory(contractName);
  const contract  = await ethers.deployContract(contractName);
  //const contract = await factory.deploy();
  await contract.waitForDeployment();
  return contract;
}

function saveFrontendFiles(userdep, docdep) {
  const contractsDir = path.join(__dirname, "/../client/src/contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ userdep: userdep.target, docdep: docdep.target }, null, 2)
  );

  const UserArtifact = artifacts.readArtifactSync("UserInfo");
  const DocArtifact = artifacts.readArtifactSync("DocStorage");

  fs.writeFileSync(
    contractsDir + "/UserDep.json",
    JSON.stringify(UserArtifact, null, 2)
  );

  fs.writeFileSync(
    contractsDir + "/DocDep.json",
    JSON.stringify(DocArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
