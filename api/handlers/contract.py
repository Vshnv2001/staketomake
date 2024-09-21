import json
import os

import web3
import web3.eth

from config.config import Settings
from models.goal import Goal

WEB3_PROVIDER = Settings().web3_provider or os.getenv("WEB3_PROVIDER")


def get_contract() -> web3.eth.Contract:
    try:
        abi = json.loads(os.path.join(os.path.dirname(__file__), "StakeContractABI.json"))
        contract = web3.Web3(provider=web3.Web3.HTTPProvider(WEB3_PROVIDER)).eth.contract(
            address="0x21EEFE85b71E0CEf9183a6ab858A9bebA769Ad52", abi=abi
        )
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
