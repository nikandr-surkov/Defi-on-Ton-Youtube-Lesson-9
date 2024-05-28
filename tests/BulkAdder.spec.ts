import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { BulkAdder } from '../wrappers/BulkAdder';
import '@ton/test-utils';

describe('BulkAdder', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let bulkAdder: SandboxContract<BulkAdder>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        bulkAdder = blockchain.openContract(await BulkAdder.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await bulkAdder.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: bulkAdder.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and bulkAdder are ready to use
    });
});
