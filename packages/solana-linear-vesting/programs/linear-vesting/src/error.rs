use num_derive::FromPrimitive;
use thiserror::Error;
use solana_program::{decode_error::DecodeError, program_error::ProgramError};

#[derive(Error, Debug, Copy, Clone, FromPrimitive)]
pub enum LinearVestingError {
    #[error("TokenVesting: no tokens are due")]
    NoTokens,
    #[error("Owner is wrong")]
    NoMatchOwner,
    #[error("Cannot revoke")]
    NoRevoke,
    #[error("Token already revoked")]
    AlreadyRevoked
}

impl From<LinearVestingError> for ProgramError {
    fn from(e: LinearVestingError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

impl<T> DecodeError<T> for LinearVestingError {
    fn type_of() -> &'static str {
        "Error"
    }
}