/*
 * 
 * script to demonstrate the failing conversion of conflux MOONLP TOKEN KP3R/ETH to MoonSwap LP Token
 * by calling exchangeLp() on MigratorPair 
 * 
 * I'm trying to convert 15ETH of KP3R/ETH crosschain LP tokens, myAddr has only a fraction of that
 * 
 * Note that mPairContract.factory().cMoonLpToken(mpairAddr) == crossChainMPLAddr was verified
 */


/*script output:

node callMigrate.js 
{
  data: {
    jsonrpc: '2.0',
    id: '175f23bc428eb5b2f35d86a1',
    method: 'cfx_call',
    params: [ [Object], undefined ]
  },
  result: '0x00000000000000000000000000000000000000000000000000038d7ea4c68000',
  duration: 536
}
{
  data: {
    jsonrpc: '2.0',
    id: '175f23bc647f05af89ea4884',
    method: 'cfx_call',
    params: [ [Object], undefined ]
  },
  result: '0x0400000000000000000000000000000000000000000000000000000000000000',
  duration: 510
}
myAddr balance 1000000000000000
migratorpair can spend 1.8092513943330656e+75 from myAddr
{
  data: {
    jsonrpc: '2.0',
    id: '175f23bc847fc9cf1cf3a57b',
    method: 'cfx_call',
    params: [ [Object], undefined ]
  },
  result: '0x0000000000000000000000000000000000000000000000000000000000000001',
  duration: 505
}
successfully called crossChainMPLContract.transfer(mpairAddr, balance)
trying exchangeLp call
{
  data: {
    jsonrpc: '2.0',
    id: '175f23bca42dfd57da626e55',
    method: 'cfx_call',
    params: [ [Object], undefined ]
  },
  error: {
    code: -32015,
    message: 'Transaction reverted',
    data: '0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000205361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564'                                                
  },
  duration: 509
}
Error: SafeERC20: low-level call failed
    at ErrorCoder.decodeError (/home/phil/moonswap/node_modules/js-conflux-sdk/src/contract/method/ErrorCoder.js:11:14)
    at Function.module.exports.decodeError (/home/phil/moonswap/node_modules/js-conflux-sdk/src/contract/index.js:7:46)
    at Conflux.call (/home/phil/moonswap/node_modules/js-conflux-sdk/src/Conflux.js:967:22)
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
phil@phil-VirtualBox:~/moonswap$ ^C
phil@phil-VirtualBox:~/moonswap$ node callMigrate.js 
{
  data: {
    jsonrpc: '2.0',
    id: '175f246b1a51e4b867c6d869',
    method: 'cfx_call',
    params: [ [Object], undefined ]
  },
  result: '0x00000000000000000000000000000000000000000000000000038d7ea4c68000',
  duration: 668
}
{
  data: {
    jsonrpc: '2.0',
    id: '175f246b449cbc4aaf728cfe',
    method: 'cfx_call',
    params: [ [Object], undefined ]
  },
  result: '0x0400000000000000000000000000000000000000000000000000000000000000',
  duration: 509
}
myAddr balance 1000000000000000
migratorpair can spend 1.8092513943330656e+75 from myAddr
{
  data: {
    jsonrpc: '2.0',
    id: '175f246b64fdafae81eeb5cc',
    method: 'cfx_call',
    params: [ [Object], undefined ]
  },
  result: '0x0000000000000000000000000000000000000000000000000000000000000001',
  duration: 299
}
successfully called crossChainMPLContract.transfer(mpairAddr, balance)
trying exchangeLp call
{
  data: {
    jsonrpc: '2.0',
    id: '175f246b77c721b4ec64a09',
    method: 'cfx_call',
    params: [ [Object], undefined ]
  },
  error: {
    code: -32015,
    message: 'Transaction reverted',
    data: '0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000205361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564'
  },
  duration: 502
}
failed mPairContract.exchangeLp()
Error: SafeERC20: low-level call failed
    at ErrorCoder.decodeError (/home/phil/moonswap/node_modules/js-conflux-sdk/src/contract/method/ErrorCoder.js:11:14)
    at Function.module.exports.decodeError (/home/phil/moonswap/node_modules/js-conflux-sdk/src/contract/index.js:7:46)
    at Conflux.call (/home/phil/moonswap/node_modules/js-conflux-sdk/src/Conflux.js:967:22)
    at processTicksAndRejections (internal/process/task_queues.js:97:5)

    
*/


const { Conflux } = require('js-conflux-sdk');
const ecr20abi  = require("./miniERC20.json").abi;

const conflux = new Conflux({
    url: 'http://main.confluxrpc.org/',
    logger: console, // for debug
});
const myAddr = '0x1776966598C5056798664848C5f878e70e0ED933'


//MigratorPair
const mpairAbi  = require("./mpairAbi.json").abi
const mpairAddr = '0x859f1e4ca197eb3d1f9da92eccc442cf165ab2d5'
const mPairContract = conflux.Contract({abi:mpairAbi, address: mpairAddr});


// the cLP tokens I'm trying to convert to native LP tokens
const crossChainMPLAddr = '0x85dc011bff5c05937fecc9d2437861bcef90ca95'
const crossChainMPLContract = conflux.Contract({abi:ecr20abi, address: crossChainMPLAddr});


// // address of native LP token
//const mlpTokenAddr = '0x87cbc4f52e858d50c138cc293b323a5c0b7008d9'




async function main() {

    const balance = await crossChainMPLContract.balanceOf(myAddr).call()
    
    const allowance = await crossChainMPLContract.allowance(myAddr,mpairAddr).call()

    console.log("myAddr balance ".concat(String( parseFloat(balance) ), ""))
    console.log("migratorpair can spend ".concat(String( parseFloat(allowance) ), " from myAddr"))
    
    
     //test transfer to mPairContract
    success = await crossChainMPLContract.transfer(mpairAddr, balance).call({'from':myAddr })
    if(success){
        console.log("successfully called crossChainMPLContract.transfer(mpairAddr, balance)")
        
    }else{
        console.log("failed calling called crossChainMPLContract.transfer(mpairAddr, balance)")
    }
    
    
    console.log("trying exchangeLp call")

    try{
        const a = await mPairContract.exchangeLp().call({'from':myAddr })
        //const b = await mPairContract.exchangeLp().call({'from':myAddr, 'gas':15000000})
    } catch (error) {
        console.log("failed mPairContract.exchangeLp()")

        console.error(error);
        
    
    }


}

main();

