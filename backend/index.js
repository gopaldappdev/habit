//cron setup

//push protocol sdk - for sending notifications

//backend would interact with smart contract

//we would extract out all the active habits from the smart contract
//using ethers.js- rpc endpoints using infura

//sending notifications to those contracts using logical timings of their reportIntervals

// Import the required packages
const PushAPI = require("@pushprotocol/restapi");
const ethers = require('ethers');
const path = require('path');

const envPath = path.join(__dirname + '/../.env');

require('dotenv').config({
  path: envPath,
});

// Define the parameters we would need in order to initialize the SDK
const  PK = process.env.CHANNEL_PK; // the private key of the channel
console.log(PK);
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);

async function getNotifications() {
    const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 1, // broadcast
        identityType: 2, // direct payload
        notification: {
          title: `env included`,
          body: `Working fine.`
        },
        payload: {
          title: `payload env included`,
          body: `working`,
          cta: '',
          img: ''
        },
        channel: `eip155:5:0xedAAfb3B4a2B5D340e3bCaB4a1337a8f2FB70Cc5`, // your channel address
        recipients: "eip155:5:0xedAAfb3B4a2B5D340e3bCaB4a1337a8f2FB70Cc5",
        env: 'staging'
      });
}

getNotifications();
