var ERC223Token = artifacts.require("ERC223Token");


module.exports = function (deployer) {
    deployer.deploy(ERC223Token);
};
