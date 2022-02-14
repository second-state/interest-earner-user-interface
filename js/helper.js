const abi = [{
        "inputs": [{
            "internalType": "contract IERC20",
            "name": "_erc20_contract_address",
            "type": "address"
        }],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": false,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TokensUnstaked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": false,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "tokensStaked",
        "type": "event"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "alreadyWithdrawn",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "balances",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contractBalance",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "erc20Contract",
        "outputs": [{
            "internalType": "contract IERC20",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "initialTimestamp",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "_timePeriodInSeconds",
            "type": "uint256"
        }],
        "name": "setTimestamp",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "contract IERC20",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "stakeTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "timePeriod",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "timestampSet",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "contract IERC20",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferAccidentallyLockedTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "contract IERC20",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "unstakeTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const erc20_abi = [{
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "account",
            "type": "address"
        }],
        "name": "balanceOf",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
// Address of the linear timelock instance
const staking_address = '0x8e00Af196371715c823c8B1494599268e93f241b';


// IMPORTANT - which address are you pasting here?
// THIS MUST BE THE ERC20 ADDRESS NOT THE TIMELOCK ADDRESS
const erc20_contract_address = '0x1d70e399C4cd5df0C11c9b1B00dfAd049f482ac4';

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

class Amounts {

    constructor() {
        this.locked = new ethers.BigNumber.from('0');
        this.unlocked = new ethers.BigNumber.from('0');
        this.unlockable = new ethers.BigNumber.from('0');
        this.timePeriod = new ethers.BigNumber.from('0');
        this.currentTime = new ethers.BigNumber.from('0');
    }

    getLocked() {
        return this.locked;
    }

    getUnlocked() {
        return this.unlocked;
    }

    getUnlockable() {
        return this.unlockable;
    }

    getTimePeriod() {
        return this.timePeriod;
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

    setUnlockable(_unlockable) {
        this.unlockable = this.unlockable.add(_unlockable);
    }

    setTimePeriod(_timePeriod) {
        this.timePeriod = _timePeriod;
    }

    setCurrentTime(_currentTime) {
        this.currentTime = _currentTime;
    }

    reset() {
        this.locked = new ethers.BigNumber.from('0');
        this.unlocked = new ethers.BigNumber.from('0');
        this.unlockable = new ethers.BigNumber.from('0');
        this.timePeriod = new ethers.BigNumber.from('0');
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
    } catch (err){
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
    if (addressOfSigner){
    console.log("Address of signer: " + addressOfSigner);
    document.getElementById("eth_address").value = addressOfSigner;
    document.getElementById("connect_wallet_text").style.color = "#00FF7F";
    document.getElementById("connect_wallet_text").innerHTML = "Wallet connected ✔";
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
    document.getElementById("button_lock_tokens").disabled = true;
    document.getElementById("button_unlock_tokens").disabled = true;
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
    stakingTimeLockContract = await new ethers.Contract(staking_address, abi, provider);
    // Instantiate ERC20 contract
    erc20TimeLockContract = new ethers.Contract(erc20_contract_address, erc20_abi, provider);

    // Timeperiod edge timestamp
    timePeriodTimestamp = await stakingTimeLockContract.timePeriod();
    timePeriodTimestampBN = new ethers.BigNumber.from(timePeriodTimestamp);
    stakingAmounts.setTimePeriod(timePeriodTimestampBN);

    // If we have not hit the unlock period then just send a message and end processing
    if (
        stakingAmounts.getCurrentTime().lt(stakingAmounts.getTimePeriod())) {
        console.log("No tokens unlockable yet");
        var unlockCommences = new Date(timePeriodTimestamp * 1000);
        var toastResponse = JSON.stringify({
            avatar: "../images/favicon.ico",
            text: "Unlocking commences at: " + unlockCommences.toLocaleString(),
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
    } else {
        var toastResponse;

        // Eth address
        console.log("Calculating balances");
        eth_address = document.getElementById('eth_address').value;
        var pattern = /0x[a-fA-F0-9]{40}/;
        var resultRegex = pattern.exec(eth_address);

        if (resultRegex != null) {
            // Recipient address
            var recipientAddress = resultRegex[0];

            // How many ERC20 tokens does this user have in the original ERC20 contract?
            erc20Balance = await erc20TimeLockContract.balanceOf(resultRegex[0]);
            erc20BalanceBN = new ethers.BigNumber.from(erc20Balance);

            // Balance locked 
            stakingUsersBalance = await stakingTimeLockContract.balances(resultRegex[0]);
            stakingUsersBalanceBN = new ethers.BigNumber.from(stakingUsersBalance);
            stakingAmounts.setLocked(stakingUsersBalanceBN);
            console.log("User's balance: " + stakingAmounts.getLocked());

            // Amount already unlocked
            stakingAlreadyUnlocked = await stakingTimeLockContract.alreadyWithdrawn(resultRegex[0]);
            stakingAlreadyUnlockedBN = new ethers.BigNumber.from(stakingAlreadyUnlocked);
            stakingAmounts.setUnlocked(stakingAlreadyUnlockedBN);
            console.log("Already unlocked: " + stakingAmounts.getUnlocked());

            // Populate UI with values
            if (ethers.utils.formatEther(stakingAmounts.getLocked()) < 0.1 && ethers.utils.formatEther(stakingAmounts.getLocked()) > 0) {
                document.getElementById("locked").innerHTML = "< 0.1";
            } else {
                document.getElementById("locked").innerHTML = ethers.utils.formatEther(stakingAmounts.getLocked());
            }

            if (ethers.utils.formatEther(stakingAmounts.getUnlocked()) < 0.1 && ethers.utils.formatEther(stakingAmounts.getUnlocked()) > 0) {
                document.getElementById("unlocked").innerHTML = "< 0.1";
            } else {
                document.getElementById("unlocked").innerHTML = ethers.utils.formatEther(stakingAmounts.getUnlocked());
            }
            // Calculate how many tokens are unlockable, given the current time period and how much time has elapsed so far        
            if (stakingAmounts.getCurrentTime().gte(stakingAmounts.getTimePeriod())) {
                // The maximum time period has passed, so all locked tokens are unlockable now and forever
                stakingAmounts.setUnlockable(stakingAmounts.getLocked());
                console.log("No time lock in place, all tokens are unlockable");
            } else {
                stakingAmounts.setUnlockable("0");
            }
            if (ethers.utils.formatEther(stakingAmounts.getUnlockable()) < 0.1 && ethers.utils.formatEther(stakingAmounts.getUnlockable()) > 0) {
                document.getElementById("unlockable").innerHTML = "< 0.1";
            } else {
                document.getElementById("unlockable").innerHTML = ethers.utils.formatEther(stakingAmounts.getUnlockable());
            }
            document.getElementById("pb").style.transition = "all 0.1s linear 0s";
            document.getElementById("pb").style.width = '100%';
            sleep(1000).then(() => {
                document.getElementById("pb").classList.remove("progress-bar-animated");
                document.getElementById("button_calculate_balances").disabled = false;
                document.getElementById("button_lock_tokens").disabled = false;
                document.getElementById("button_unlock_tokens").disabled = false;
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

    // Instantiate staking contract
    stakingTimeLockContract = new ethers.Contract(staking_address, abi, signer);
    // Instantiate ERC20 contract
    erc20TimeLockContract = new ethers.Contract(erc20_contract_address, erc20_abi, signer);

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
                if (erc20ApprovalBalanceBN.lt(stateAmountInWei)) {
                    // Setting approval to zero before increasing
                    erc20ZeroValueBN = new ethers.BigNumber.from("0");
                    approveResponse1 = await erc20TimeLockContract.approve(staking_address, erc20ZeroValueBN);
                    // Now we can go ahead and set the approval amount to the correct amount for this specific transaction
                    approveResponse2 = await erc20TimeLockContract.approve(staking_address, stateAmountInWei);
                }
                // Now go ahead and stake the tokens
                stakingResponse1 = await stakingTimeLockContract.stakeTokens(erc20_contract_address, stateAmountInWei);
                var toastResponse = JSON.stringify({
                    avatar: "../images/favicon.ico",
                    text: "Congratulations, tokens locked!",
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

    // Instantiate staking contract
    stakingTimeLockContract = new ethers.Contract(staking_address, abi, signer);
    // Instantiate ERC20 contract
    erc20TimeLockContract = new ethers.Contract(erc20_contract_address, erc20_abi, signer);

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
                stakingResponse1 = await stakingTimeLockContract.unstakeTokens(erc20_contract_address, stateAmountInWei);
                var toastResponse = JSON.stringify({
                    avatar: "../images/favicon.ico",
                    text: "Congratulations, tokens un-locked!",
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