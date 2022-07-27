// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

import './TokenVesting.sol';

contract ContractFactory {
  /*
   *  Events
   */
  event ContractInstantiation(address instantiation, address beneficiary);

  /*
   *  Storage
   */
  mapping(address => bool) public isInstantiation;
  mapping(address => address) public vestingAddress;

  /// @dev Returns address of vesting contract
  /// @return Returns address of vesting contract
  function getVestingAddress() public view returns (address) {
    return vestingAddress[msg.sender];
  }

  /*
   * Internal functions
   */
  /// @dev Registers contract in factory registry.
  /// @param instantiation Address of contract instantiation.
  function register(address instantiation, address beneficiary) internal {
    isInstantiation[instantiation] = true;
    vestingAddress[beneficiary] = instantiation;
    emit ContractInstantiation(instantiation, beneficiary);
  }
}

/// @title Token Vesting Factory
/// @author Albert Chen - <albert.chen@me.com>
contract TokenVestingFactory is ContractFactory {
  /*
   * Public functions
   */
  /// @dev Allows verified creation of Token Vesting Contract
  /// Returns wallet address.
  function create(
    address _beneficiary,
    uint256 _start,
    uint256 _cliffDuration,
    uint256 _duration,
    bool _revocable,
    address _owner
  ) public returns (address contractAddress) {
    require(
      vestingAddress[_beneficiary] == address(0),
      'Beneficiary already has a vesting contract!'
    );

    contractAddress = address(
      new TokenVesting(
        _beneficiary,
        _start,
        _cliffDuration,
        _duration,
        _revocable,
        _owner
      )
    );

    register(contractAddress, _beneficiary);
  }
}