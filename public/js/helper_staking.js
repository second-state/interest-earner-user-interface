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
        this.locked = new ethers.BigNumber.from('0');
        this.unlocked = new ethers.BigNumber.from('0');
        this.interestEarned = new ethers.BigNumber.from('0');
        this.timePeriod = new ethers.BigNumber.from('0');
        this.basisPoints = new ethers.BigNumber.from('0');
        this.initialTimePeriod = new ethers.BigNumber.from('0');
        this.currentTime = new ethers.BigNumber.from('0');
        this.totalStateStaked = new ethers.BigNumber.from('0');
        this.reservePool = new ethers.BigNumber.from('0');
        this.totalExpectedInterest = new ethers.BigNumber.from('0');
    }

    getLocked() {
        return this.locked;
    }

    getUnlocked() {
        return this.unlocked;
    }

    getInterestEarned() {
        return this.interestEarned;
    }

    getTimePeriod() {
        return this.timePeriod;
    }

    getBasisPoints() {
        return this.basisPoints;
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

    getInitialTimePeriod() {
        return this.initialTimePeriod;
    }

    getCurrentTime() {
        return this.currentTime;
    }

    setTotalExpectedInterest(_interestEarned) {
        this.totalExpectedInterest = this.totalExpectedInterest.add(_interestEarned);
    }

    setTotalStateStaked(_totalStateStaked) {
        this.totalStateStaked = _totalStateStaked;
    }

    setReservePool(_reservePool) {
        this.reservePool = _reservePool;
    }

    setLocked(_locked) {
        this.locked = this.locked.add(_locked);
    }

    setUnlocked(_unlocked) {
        this.unlocked = this.unlocked.add(_unlocked);
    }

    setInterestEarned(_interestEarned) {
        this.interestEarned = this.interestEarned.add(_interestEarned);
    }

    setTimePeriod(_timePeriod) {
        this.timePeriod = _timePeriod;
    }

    setBasisPoints(_basisPoints) {
        this.basisPoints = _basisPoints;
    }

    setInitialTimePeriod(_initialTimePeriod) {
        this.initialTimePeriod = _initialTimePeriod;
    }

    setCurrentTime(_currentTime) {
        this.currentTime = _currentTime;
    }

    reset() {
        this.locked = new ethers.BigNumber.from('0');
        this.unlocked = new ethers.BigNumber.from('0');
        this.interestEarned = new ethers.BigNumber.from('0');
        this.timePeriod = new ethers.BigNumber.from('0');
        this.basisPoints = new ethers.BigNumber.from('0');
        this.initialTimePeriod = new ethers.BigNumber.from('0');
        this.currentTime = new ethers.BigNumber.from('0');
        this.totalStateStaked = new ethers.BigNumber.from('0');
        this.reservePool = new ethers.BigNumber.from('0');
        this.totalExpectedInterest = new ethers.BigNumber.from('0');
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
    stakingAmounts.reset();
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
        document.getElementById("connect_wallet_text").innerHTML = "Wallet Connected ✔";
    }
}


