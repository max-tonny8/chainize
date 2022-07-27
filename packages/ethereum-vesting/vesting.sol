// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

import './libs/SafeERC20.sol';
import './libs/Ownable.sol';
import './libs/SafeMath.sol';

/**
 * @title TokenVesting
 * @dev A token holder contract that can release its token balance gradually like a
 * typical vesting scheme, with a cliff and vesting period. Optionally revocable by the
 * owner.
 */
contract TokenVesting is Ownable {
  // The vesting schedule is time-based (i.e. using block timestamps as opposed to e.g. block numbers), and is
  // therefore sensitive to timestamp manipulation (which is something miners can do, to a certain degree). Therefore,
  // it is recommended to avoid using short time durations (less than a minute). Typical vesting schemes, with a
  // cliff period of a year and a duration of four years, are safe to use.
  // solhint-disable not-rely-on-time

  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  event TokensReleased(address token, uint256 amount);
  event TokenVestingRevoked(address token);

  // beneficiary of tokens after they are released
  address private beneficiary;

  // Durations and timestamps are expressed in UNIX time, the same units as block.timestamp.
  uint256 private cliff;
  uint256 private start;
  uint256 private duration;

  bool private revocable;

  mapping(address => uint256) private released;
  mapping(address => bool) private revoked;

  /**
   * @dev Creates a vesting contract that vests its balance of any ERC20 token to the
   * beneficiary, gradually in a linear fashion until start + duration. By then all
   * of the balance will have vested.
   * @param _beneficiary address of the beneficiary to whom vested tokens are transferred
   * @param _cliffDuration duration in seconds of the cliff in which tokens will begin to vest
   * @param _start the time (as Unix time) at which point vesting starts
   * @param _duration duration in seconds of the period in which the tokens will vest
   * @param _revocable whether the vesting is revocable or not
   */
  constructor(
    address _beneficiary,
    uint256 _start,
    uint256 _cliffDuration,
    uint256 _duration,
    bool _revocable,
    address _owner
  ) {
    require(
      _beneficiary != address(0),
      'TokenVesting: beneficiary is the zero address'
    );
    // solhint-disable-next-line max-line-length
    require(
      _cliffDuration <= _duration,
      'TokenVesting: cliff is longer than duration'
    );
    require(_duration > 0, 'TokenVesting: duration is 0');
    // solhint-disable-next-line max-line-length
    require(
      _start.add(_duration) > block.timestamp,
      'TokenVesting: final time is before current time'
    );

    beneficiary = _beneficiary;
    revocable = _revocable;
    duration = _duration;
    cliff = _start.add(_cliffDuration);
    start = _start;

    transferOwnership(_owner);
  }

  /**
   * @return the beneficiary of the tokens.
   */
  function getBeneficiary() external view returns (address) {
    return beneficiary;
  }

  /**
   * @return the cliff time of the token vesting.
   */
  function getCliff() external view returns (uint256) {
    return cliff;
  }

  /**
   * @return the start time of the token vesting.
   */
  function getStart() external view returns (uint256) {
    return start;
  }

  /**
   * @return the duration of the token vesting.
   */
  function getDuration() external view returns (uint256) {
    return duration;
  }

  /**
   * @return true if the vesting is revocable.
   */
  function getRevocable() external view returns (bool) {
    return revocable;
  }

  /**
   * @return the amount of the token released.
   */
  function getReleased(address token) external view returns (uint256) {
    return released[token];
  }

  /**
   * @return true if the token is revoked.
   */
  function getRevoked(address token) external view returns (bool) {
    return revoked[token];
  }

  /**
   * @return the amount of the token vested.
   */
  function getVestedAmount(IERC20 token) external view returns (uint256) {
    return _vestedAmount(token);
  }

  /**
   * @notice Transfers vested tokens to beneficiary.
   * @param token ERC20 token which is being vested
   */
  function release(IERC20 token) public {
    uint256 unreleased = _releasableAmount(token);

    require(unreleased > 0, 'TokenVesting: no tokens are due');

    released[address(token)] = released[address(token)].add(unreleased);

    token.safeTransfer(beneficiary, unreleased);

    emit TokensReleased(address(token), unreleased);
  }

  /**
   * @notice Allows the owner to revoke the vesting. Tokens already vested
   * remain in the contract, the rest are returned to the owner.
   * @param token ERC20 token which is being vested
   */
  function revoke(IERC20 token) public onlyOwner {
    require(revocable, 'TokenVesting: cannot revoke');
    require(!revoked[address(token)], 'TokenVesting: token already revoked');

    uint256 balance = token.balanceOf(address(this));

    uint256 unreleased = _releasableAmount(token);
    uint256 refund = balance.sub(unreleased);

    revoked[address(token)] = true;

    token.safeTransfer(owner(), refund);

    emit TokenVestingRevoked(address(token));
  }

  /**
   * @dev Calculates the amount that has already vested but hasn't been released yet.
   * @param token ERC20 token which is being vested
   */
  function _releasableAmount(IERC20 token) private view returns (uint256) {
    return _vestedAmount(token).sub(released[address(token)]);
  }

  /**
   * @dev Calculates the amount that has already vested.
   * @param token ERC20 token which is being vested
   */
  function _vestedAmount(IERC20 token) private view returns (uint256) {
    uint256 currentBalance = token.balanceOf(address(this));
    uint256 totalBalance = currentBalance.add(released[address(token)]);

    if (block.timestamp < cliff) {
      return 0;
    } else if (
      block.timestamp >= start.add(duration) || revoked[address(token)]
    ) {
      return totalBalance;
    } else {
      return totalBalance.mul(block.timestamp.sub(start)).div(duration);
    }
  }
}