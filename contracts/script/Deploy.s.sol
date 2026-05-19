// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {DailyCheckIn} from "../src/DailyCheckIn.sol";

contract Deploy is Script {
    function run() external returns (DailyCheckIn deployed) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        deployed = new DailyCheckIn();
        vm.stopBroadcast();
        console2.log("DailyCheckIn deployed at:", address(deployed));
    }
}
