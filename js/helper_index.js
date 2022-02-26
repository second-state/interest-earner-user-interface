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
        sleep(1000).then(() => {
        document.getElementById("pb").style.transition = "all 0.1s linear 0s";
        document.getElementById("pb").style.width = '100%';
        document.getElementById("pb").classList.remove("progress-bar-animated");
        document.getElementById("button_lock_tokens").disabled = false;
        document.getElementById("pb").style.width = '0%';
    });
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

        if (stakingAmounts.getInitialTimePeriod() == 0){
            document.getElementById("your_un-staking_date").innerHTML = "N/A"
        } else {
            document.getElementById("your_un-staking_date").innerHTML = unlockCommences.toLocaleString();
        }
        document.getElementById("interest_per_annum").innerHTML = stakingAmounts.getBasisPoints().div(100) + "%";

        document.getElementById("pb").style.transition = "all 0.1s linear 0s";
        document.getElementById("pb").style.width = '100%';
        sleep(1000).then(() => {
            document.getElementById("pb").classList.remove("progress-bar-animated");
            document.getElementById("button_calculate_balances").disabled = false;
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
    sleep(1000).then(() => {
        document.getElementById("pb").style.transition = "all 0.1s linear 0s";
        document.getElementById("pb").style.width = '100%';
        document.getElementById("pb").classList.remove("progress-bar-animated");
        document.getElementById("button_lock_tokens").disabled = false;
        document.getElementById("pb").style.width = '0%';
    });
}

async function calculateBalances() {
    stakingAmounts.reset();
    await updateBalances();
}