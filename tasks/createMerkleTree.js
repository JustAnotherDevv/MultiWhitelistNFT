const { ethers } = require("ethers");
const { MerkleTree } = require("merkletreejs");
const fs = require("fs");
const bytes32 = require("bytes32");
const keccak256 = require("keccak256");

// Your whitelist from database
const whitelist = [
  "0xBdA02107D3A014B6F495bFb3Ba68e974d4529634",
  "0x915F68B52C3c37eA55BF1dA4D1473a450c0DE802",
  "0xBA2dB5F2F5153EE3Fd55faae3a16653F26eA26f4",
  "0x725dfec3d1226851a8538c10f6ebe2fe7512f224",
  "0x7addc0f7622ab600e03a21197e6b8ca6068192d9",
  "0xce8acd8a2b753c32a9de2b559846adf1cd478ebb",
  "0x64c4ec2c830c8203c48f369486701152997bd760",
  "0x6e7F1a7d1Bac9c7784c7C7Cdb098A727F62E95c7",
  "0xb8c1F8586625c34bc350546AC44603Cd7916350d",
  "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
];

const amounts = [
  "2, 2, 2, 2, 1, 1, 1, 1, 1",
  "2, 2, 2, 2, 1, 1, 1, 1, 1",
  "2, 2, 2, 2, 1, 1, 1, 1, 1",
  "2, 2, 2, 2, 1, 1, 1, 1, 1",
  "2, 2, 2, 2, 1, 1, 1, 1, 1",
  "2, 2, 2, 2, 1, 1, 1, 1, 1",
  "2, 2, 2, 2, 1, 1, 1, 1, 1",
  "2, 2, 2, 2, 1, 1, 1, 1, 1",
  "2, 2, 2, 2, 1, 1, 1, 1, 1",
  "2, 2, 2, 2, 1, 1, 1, 1, 1",
];

const myWhitelist = [
  {
    account: "0x8d37826DEBbdf3A8Db035b304631667efE7D1B52",
    amount: 2,
  },
  {
    account: "0xFB6f522d0Ff7c3ACD6C9b0Ee036B70e6f27AC824",
    amount: 1,
  },
  // {
  //   account: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
  //   amount: 4,
  // },
];

// Parse params passed to server and get user wallet address
const userWalletAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";

const makeMerkleTree = () => {
  const { keccak256, solidityKeccak256 } = ethers.utils;
  let leaves = whitelist.map((addr, i) => keccak256(addr, amounts[i]));
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  // Save this value to smartcontract
  //   const merkleRootHash = merkleTree.getHexRoot();
  //   console.log(merkleTree.getHexRoot());
  // 0x09485889b804a49c9e383c7966a2c480ab28a13a8345c4ebe0886a7478c0b73d
  return merkleTree;
};

const generateMerkleTree = async (whitelist) => {
  // const { keccak256, solidityKeccak256 } = ethers.utils;

  const hashNode = ({ account, amount }) =>
    Buffer.from(hre.ethers.utils.solidityKeccak256(["address", "uint256"], [account, amount]).slice(2), "hex");
  console.log("a");
  const leaves = whitelist.map(({ account, amount }) =>
    hashNode({
      account,
      amount,
    }),
  );

  // console.log("hash node ");

  const merkleTree = new MerkleTree(leaves, keccak256, {
    sortPairs: true,
  });
  const merkleRoot = merkleTree.getHexRoot();
  const merkleProofs = leaves.map((item) => merkleTree.getHexProof(item));

  console.log("b");

  return {
    merkleRoot,
    merkleTree,
    merkleProofs,
  };
};

const rootHash = () => {
  //   return makeMerkleTree().getRoot().toString("hex");
  return makeMerkleTree().getHexRoot();
};

const getProofForAddress = (filePath) => {
  const { keccak256 } = ethers.utils;
  // const proof = makeMerkleTree().getHexProof(keccak256(userWalletAddress));
  console.log("hash of addr ", keccak256(bytes32({ input: "testtesttest" })));
  console.log("hash of addr ", keccak256(bytes32({ input: `${amounts[9]}${userWalletAddress}`, ignoreLength: true })));
  console.log("hash of addr ", keccak256(userWalletAddress, amounts[9]));
  console.log("hash of addr ", keccak256(userWalletAddress));
  const proof = makeMerkleTree().getHexProof(keccak256(userWalletAddress * amounts[9]));
  fs.writeFile(filePath, JSON.stringify(proof), (err) => {
    if (err) throw err;
    console.log(`Data was saved to ${filePath}`);
  });
  return proof;
};

// console.log(makeMerkleTree().toString());
// console.log(rootHash());
// console.log(getProofForAddress("proof.txt"));
// console.log(makeMerkleTree());

const main = async () => {
  const { merkleRoot, merkleTree, merkleProofs } = generateMerkleTree(myWhitelist);
  console.log({
    merkleRoot,
    merkleProofs,
  });
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
