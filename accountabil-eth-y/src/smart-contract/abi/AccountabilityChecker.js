export const AccountabilityCheckerABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "payout",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "penalty",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "sentToOwner",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "sentToNominee",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isPromiseActive",
        type: "bool",
      },
    ],
    name: "cashOutSummary",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "check_open",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "check_closed",
        type: "uint256",
      },
    ],
    name: "checkTimesUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "pledge_pot",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward_pot",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "penalty_pot",
        type: "uint256",
      },
    ],
    name: "moneyPotUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "nominee_address",
        type: "address",
      },
    ],
    name: "nomineeSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "days_missed",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "penalty_amount",
        type: "uint256",
      },
    ],
    name: "penaltyApplied",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "commitments",
        type: "bytes32[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "pledge_pot",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "promise_deadline",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "checks_left",
        type: "uint256",
      },
    ],
    name: "promiseSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "checks_left",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "last_checked",
        type: "uint256",
      },
    ],
    name: "submissionAccepted",
    type: "event",
  },
  {
    inputs: [],
    name: "check_closed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "check_open",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "contract_creation",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "isPromiseActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "nominee_account",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "promise_deadline",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "requester",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nominee",
        type: "address",
      },
    ],
    name: "setNominee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "my_commitments",
        type: "bytes32[]",
      },
      {
        internalType: "uint256",
        name: "my_wager",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "my_deadline",
        type: "uint256",
      },
    ],
    name: "activatePromise",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "commitments_fulfiled",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "time_submitted",
        type: "uint256",
      },
    ],
    name: "checkCommitments",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cashOut",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [],
    name: "getPromiseDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getPotsDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];
