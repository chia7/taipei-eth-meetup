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

contract Main {
    address public owner;
    Oracle public oracle;

    function Main() {
        owner = msg.sender;
    }
    
    function SetOracle(address _addr) {
        oracle = Oracle(_addr);
    }
    
    function send(bool _a) {
        if(_a) {
            oracle.query();
        }
    }
}