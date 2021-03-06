var interest_earner_abi = JSON.parse($.getJSON({
    'url': "../js/interest_earner_abi.json",
    'async': false
}).responseText);
var erc20_abi = JSON.parse($.getJSON({
    'url': "../js/erc20_abi.json",
    'async': false
}).responseText);
var interest_earner_contract_address = JSON.parse($.getJSON({
    'url': "../js/interest_earner_contract_address.json",
    'async': false
}).responseText);
var erc20_contract_address = JSON.parse($.getJSON({
    'url': "../js/erc20_contract_address.json",
    'async': false
}).responseText);


function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

class Amounts {

    constructor() {
        this.timePeriod = new ethers.BigNumber.from('0');
        this.initialTimePeriod = new ethers.BigNumber.from('0');
        this.currentTime = new ethers.BigNumber.from('0');
        this.totalExpectedInterest = new ethers.BigNumber.from('0');
        this.totalStateStaked = new ethers.BigNumber.from('0');
        this.reservePool = new ethers.BigNumber.from('0');
        this.basisPoints = new ethers.BigNumber.from('0');
        this.userBalance = new ethers.BigNumber.from('0');
        this.userInterest = new ethers.BigNumber.from('0');
    }

    getTimePeriod() {
        return this.timePeriod;
    }

    getInitialTimePeriod() {
        return this.initialTimePeriod;
    }

    getCurrentTime() {
        return this.currentTime;
    }

    getReservePool() {
        return this.reservePool;
    }

    getTotalStateStaked() {
        return this.totalStateStaked;
    }

    getTotalExpectedInterest() {
        return this.totalExpectedInterest;
    }

    getBasisPoints() {
        return this.basisPoints;
    }

    getUserBalance() {
        return this.userBalance;
    }

    getUserInterest() {
        return this.userInterest;
    }

    setBasisPoints(_basisPoints) {
        this.basisPoints = _basisPoints;
    }

    setTotalExpectedInterest(_interestEarned) {
        this.totalExpectedInterest = _interestEarned;
    }

    setTotalStateStaked(_totalStateStaked) {
        this.totalStateStaked = _totalStateStaked;
    }

    setReservePool(_reservePool) {
        this.reservePool = _reservePool;
    }

    setTimePeriod(_timePeriod) {
        this.timePeriod = _timePeriod;
    }

    setInitialTimePeriod(_initialTimePeriod) {
        this.initialTimePeriod = _initialTimePeriod;
    }

    setCurrentTime(_currentTime) {
        this.currentTime = _currentTime;
    }

    setUserBalance(_userBalance) {
        this.userBalance = _userBalance;
    }

    setUserInterest(_userInterest) {
        this.userInterest = _userInterest;
    }

    reset() {
        this.timePeriod = new ethers.BigNumber.from('0');
        this.initialTimePeriod = new ethers.BigNumber.from('0');
        this.currentTime = new ethers.BigNumber.from('0');
        this.totalExpectedInterest = new ethers.BigNumber.from('0');
        this.totalStateStaked = new ethers.BigNumber.from('0');
        this.reservePool = new ethers.BigNumber.from('0');
        this.basisPoints = new ethers.BigNumber.from('0');
        this.userBalance = new ethers.BigNumber.from('0');
        this.userInterest = new ethers.BigNumber.from('0');
    }
}

var stakingAmounts = new Amounts();

var provider;
var signer;

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Page has loaded ...");
    window.ethereum.enable();
    connectWallet().then(() => {
        console.log("Wallet connected in page load section");
    });
    jQuery('.hover-tipso-tooltip').tipso({
        tooltipHover: true
    });
});

async function connectWallet() {

    window.ethereum.enable();
    console.log('Called connect wallet which is inside helper.js');
    provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider);
    signer = provider.getSigner();
    console.log(signer);
    var addressOfSigner;
    try {
        addressOfSigner = await signer.getAddress();
    } catch (err) {
        var toastResponse = JSON.stringify({
            avatar: "../images/favicon.ico",
            text: "Please open & sign in to your wallet software first",
            duration: 10000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #FF6600, #FFA500)",
            stopOnFocus: false, // Prevents dismissing of toast on hover
            onClick: function() {} // Callback after click
        });
        var toastObject = JSON.parse(toastResponse);
        Toastify(toastObject).showToast();
    }
    if (addressOfSigner) {
        console.log("Address of signer: " + addressOfSigner);
        document.getElementById("eth_address").value = addressOfSigner;
        document.getElementById("connect_wallet_text").style.color = "#40d9ff";
        document.getElementById("connect_wallet_text").innerHTML = "Wallet Connected ???";
    }
}

