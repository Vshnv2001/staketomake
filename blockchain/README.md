# Deploying Smart Contract

```shell
npx hardhat clean
npx hardhat compile
npx hardhat run deployments/deploy.js --network sepolia 
```

env format
```
API_URL='https://eth-sepolia.g.alchemy.com/v2/<yourAPIKEY>'
PRIVATE_KEY='<yourPrivateKey>'
```

Refer to the [link](https://docs.alchemy.com/docs/how-to-deploy-a-smart-contract-to-the-sepolia-testnet) for support on how to deploy a smart contract to the sepolia testnet using Alchemy.
