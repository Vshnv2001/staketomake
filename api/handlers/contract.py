import datetime
import json
import os
from typing import Dict

import web3
import web3.eth

# Eth Sepolia test provider
from web3 import Web3

from models.goal import Goal


def get_contract():
    try:
        abi = json.loads(os.path.join(os.path.dirname(__file__), "StakeContractABI.json"))
        contract = web3.Web3(provider=Web3.EthereumTesterProvider).eth.contract(address="0x21EEFE85b71E0CEf9183a6ab858A9bebA769Ad52", abi=abi)
        return contract
    except Exception as e:
        print(e)
        return None


def submit_goal_data(goal: Goal):
    try:
        contract = get_contract()

        goal_mappings = {}
        for submission in goal.submissions:
            goal_mappings[submission.person] = goal_mappings.get(submission.person, 0) + 1

        for participant_id, submission_count in goal_mappings.items():
            contract.functions.tallyParticipantSubmissions(goal.id, participant_id, submission_count).transact()

        return True
    except Exception as e:
        print(e)
        return False
