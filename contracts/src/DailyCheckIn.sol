// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Daily check-in for Anagram Game on Base (gas only, no fee)
contract DailyCheckIn {
    mapping(address => uint256) public lastCheckInDay;
    mapping(address => uint256) public streak;

    event CheckedIn(address indexed user, uint256 day, uint256 streak);

    error AlreadyCheckedIn();
    error ValueNotAllowed();

    function checkIn() external payable {
        if (msg.value != 0) revert ValueNotAllowed();

        // +1 so "never checked" (0) never collides with calendar day 0
        uint256 today = (block.timestamp / 1 days) + 1;
        uint256 previousDay = lastCheckInDay[msg.sender];
        if (previousDay == today) revert AlreadyCheckedIn();

        uint256 newStreak = 1;
        if (previousDay != 0 && previousDay == today - 1) {
            newStreak = streak[msg.sender] + 1;
        }

        lastCheckInDay[msg.sender] = today;
        streak[msg.sender] = newStreak;

        emit CheckedIn(msg.sender, today, newStreak);
    }
}
