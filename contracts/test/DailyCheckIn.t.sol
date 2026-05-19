// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {DailyCheckIn} from "../src/DailyCheckIn.sol";

contract DailyCheckInTest is Test {
    DailyCheckIn internal checkIn;
    address internal alice = makeAddr("alice");

    function setUp() public {
        checkIn = new DailyCheckIn();
    }

    function test_FirstCheckIn() public {
        vm.prank(alice);
        checkIn.checkIn();

        uint256 today = (block.timestamp / 1 days) + 1;
        assertEq(checkIn.lastCheckInDay(alice), today);
        assertEq(checkIn.streak(alice), 1);
    }

    function test_RevertSameDay() public {
        vm.startPrank(alice);
        checkIn.checkIn();
        vm.expectRevert(DailyCheckIn.AlreadyCheckedIn.selector);
        checkIn.checkIn();
        vm.stopPrank();
    }

    function test_NextDayCheckIn() public {
        vm.prank(alice);
        checkIn.checkIn();

        vm.warp(block.timestamp + 1 days);
        vm.prank(alice);
        checkIn.checkIn();

        assertEq(checkIn.streak(alice), 2);
    }

    function test_StreakResetsAfterGap() public {
        vm.prank(alice);
        checkIn.checkIn();

        vm.warp(block.timestamp + 2 days);
        vm.prank(alice);
        checkIn.checkIn();

        assertEq(checkIn.streak(alice), 1);
    }

    function test_RevertWithValue() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        vm.expectRevert(DailyCheckIn.ValueNotAllowed.selector);
        checkIn.checkIn{value: 1 wei}();
    }
}
