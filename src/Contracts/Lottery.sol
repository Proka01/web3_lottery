/**
 *Submitted for verification at Etherscan.io on 2023-05-18
  https://sepolia.etherscan.io/address/0xa6D750f4123b4644338770C262d62891Be9ee591#code
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address public manager;
    address payable[] public players;
    address payable winner;
    bool public isComplete;
    bool public winnerRewarded;
    bool public claimed;
    
    constructor() {
        manager = msg.sender;
        isComplete = false;
        claimed = false;
        winnerRewarded = false;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getManager() public view returns (address) {
        return manager;
    }

    function getWinner() public view returns (address) {
        return winner;
    }

    function status() public view returns (bool) {
        return isComplete;
    }
    
    function enter() public payable {
        //require(msg.value >= 0.001 ether);
        require(!isComplete);
        players.push(payable(msg.sender));
    }
    
    function pickWinner() public restricted {
        require(players.length > 0);
        require(!isComplete);
        winner = players[randomNumber() % players.length];
        //winner.transfer(address(this).balance);

        winnerRewarded = true;
        isComplete = true;
        players = new address payable [](0);

        (bool sent, ) = winner.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function resetLottery() public restricted{
        require(winnerRewarded);
        isComplete = false;
        winnerRewarded = false;
    }
    
    
    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
    
    
    function randomNumber() private view returns (uint) {
        return uint (keccak256(abi.encode(block.timestamp,  players)));
    }
}