const token = artifacts.require('../contracts/MASTERTToken.sol')
const crowdsale = artifacts.require('../contracts/MASTERTCrowdsale.sol')
const setDefaultAccount = require('../scripts/setDefaultAccount.js')

module.exports = function(deployer, network, accounts) {
    const rate = new web3.BigNumber(0)
    const wallet = '0xefa21EeC348271CDBA5Ca478aeeB5b41b608F596'
    // Setup default account
    setDefaultAccount(web3)
    const account = web3.eth.accounts.pop()
    // Get gas limit
    let gasLimit = web3.eth.getBlock('latest').gasLimit
    let gasPrice = web3.eth.gasPrice
    if (process.argv[4] === '--staging') {
        gasPrice *= 4
    }
    console.log(`Determined gas limit: ${gasLimit}; and gas price: ${gasPrice}; max deployment price is ${web3.fromWei(gasPrice * gasLimit, 'ether')} ETH`)
    // Deploy contract
    return deployer
        .then(() => {
            return deployer.deploy(token, { gas: gasLimit, gasPrice: gasPrice, from: account })
        })
        .then(() => {
            // Get gas limit
            gasLimit = web3.eth.getBlock('latest').gasLimit
            console.log(`Determined gas limit: ${gasLimit}; and gas price: ${gasPrice}; estimate max deployment price is ${web3.fromWei(gasPrice * gasLimit, 'ether')} ETH`)
            console.log('This might take a while, please, be patient')
            return deployer.deploy(
                crowdsale,
                token.address,
                rate,
                wallet,
                { gas: gasLimit, gasPrice: gasPrice, from: account },
            )
        })
        .then(() => {
            // Make smart-contract an owner
            var tokenContract = web3.eth.contract(token.abi).at(token.address)
            tokenContract.transferOwnership(crowdsale.address)
        });
}