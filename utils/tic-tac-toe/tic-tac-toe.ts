export type TicTacToe = {
  "version": "0.1.0",
  "name": "tic_tac_toe",
  "instructions": [
    {
      "name": "gameInit",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pot",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u32"
        },
        {
          "name": "rows",
          "type": "u8"
        },
        {
          "name": "cols",
          "type": "u8"
        },
        {
          "name": "connect",
          "type": "u8"
        },
        {
          "name": "minPlayers",
          "type": "u8"
        },
        {
          "name": "maxPlayers",
          "type": "u8"
        },
        {
          "name": "wager",
          "type": "u32"
        }
      ]
    },
    {
      "name": "gameJoin",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pot",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "gamePlay",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pot",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tile",
          "type": {
            "defined": "Tile"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "nonce",
            "type": "u32"
          },
          {
            "name": "state",
            "type": {
              "defined": "GameState"
            }
          },
          {
            "name": "rows",
            "type": "u8"
          },
          {
            "name": "cols",
            "type": "u8"
          },
          {
            "name": "connect",
            "type": "u8"
          },
          {
            "name": "minPlayers",
            "type": "u8"
          },
          {
            "name": "maxPlayers",
            "type": "u8"
          },
          {
            "name": "moves",
            "type": "u8"
          },
          {
            "name": "wager",
            "type": "u32"
          },
          {
            "name": "pot",
            "type": "publicKey"
          },
          {
            "name": "initTimestamp",
            "type": "i64"
          },
          {
            "name": "lastMoveSlot",
            "type": "u64"
          },
          {
            "name": "joinedPlayers",
            "type": "u8"
          },
          {
            "name": "currentPlayerIndex",
            "type": "u8"
          },
          {
            "name": "board",
            "type": {
              "vec": {
                "vec": {
                  "option": "u8"
                }
              }
            }
          },
          {
            "name": "players",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "pot",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "game",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Tile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "row",
            "type": "u8"
          },
          {
            "name": "column",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "GameState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Waiting"
          },
          {
            "name": "Active"
          },
          {
            "name": "Tie"
          },
          {
            "name": "Won",
            "fields": [
              {
                "name": "winner",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TileOutOfBounds",
      "msg": "specified tile is out of bounds"
    },
    {
      "code": 6001,
      "name": "TileAlreadySet",
      "msg": "specified tile is occupied"
    },
    {
      "code": 6002,
      "name": "GameAlreadyOver",
      "msg": "game has already ended"
    },
    {
      "code": 6003,
      "name": "NotPlayersTurn",
      "msg": "it is not your player's turn"
    },
    {
      "code": 6004,
      "name": "GameAlreadyStarted",
      "msg": "game has already started"
    },
    {
      "code": 6005,
      "name": "NotAcceptingPlayers",
      "msg": "game is not accepting new players"
    },
    {
      "code": 6006,
      "name": "PayoutDebitNumericalOverflow",
      "msg": "debiting the game pot has caused a numerical overflow"
    },
    {
      "code": 6007,
      "name": "PayoutCreditNumericalOverflow",
      "msg": "crediting the winner account has caused a numerical overflow"
    },
    {
      "code": 6008,
      "name": "PlayerWinnerMismatch",
      "msg": "player and winner don't match"
    },
    {
      "code": 6009,
      "name": "RowsMustBeGreaterThanTwo",
      "msg": "rows must be greater than 2"
    },
    {
      "code": 6010,
      "name": "ColumnsMustBeGreaterThanTwo",
      "msg": "colums must be greater than 2"
    },
    {
      "code": 6011,
      "name": "MinimumPlayersMustBeGreaterThanOne",
      "msg": "minimum players must be greater than 1"
    },
    {
      "code": 6012,
      "name": "MaximumPlayersMustBeGreaterThanOne",
      "msg": "maximum players must be greater than 1"
    },
    {
      "code": 6013,
      "name": "MaximumPlayersMustBeGreaterThanOrEqualToMiniumPlayers",
      "msg": "maximum players must be greater than or equal to minimum players"
    },
    {
      "code": 6014,
      "name": "FailedToTransferFunds",
      "msg": "failed to transfer funds"
    },
    {
      "code": 6015,
      "name": "TooManyPlayersSpecified",
      "msg": "too many players specified"
    },
    {
      "code": 6016,
      "name": "ConnectMinimumNotMet",
      "msg": "connect minimum not met"
    },
    {
      "code": 6017,
      "name": "ConnectIsGreaterThanNumberOfRows",
      "msg": "connect cannot be greater than the number of rows"
    },
    {
      "code": 6018,
      "name": "ConnectIsGreaterThanNumberOfColumns",
      "msg": "connect cannot be greater than the number of columns"
    }
  ]
};

export const IDL: TicTacToe = {
  "version": "0.1.0",
  "name": "tic_tac_toe",
  "instructions": [
    {
      "name": "gameInit",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pot",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u32"
        },
        {
          "name": "rows",
          "type": "u8"
        },
        {
          "name": "cols",
          "type": "u8"
        },
        {
          "name": "connect",
          "type": "u8"
        },
        {
          "name": "minPlayers",
          "type": "u8"
        },
        {
          "name": "maxPlayers",
          "type": "u8"
        },
        {
          "name": "wager",
          "type": "u32"
        }
      ]
    },
    {
      "name": "gameJoin",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pot",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "gamePlay",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pot",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tile",
          "type": {
            "defined": "Tile"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "nonce",
            "type": "u32"
          },
          {
            "name": "state",
            "type": {
              "defined": "GameState"
            }
          },
          {
            "name": "rows",
            "type": "u8"
          },
          {
            "name": "cols",
            "type": "u8"
          },
          {
            "name": "connect",
            "type": "u8"
          },
          {
            "name": "minPlayers",
            "type": "u8"
          },
          {
            "name": "maxPlayers",
            "type": "u8"
          },
          {
            "name": "moves",
            "type": "u8"
          },
          {
            "name": "wager",
            "type": "u32"
          },
          {
            "name": "pot",
            "type": "publicKey"
          },
          {
            "name": "initTimestamp",
            "type": "i64"
          },
          {
            "name": "lastMoveSlot",
            "type": "u64"
          },
          {
            "name": "joinedPlayers",
            "type": "u8"
          },
          {
            "name": "currentPlayerIndex",
            "type": "u8"
          },
          {
            "name": "board",
            "type": {
              "vec": {
                "vec": {
                  "option": "u8"
                }
              }
            }
          },
          {
            "name": "players",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "pot",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "game",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Tile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "row",
            "type": "u8"
          },
          {
            "name": "column",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "GameState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Waiting"
          },
          {
            "name": "Active"
          },
          {
            "name": "Tie"
          },
          {
            "name": "Won",
            "fields": [
              {
                "name": "winner",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TileOutOfBounds",
      "msg": "specified tile is out of bounds"
    },
    {
      "code": 6001,
      "name": "TileAlreadySet",
      "msg": "specified tile is occupied"
    },
    {
      "code": 6002,
      "name": "GameAlreadyOver",
      "msg": "game has already ended"
    },
    {
      "code": 6003,
      "name": "NotPlayersTurn",
      "msg": "it is not your player's turn"
    },
    {
      "code": 6004,
      "name": "GameAlreadyStarted",
      "msg": "game has already started"
    },
    {
      "code": 6005,
      "name": "NotAcceptingPlayers",
      "msg": "game is not accepting new players"
    },
    {
      "code": 6006,
      "name": "PayoutDebitNumericalOverflow",
      "msg": "debiting the game pot has caused a numerical overflow"
    },
    {
      "code": 6007,
      "name": "PayoutCreditNumericalOverflow",
      "msg": "crediting the winner account has caused a numerical overflow"
    },
    {
      "code": 6008,
      "name": "PlayerWinnerMismatch",
      "msg": "player and winner don't match"
    },
    {
      "code": 6009,
      "name": "RowsMustBeGreaterThanTwo",
      "msg": "rows must be greater than 2"
    },
    {
      "code": 6010,
      "name": "ColumnsMustBeGreaterThanTwo",
      "msg": "colums must be greater than 2"
    },
    {
      "code": 6011,
      "name": "MinimumPlayersMustBeGreaterThanOne",
      "msg": "minimum players must be greater than 1"
    },
    {
      "code": 6012,
      "name": "MaximumPlayersMustBeGreaterThanOne",
      "msg": "maximum players must be greater than 1"
    },
    {
      "code": 6013,
      "name": "MaximumPlayersMustBeGreaterThanOrEqualToMiniumPlayers",
      "msg": "maximum players must be greater than or equal to minimum players"
    },
    {
      "code": 6014,
      "name": "FailedToTransferFunds",
      "msg": "failed to transfer funds"
    },
    {
      "code": 6015,
      "name": "TooManyPlayersSpecified",
      "msg": "too many players specified"
    },
    {
      "code": 6016,
      "name": "ConnectMinimumNotMet",
      "msg": "connect minimum not met"
    },
    {
      "code": 6017,
      "name": "ConnectIsGreaterThanNumberOfRows",
      "msg": "connect cannot be greater than the number of rows"
    },
    {
      "code": 6018,
      "name": "ConnectIsGreaterThanNumberOfColumns",
      "msg": "connect cannot be greater than the number of columns"
    }
  ]
};
