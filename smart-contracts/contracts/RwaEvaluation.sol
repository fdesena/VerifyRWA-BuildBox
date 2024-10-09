// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing the EvaluatorRegistry contract
import "./EvaluatorRegistry.sol";

contract RwaEvaluation {
    // Declares a public instance of the EvaluatorRegistry contract
    EvaluatorRegistry public evaluatorRegistry;

    // Stores the address of the contract owner
    address public owner;

    // Constructor function that initializes the contract
    // Sets the owner as the address deploying the contract and links the EvaluatorRegistry contract
    constructor(address _evaluatorRegistryAddress) {
        evaluatorRegistry = EvaluatorRegistry(_evaluatorRegistryAddress);
        owner = msg.sender;  // Sets the owner to the address that deploys this contract
    }

    // Defines a struct 'Evaluation' to hold details about each evaluation
    struct Evaluation {
        address evaluatorAddress;  // Address of the evaluator who performed the evaluation
        string rwaTokenAddress;    // Address of the Real World Asset (RWA) token being evaluated
        uint256 totalValue;        // Total value of the evaluated RWA
        bool paymentInfoAvailable; // Whether payment information is available for the RWA
        string officialWebsite;    // Official website associated with the RWA
        uint8 trustScore;          // Trust score of the RWA (between 1 and 10)
        string comments;           // Additional comments from the evaluator
        uint256 timestamp;         // The timestamp when the evaluation was submitted
    }

    // An array to store all evaluations submitted
    Evaluation[] public evaluations;

    // Event emitted when a new evaluation is submitted
    event EvaluationSubmitted(address indexed evaluatorAddress, string rwaTokenAddress, uint256 timestamp);

    // Modifier to allow only registered evaluators to submit evaluations
    modifier onlyRegisteredEvaluator() {
        require(
            evaluatorRegistry.isEvaluatorRegistered(msg.sender),
            "Evaluator is not registered."  // Checks if the evaluator is registered in the EvaluatorRegistry
        );
        _;  // This allows the function using the modifier to execute
    }

    // Function to submit a new evaluation
    // Takes various parameters including RWA token address, total value, trust score, etc.
    function submitEvaluation(
        string memory _rwaTokenAddress,        // Address of the RWA token being evaluated
        uint256 _totalValue,                  // Total value of the RWA
        bool _paymentInfoAvailable,           // Whether payment information is available
        string memory _officialWebsite,       // Official website of the RWA
        uint8 _trustScore,                    // Trust score (must be between 1 and 10)
        string memory _comments               // Additional comments from the evaluator
    ) public onlyRegisteredEvaluator {        // Only registered evaluators can call this function
        require(_trustScore >= 1 && _trustScore <= 10, "Trust Score must be between 1 and 10.");  // Validates the trust score

        // Pushes a new evaluation into the evaluations array
        evaluations.push(Evaluation({
            evaluatorAddress: msg.sender,
            rwaTokenAddress: _rwaTokenAddress,
            totalValue: _totalValue,
            paymentInfoAvailable: _paymentInfoAvailable,
            officialWebsite: _officialWebsite,
            trustScore: _trustScore,
            comments: _comments,
            timestamp: block.timestamp  // Captures the time of evaluation submission
        }));

        // Emits an event to notify that a new evaluation has been submitted
        emit EvaluationSubmitted(msg.sender, _rwaTokenAddress, block.timestamp);
    }

    // Function to get the total number of evaluations submitted
    // Returns the length of the evaluations array
    function getEvaluationsCount() public view returns (uint256) {
        return evaluations.length;
    }

    // Function to get details of a specific evaluation based on its index in the array
    function getEvaluation(uint256 index) public view returns (
        address evaluatorAddress,           // Address of the evaluator who submitted the evaluation
        string memory rwaTokenAddress,      // Address of the evaluated RWA token
        uint256 totalValue,                 // Total value of the RWA
        bool paymentInfoAvailable,          // Whether payment information is available
        string memory officialWebsite,      // Official website of the RWA
        uint8 trustScore,                   // Trust score given to the RWA
        string memory comments,             // Additional comments from the evaluator
        uint256 timestamp                   // Time when the evaluation was submitted
    ) {
        // Retrieves the evaluation details from the evaluations array using the given index
        Evaluation memory eval = evaluations[index];
        return (
            eval.evaluatorAddress,
            eval.rwaTokenAddress,
            eval.totalValue,
            eval.paymentInfoAvailable,
            eval.officialWebsite,
            eval.trustScore,
            eval.comments,
            eval.timestamp
        );
    }
}
