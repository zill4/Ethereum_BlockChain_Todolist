pragma solidity ^0.5.0;

contract MindMap {

    //Neuron count applied globally.
    uint public neuronCount = 0;
    // A mind map contains a collection of Neuron's
    struct Neuron {
        uint id;
        // The url
        string content;
    }


    mapping(uint => Neuron) public neurons;

    // Neuron created event
    event NeuronCreated(
        uint id,
        string content
    );

    constructor() public {
        createNeuron("Initialized");
    }

    function createNeuron(string memory _content) public
    {
        neuronCount ++;
        neurons[neuronCount] = Neuron(neuronCount, _content);
        emit NeuronCreated(neuronCount, _content);
    }
}