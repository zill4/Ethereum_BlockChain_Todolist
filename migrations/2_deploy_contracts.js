const MindMap = artifacts.require("./MindMap.sol");

module.exports = function(deployer) {
    deployer.deploy(MindMap);
};