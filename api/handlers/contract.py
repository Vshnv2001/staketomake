import json
import os

import web3
import web3.eth
from web3.middleware import ExtraDataToPOAMiddleware

from config.config import Settings
from models.goal import Goal
from models.enums import SubmissionStatus

WEB3_PROVIDER = Settings().web3_provider or os.getenv("WEB3_PROVIDER")
CONTRACT_ADDRESS = "0x21EEFE85b71E0CEf9183a6ab858A9bebA769Ad52"


def get_contract() -> web3.eth.Contract:
    try:
        filepath = os.path.join(os.path.dirname(__file__), "StakeContractABI.json")
        with open(filepath, "r") as file:
            abi = json.load(file)

        w3 = web3.Web3(web3.Web3.HTTPProvider(WEB3_PROVIDER))
        w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)  # For Goerli/Rinkeby

        contract = w3.eth.contract(address=web3.Web3.to_checksum_address(CONTRACT_ADDRESS), abi=abi)
        return contract
    except Exception as e:
        print(f"Error loading contract: {e}")
        return None


def submit_goal_data(goal: Goal):
    try:
        contract = get_contract()

        goal_mappings = {}
        for submission in goal.submissions:
            if submission.status == SubmissionStatus.COMPLETED:
                goal_mappings[submission.person] = goal_mappings.get(submission.person, 0) + 1

        for participant_id, submission_count in goal_mappings.items():
            checksum_address = web3.Web3.to_checksum_address(participant_id)
            tx_hash = contract.functions.tallyParticipantSubmissions(goal.id, checksum_address, submission_count).transact()
            tx_receipt = web3.Web3.eth.wait_for_transaction_receipt(tx_hash)
            print(f"Submitted data for {checksum_address}: {submission_count} submissions, tx receipt: {tx_receipt.values()}")
        return True
    except Exception as e:
        print(e)
        return False
