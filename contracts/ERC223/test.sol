pragma solidity ^0.4.11;


/*
  Concrete token for unit-tests
  Author: Victor Mezrin  victor@mezrin.com
*/


import './implementation.sol';


contract ERC223TestToken is ERC223Token {
    function ERC223TestToken(
        string _name,
        string _symbol,
        uint8 _decimals,
        uint256 _totalSupply,
        address _initialTokensHolder
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        balances[_initialTokensHolder] = _totalSupply;
    }
}


contract ERC223TestContract is ERC223ContractInterface {
    function erc223Fallback(address _from, uint256 _value, bytes _data){
        // to avoid warnings during compilation
        _from = _from;
        _value = _value;
        _data = _data;

        // just blank function to allow transmission of tokens
    }
}
