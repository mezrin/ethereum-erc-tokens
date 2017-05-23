var ERC223TestToken = artifacts.require("ERC223TestToken");


contract('ERC223TestToken', function (accounts) {
    const tokenName          = 'Token Name';
    const tokenSymbol        = 'Token Symbol';
    const tokenDecimals      = 18;
    const tokenSupply        = Math.pow(10, 9);
    const tokenInitialHolder = accounts[0];

    it("Should test that contract can be deployed", function () {
        var testToken;
        ERC223TestToken.new(
            tokenName, tokenSymbol, tokenDecimals, tokenSupply * Math.pow(10, tokenDecimals), tokenInitialHolder,
            {from: tokenInitialHolder}
        ).then(function (instance) {
            testToken = instance;
            assert.ok(testToken.address);
            //
            // console.log("Contract created. Check it.");
            return testToken.name.call();
        }).then(function (response) {
            assert.equal(response, tokenName);
            return testToken.symbol.call();
        }).then(function (response) {
            assert.equal(response, tokenSymbol);
            return testToken.decimals.call();
        }).then(function (response) {
            assert.equal(response.toNumber(), tokenDecimals);
            return testToken.totalSupply.call();
        }).then(function (response) {
            assert.equal(response.toNumber(), tokenSupply * Math.pow(10, tokenDecimals));
            return testToken.balanceOf.call(tokenInitialHolder);
        }).then(function (response) {
            assert.equal(response.toNumber(), tokenSupply * Math.pow(10, tokenDecimals));
            // console.log("Contract created and checked.");
        });
    });

    it("Should test transmission of tokens", function () {
        const tokensReceiver = accounts[1];
        const amountToSend   = 100;

        var testToken;
        ERC223TestToken.new(
            tokenName, tokenSymbol, tokenDecimals, tokenSupply * Math.pow(10, tokenDecimals), tokenInitialHolder,
            {from: tokenInitialHolder}
        ).then(function (instance) {
            testToken = instance;
            assert.ok(testToken.address);
            //
            // console.log("Contract created. Check balances.");
            return testToken.balanceOf.call(tokenInitialHolder);
        }).then(function (response) {
            assert.equal(response.toNumber(), tokenSupply * Math.pow(10, tokenDecimals));
            return testToken.balanceOf.call(tokensReceiver);
        }).then(function (response) {
            assert.equal(response.toNumber(), 0);
            //
            // console.log("Do the test transfer");
            return testToken.transfer(tokensReceiver,
                                      amountToSend * Math.pow(10, tokenDecimals),
                                      {from: tokenInitialHolder});
        }).then(function () {
            return testToken.balanceOf.call(tokenInitialHolder);
        }).then(function (response) {
            assert.equal(response.toNumber(), (tokenSupply - amountToSend) * Math.pow(10, tokenDecimals));
            return testToken.balanceOf.call(tokensReceiver);
        }).then(function (response) {
            assert.equal(response.toNumber(), amountToSend * Math.pow(10, tokenDecimals));
            //
            // console.log("Check that over-spending is not possible");
            var isCaught = false;
            return testToken.transfer(tokensReceiver,
                                      tokenSupply * Math.pow(10, tokenDecimals),
                                      {from: tokenInitialHolder}
            ).catch(function () {isCaught = true;}
            ).then(function () {
                if (isCaught === false) {
                    throw new Error('Transfer of too big amount passed !!!');
                }
            });
        });
    });

    it("Should test allowances", function () {
        const tokensReceiver       = accounts[1];
        const tokensAllowedSpender = accounts[2];
        const amountToSend         = 100;

        var testToken;
        ERC223TestToken.new(
            tokenName, tokenSymbol, tokenDecimals, tokenSupply * Math.pow(10, tokenDecimals), tokenInitialHolder,
            {from: tokenInitialHolder}
        ).then(function (instance) {
            testToken = instance;
            assert.ok(testToken.address);
            //
            // console.log("Contract created. Check balances.");
            return testToken.balanceOf.call(tokenInitialHolder);
        }).then(function (response) {
            assert.equal(response.toNumber(), tokenSupply * Math.pow(10, tokenDecimals));
            return testToken.balanceOf.call(tokensReceiver);
        }).then(function (response) {
            assert.equal(response.toNumber(), 0);
            //
            // console.log("Allow to spend money");
            return testToken.approve(tokensAllowedSpender,
                                     amountToSend * Math.pow(10, tokenDecimals),
                                     {from: tokenInitialHolder});
        }).then(function () {
            return testToken.allowance.call(tokenInitialHolder, tokensAllowedSpender);
        }).then(function (response) {
            assert.equal(response.toNumber(), amountToSend * Math.pow(10, tokenDecimals));
            //
            // console.log("Do the test transfer");
            return testToken.transferFrom(tokenInitialHolder,
                                          tokensReceiver,
                                          amountToSend * Math.pow(10, tokenDecimals),
                                          {from: tokensAllowedSpender});
        }).then(function () {
            return testToken.allowance.call(tokenInitialHolder, tokensAllowedSpender);
        }).then(function (response) {
            assert.equal(response.toNumber(), 0);
            return testToken.balanceOf.call(tokenInitialHolder);
        }).then(function (response) {
            assert.equal(response.toNumber(), (tokenSupply - amountToSend) * Math.pow(10, tokenDecimals));
            return testToken.balanceOf.call(tokensReceiver);
        }).then(function (response) {
            assert.equal(response.toNumber(), amountToSend * Math.pow(10, tokenDecimals));
            //
            // console.log("Check that over-spending is not possible");
            var isCaught = false;
            return testToken.transferFrom(tokenInitialHolder,
                                          tokensReceiver,
                                          amountToSend * Math.pow(10, tokenDecimals),
                                          {from: tokensAllowedSpender}
            ).catch(function () {isCaught = true;}
            ).then(function () {
                if (isCaught === false) {
                    throw new Error('Transfer of not-allowed tokens passed !!!');
                }
            });
        });
    });

});
