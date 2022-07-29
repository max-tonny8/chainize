use anchor_lang::error_code;

#[error_code]
pub enum TicTacToeError {
    TileOutOfBounds,
    TileAlreadySet,
    NotPlayersTurn,
    GameAlreadyStarted,
    GameAlreadyOver,
}
