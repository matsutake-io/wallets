import * as nock from 'nock';
import { PasswordLockedCoin } from './PasswordLockedCoin';

describe('PasswordLockedCoin', () => {
    describe('getAddress', () => {
        it('generates a receive address', async () => {
            const wallet = new PasswordLockedCoin('foobar');
            const result = await wallet.getAddress();

            expect(result).toBe('xch1sgput8rxzuvkh0t7g8aq8te92x9kqhrqexunl70fj5v2j2g3kkmscnmcqh');
        });
    });

    describe('spendCoin', () => {
        it('spends a password locked coin', async () => {
            const coin = {
                parent_coin_info: '0xffff',
                amount: 1000000,
                puzzle_hash: '0x8203c59c6617196bbd7e41fa03af25518b605c60c9b93ff9e99518a92911b5b7'
            };

            nock(`https://api.matsutake.io/v1`)
                .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
                .post('/transaction', {
                    spend_bundle: {
                        aggregated_signature: '0xc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                        coin_spends: [{
                            coin,
                            puzzle_reveal: 'ff02ffff01ff02ffff03ffff09ffff0bff0580ffff01a0c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f280ffff01ff04ffff04ff02ffff04ff0bffff04ff17ff80808080ff8080ffff01ff088080ff0180ffff04ffff0133ff018080',
                            solution: '9a73796d626f6c5f7461626c652e61735f6a617661736372697074'
                        }]
                    }
                })
                .reply(200, { status: 'success' });

            const wallet = new PasswordLockedCoin('foobar');

            await wallet.spendCoin(coin, 'xch1f0ryxk6qn096hefcwrdwpuph2hm24w69jnzezhkfswk0z2jar7aq5zzpfj');
        });

        it('fails to spend a password locked coin', async () => {
            const coin = {
                parent_coin_info: '0xffff',
                amount: 1000000,
                puzzle_hash: '0x8203c59c6617196bbd7e41fa03af25518b605c60c9b93ff9e99518a92911b5b7'
            };

            nock(`https://api.matsutake.io/v1`)
                .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
                .post('/transaction', {
                    spend_bundle: {
                        aggregated_signature: '0xc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                        coin_spends: [{
                            coin,
                            puzzle_reveal: 'ff02ffff01ff02ffff03ffff09ffff0bff0580ffff01a0c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f280ffff01ff04ffff04ff02ffff04ff0bffff04ff17ff80808080ff8080ffff01ff088080ff0180ffff04ffff0133ff018080',
                            solution: '9a73796d626f6c5f7461626c652e61735f6a617661736372697074'
                        }]
                    }
                })
                .reply(400, { status: 'failed' });

            const wallet = new PasswordLockedCoin('cheese');

            await expect(() => wallet.spendCoin(coin, 'xch1f0ryxk6qn096hefcwrdwpuph2hm24w69jnzezhkfswk0z2jar7aq5zzpfj')).rejects.toThrow(new Error('Request was rejected by full node'));
        });
    });
});
