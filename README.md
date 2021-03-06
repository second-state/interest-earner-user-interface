# Interest Earner User Interface (UI)

# What does it do?

Interacts with the [interest earner smart contract](https://github.com/second-state/interest-earner-smart-contract), which allows users to stake and unstake tokens.

# How do end users interact with the interest earner UI

Users simply load the page, (the user's account details are automatically pre-filled in the address input box)

## Staking tokens

The user then simply types in the amount of tokens they would like to stake

The user then clicks the "Stake Tokens" button  

## Unstaking tokens

The user clicks the "Unstake Tokens" button

# Where is the interest earner smart contract

The [interest earner smart contract](https://github.com/second-state/interest-earner-smart-contract) is deployed on the Ethereum mainnet and then this UI source code is updated with the interest earner contract's ABI, deployment address and so forth. This interest earner UI instantiates the staking contract in order to interact and transfer tokens to end users and so forth.

# How to deploy this UI

Clone this repository

```
git clone git@github.com:second-state/interest-earner-user-interface.git
```

## ABI and address of interest earner contract

Paste the ABI into the `interest_earner_abi.json` file and the address of the interest earner contract's successfully deployed contract instance into the `interest_earner_contract_address.json` file.

## Contract address of ERC20 contract (NOT staking contract)

Paste the ABI into the `erc20_abi.json` file and the address of the ERC20's successfully deployed contract instance into the `erc20_contract_address.json` file.

## Installing

Then simply type

```
npm install
```

## Running

### Run on local

To run on local system, type

```
node server.js
```

The site will then be hosted at `http://localhost/`

### GitHub pages

To publish/deploy on GitHub pages, simply type

```
npm run deploy
```

The site will then be hosted to [https://second-state.github.io/interest-earner-user-interface/html/index.html](https://second-state.github.io/interest-earner-user-interface/html/index.html)

## Usage

Just browse to the URL where the UI is hosted and ensure that your MetaMask wallet is configured to run on the same network (where the contracts are deployed). Default is Ethereum mainnet.

<img width="872" alt="Screen Shot 2022-03-12 at 2 08 53 pm" src="https://user-images.githubusercontent.com/9831342/158003150-4440082e-9152-43a6-b226-9b762a88638f.png">

