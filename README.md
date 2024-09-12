# ETH Olympic Ticket Purchase DApp

## Overview
The **ETH Olympic Ticket Purchase DApp** allows users to purchase and withdraw event tickets using Ethereum. This decentralized application (DApp) interacts with a Solidity smart contract deployed on the Ethereum blockchain, letting users connect their MetaMask wallet, buy tickets, and track their ETH spending and ticket ownership.

## Features
- Connect your MetaMask wallet to the DApp.
- Purchase event tickets using ETH.
- View your total ETH spent on tickets.
- Track how many tickets you own.
- Withdraw tickets if needed.

## Installation

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MetaMask](https://metamask.io/) browser extension
- [Hardhat](https://hardhat.org/) for smart contract development

### Execution
Install dependencies: - npm install
Start a local Ethereum blockchain network: - npx hardhat node
Deploy the smart contract on the local network: - npx hardhat run --network localhost scripts/deploy.js
Run the frontend: - npm run dev

## Usage

After setting up the project and deploying the contract, follow these steps to interact with the DApp:

1. Open the DApp in your browser (usually at `http://localhost:3000` after running the frontend).
2. Connect your MetaMask wallet using the "Connect Your Metamask Wallet" button.
3. Enter the number of tickets you want to purchase and click the "Purchase Tickets" button.
4. View your ETH spent and the number of tickets owned in the balance section.
5. If needed, withdraw tickets by entering the number of tickets and clicking "Withdraw Tickets."


## Authors

Contributors names and contact info

Rahul Tiwary  
[rahult7526@gmail.com]

## License

This project is licensed under the MIT License. See the LICENSE file for details.
