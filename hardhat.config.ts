require("dotenv").config();

import "@nomiclabs/hardhat-waffle"
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import "hardhat-gas-reporter";
import 'hardhat-deploy'
import 'solidity-coverage';
import 'hardhat-tracer';
import 'hardhat-contract-sizer';
import '@nomiclabs/hardhat-etherscan';

require('hardhat-spdx-license-identifier');
import { task, HardhatUserConfig } from "hardhat/config";
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

import fs from "fs";
import "hardhat-preprocessor";
function getRemappings() {
  return fs
    .readFileSync("remappings.txt", "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.trim().split("="));
}



// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.14",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
      tags: ['local'],
      gas: 8000000,
      blockGasLimit: 8000000,
      allowUnlimitedContractSize: true, // only for testing
      timeout: 1800000
    },
    bscTest: {
      chainId: 97,
      url: "https://data-seed-prebsc-2-s3.binance.org:8545",
      accounts:
        process.env.TEST_KEY !== undefined ? [process.env.TEST_KEY] : [],
    },
    bsc: {
      chainId: 56,
      url: "https://bsc-dataseed.binance.org/",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    geori: {
      chainId: 5,
      url: "https://eth-goerli.alchemyapi.io/v2/2Ep8pxxRx53-mJhPBTcGdV40FYDMePem/",
      accounts:
        process.env.TEST_KEY !== undefined ? [process.env.TEST_KEY] : [],
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },  
  paths: {
    sources: "./src", // Use ./src rather than ./contracts as Hardhat expects
    cache: "./cache_hardhat", // Use a different cache for Hardhat than Foundry
  },
  // This fully resolves paths for imports in the ./lib directory for Hardhat
  preprocess: {
    eachLine: (hre) => ({
      transform: (line: string) => {
        if (line.match(/^\s*import /i)) {
          getRemappings().forEach(([find, replace]) => {
            if (line.match(find)) {
              line = line.replace(find, replace);
            }
          });
        }
        return line;
      },
    }),
  },
} as HardhatUserConfig;