async function onButtonClickUnLock() {

    // UI mods
    document.getElementById("pb").style.width = '0%';
    console.log("Disabling button");
    document.getElementById("button_unlock_tokens").disabled = true;
    document.getElementById("button_restake_tokens").disabled = true;
    document.getElementById("pb").style.transition = "all 30s linear 0s";
    document.getElementById("pb").style.width = '80%';
    // Provider
    window.ethereum.enable()
    provider = new ethers.providers.Web3Provider(window.ethereum);

    // Signer
    signer = provider.getSigner();
    console.log(signer);

    // Instantiate staking timelock contract
    stakingTimeLockContract = await new ethers.Contract(interest_earner_contract_address.address, interest_earner_abi, signer);
    // Init toast response
    var toastResponse;

    eth_address = document.getElementById('eth_address').value;
    var pattern = /0x[a-fA-F0-9]{40}/;
    var resultRegex = pattern.exec(eth_address);
    if (resultRegex != null) {

        var recipientAddress = resultRegex[0];

        // Current time
        var currentBlock = await provider.getBlock("latest");
        currentTime = currentBlock.timestamp;
        currentTimeBN = new ethers.BigNumber.from(currentTime);
        stakingAmounts.setCurrentTime(currentTimeBN);
        console.log("Current time: " + stakingAmounts.getCurrentTime());

        // Lock duration
        timePeriodTimestamp = await stakingTimeLockContract.timePeriod();
        timePeriodTimestampBN = new ethers.BigNumber.from(timePeriodTimestamp);
        stakingAmounts.setTimePeriod(timePeriodTimestampBN);

        // Check to see if time period has ended already (which means owner must unstake all, in order to re-stake for another round)
        // Timeperiod edge timestamp
        initialTimePeriodTimestamp = await stakingTimeLockContract.initialStakingTimestamp(recipientAddress);
        initialTimePeriodTimestampBN = new ethers.BigNumber.from(initialTimePeriodTimestamp);
        stakingAmounts.setInitialTimePeriod(initialTimePeriodTimestampBN);


        if (stakingAmounts.getInitialTimePeriod() != 0 && stakingAmounts.getCurrentTime() > stakingAmounts.getTimePeriod().add(stakingAmounts.getInitialTimePeriod())) {
            var toastResponse = JSON.stringify({
                avatar: "../images/favicon.ico",
                text: "Un-staking & withdrawing interest earned, please wait",
                duration: 10000,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "left", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                stopOnFocus: false, // Prevents dismissing of toast on hover
                onClick: function() {} // Callback after click
            });
            var toastObject = JSON.parse(toastResponse);
            Toastify(toastObject).showToast();
            // Now we can go ahead and unstake the tokens
            stakingTimeLockContract.unstakeAllTokensAndWithdrawInterestEarned(erc20_contract_address.address).then((unlockResponse) => {
                unlockResponse.wait().then((unlockResponse01) => {
                    var toastResponse = JSON.stringify({
                        avatar: "../images/favicon.ico",
                        text: "Congratulations, tokens un-staked & interest withdrawn!",
                        duration: 10000,
                        newWindow: true,
                        close: true,
                        gravity: "top", // `top` or `bottom`
                        position: "left", // `left`, `center` or `right`
                        backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                        stopOnFocus: false, // Prevents dismissing of toast on hover
                        onClick: function() {} // Callback after click
                    });
                    var toastObject = JSON.parse(toastResponse);
                    Toastify(toastObject).showToast();
                    // UI mods
                    sleep(1000).then(() => {
                        document.getElementById("pb").style.transition = "all 0.1s linear 0s";
                        document.getElementById("pb").style.width = '100%';
                        document.getElementById("pb").classList.remove("progress-bar-animated");
                        document.getElementById("button_unlock_tokens").disabled = false;
                        document.getElementById("button_restake_tokens").disabled = false;
                        document.getElementById("pb").style.width = '0%';
                    });
                });
            });

        } else {
            var toastResponse = JSON.stringify({
                avatar: "../images/favicon.ico",
                text: "This round is still active, please try again later",
                duration: 10000,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #FF6600, #FFA500)",
                stopOnFocus: false, // Prevents dismissing of toast on hover
                onClick: function() {} // Callback after click
            });
            var toastObject = JSON.parse(toastResponse);
            Toastify(toastObject).showToast();
        }


    } else {
        var toastResponse = JSON.stringify({
            avatar: "../images/favicon.ico",
            text: "Not a valid Ethereum address!",
            duration: 10000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #FF6600, #FFA500)",
            stopOnFocus: false, // Prevents dismissing of toast on hover
            onClick: function() {} // Callback after click
        });
        var toastObject = JSON.parse(toastResponse);
        Toastify(toastObject).showToast();
    }

    sleep(1000).then(() => {
        document.getElementById("pb").style.transition = "all 0.1s linear 0s";
        document.getElementById("pb").style.width = '100%';
        document.getElementById("pb").classList.remove("progress-bar-animated");
        document.getElementById("button_unlock_tokens").disabled = false;
        document.getElementById("button_restake_tokens").disabled = false;
        document.getElementById("pb").style.width = '0%';
    });
}

