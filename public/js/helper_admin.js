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
        this.totalStateStaked = new ethers.BigNumber.from('0');
        this.reservePool = new ethers.BigNumber.from('0');
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

    getTotalExpectedInterest() {
        return this.interestEarned;
    }

    getTimePeriod() {
        return this.timePeriod;
    }

    getTotalStateStaked() {
        return this.totalStateStaked;
    }

    getReservePool() {
        return this.reservePool;
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

    setTotalExpectedInterest(_interestEarned) {
        this.interestEarned = this.interestEarned.add(_interestEarned);
    }

    setTimePeriod(_timePeriod) {
        this.timePeriod = _timePeriod;
    }

    setTotalStateStaked(_totalStateStaked) {
        this.totalStateStaked = _totalStateStaked;
    }

    setReservePool(_reservePool) {
        this.reservePool = _reservePool;
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
        this.totalStateStaked = new ethers.BigNumber.from('0');
        this.reservePool = new ethers.BigNumber.from('0');
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
}

async function updateBalances() {
    stakingAmounts.reset();
    document.getElementById("pb").style.width = '0%';
    document.getElementById("button_calculate_balances").value = "Calculating balances, please wait ...";
    document.getElementById("pb").style.transition = "all 30s linear 0s";
    document.getElementById("pb").style.width = '80%';

    window.ethereum.enable();

    provider = new ethers.providers.Web3Provider(window.ethereum);


    // Instantiate staking timelock contract
    stakingTimeLockContract = await new ethers.Contract(interest_earner_contract_address.address, interest_earner_abi, provider);
    // Instantiate ERC20 contract
    erc20TimeLockContract = new ethers.Contract(erc20_contract_address.address, erc20_abi, provider);

    // Timeperiod timestamp
    timePeriodTimestamp = await stakingTimeLockContract.timePeriod();
    timePeriodTimestampBN = new ethers.BigNumber.from(timePeriodTimestamp);
    stakingAmounts.setTimePeriod(timePeriodTimestampBN);
    var toastResponse;

    // Staked State
    stakedState = await stakingTimeLockContract.totalStateStaked();
    stakedStateBN = new ethers.BigNumber.from(stakedState);
    stakingAmounts.setTotalStateStaked(stakedStateBN);

    // Basis points
    basisPoints = await stakingTimeLockContract.percentageBasisPoints();
    basisPointsBN = new ethers.BigNumber.from(basisPoints);
    stakingAmounts.setBasisPoints(basisPointsBN);

    // Interest earned by all
    interestEarned = await stakingTimeLockContract.totalExpectedInterest();
    interestEarnedBN = new ethers.BigNumber.from(interestEarned);
    stakingAmounts.setTotalExpectedInterest(interestEarnedBN);

    // How many ERC20 tokens does this smart contract have in the original ERC20 contract?
    erc20Balance = await erc20TimeLockContract.balanceOf(interest_earner_contract_address.address);
    erc20BalanceBN = new ethers.BigNumber.from(erc20Balance);
    stakingAmounts.setReservePool(erc20BalanceBN);


    // Populate UI with values
    if (ethers.utils.formatEther(stakingAmounts.getTotalExpectedInterest()) < 0.1 && ethers.utils.formatEther(stakingAmounts.getTotalExpectedInterest()) > 0) {
        document.getElementById("total_expected_interest").innerHTML = "< 0.1";
    } else {
        document.getElementById("total_expected_interest").innerHTML = parseInt(ethers.utils.formatEther(stakingAmounts.getTotalExpectedInterest()));
    }

    document.getElementById("time_period_per_round").innerHTML = stakingAmounts.getTimePeriod();

    document.getElementById("interest_per_annum").innerHTML = stakingAmounts.getBasisPoints().div(100) + "%";

    if (ethers.utils.formatEther(stakingAmounts.getTotalStateStaked()) < 0.1 && ethers.utils.formatEther(stakingAmounts.getTotalStateStaked()) > 0) {
        document.getElementById("total_staked_tokens").innerHTML = "< 0.1";
    } else {
        document.getElementById("total_staked_tokens").innerHTML = parseInt(ethers.utils.formatEther(stakingAmounts.getTotalStateStaked()));
    }
    console.log("Sum" + stakingAmounts.getTotalStateStaked().add(stakingAmounts.getTotalExpectedInterest()));
    console.log("Sum" + stakingAmounts.getReservePool());
    // Create red text if the contract's owner is 1 Eth denomination away from not having enough reserve for new users to stake
    var tolerance = new ethers.BigNumber.from('1000000000000000000');
    if (stakingAmounts.getTotalStateStaked().add(stakingAmounts.getTotalExpectedInterest()).add(tolerance).gte(stakingAmounts.getReservePool())){
        document.getElementById("contracts_reserve_pool").style.color = "red";
    } else {
        document.getElementById("contracts_reserve_pool").style.color = "white"; 
    }
    if (ethers.utils.formatEther(stakingAmounts.getReservePool()) < 0.1 && ethers.utils.formatEther(stakingAmounts.getReservePool()) > 0) {
        document.getElementById("contracts_reserve_pool").innerHTML = "< 0.1";
    } else {
        document.getElementById("contracts_reserve_pool").innerHTML = parseInt(ethers.utils.formatEther(stakingAmounts.getReservePool()));
    }

    document.getElementById("pb").style.transition = "all 0.1s linear 0s";
    document.getElementById("pb").style.width = '100%';
    sleep(1000).then(() => {
        document.getElementById("pb").classList.remove("progress-bar-animated");
        document.getElementById("button_calculate_balances").disabled = false;
        //document.getElementById("button_lock_tokens").disabled = false;
        document.getElementById("button_calculate_balances").value = "Refresh/Calculate Balances";
        document.getElementById("pb").style.width = '0%';
    });

    
}

async function calculateBalances() {
    stakingAmounts.reset();
    await updateBalances();
}

