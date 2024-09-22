import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { abi } from './StakeContractABI'

// Ensure web3 is only initialized on the client side
let web3: Web3 | null = null;
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
}

interface StakeTokensParams {
    goalId: string;
    goalType: string;
    goalDescription: string;
    goalStart: Date | string;
    goalEnd: Date | string;
}

export async function stakeTokens({
    goalId,
    goalType,
    goalDescription,
    goalStart,
    goalEnd
}: StakeTokensParams): Promise<any> {
    if (!web3) {
        throw new Error("Web3 is not initialized. Make sure you're in a browser environment with MetaMask installed.");
    }

    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        const contractAddress = "0x21EEFE85b71E0CEf9183a6ab858A9bebA769Ad52"; // Ensure this is correct
        const contract = new web3.eth.Contract(abi as AbiItem[], contractAddress);

        // Hard-coded staking amount (0.001 ETH)
        const stakingAmountWei = web3.utils.toWei('0.001', 'ether');

        // Convert dates to Unix timestamps
        const goalStartUnix = Math.floor(new Date(goalStart).getTime() / 1000);
        const goalEndUnix = Math.floor(new Date(goalEnd).getTime() / 1000);

        // Ensure all parameters are defined
        const params = [
            goalId || "defaultGoalId",
            goalType || "defaultGoalType",
            goalDescription || "defaultDescription",
            goalStartUnix,
            goalEndUnix
        ];

        console.log("Staking parameters:", params);

        const result = await contract.methods.stake(...params).send({
            from: account,
            value: stakingAmountWei
        });

        console.log("Staking transaction result:", result);
        return result;
    } catch (error) {
        console.error("Error in staking transaction:", error);
        throw error;
    }
}