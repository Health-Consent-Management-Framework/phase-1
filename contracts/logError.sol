// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.21;

contract MyContract {
    event LogError(string message);

    function throwError() public {
        emit LogError("Error occurred: Something went wrong");
        revert("Error occurred: Something went wrong");
    }
}