async function onButtonClickReStakeAll() {
    stakingAmounts.reset();
    // UI mods
    document.getElementById("pb").style.width = '0%';
    console.log("Disabling button");
    document.getElementById("button_unlock_tokens").disabled = true;
    document.getElementById("button_restake_tokens").disabled = true;
    document.getElementById("pb").style.transition = "all 30s linear 0s";
    document.getElementById("pb").style.width = '80%';
    // Provider
    window.ethereum.enable()
    provider = new ethers.providers.Web3Provider(window.ethereum);

    // Signer
    signer = provider.getSigner();
    console.log(signer);

    // Instantiate staking timelock contract
    stakingTimeLockContract = await new ethers.Contract(interest_earner_contract_address.address, interest_earner_abi, signer);
    // Instantiate ERC20 so we can check balances - provider only
    erc20TimeLockContract = new ethers.Contract(erc20_contract_address.address, erc20_abi, provider);
    // Init toast response
    var toastResponse;

    eth_address = document.getElementById('eth_address').value;
    var pattern = /0x[a-fA-F0-9]{40}/;
    var resultRegex = pattern.exec(eth_address);
    if (resultRegex != null) {

        var recipientAddress = resultRegex[0];

        // Current time
        var currentBlock = await provider.getBlock("latest");
        currentTime = currentBlock.timestamp;
        currentTimeBN = new ethers.BigNumber.from(currentTime);
        stakingAmounts.setCurrentTime(currentTimeBN);
        console.log("Current time: " + stakingAmounts.getCurrentTime());

        // Lock duration
        timePeriodTimestamp = await stakingTimeLockContract.timePeriod();
        timePeriodTimestampBN = new ethers.BigNumber.from(timePeriodTimestamp);
        stakingAmounts.setTimePeriod(timePeriodTimestampBN);

        // Check to see if time period has ended already (which means owner must unstake all, in order to re-stake for another round)
        // Timeperiod edge timestamp
        initialTimePeriodTimestamp = await stakingTimeLockContract.initialStakingTimestamp(recipientAddress);
        initialTimePeriodTimestampBN = new ethers.BigNumber.from(initialTimePeriodTimestamp);
        stakingAmounts.setInitialTimePeriod(initialTimePeriodTimestampBN);

        // Ensure that the contract has enough reserve pool for this user to proceed
        // Staked State
        totalStakedState = await stakingTimeLockContract.totalStateStaked();
        totalStakedStateBN = new ethers.BigNumber.from(totalStakedState);
        stakingAmounts.setTotalStateStaked(totalStakedStateBN);

        // Interest earned by all
        totalExpectedInterest = await stakingTimeLockContract.totalExpectedInterest();
        totalExpectedInterestBN = new ethers.BigNumber.from(totalExpectedInterest);
        stakingAmounts.setTotalExpectedInterest(totalExpectedInterestBN);

        // How many ERC20 tokens does this smart contract have in the original ERC20 contract?
        reservePool = await erc20TimeLockContract.balanceOf(interest_earner_contract_address.address);
        reservePoolBN = new ethers.BigNumber.from(reservePool);
        stakingAmounts.setReservePool(reservePoolBN);

        // Basis points
        basisPoints = await stakingTimeLockContract.percentageBasisPoints();
        basisPointsBN = new ethers.BigNumber.from(basisPoints);
        stakingAmounts.setBasisPoints(basisPointsBN);

        // Calculate how much interest the reserve needs to hold
        stakingTimeLockContract.balances(recipientAddress).then((balanceResponse) => {
            userBalanceBN = new ethers.BigNumber.from(balanceResponse);
            stakingAmounts.setUserBalance(userBalanceBN);

            stakingTimeLockContract.expectedInterest(recipientAddress).then((interestResponse) => {
                userInterestBN = new ethers.BigNumber.from(interestResponse);
                stakingAmounts.setUserInterest(userInterestBN);

                var preCalcAmountToReInvest = stakingAmounts.getUserBalance().add(stakingAmounts.getUserInterest());
                var preInterest = preCalcAmountToReInvest.mul(stakingAmounts.getBasisPoints());

                var postInterest = preInterest.div(10000);
                var weiPerSecond = postInterest.div(31536000);
                var releaseEpoch;
                console.log("Initial time period: " + stakingAmounts.getInitialTimePeriod());
                console.log("Time period: " + stakingAmounts.getTimePeriod());
                // This is a restake at the beginning of a new term so seconds remaining is the whole stakingAmounts.getTimePeriod();
                var secondsRemaining = stakingAmounts.getTimePeriod();
                var interestEaredForThisStake = weiPerSecond.mul(secondsRemaining);
                console.log(stakingAmounts.getTotalStateStaked().toString());
                console.log(stakingAmounts.getTotalExpectedInterest().toString());
                console.log(interestEaredForThisStake.toString());
                console.log(stakingAmounts.getReservePool().toString());
                if (stakingAmounts.getInitialTimePeriod().eq(0)) {
                    var toastResponse = JSON.stringify({
                        avatar: "../images/favicon.ico",
                        text: "No tokens staked at present",
                        duration: 10000,
                        newWindow: true,
                        close: true,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        backgroundColor: "linear-gradient(to right, #FF6600, #FFA500)",
                        stopOnFocus: false, // Prevents dismissing of toast on hover
                        onClick: function() {} // Callback after click
                    });
                    var toastObject = JSON.parse(toastResponse);
                    Toastify(toastObject).showToast();
                    sleep(1000).then(() => {
                        document.getElementById("pb").style.transition = "all 0.1s linear 0s";
                        document.getElementById("pb").style.width = '100%';
                        document.getElementById("pb").classList.remove("progress-bar-animated");
                        document.getElementById("button_unlock_tokens").disabled = false;
                        document.getElementById("button_restake_tokens").disabled = false;
                        document.getElementById("pb").style.width = '0%';
                    });
                } else {

                    if (stakingAmounts.getInitialTimePeriod() != 0 && stakingAmounts.getCurrentTime() > stakingAmounts.getTimePeriod().add(stakingAmounts.getInitialTimePeriod())) {
                        var toastResponse = JSON.stringify({
                            avatar: "../images/favicon.ico",
                            text: "Re-staking BOTH principle and interest for another round, please wait",
                            duration: 10000,
                            newWindow: true,
                            close: true,
                            gravity: "top", // `top` or `bottom`
                            position: "left", // `left`, `center` or `right`
                            backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                            stopOnFocus: false, // Prevents dismissing of toast on hover
                            onClick: function() {} // Callback after click
                        });
                        var toastObject = JSON.parse(toastResponse);
                        Toastify(toastObject).showToast();
                        // Now we can go ahead and unstake the tokens
                        if (stakingAmounts.getTotalStateStaked().add(stakingAmounts.getTotalExpectedInterest()).add(interestEaredForThisStake).lte(stakingAmounts.getReservePool())) {
                            // Call re-stake
                            stakingTimeLockContract.reinvestAlreadyStakedTokensAndInterestEarned(erc20_contract_address.address).then((unlockResponse) => {
                                unlockResponse.wait().then((unlockResponse01) => {
                                    var toastResponse = JSON.stringify({
                                        avatar: "../images/favicon.ico",
                                        text: "Congratulations, tokens Re-staked",
                                        duration: 10000,
                                        newWindow: true,
                                        close: true,
                                        gravity: "top", // `top` or `bottom`
                                        position: "left", // `left`, `center` or `right`
                                        backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                                        stopOnFocus: false, // Prevents dismissing of toast on hover
                                        onClick: function() {} // Callback after click
                                    });
                                    var toastObject = JSON.parse(toastResponse);
                                    Toastify(toastObject).showToast();
                                    // UI mods
                                    sleep(1000).then(() => {
                                        document.getElementById("pb").style.transition = "all 0.1s linear 0s";
                                        document.getElementById("pb").style.width = '100%';
                                        document.getElementById("pb").classList.remove("progress-bar-animated");
                                        document.getElementById("button_unlock_tokens").disabled = false;
                                        document.getElementById("button_restake_tokens").disabled = false;
                                        document.getElementById("pb").style.width = '0%';
                                    });
                                });
                            });
                        } else {
                            var toastResponse = JSON.stringify({
                                avatar: "../images/favicon.ico",
                                text: "Not enough STATE tokens in the reserve pool, to facilitate this restake, please contact owner of this contract ",
                                duration: 10000,
                                newWindow: true,
                                close: true,
                                gravity: "top", // `top` or `bottom`
                                position: "right", // `left`, `center` or `right`
                                backgroundColor: "linear-gradient(to right, #FF6600, #FFA500)",
                                stopOnFocus: false, // Prevents dismissing of toast on hover
                                onClick: function() {} // Callback after click
                            });
                            var toastObject = JSON.parse(toastResponse);
                            Toastify(toastObject).showToast();
                            // UI mods
                            sleep(1000).then(() => {
                                document.getElementById("pb").style.transition = "all 0.1s linear 0s";
                                document.getElementById("pb").style.width = '100%';
                                document.getElementById("pb").classList.remove("progress-bar-animated");
                                document.getElementById("button_unlock_tokens").disabled = false;
                                document.getElementById("button_restake_tokens").disabled = false;
                                document.getElementById("pb").style.width = '0%';
                            });
                        }

                    } else {
                        var toastResponse = JSON.stringify({
                            avatar: "../images/favicon.ico",
                            text: "This round is still active, please try again later",
                            duration: 10000,
                            newWindow: true,
                            close: true,
                            gravity: "top", // `top` or `bottom`
                            position: "right", // `left`, `center` or `right`
                            backgroundColor: "linear-gradient(to right, #FF6600, #FFA500)",
                            stopOnFocus: false, // Prevents dismissing of toast on hover
                            onClick: function() {} // Callback after click
                        });
                        var toastObject = JSON.parse(toastResponse);
                        Toastify(toastObject).showToast();
                        sleep(1000).then(() => {
                            document.getElementById("pb").style.transition = "all 0.1s linear 0s";
                            document.getElementById("pb").style.width = '100%';
                            document.getElementById("pb").classList.remove("progress-bar-animated");
                            document.getElementById("button_unlock_tokens").disabled = false;
                            document.getElementById("button_restake_tokens").disabled = false;
                            document.getElementById("pb").style.width = '0%';
                        });
                    }
                }
            });
        });
    } else {
        var toastResponse = JSON.stringify({
            avatar: "../images/favicon.ico",
            text: "Not a valid Ethereum address!",
            duration: 10000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #FF6600, #FFA500)",
            stopOnFocus: false, // Prevents dismissing of toast on hover
            onClick: function() {} // Callback after click
        });
        var toastObject = JSON.parse(toastResponse);
        Toastify(toastObject).showToast();
    }

    sleep(1000).then(() => {
        document.getElementById("pb").style.transition = "all 0.1s linear 0s";
        document.getElementById("pb").style.width = '100%';
        document.getElementById("pb").classList.remove("progress-bar-animated");
        document.getElementById("button_unlock_tokens").disabled = false;
        document.getElementById("button_restake_tokens").disabled = false;
        document.getElementById("pb").style.width = '0%';
    });
}