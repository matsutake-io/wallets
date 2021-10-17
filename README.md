# Matsutake Wallets

Example wallets using the [matsutake.io](https://www.matsutake.io) Chia defi application development framework.

```TypeScript
import { PasswordLockedCoin } from '@matsutake/wallets/browser'; // Web browser compatible import

const passwordLockedCoinWallet = new PasswordLockedCoin('foobar');

// Generate an address that receives password locked coins
const address = passwordLockedCoinWallet.getAddress(); // xch1sgput8rxzuvkh0t7g8aq8te92x9kqhrqexunl70fj5v2j2g3kkmscnmcqh

// Spend a password locked coin
const passwordLockedCoin = {
    parent_coin_info: '0xffff',
    amount: 1000000,
    puzzle_hash: '0x8203c59c6617196bbd7e41fa03af25518b605c60c9b93ff9e99518a92911b5b7'
};
await wallet.spendCoin(passwordLockedCoin, 'xch1f0ryxk6qn096hefcwrdwpuph2hm24w69jnzezhkfswk0z2jar7aq5zzpfj')
```

Please enjoy!