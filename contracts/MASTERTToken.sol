pragma solidity ^0.5.8;

// Imports
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

// Main token smart contract
contract MASTERTToken is ERC20Mintable {
  string public constant name = "Master Token";
  string public constant symbol = "MASTERT";
  uint8 public constant decimals = 8;
}