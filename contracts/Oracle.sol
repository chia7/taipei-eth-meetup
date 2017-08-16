pragma solidity ^0.4.10;

contract Oracle {
    address public owner;

    function Oracle() {
        owner = msg.sender;
    }
    
    event Query(address addr);

    function query() {
        Query(msg.sender);
    }
}