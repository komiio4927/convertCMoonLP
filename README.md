# convertCMoonLP
Trying to recover 15ETH worth of KP3R/ETH lp tokens. I can pay for your time.


Situation:


Instead of migrating from the eth Moonstar, I used withdrawal, now I have moonLP on ethereum. 
Depositing it back to the eth contract doesn't work
relevant tx's:

withdraw()to eth staking contract
https://etherscan.io/tx/0x3e4a5dd6a1ac5c95d99e1c657ff900ea2dbcf18851d5e963d383cb1b261566cf

approve() to eth staking contract
https://etherscan.io/tx/0xac2b0ab91f329648aa2b0c85fd4900a3d1668292e46b2e3c6f20329b53ad3eae

deposit() to eth staking contract
https://etherscan.io/tx/0x263ce40a44ed4db1b2d69705f21c300a44eddf0b9ec4cea1faab0007d356a912 


Instead I can deposit it to conflux, I can get the crosschain asset. Now it has to be converted to native moonLP.

unfortunately despite plenty of tokenallowance, calling mPairContract.exchangeLp():


Error: SafeERC20: low-level call failed
