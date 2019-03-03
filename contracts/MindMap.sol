pragma solidity ^0.5.0;

contract MindMap {

    //Neuron count applied globally.
    uint public neuronCount = 0;
    // A mind map contains a collection of Neuron's
    struct Neuron {
        uint id;
    // The content of each Neuron
        // The url
        string url;
    }

    mapping(uint => Neuron) public neurons;

    // Neuron created event
    event NeuronCreated(
        uint id,
        string url
    );

    function createNeuron(string memory _url) public
    {
        neuronCount ++;
        neurons[neuronCount] = Neuron(neuronCount, _url);
        emit NeuronCreated(neuronCount, _url);
    }
}