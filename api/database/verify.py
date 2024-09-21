from typing import Dict
from collections import defaultdict

verified_users: Dict[str, bool] = defaultdict(bool)


def verify_user(address: str) -> bool:
    verified_users[address] = True
    return verified_users[address]


def check_user(address: str) -> bool:
    return verified_users[address]
