const { ethers } = require("hardhat")

const networkConfig = {
    5: {
        name: "goerli",
        committed: "Walk 2 miles everyday",
        title: "To - Do",
        totalReports: 30,
        interval: 30,
        amount: "0.01",
        validator: "0x097b70194015BD7e69d161deB580BB97eA923136",
    },
    80001: {
        name: "mumbai",
        committed: "Quit Smoking",
        title: "Goal",
        totalReports: 10,
        interval: 30,
        amount: "0.01",
        validator: "0x097b70194015BD7e69d161deB580BB97eA923136",
    },
    31337: {
        name: "hardhat",
        committed: "Run 100 kms in 30 days",
        title: "In progress",
        totalReports: 10,
        interval: 30,
        amount: "0.01",
        validator: "0x097b70194015BD7e69d161deB580BB97eA923136",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
