const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { ethers } = require("ethers");
const fs = require("fs");

const myWhitelist = [
  {
    account: "0x8d37826DEBbdf3A8Db035b304631667efE7D1B52",
    amount: 2,
  },
  {
    account: "0xFB6f522d0Ff7c3ACD6C9b0Ee036B70e6f27AC824",
    amount: 1,
  },
  {
    account: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    amount: 4,
  },
];

const hashNode = ({ account, amount }) =>
  Buffer.from(ethers.utils.solidityKeccak256(["address", "uint256"], [account, amount]).slice(2), "hex");
const generateMerkleTree = async (whitelist) => {
  const leaves = whitelist.map(({ account, amount }) =>
    hashNode({
      account,
      amount,
    }),
  );

  const merkleTree = new MerkleTree(leaves, keccak256, {
    sortPairs: true,
  });
  const merkleRoot = merkleTree.getHexRoot();
  const merkleProofs = leaves.map((item) => merkleTree.getHexProof(item));

  console.log("===> ", merkleRoot, "\n\n\n", merkleProofs);

  fs.writeFile(`proof.txt`, JSON.stringify(merkleProofs), (err) => {
    if (err) throw err;
    console.log(`Data was saved to proof.txt`);
  });

  return {
    merkleRoot,
    merkleTree,
    merkleProofs,
  };
};
const main = async () => {
  const { merkleRoot, merkleTree, merkleProofs } = generateMerkleTree(myWhitelist);
  console.log({
    merkleRoot,
    merkleProofs,
  });
};
main();
