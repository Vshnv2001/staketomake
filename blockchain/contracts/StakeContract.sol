// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract StakeReward {
    uint256 private constant COMMISSION = 5;

    struct Community {
        uint256 totalStake;
        address[] participants;
        mapping(address => bool) participantStatus;
        mapping(address => uint256) participantStake;
    }

    //map goal type to communities
    mapping(string => Community) public communities;
    //keeps track of community pool size, we're going to siphon 5% from each stake for the community pool
    mapping(address => uint256) public communityPool;

    address public owner;
    uint256 public globalPoolBal;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function stake(string memory goalType) external payable {
        require(msg.value > 0, "Non-zero amount of ETH must be staked!");
        Community storage community = communities[goalType];
        community.totalStake += msg.value;
        community.participants.push(msg.sender);
        community.participantStake[msg.sender] = msg.value; //stake value
        community.participantStatus[msg.sender] = false;
    }

    function setSuccessful(
        string memory goalType,
        address participant,
        bool isSuccess
    ) external onlyOwner {
        Community storage community = communities[goalType];
        require(
            community.participantStake[participant] > 0,
            "Participant has not staked any money for this goal type."
        );

        if (isSuccess) {
            community.participantStatus[participant] = true;
        }
    }

    //send any failed group's amounts to the communityPool
    function finalizeCommunityPool(string memory goalType) external onlyOwner {
        Community storage community = communities[goalType];
        require(community.totalStake > 0, "Community has no funds.");

        uint256 successCount = 0;
        for (uint256 i = 0; i < community.participants.length; ++i) {
            if (community.participantStatus[community.participants[i]]) {
                successCount++;
            }
        }
        if (successCount == 0) {
            globalPoolBal += community.totalStake;
        } else {
            uint256 reward = ((1 - COMMISSION) * community.totalStake) /
                (100 * successCount);
            uint256 comp = (COMMISSION * community.totalStake) /
                (100 * successCount);
            for (uint256 i = 0; i < community.participants.length; ++i) {
                address participant = community.participants[i];
                if (community.participantStatus[participant]) {
                    payable(participant).transfer(reward);
                    globalPoolBal += comp;
                }
            }
        }
        community.totalStake = 0;
        delete community.participants;

        for (uint256 i = 0; i < community.participants.length; ++i) {
            address participant = community.participants[i];
            delete community.participantStake[participant];
            delete community.participantStatus[participant];
        }
    }

    function withdrawGlobalPool(uint256 amount) external onlyOwner {
        require(
            amount >= globalPoolBal,
            "Not enough ETH staked globally to be withdrawn"
        );
        globalPoolBal -= amount;
        payable(owner).transfer(amount);
    }

    fallback() external payable {
        globalPoolBal += msg.value; // Add received amount to total
    }
}
