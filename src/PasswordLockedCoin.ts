import * as shajs from 'sha.js';
import { transaction } from '@matsutake/api-client';
import { Chialisp } from '@matsutake/chialisp';
import { address } from '@matsutake/crypto';
import { Coin } from './Coin';

export class PasswordLockedCoin {
    private readonly password: string;
    private readonly puzzle: Chialisp;

    public constructor(password: string) {
        this.password = password;
        this.puzzle = new Chialisp(`
            (mod (password new_puzhash amount)
                (defconstant CREATE_COIN 51)
                
                (if (= (sha256 password) (q . 0x${shajs('sha256').update(this.password).digest('hex')}))
                (list (list CREATE_COIN new_puzhash amount))
                (x)
            ))
        `);
    }

    public async getAddress(): Promise<string> {
        const hash = await this.puzzle.hash();

        return address.fromHash('xch', hash);
    }

    public async spendCoin(coin: Coin, destinationAddress: string): Promise<void> {
        const destinationPuzzleHash = address.toHash(destinationAddress);
        const solutionClsp = new Chialisp(`(${this.password} 0x${destinationPuzzleHash} ${coin.amount})`);
        const [puzzle_reveal, solution] = await Promise.all([this.puzzle.hex(), solutionClsp.hex()]);

        await transaction.push({
            spend_bundle: {
                aggregated_signature: '0xc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                coin_spends: [{
                    coin,
                    puzzle_reveal,
                    solution
                }]
            }
        });
    }
}