async function onButtonClickLock() {
    stakingAmounts.reset();

    // UI mods
    document.getElementById("pb").style.width = '0%';
    console.log("Disabling button");
    document.getElementById("button_lock_tokens").disabled = true;
    document.getElementById("pb").style.transition = "all 30s linear 0s";
    document.getElementById("pb").style.width = '80%';

    // Provider
    window.ethereum.enable()
    provider = new ethers.providers.Web3Provider(window.ethereum);

    // Current time
    var currentBlock = await provider.getBlock("latest");
    currentTime = currentBlock.timestamp;
    currentTimeBN = new ethers.BigNumber.from(currentTime);
    stakingAmounts.setCurrentTime(currentTimeBN);
    console.log("Current time: " + stakingAmounts.getCurrentTime());

    // Signer
    signer = provider.getSigner();
    console.log(signer);

    // Instantiate staking timelock contract
    stakingTimeLockContract = await new ethers.Contract(interest_earner_contract_address.address, interest_earner_abi, signer);
    // Instantiate ERC20 contract
    erc20TimeLockContract = new ethers.Contract(erc20_contract_address.address, erc20_abi, signer);

    // Init toast response
    var toastResponse;

    // Amount to unlock
    state_amount = document.getElementById('amount').value;

    // Ensure that state amount is a real number, if not then we skip everything and send a toast message 
    try {
        stateAmountInWei = new ethers.BigNumber.from(state_amount);
        console.log("Big Number: " + stateAmountInWei);
    } catch (err) {
        sleep(1000).then(() => {
            document.getElementById("pb").style.transition = "all 1s linear 0s";
            document.getElementById("pb").style.width = '100%';
            document.getElementById("pb").classList.remove("progress-bar-animated");
            document.getElementById("button_lock_tokens").disabled = false;
            document.getElementById("pb").style.width = '0%';
        });
        var toastResponse = JSON.stringify({
            avatar: "../images/favicon.ico",
            text: "Token amount is not a valid number!",
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
        console.log("Token amount is not a valid number");
        sleep(1000).then(() => {
            document.getElementById("pb").style.transition = "all 1s linear 0s";
            document.getElementById("pb").style.width = '100%';
            document.getElementById("pb").classList.remove("progress-bar-animated");
            document.getElementById("button_lock_tokens").disabled = false;
            document.getElementById("pb").style.width = '0%';
        });
        throw "exit";
    }
    if (stateAmountInWei > 0) {
        if (stateAmountInWei > 315360000000 && stateAmountInWei < 11579208923731619542357098500868790785326998466564056403945758400791312963) {
            
/* TODO START
Add setTotalStateStaked, setTotalExpectedInterest, setReservePool
Perform the whole calculation here in the UI which will pre-detect whether the contract has enough reserve to proceed


//// Solidity
Essentially want to copy the following logic from Solidity and port that to JS below using the stakingAmounts class

        uint256 interestEarnedPerAnnum_pre = amount.mul(percentageBasisPoints);
        // We use basis points so that Ethereum's uint256 (which does not have decimals) can have percentages of 0.01% increments. The following line caters for the basis points offset
        uint256 interestEarnedPerAnnum_post = interestEarnedPerAnnum_pre.div(10000);
        // Let's calculate how many wei are earned per second
        uint256 weiPerSecond = interestEarnedPerAnnum_post.div(31536000);
        require(weiPerSecond > 0, "Interest on this amount is too low to calculate, please try a greater amount");
        // Let's calculate the release date
        uint256 releaseEpoch = initialStakingTimestamp[msg.sender].add(timePeriod);
        // Let's fragment the interest earned per annum down to the remaining time left on this staking round
        uint256 secondsRemaining = releaseEpoch.sub(block.timestamp);
        // We must ensure that there is a quantifiable amount of time remaining (so we can calculate some interest; albeit proportional)
        require(secondsRemaining > 0, "There is not enough time left to stake for this current round");
        // There are 31536000 seconds per annum, so let's calculate the interest for this remaining time period
        uint256 interestEarnedForThisStake = weiPerSecond.mul(secondsRemaining);
        // Make sure that contract's reserve pool has enough to service this transaction. I.e. there is enough STATE in this contract to pay this user's interest (not including/counting any previous end user's staked STATE or interest which they will eventually take as a pay out)
        require(token.balanceOf(address(this)) >= totalStateStaked.add(totalExpectedInterest).add(interestEarnedForThisStake), "Not enough STATE tokens in the reserve pool, please contact owner of this contract");

//// Javascript equivalent
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

            if(stakingAmounts.getTotalStateStaked().add(stakingAmounts.getTotalExpectedInterest()))
TODO END
*/

            eth_address = document.getElementById('eth_address').value;
            console.log(eth_address);
            var pattern = /0x[a-fA-F0-9]{40}/;
            var resultRegex = pattern.exec(eth_address);
            if (resultRegex != null) {
                var recipientAddress = resultRegex[0];

                // Check to see if time period has ended already (which means owner must unstake all, in order to re-stake for another round)
                // Timeperiod edge timestamp
                initialTimePeriodTimestamp = await stakingTimeLockContract.initialStakingTimestamp(recipientAddress);
                initialTimePeriodTimestampBN = new ethers.BigNumber.from(initialTimePeriodTimestamp);
                stakingAmounts.setInitialTimePeriod(initialTimePeriodTimestampBN);

                // Lock duration
                timePeriodTimestamp = await stakingTimeLockContract.timePeriod();
                timePeriodTimestampBN = new ethers.BigNumber.from(timePeriodTimestamp);
                stakingAmounts.setTimePeriod(timePeriodTimestampBN);

                if (stakingAmounts.getInitialTimePeriod() == 0 || stakingAmounts.getCurrentTime() < stakingAmounts.getTimePeriod().add(stakingAmounts.getInitialTimePeriod())) {

                    // Check user ERC20 balance in ERC20 contract
                    erc20Balance = await erc20TimeLockContract.balanceOf(resultRegex[0]);
                    erc20BalanceBN = new ethers.BigNumber.from(erc20Balance);
                    console.log("User's balance: " + erc20Balance);

                    // Check to see if user has enough tokens to stake
                    if (stateAmountInWei.lte(erc20BalanceBN)) {
                        console.log("User's balance is sufficient");
                        // Check allowance i.e. has this user approved the staking contract to transferFrom?
                        erc20TimeLockContract.allowance(resultRegex[0], interest_earner_contract_address.address).then((allowanceResponse00) => {
                            erc20ApprovalBalanceBN = new ethers.BigNumber.from(allowanceResponse00);

                            // Set approval to zero first (in the event that we need to increase the approved amount for this upcoming transaction)
                            // First create a zero BN
                            erc20ZeroValueBN = new ethers.BigNumber.from("0");
                            if (erc20ApprovalBalanceBN.eq(erc20ZeroValueBN)) {
                                var toastResponseApprove = JSON.stringify({
                                    avatar: "../images/favicon.ico",
                                    text: "Staking contract approval is required, please approve.",
                                    duration: 10000,
                                    newWindow: true,
                                    close: true,
                                    gravity: "top", // `top` or `bottom`
                                    position: "left", // `left`, `center` or `right`
                                    backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                                    stopOnFocus: false, // Prevents dismissing of toast on hover
                                    onClick: function() {} // Callback after click
                                });
                                var toastObject = JSON.parse(toastResponseApprove);
                                Toastify(toastObject).showToast();
                                erc20TimeLockContract.approve(interest_earner_contract_address.address, stateAmountInWei).then((approveResponse00) => {
                                    var toastResponseApprove0 = JSON.stringify({
                                        avatar: "../images/favicon.ico",
                                        text: "Waiting for transaction confirmation",
                                        duration: 10000,
                                        newWindow: true,
                                        close: true,
                                        gravity: "top", // `top` or `bottom`
                                        position: "left", // `left`, `center` or `right`
                                        backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                                        stopOnFocus: false, // Prevents dismissing of toast on hover
                                        onClick: function() {} // Callback after click
                                    });
                                    var toastObject = JSON.parse(toastResponseApprove0);
                                    Toastify(toastObject).showToast();
                                    // Wait for transaction to complete
                                    console.log("Waiting for receipt in relation to setting approval from zero to " + stateAmountInWei);
                                    console.log(approveResponse00);
                                    console.log("Receipt delivered!");
                                    approveResponse00.wait().then((approveResponse01) => {
                                        var toastResponseApprove01 = JSON.stringify({
                                            avatar: "../images/favicon.ico",
                                            text: "Approval granted!",
                                            duration: 10000,
                                            newWindow: true,
                                            close: true,
                                            gravity: "top", // `top` or `bottom`
                                            position: "left", // `left`, `center` or `right`
                                            backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                                            stopOnFocus: false, // Prevents dismissing of toast on hover
                                            onClick: function() {} // Callback after click
                                        });
                                        var toastObject = JSON.parse(toastResponseApprove01);
                                        Toastify(toastObject).showToast();
                                        console.log("Confirmed!!!");
                                        // Now go ahead and stake the tokens
                                        console.log("Locking tokens, please wait ...");
                                        stakingTimeLockContract.stakeTokens(erc20_contract_address.address, stateAmountInWei).then((approveResponse02) => {
                                            var toastResponse = JSON.stringify({
                                                avatar: "../images/favicon.ico",
                                                text: "Waiting for transaction confirmation",
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
                                            console.log("Waiting for staking transaction to be confirmed");
                                            approveResponse02.wait().then((approveResponse03) => {
                                                var toastResponseApprove02 = JSON.stringify({
                                                    avatar: "../images/favicon.ico",
                                                    text: "Congratulations, tokens are staked.",
                                                    duration: 10000,
                                                    newWindow: true,
                                                    close: true,
                                                    gravity: "top", // `top` or `bottom`
                                                    position: "left", // `left`, `center` or `right`
                                                    backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                                                    stopOnFocus: false, // Prevents dismissing of toast on hover
                                                    onClick: function() {} // Callback after click
                                                });
                                                var toastObject = JSON.parse(toastResponseApprove02);
                                                Toastify(toastObject).showToast();
                                                // Automatically update balances
                                                stakingAmounts.reset();
                                                // UI mods
                                                sleep(1000).then(() => {
                                                    document.getElementById("pb").style.transition = "all 0.1s linear 0s";
                                                    document.getElementById("pb").style.width = '100%';
                                                    document.getElementById("pb").classList.remove("progress-bar-animated");
                                                    document.getElementById("button_unlock_tokens").disabled = false;
                                                    document.getElementById("pb").style.width = '0%';
                                                });
                                            });
                                        });
                                    });
                                });

                            } else if (erc20ApprovalBalanceBN.gt(erc20ZeroValueBN) && erc20ApprovalBalanceBN.lt(stateAmountInWei)) {
                                // Setting approval to zero before increasing
                                var toastResponseApprove2 = JSON.stringify({
                                    avatar: "../images/favicon.ico",
                                    text: "Setting approval to zero first, this will just take a minute",
                                    duration: 10000,
                                    newWindow: true,
                                    close: true,
                                    gravity: "top", // `top` or `bottom`
                                    position: "left", // `left`, `center` or `right`
                                    backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                                    stopOnFocus: false, // Prevents dismissing of toast on hover
                                    onClick: function() {} // Callback after click
                                });
                                var toastObject = JSON.parse(toastResponseApprove2);
                                Toastify(toastObject).showToast();
                                erc20TimeLockContract.approve(interest_earner_contract_address.address, erc20ZeroValueBN).then((approveResponse04) => {
                                    approveResponse04.wait().then((approveResponse05) => {
                                        // Now we can go ahead and set the approval amount to the correct amount for this specific transaction
                                        var toastResponseApprove3 = JSON.stringify({
                                            avatar: "../images/favicon.ico",
                                            text: "Setting approval to " + stateAmountInWei + " please approve",
                                            duration: 10000,
                                            newWindow: true,
                                            close: true,
                                            gravity: "top", // `top` or `bottom`
                                            position: "left", // `left`, `center` or `right`
                                            backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                                            stopOnFocus: false, // Prevents dismissing of toast on hover
                                            onClick: function() {} // Callback after click
                                        });
                                        var toastObject = JSON.parse(toastResponseApprove3);
                                        Toastify(toastObject).showToast();
                                        erc20TimeLockContract.approve(interest_earner_contract_address.address, stateAmountInWei).then((approveResponse06) => {
                                            approveResponse06.wait().then((approveResponse07) => {
                                                var toastResponseStake = JSON.stringify({
                                                    avatar: "../images/favicon.ico",
                                                    text: "Staking " + stateAmountInWei + ", please approve",
                                                    duration: 10000,
                                                    newWindow: true,
                                                    close: true,
                                                    gravity: "top", // `top` or `bottom`
                                                    position: "left", // `left`, `center` or `right`
                                                    backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                                                    stopOnFocus: false, // Prevents dismissing of toast on hover
                                                    onClick: function() {} // Callback after click
                                                });
                                                var toastObject = JSON.parse(toastResponseStake);
                                                Toastify(toastObject).showToast();
                                                stakingTimeLockContract.stakeTokens(erc20_contract_address.address, stateAmountInWei).then((approveResponse08) => {
                                                    approveResponse08.wait().then((approveResponse09) => {
                                                        // Automatically update balances
                                                        stakingAmounts.reset();
                                                        var toastResponseStake2 = JSON.stringify({
                                                            avatar: "../images/favicon.ico",
                                                            text: "Congratulations, tokens are staked.",
                                                            duration: 10000,
                                                            newWindow: true,
                                                            close: true,
                                                            gravity: "top", // `top` or `bottom`
                                                            position: "left", // `left`, `center` or `right`
                                                            backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                                                            stopOnFocus: false, // Prevents dismissing of toast on hover
                                                            onClick: function() {} // Callback after click
                                                        });
                                                        var toastObject = JSON.parse(toastResponseStake2);
                                                        Toastify(toastObject).showToast();
                                                        // UI mods
                                                        sleep(1000).then(() => {
                                                            document.getElementById("pb").style.transition = "all 0.1s linear 0s";
                                                            document.getElementById("pb").style.width = '100%';
                                                            document.getElementById("pb").classList.remove("progress-bar-animated");
                                                            document.getElementById("button_unlock_tokens").disabled = false;
                                                            document.getElementById("pb").style.width = '0%';
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            } else if ((erc20ApprovalBalanceBN.gt(erc20ZeroValueBN) && erc20ApprovalBalanceBN.gte(stateAmountInWei))) {
                                var toastResponseStake = JSON.stringify({
                                    avatar: "../images/favicon.ico",
                                    text: "Staking " + stateAmountInWei + ", please approve",
                                    duration: 10000,
                                    newWindow: true,
                                    close: true,
                                    gravity: "top", // `top` or `bottom`
                                    position: "left", // `left`, `center` or `right`
                                    backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                                    stopOnFocus: false, // Prevents dismissing of toast on hover
                                    onClick: function() {} // Callback after click
                                });
                                var toastObject = JSON.parse(toastResponseStake);
                                Toastify(toastObject).showToast();
                                stakingTimeLockContract.stakeTokens(erc20_contract_address.address, stateAmountInWei).then((approveResponse08) => {
                                    approveResponse08.wait().then((approveResponse09) => {
                                        // Automatically update balances
                                        stakingAmounts.reset();
                                        var toastResponseStake = JSON.stringify({
                                            avatar: "../images/favicon.ico",
                                            text: "Congratulations, tokens are staked.",
                                            duration: 10000,
                                            newWindow: true,
                                            close: true,
                                            gravity: "top", // `top` or `bottom`
                                            position: "left", // `left`, `center` or `right`
                                            backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                                            stopOnFocus: false, // Prevents dismissing of toast on hover
                                            onClick: function() {} // Callback after click
                                        });
                                        var toastObject = JSON.parse(toastResponseStake);
                                        Toastify(toastObject).showToast();
                                        // UI mods
                                        sleep(1000).then(() => {
                                            document.getElementById("pb").style.transition = "all 0.1s linear 0s";
                                            document.getElementById("pb").style.width = '100%';
                                            document.getElementById("pb").classList.remove("progress-bar-animated");
                                            document.getElementById("button_unlock_tokens").disabled = false;
                                            document.getElementById("pb").style.width = '0%';
                                        });
                                    });
                                });
                            }
                        });
                    } else {
                        var toastResponse = JSON.stringify({
                            avatar: "../images/favicon.ico",
                            text: "insufficient ERC20 token balance!",
                            duration: 10000,
                            newWindow: true,
                            close: true,
                            gravity: "top", // `top` or `bottom`
                            position: "right", // `left`, `center` or `right`
                            backgroundColor: "linear-gradient(to right, #454A21, #607D3B)",
                            stopOnFocus: false, // Prevents dismissing of toast on hover
                            onClick: function() {} // Callback after click
                        });
                        var toastObject = JSON.parse(toastResponse);
                        Toastify(toastObject).showToast();
                    }
                } else {
                    var toastResponse = JSON.stringify({
                        avatar: "../images/favicon.ico",
                        text: "This round has already ended! Please un-stake existing tokens and then try again",
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
        } else {
            var toastResponse = JSON.stringify({
                avatar: "../images/favicon.ico",
                text: "Amount to stake must be a) greater than 0.00000031536 Eth (315360000000 Wei) and b) less than (2**256 - 1)/10000",
                duration: 15000,
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
            text: "Please re-check token amount and try again!",
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
        document.getElementById("button_lock_tokens").disabled = false;
        document.getElementById("pb").style.width = '0%';
    });
}