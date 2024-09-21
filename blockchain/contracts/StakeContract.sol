// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract StakeContract {
    uint8 private constant COMMISSION = 5;
    uint32 private constant CONVERT_TO_DAYS = 60 * 60 * 24;

    struct Goal {
        string id;
        uint256 startDate;
        uint256 endDate;
        uint256 duration;
        string gtype;
        string description;
        uint256 totalStake;
        address[] participants;
        mapping(address => uint256) participantSubmissions;
        mapping(address => uint256) participantStake;
        bool hasFinalized;
    }

    //list of goals
    string[] goalIds;
    mapping(string => bool) mappingGoals;
    mapping(string => Goal) public goals;

    address public owner;
    uint256 private globalPoolBal;

    constructor() {
        owner = msg.sender;
        globalPoolBal = 0; //keeps track of forfeited and commission amounts
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function stake(
        string memory goalId,
        string memory goalType,
        string memory goalDescription,
        uint256 goalStart,
        uint256 goalEnd
    ) external payable {
        require(msg.value > 0, "Non-zero amount of ETH must be staked!");
        require(goalEnd > block.timestamp, "End date must be in the future");
        if (!mappingGoals[goalId]) {
            mappingGoals[goalId] = true;
            goalIds.push(goalId);
        }
        Goal storage goal = goals[goalId];
        goal.gtype = goalType;
        goal.description = goalDescription;
        goal.totalStake += (((100 - COMMISSION) * msg.value) / 100);
        globalPoolBal += ((COMMISSION * msg.value) / 100);
        goal.participants.push(msg.sender);
        goal.participantStake[msg.sender] = msg.value; //stake value
        goal.participantSubmissions[msg.sender] = 0;
        goal.startDate = goalStart;
        goal.endDate = goalEnd;
        goal.duration = (goalEnd - goalStart) / CONVERT_TO_DAYS;
    }

    function validateChallenge(string memory goalId) private {
        require(mappingGoals[goalId], "Challenge ID does not exist");
        Goal storage goal = goals[goalId];

        for (uint256 i = 0; i < goal.participants.length; ++i) {
            if (
                block.timestamp > goal.startDate &&
                goal.participants.length == 1
            ) {
                payable(goal.participants[0]).transfer(goal.totalStake);
            }
        }
        goal.hasFinalized = true;
        goal.totalStake = 0;
    }

    function tallyParticipantSubmissions(
        string memory goalId,
        address participant,
        uint256 numSubmissions
    ) external onlyOwner {
        require(mappingGoals[goalId], "Goal type does not exist");

        Goal storage goal = goals[goalId];
        require(
            goal.participantStake[participant] > 0,
            "Participant has not staked any money for this goal type."
        );

        goal.participantSubmissions[participant] = numSubmissions;
    }

    //send any failed group's amounts to the global pool
    function finalizeGoalPool(string memory goalId) private {
        require(mappingGoals[goalId], "Goal type does not exist");

        Goal storage goal = goals[goalId];
        if (!goal.hasFinalized) {
            require(
                goal.participants.length > 0,
                "No participants in this goal"
            );
            require(block.timestamp > goal.endDate, "Goal is still ongoing!");

            uint256 rewardPoolVal = (goal.totalStake * 100 * COMMISSION) /
                (1 - COMMISSION);
            uint256 total_redeemed = 0;
            uint256 expectedSubmissions = goal.duration *
                goal.participants.length;

            for (uint256 i = 0; i < goal.participants.length; ++i) {
                address participant = goal.participants[i];
                uint256 reward = (goal.participantSubmissions[participant] *
                    goal.totalStake) / expectedSubmissions;
                if (reward != 0) {
                    payable(participant).transfer(reward);
                    total_redeemed += reward;
                }
            }
            if (total_redeemed == goal.totalStake) {
                for (uint256 i = 0; i < goal.participants.length; ++i) {
                    address participant = goal.participants[i];
                    payable(participant).transfer(
                        total_redeemed / goal.participants.length
                    );
                }
                globalPoolBal -= goal.totalStake;
            } else {
                globalPoolBal += (goal.totalStake - total_redeemed);
            }
            goal.totalStake = 0;
            goal.hasFinalized = true;
        }
    }

    function withdrawGlobalPool(uint256 amount) external onlyOwner {
        require(
            globalPoolBal >= amount,
            "Not enough ETH staked globally to be withdrawn"
        );
        globalPoolBal -= amount;
        payable(owner).transfer(amount);
    }

    //ChainLink Upkeep
    function performUpkeep() external {
        for (uint256 i = 0; i < goalIds.length; i++) {
            validateChallenge(goalIds[i]);
            finalizeGoalPool(goalIds[i]);
        }
    }

    fallback() external payable {
        globalPoolBal += msg.value; // Add received amount to total
    }
}
