// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

/// @title habETH contract - Own your goal
/// @author Team Dazzle
/// @notice This contract allows users to create a committment/goal for self and report

contract Habit {
    /*Type declarations*/
    mapping(uint256 => HabitCore) private _habits;
    mapping(uint256 => ReportCore) private _reports;
    mapping(address => uint256[]) private _userHabits;
    mapping(uint256 => uint256) private indexOfHabitInPendingAgreements;
    mapping(uint256 => uint256) private indexOfReportInPendingValidations;
    mapping(address => uint256[]) private _pendingAgreements; 
    mapping(address => uint256[]) private _pendingValidations;

    /// @param status Can have value 0, 1, -1. Where 0 denotes pending, 1 denotes accepted and -1 denotes declined.
    struct HabitCore {
        address payable user;
        address payable validator;
        int status;
        bool validatorIsSelf;
        string title;
        string committment;
        uint256 startTime;
        uint256 totalAmount;
        uint256 totalReports;
        uint256 interval;
        bool ended;
        uint256 successCount;
        uint256 missedCount;
        uint256 amountWithdrawn;
    }

    /// @param reportApprovalStatus Can have value 0, 1, -1. Where 0 denotes pending, 1 denotes accepted and -1 denotes declined.
    struct ReportCore {
        uint256 habitId;
        int reportApprovalStatus;
        string journalEntry;
        string proofUrl;
        uint256 reportedAt;
    }

    /*State Variables */
    uint256 public totalAmountDeposited;
    uint256 public totalAmountWithdrawn;

    /*Events */
    /// @notice This event is emitted when a user creates a new Habit
    /// @dev emit from func createHabit
    /// @param user The habit creator's address
    /// @param habitId The hash of user address, goal title and habit committment
    /// @param startTime The timestamp when the habit was created
    /// @param totalAmount The value of the habit/committment for the user in MATIC
    /// @param totalReports The duration within which the user wants to achieve his/her committment
    /// @param interval The duration in which user wants to get notified
    event HabitCreated(
        address indexed user,
        uint256 indexed habitId,
        uint256 startTime,
        uint256 totalAmount,
        uint256 totalReports,
        uint256 interval,
        address validator
    );

    /// @notice This event is emitted when a user accepts the role of validator for a habit
    event HabitAccepted(
        uint256 indexed habitId, 
        address validator
    );

    /// @notice This event is emitted when a user declines the role of validator for a habit
    event HabitDeclined(
        uint256 indexed habitId, 
        address validator
    );

    event ReportApproved(
        uint256 indexed reportId, 
        address validator
    );

    event ReportDeclined(
        uint256 indexed reportId, 
        address validator
    );

    /// @notice This event is emitted when a user reports for his/her committment
    /// @dev emit from func report
    /// @param user The habit creator's address
    /// @param habitId The hash of user address, goal title and habit committment
    /// @param journalEntry The description of the report creadted by user
    /// @param proofUrl The IPFS url of the proof attached in the report
    /// @param reportedAt The timestamp when the report was made towards the committment
    /// @param successCount The count of the reports made by user within the committed time interval
    /// @param missedCount The count of the reports missed by user within the committed time interval

    event HabitReported(
        uint256 indexed habitId,
        address indexed user,
        string journalEntry,
        string proofUrl,
        uint256 reportedAt,
        uint256 successCount,
        uint256 missedCount
    );

    /// @notice This event is emitted when the committed duration is reached
    /// @dev emit from func report when the committed duration is completed
    /// @param startTime a parameter just like in doxygen (must be followed by parameter name)
    /// @param totalAmount The value of the habit/committment for the user in MATIC
    /// @param totalReports The duration within which the user wants to achieve his/her committment
    /// @param successCount The count of the reports made by user within the committed time interval
    /// @param missedCount The count of the reports missed by user within the committed time interval
    /// @param amountWithdrawn The amount sent by the contract to the user address after the committment  duration was completed

    event HabitCompleted(
        uint256 indexed habitId,
        address indexed user,
        uint256 startTime,
        uint256 totalAmount,
        uint256 totalReports,
        uint256 successCount,
        uint256 missedCount,
        uint256 amountWithdrawn
    );

    constructor() {}

    /// @notice This function gets the committment details
    /// @dev getter for habit structure data
    /// @param habitId The hash of user address, goal title and habit committment
    /// @return habit Committment details of the user
    function getHabit(uint256 habitId) external view returns (HabitCore memory habit) {
        return _habits[habitId];
    }

    /// @notice This function gets the committment details using user's address
    /// @dev getter for habit structure based on address
    /// @param user The habit creator's address
    /// @return userHabits the habits of the user
    function getUserHabits(address user) external view returns (uint256[] memory userHabits) {
        return _userHabits[user];
    }

    function getUserHabitNonce(address user) external view returns (uint256 userHabitLength) {
        return _userHabits[user].length + 1;
    }

    function getHabitValidatorRequests(address user) external view returns (uint256[] memory pendingValidatorRequests) {
        return _pendingAgreements[user];
    }

    function getReportApprovalRequests(address user) external view returns (uint256[] memory pendingReportValidations) {
        return _pendingValidations[user];
    }

    function hashHabit(
        address user,
        bytes32 titleHash,
        bytes32 committmentHash
    ) public pure virtual returns (uint256) {
        return uint256(keccak256(abi.encode(user, titleHash, committmentHash)));
    }

    function createHabit(
        string memory title,
        string memory committment,
        uint256 totalReports,
        uint256 interval,
        address validator
    ) public payable {
        uint habitId = hashHabit(
            msg.sender,
            keccak256(bytes(title)),
            keccak256(bytes(committment))
        );
        HabitCore storage habit = _habits[habitId];
        require(habit.totalAmount == 0, "Habit with this id already exists");
        require(totalReports > 0, "totalReports should be greater than 0");
        require(msg.value >= totalReports, "Amount should be greater than total no. of reports");
        require(interval > 0, "Interval should be greater than 0");

        habit.user = payable(msg.sender);
        habit.startTime = block.timestamp;
        habit.totalAmount = msg.value;
        habit.totalReports = totalReports;
        habit.interval = interval;
        habit.title = title;
        habit.committment = committment;
        habit.validator = payable(validator);
        if (habit.validator == msg.sender) {
            habit.validatorIsSelf = true;
            habit.status = 1;
        } else {
            habit.status = 0;
            _pendingAgreements[validator].push(habitId);
            indexOfHabitInPendingAgreements[habitId] = _pendingAgreements[validator].length-1;
        }

        _userHabits[habit.user].push(habitId);
        totalAmountDeposited += msg.value;

        emit HabitCreated(
            habit.user,
            habitId,
            habit.startTime,
            msg.value,
            totalReports,
            interval,
            validator
        );
    }

    function hashReport(
        address user,
        uint256 habitId,
        uint256 reportedAt
    ) public pure virtual returns (uint256) {
        return uint256(keccak256(abi.encode(user, habitId, reportedAt)));
    }

    function report(
        uint256 habitId,
        string calldata journalEntry,
        string calldata proofUrl
    ) public payable {
        HabitCore storage habit = _habits[habitId];
        require(habit.totalAmount != 0, "Habit with this id does not exists");
        require(habit.user == msg.sender, "Invalid user");
        require(habit.ended == false, "Habit is completed");

        // check if the user is doing it in the slot
        uint timeDiff = block.timestamp - habit.startTime;
        uint numSlots = timeDiff / habit.interval;
        uint totalUpdatedCount = habit.successCount + habit.missedCount;
        require(totalUpdatedCount <= numSlots, "Already submitted report for this slot");
        if (numSlots >= habit.totalReports) {
            habit.missedCount = habit.totalReports - habit.successCount;
        } else {
            if (numSlots > habit.successCount) {
                habit.missedCount = numSlots - habit.successCount;
            }
            habit.successCount++;
        }

        if ((habit.successCount + habit.missedCount) == habit.totalReports) {
            habit.ended = true;
            uint amountToSend = (habit.totalAmount * habit.successCount) / habit.totalReports;
            if (amountToSend > 0) {
                habit.user.transfer(amountToSend);
                totalAmountWithdrawn += amountToSend;
                emit HabitCompleted(
                    habitId,
                    habit.user,
                    habit.startTime,
                    habit.totalAmount,
                    habit.totalReports,
                    habit.successCount,
                    habit.missedCount,
                    amountToSend
                );
            }
        }

        uint reportId = hashReport(habit.user, habitId, block.timestamp);
        ReportCore memory currReport;
        currReport.habitId = habitId;
        currReport.journalEntry = journalEntry;
        currReport.proofUrl = proofUrl;
        currReport.reportedAt = block.timestamp;
        _reports[reportId] = currReport;
        if (habit.validatorIsSelf) {
            currReport.reportApprovalStatus = 1;
        } else {
            currReport.reportApprovalStatus = 0;
            _pendingValidations[habit.validator].push(reportId);
            indexOfReportInPendingValidations[reportId] = _pendingValidations[habit.validator].length-1;
        }

        emit HabitReported(
            habitId,
            habit.user,
            journalEntry,
            proofUrl,
            block.timestamp,
            habit.successCount,
            habit.missedCount
        );
    }

    function acceptValidatorRole(
        uint256 habitId, 
        address validator
    ) public {
        HabitCore storage habit = _habits[habitId];
        require(habit.status != 0, "Habit can't be accepted!");

        habit.status = 1;
        deleteFromListUsingIndexMapping(
            _pendingAgreements[validator], 
            habitId, 
            indexOfHabitInPendingAgreements
        );
        emit HabitAccepted(habitId, validator);
    }

    function declineValidatorRole(
        uint256 habitId, 
        address validator
    ) public {
        HabitCore storage habit = _habits[habitId];
        require(habit.status != 0, "Habit can't be declined!");

        habit.status = -1;
        deleteFromListUsingIndexMapping(
            _pendingAgreements[validator], 
            habitId, 
            indexOfHabitInPendingAgreements
        );    
        emit HabitDeclined(habitId, validator);
    }

    function validateReport(
        uint256 reportId, 
        address validator
    ) public {
        ReportCore storage currReport = _reports[reportId];
        currReport.reportApprovalStatus = 1;
        deleteFromListUsingIndexMapping(
            _pendingValidations[validator], 
            reportId, 
            indexOfReportInPendingValidations
        );
        emit ReportApproved(reportId, validator);
    }

    function declineReport(
        uint256 reportId, 
        address validator
    ) public {
        ReportCore storage currReport = _reports[reportId];
        currReport.reportApprovalStatus = -1;
        deleteFromListUsingIndexMapping(
            _pendingValidations[validator], 
            reportId, 
            indexOfReportInPendingValidations
        );
        emit ReportDeclined(reportId, validator);
    }

    function deleteFromListUsingIndexMapping(
        uint256[] storage list, 
        uint256 elementToDelete,
        mapping(uint256 => uint256) storage indexMap
    ) private {
        uint256 ind = indexMap[elementToDelete];
        if (ind >= list.length) return;
        if (list.length != 1) {
            uint256 lastEle = list[list.length - 1];
            list[ind] = lastEle;
            indexMap[lastEle] = ind;
        }
        delete indexMap[ind];
        list.pop();
    }

    // When a habit is declined, user can delete that habit
    function deleteHabit() public {}
}
