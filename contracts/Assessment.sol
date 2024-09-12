// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Assessment {
    // Mapping to store tickets owned by each user
    mapping(address => uint256) public ticketsOwned;

    // Mapping to store ETH spent by each user
    mapping(address => uint256) public ethSpent;

    // Events to track purchases and withdrawals
    event TicketsPurchased(address indexed buyer, uint256 amount, uint256 totalCost);
    event TicketsWithdrawn(address indexed user, uint256 amount);

    // Ticket prices
    uint256 public constant singleTicketPrice = 3 ether;
    uint256 public constant bulkTicketPrice = 2 ether;

    // Modifier to check if the caller has enough tickets
    modifier hasEnoughTickets(uint256 _amount) {
        require(ticketsOwned[msg.sender] >= _amount, "Not enough tickets");
        _;
    }

    // Function to get the number of tickets owned by the caller
    function getMyTickets() external view returns (uint256) {
        return ticketsOwned[msg.sender];
    }

    // Function to get the total ETH spent by the caller
    function getETHSpent() external view returns (uint256) {
        return ethSpent[msg.sender];
    }

    // Function to purchase tickets
    function purchaseTickets(uint256 _amount) external payable {
        require(_amount > 0, "Must purchase at least 1 ticket");

        uint256 totalCost;
        if (_amount == 1) {
            totalCost = singleTicketPrice;
        } else {
            totalCost = bulkTicketPrice * _amount;
        }

        require(msg.value >= totalCost, "Not enough ETH sent for ticket purchase");

        ticketsOwned[msg.sender] += _amount;
        ethSpent[msg.sender] += totalCost;

        emit TicketsPurchased(msg.sender, _amount, totalCost);

        // Refund extra ETH sent, if any
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }

    // Function to withdraw tickets
    function withdraw(uint256 _amount) external hasEnoughTickets(_amount) {
        ticketsOwned[msg.sender] -= _amount;

        emit TicketsWithdrawn(msg.sender, _amount);
    }

    // Function to withdraw contract's balance (only owner)
    function withdrawBalance() external {
        require(msg.sender == owner(), "Only owner can withdraw balance");
        payable(msg.sender).transfer(address(this).balance);
    }

    // Helper function to get the contract's balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Ownership management (to withdraw funds)
    address private _owner;

    constructor() {
        _owner = msg.sender;
    }

    function owner() public view returns (address) {
        return _owner;
    }
}
