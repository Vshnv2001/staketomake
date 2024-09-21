import Web3 from 'web3';
import { abi } from './StakeContractABI';

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_INFURA_URL || "127.0.0.1:8545"));

export async function stakeTokens(goalId:string, goalType: string, goalDesc: string, goalStart: Date, goalEnd: Date, stakingAmount: number) {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];


    const contractAddress = "0x21EEFE85b71E0CEf9183a6ab858A9bebA769Ad52";
    const contractABI = abi;
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const stakingAmountWei = web3.utils.toWei(stakingAmount !== 0 ? stakingAmount : 0.0001, 'ether');
    const goalStartUnix = Math.floor(new Date(goalStart).getTime() / 1000);
    const goalEndUnix = Math.floor(new Date(goalEnd).getTime() / 1000);

    const transaction = {
        from: account,
        to: contractAddress,
        value: stakingAmountWei,
        data: contract.methods.stake(goalId, goalType, goalDesc, goalStartUnix, goalEndUnix).encodeABI(),
    };

    try {
        const result = await web3.eth.sendTransaction(transaction);
        return result;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}