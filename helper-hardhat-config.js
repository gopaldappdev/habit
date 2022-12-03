const { ethers } = require("hardhat")

const networkConfig = {
    5: {
        name: "goerli",
        committed: "Walk 2 miles everyday",
        title: "To - Do",
        totalReports: 30,
        interval: 30,
        amount: "0.01",
    },
    80001: {
        name: "mumbai",
        committed: "Quit Smoking",
        title: "Goal",
        totalReports: 10,
        interval: 30,
        amount: "0.01",
    },
    31337: {
        name: "hardhat",
        committed: "Run 100 kms in 30 days",
        title: "In progress",
        totalReports: 10,
        interval: 30,
        amount: "0.01",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
