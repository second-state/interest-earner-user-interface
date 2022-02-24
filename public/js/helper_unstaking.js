var interest_earner_abi = JSON.parse($.getJSON({'url': "../js/interest_earner_abi.json", 'async': false}).responseText);
var erc20_abi = JSON.parse($.getJSON({'url': "../js/erc20_abi.json", 'async': false}).responseText);
var interest_earner_contract_address = JSON.parse($.getJSON({'url': "../js/interest_earner_contract_address.json", 'async': false}).responseText);
var erc20_contract_address = JSON.parse($.getJSON({'url': "../js/erc20_contract_address.json", 'async': false}).responseText);


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

    getInitialTimePeriod() {
        return this.initialTimePeriod;
    }

    getCurrentTime() {
        return this.currentTime;
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
        updateBalances().then(() => {
            console.log("Ready to unlock tokens ...")
        });
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

function clearInput() {
    document.getElementById("eth_address").value = '';
    document.getElementById("state_amount").value = '';
}

async function updateBalances() {
    stakingAmounts.reset();
    document.getElementById("pb").style.width = '0%';
    console.log("Disabling button");
    document.getElementById("button_calculate_balances").disabled = true;
    //document.getElementById("button_lock_tokens").disabled = true;
    document.getElementById("button_calculate_balances").value = "Calculating balances, please wait ...";
    document.getElementById("pb").style.transition = "all 30s linear 0s";
    document.getElementById("pb").style.width = '80%';

    window.ethereum.enable();

    provider = new ethers.providers.Web3Provider(window.ethereum);

    // Current time
    var currentBlock = await provider.getBlock("latest");
    currentTime = currentBlock.timestamp;
    currentTimeBN = new ethers.BigNumber.from(currentTime);
    stakingAmounts.setCurrentTime(currentTimeBN);
    console.log("Current time: " + stakingAmounts.getCurrentTime());

    // Instantiate staking timelock contract
    stakingTimeLockContract = await new ethers.Contract(interest_earner_contract_address.address, interest_earner_abi, provider);
    // Instantiate ERC20 contract
    erc20TimeLockContract = new ethers.Contract(erc20_contract_address.address, erc20_abi, provider);

    // Timeperiod edge timestamp
    timePeriodTimestamp = await stakingTimeLockContract.timePeriod();
    timePeriodTimestampBN = new ethers.BigNumber.from(timePeriodTimestamp);
    stakingAmounts.setTimePeriod(timePeriodTimestampBN);
    var toastResponse;

    // Eth address
    console.log("Calculating balances");
    eth_address = document.getElementById('eth_address').value;
    var pattern = /0x[a-fA-F0-9]{40}/;
    var resultRegex = pattern.exec(eth_address);

    if (resultRegex != null) {
        // Recipient address
        var recipientAddress = resultRegex[0];

        // Timeperiod edge timestamp
        initialTimePeriodTimestamp = await stakingTimeLockContract.initialStakingTimestamp(recipientAddress);
        initialTimePeriodTimestampBN = new ethers.BigNumber.from(initialTimePeriodTimestamp);
        stakingAmounts.setInitialTimePeriod(initialTimePeriodTimestampBN);


        // Lock duration
        timePeriodTimestamp = await stakingTimeLockContract.timePeriod();
        timePeriodTimestampBN = new ethers.BigNumber.from(timePeriodTimestamp);
        stakingAmounts.setTimePeriod(timePeriodTimestampBN);

        // Lock duration
        basisPoints = await stakingTimeLockContract.percentageBasisPoints();
        basisPointsBN = new ethers.BigNumber.from(basisPoints);
        stakingAmounts.setBasisPoints(basisPointsBN);

        var unlockCommences = new Date((stakingAmounts.getTimePeriod().add(stakingAmounts.getInitialTimePeriod())) * 1000);

        // Timeperiod edge timestamp
        interestEarned = await stakingTimeLockContract.expectedInterest(recipientAddress);
        interestEarnedBN = new ethers.BigNumber.from(interestEarned);
        stakingAmounts.setInterestEarned(interestEarnedBN);

        // How many ERC20 tokens does this user have in the original ERC20 contract?
        erc20Balance = await erc20TimeLockContract.balanceOf(resultRegex[0]);
        erc20BalanceBN = new ethers.BigNumber.from(erc20Balance);

        // Balance locked 
        stakingUsersBalance = await stakingTimeLockContract.balances(resultRegex[0]);
        stakingUsersBalanceBN = new ethers.BigNumber.from(stakingUsersBalance);
        stakingAmounts.setLocked(stakingUsersBalanceBN);
        console.log("User's balance: " + stakingAmounts.getLocked());

        // Populate UI with values
        if (ethers.utils.formatEther(stakingAmounts.getLocked()) < 0.1 && ethers.utils.formatEther(stakingAmounts.getLocked()) > 0) {
            document.getElementById("your_staked_tokens").innerHTML = "< 0.1";
        } else {
            document.getElementById("your_staked_tokens").innerHTML = ethers.utils.formatEther(stakingAmounts.getLocked());
        }

        if (ethers.utils.formatEther(stakingAmounts.getInterestEarned()) < 0.1 && ethers.utils.formatEther(stakingAmounts.getInterestEarned()) > 0) {
            document.getElementById("your_interest_earned").innerHTML = "< 0.1";
        } else {
            document.getElementById("your_interest_earned").innerHTML = ethers.utils.formatEther(stakingAmounts.getInterestEarned());
        }

        document.getElementById("your_un-staking_date").innerHTML = unlockCommences.toLocaleString();

        document.getElementById("interest_per_annum").innerHTML = stakingAmounts.getBasisPoints().div(100);

        document.getElementById("pb").style.transition = "all 0.1s linear 0s";
        document.getElementById("pb").style.width = '100%';
        sleep(1000).then(() => {
            document.getElementById("pb").classList.remove("progress-bar-animated");
            document.getElementById("button_calculate_balances").disabled = false;
            //document.getElementById("button_lock_tokens").disabled = false;
            document.getElementById("button_calculate_balances").value = "Refresh/Calculate Balances";
            document.getElementById("pb").style.width = '0%';
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
    
}

async function calculateBalances() {
    stakingAmounts.reset();
    await updateBalances();
}

async function onButtonClickLock() {
    stakingAmounts.reset();

    // UI mods
    document.getElementById("pb").style.width = '0%';
    console.log("Disabling button");
    document.getElementById("button_calculate_balances").disabled = true;
    document.getElementById("button_lock_tokens").disabled = true;
    document.getElementById("button_unlock_tokens").disabled = true;
    document.getElementById("pb").style.transition = "all 30s linear 0s";
    document.getElementById("pb").style.width = '80%';

    await updateBalances();
    // Provider
    window.ethereum.enable()
    provider = new ethers.providers.Web3Provider(window.ethereum);

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
            document.getElementById("button_calculate_balances").disabled = false;
            document.getElementById("button_lock_tokens").disabled = false;
            document.getElementById("button_unlock_tokens").disabled = false;
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
            document.getElementById("button_calculate_balances").disabled = false;
            document.getElementById("button_lock_tokens").disabled = false;
            document.getElementById("button_unlock_tokens").disabled = false;
            document.getElementById("pb").style.width = '0%';
        });
        throw "exit";
    }
    if (stateAmountInWei > 0) {
        eth_address = document.getElementById('eth_address').value;
        var pattern = /0x[a-fA-F0-9]{40}/;
        var resultRegex = pattern.exec(eth_address);
        if (resultRegex != null) {
            var recipientAddress = resultRegex[0];

            // Check user ERC20 balance in ERC20 contract
            erc20Balance = await erc20TimeLockContract.balanceOf(resultRegex[0]);
            erc20BalanceBN = new ethers.BigNumber.from(erc20Balance);

            // Check to see if user has enough tokens to stake
            if (stateAmountInWei.lte(erc20BalanceBN)) {

                // Check allowance i.e. has this user approved the staking contract to transferFrom?
                erc20ApprovalBalance = await erc20TimeLockContract.allowance(resultRegex[0], staking_address);
                erc20ApprovalBalanceBN = new ethers.BigNumber.from(erc20ApprovalBalance);

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
                    erc20TimeLockContract.approve(staking_address, stateAmountInWei).then((approveResponse00) => {
                        var toastResponseApprove0 = JSON.stringify({
                            avatar: "../images/favicon.ico",
                            text: "Waiting for approval transaction to be confirmed ...",
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
                        console.log("Waiting for transaction to be confirmed ...");
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
                            stakingTimeLockContract.stakeTokens(erc20_contract_address, stateAmountInWei).then((approveResponse02) => {
                                var toastResponse = JSON.stringify({
                                    avatar: "../images/favicon.ico",
                                    text: "Waiting for staking transaction to be confirmed ...",
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
                                        text: "Tokens staked successfully!",
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
                                    var toastResponseApprove03 = JSON.stringify({
                                        avatar: "../images/favicon.ico",
                                        text: "Refreshing balances, please wait ...",
                                        duration: 10000,
                                        newWindow: true,
                                        close: true,
                                        gravity: "top", // `top` or `bottom`
                                        position: "left", // `left`, `center` or `right`
                                        backgroundColor: "linear-gradient(to right, #green, #607D3B)",
                                        stopOnFocus: false, // Prevents dismissing of toast on hover
                                        onClick: function() {} // Callback after click
                                    });
                                    var toastObject = JSON.parse(toastResponseApprove03);
                                    Toastify(toastObject).showToast();
                                    // UI mods
                                    document.getElementById("pb").style.width = '0%';
                                    console.log("Disabling button");
                                    document.getElementById("button_calculate_balances").disabled = true;
                                    document.getElementById("button_lock_tokens").disabled = true;
                                    document.getElementById("button_unlock_tokens").disabled = true;
                                    document.getElementById("pb").style.transition = "all 30s linear 0s";
                                    document.getElementById("pb").style.width = '80%';
                                        sleep(1500).then(() => {
                                        updateBalances().then((updateBalancesResponse) => {
                                            console.log("Balances updated.");
                                        });
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
                    erc20TimeLockContract.approve(staking_address, erc20ZeroValueBN).then((approveResponse04) => {
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
                            erc20TimeLockContract.approve(staking_address, stateAmountInWei).then((approveResponse06) => {
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
                                    stakingTimeLockContract.stakeTokens(erc20_contract_address, stateAmountInWei).then((approveResponse08) => {
                                        approveResponse08.wait().then((approveResponse09) => {
                                            // Automatically update balances
                                            stakingAmounts.reset();
                                            var toastResponseStake = JSON.stringify({
                                                avatar: "../images/favicon.ico",
                                                text: "Refreshing balances, please wait ...",
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
                                            document.getElementById("pb").style.width = '0%';
                                            console.log("Disabling button");
                                            document.getElementById("button_calculate_balances").disabled = true;
                                            document.getElementById("button_lock_tokens").disabled = true;
                                            document.getElementById("button_unlock_tokens").disabled = true;
                                            document.getElementById("pb").style.transition = "all 30s linear 0s";
                                            document.getElementById("pb").style.width = '80%';
                                                sleep(1500).then(() => {
                                                updateBalances().then((updateBalancesResponse) => {
                                                    console.log("Balances updated.");
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });  
                }
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
        document.getElementById("button_calculate_balances").disabled = false;
        document.getElementById("button_lock_tokens").disabled = false;
        document.getElementById("button_unlock_tokens").disabled = false;
        document.getElementById("pb").style.width = '0%';
    });
}

async function onButtonClickUnLock() {
    stakingAmounts.reset();

    // UI mods
    document.getElementById("pb").style.width = '0%';
    console.log("Disabling button");
    document.getElementById("button_calculate_balances").disabled = true;
    document.getElementById("button_lock_tokens").disabled = true;
    document.getElementById("button_unlock_tokens").disabled = true;
    document.getElementById("pb").style.transition = "all 30s linear 0s";
    document.getElementById("pb").style.width = '80%';

    await updateBalances();
    // Provider
    window.ethereum.enable()
    provider = new ethers.providers.Web3Provider(window.ethereum);

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
            document.getElementById("button_calculate_balances").disabled = false;
            document.getElementById("button_lock_tokens").disabled = false;
            document.getElementById("button_unlock_tokens").disabled = false;
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
            document.getElementById("button_calculate_balances").disabled = false;
            document.getElementById("button_lock_tokens").disabled = false;
            document.getElementById("button_unlock_tokens").disabled = false;
            document.getElementById("pb").style.width = '0%';
        });
        throw "exit";
    }
    if (stateAmountInWei > 0) {
        eth_address = document.getElementById('eth_address').value;
        var pattern = /0x[a-fA-F0-9]{40}/;
        var resultRegex = pattern.exec(eth_address);
        if (resultRegex != null) {
            var recipientAddress = resultRegex[0];
            console.log("Unlockable: " + ethers.utils.formatUnits(stakingAmounts.getUnlockable(), 0));
            console.log("StateAmountInWei: " + stateAmountInWei);
            // Check to see if user has enough tokens to unstake
            if (stateAmountInWei.lte(ethers.utils.formatUnits(stakingAmounts.getUnlockable(), 0))) {
                // Now we can go ahead and unstake the tokens
                stakingTimeLockContract.unstakeTokens(erc20_contract_address, stateAmountInWei).then((unlockResponse) => {
                    unlockResponse.wait().then((unlockResponse01) => {

                    var toastResponse = JSON.stringify({
                        avatar: "../images/favicon.ico",
                        text: "Congratulations, tokens un-locked!",
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
                    // Automatically update balances
                    stakingAmounts.reset();
                    var toastResponseStake = JSON.stringify({
                        avatar: "../images/favicon.ico",
                        text: "Refreshing balances, please wait ...",
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
                    document.getElementById("pb").style.width = '0%';
                    console.log("Disabling button");
                    document.getElementById("button_calculate_balances").disabled = true;
                    document.getElementById("button_lock_tokens").disabled = true;
                    document.getElementById("button_unlock_tokens").disabled = true;
                    document.getElementById("pb").style.transition = "all 30s linear 0s";
                    document.getElementById("pb").style.width = '80%';
                        sleep(1500).then(() => {
                            updateBalances().then((updateBalancesResponse) => {
                                console.log("Balances updated.");
                            });
                        });
                    });
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
        document.getElementById("button_calculate_balances").disabled = false;
        document.getElementById("button_lock_tokens").disabled = false;
        document.getElementById("button_unlock_tokens").disabled = false;
        document.getElementById("pb").style.width = '0%';
    });
}