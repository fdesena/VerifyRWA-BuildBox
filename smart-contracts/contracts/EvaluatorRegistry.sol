// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EvaluatorRegistry {
    // Declares a public variable 'owner' that stores the address of the contract owner
    address public owner;

    // Defines a struct 'Evaluator' to hold details about each evaluator
    struct Evaluator {
        address evaluatorAddress;  // The address of the evaluator
        string name;               // The name of the evaluator
        string email;              // The email of the evaluator
        bool isRegistered;         // Boolean to track whether the evaluator is registered or not
    }

    // A mapping to store the evaluators, where the key is the evaluator's address and the value is the Evaluator struct
    mapping(address => Evaluator) public evaluators;

    // Event to log when an evaluator is registered
    event EvaluatorRegistered(address indexed evaluatorAddress, string name, string email);
    
    // Event to log when an evaluator is deregistered
    event EvaluatorDeregistered(address indexed evaluatorAddress);

    // Modifier 'onlyOwner' ensures that only the contract owner can call certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _; // This is a placeholder for the function body that will use the modifier
    }

    // Constructor function, which sets the owner of the contract to the address that deployed the contract
    constructor() {
        owner = msg.sender;
    }

    // Function to register a new evaluator
    // Takes in the evaluator's name and email as parameters
    function registerEvaluator(string memory _name, string memory _email) public {
        // Ensures that the evaluator is not already registered
        require(!evaluators[msg.sender].isRegistered, "Evaluator already registered!");

        // Adds the new evaluator's details to the mapping
        evaluators[msg.sender] = Evaluator({
            evaluatorAddress: msg.sender,
            name: _name,
            email: _email,
            isRegistered: true
        });

        // Emits an event to notify that an evaluator has been registered
        emit EvaluatorRegistered(msg.sender, _name, _email);
    }

    // Function to deregister an evaluator
    // Can only be called by the evaluator themselves
    function deregisterEvaluator() public {
        // Ensures that the evaluator is already registered before allowing deregistration
        require(evaluators[msg.sender].isRegistered, "Evaluator not registered!");

        // Deletes the evaluator's details from the mapping
        delete evaluators[msg.sender];

        // Emits an event to notify that an evaluator has been deregistered
        emit EvaluatorDeregistered(msg.sender);
    }

    // Function to check if a given address is registered as an evaluator
    // Returns a boolean indicating the registration status
    function isEvaluatorRegistered(address _evaluatorAddress) public view returns (bool) {
        return evaluators[_evaluatorAddress].isRegistered;
    }

    // Function to retrieve the details of an evaluator using their address
    // Returns the Evaluator struct containing the evaluator's details
    function getEvaluator(address _evaluatorAddress) public view returns (Evaluator memory) {
        return evaluators[_evaluatorAddress];
    }
}
