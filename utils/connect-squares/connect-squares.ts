export type ConnectSquares = {
  "version": "0.1.0",
  "name": "connect_squares",
  "instructions": [
    {
      "name": "metadataInit",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
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
      "name": "metdataSetAuthority",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "metadata",
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
          "name": "newAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "metadataWithdraw",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "metadata",
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
          "name": "amount",
          "type": "u64"
        }
      ]
    },
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
      "name": "gameCancel",
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
          "name": "metadata",
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
      "name": "metadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "authority",
            "type": "publicKey"
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
      "name": "GameError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "TileOutOfBounds"
          },
          {
            "name": "TileAlreadySet"
          },
          {
            "name": "GameAlreadyOver"
          },
          {
            "name": "NotPlayersTurn"
          },
          {
            "name": "GameAlreadyStarted"
          },
          {
            "name": "NotAcceptingPlayers"
          },
          {
            "name": "PayoutDebitNumericalOverflow"
          },
          {
            "name": "PayoutCreditNumericalOverflow"
          },
          {
            "name": "PlayerWinnerMismatch"
          },
          {
            "name": "RowsMustBeGreaterThanTwo"
          },
          {
            "name": "ColumnsMustBeGreaterThanTwo"
          },
          {
            "name": "MinimumPlayersMustBeGreaterThanOne"
          },
          {
            "name": "MaximumPlayersMustBeGreaterThanOne"
          },
          {
            "name": "MaximumPlayersMustBeGreaterThanOrEqualToMiniumPlayers"
          },
          {
            "name": "FailedToTransferFunds"
          },
          {
            "name": "TooManyPlayersSpecified"
          },
          {
            "name": "ConnectMinimumNotMet"
          },
          {
            "name": "ConnectIsGreaterThanNumberOfRows"
          },
          {
            "name": "ConnectIsGreaterThanNumberOfColumns"
          },
          {
            "name": "NotAuthorized"
          },
          {
            "name": "CellValueIsInvalid"
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
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6001,
      "name": "AlreadyInitialized",
      "msg": "already initialized"
    },
    {
      "code": 6002,
      "name": "InsufficientFunds",
      "msg": "insufficient funds"
    }
  ]
};

export const IDL: ConnectSquares = {
  "version": "0.1.0",
  "name": "connect_squares",
  "instructions": [
    {
      "name": "metadataInit",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
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
      "name": "metdataSetAuthority",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "metadata",
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
          "name": "newAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "metadataWithdraw",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "metadata",
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
          "name": "amount",
          "type": "u64"
        }
      ]
    },
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
      "name": "gameCancel",
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
          "name": "metadata",
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
      "name": "metadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "authority",
            "type": "publicKey"
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
      "name": "GameError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "TileOutOfBounds"
          },
          {
            "name": "TileAlreadySet"
          },
          {
            "name": "GameAlreadyOver"
          },
          {
            "name": "NotPlayersTurn"
          },
          {
            "name": "GameAlreadyStarted"
          },
          {
            "name": "NotAcceptingPlayers"
          },
          {
            "name": "PayoutDebitNumericalOverflow"
          },
          {
            "name": "PayoutCreditNumericalOverflow"
          },
          {
            "name": "PlayerWinnerMismatch"
          },
          {
            "name": "RowsMustBeGreaterThanTwo"
          },
          {
            "name": "ColumnsMustBeGreaterThanTwo"
          },
          {
            "name": "MinimumPlayersMustBeGreaterThanOne"
          },
          {
            "name": "MaximumPlayersMustBeGreaterThanOne"
          },
          {
            "name": "MaximumPlayersMustBeGreaterThanOrEqualToMiniumPlayers"
          },
          {
            "name": "FailedToTransferFunds"
          },
          {
            "name": "TooManyPlayersSpecified"
          },
          {
            "name": "ConnectMinimumNotMet"
          },
          {
            "name": "ConnectIsGreaterThanNumberOfRows"
          },
          {
            "name": "ConnectIsGreaterThanNumberOfColumns"
          },
          {
            "name": "NotAuthorized"
          },
          {
            "name": "CellValueIsInvalid"
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
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6001,
      "name": "AlreadyInitialized",
      "msg": "already initialized"
    },
    {
      "code": 6002,
      "name": "InsufficientFunds",
      "msg": "insufficient funds"
    }
  ]
};
