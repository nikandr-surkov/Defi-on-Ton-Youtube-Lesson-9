import { NetworkProvider, sleep } from "@ton/blueprint";
import { Counter } from "../wrappers/Counter";
import { Address, toNano } from "@ton/core";
import { BulkAdder } from "../wrappers/BulkAdder";



export async function run(provider: NetworkProvider) {
    const counter = provider.open(Counter.fromAddress(Address.parse('EQCOKnrAaJ4dxuQC98JF1RgQcrRzx-9CRbnVsrurSDHCxWD0')));
    const bulkAdder = provider.open(BulkAdder.fromAddress(Address.parse('EQCHXObRbuAJv_VNznSSO9GL0kOflCuF8acu_ziW8fnYsb5L')));

    const targetCounterValue = 3n;

    const counterValueBefore = await counter.getValue();
    console.log(`Counter value before: ${counterValueBefore}`);
    let queryCounter = await counter.getQueryCounter();
    console.log(`Query counter before: ${queryCounter}`);

    await bulkAdder.send(
        provider.sender(),
        {
            value: toNano('0.05')
        },
        {
            $$type: 'Reach',
            counter: Address.parse('EQCOKnrAaJ4dxuQC98JF1RgQcrRzx-9CRbnVsrurSDHCxWD0'),
            target: targetCounterValue
        }
    );

    let attempt = 0;
    let counterValueAfter = counterValueBefore;
    while((counterValueAfter !== targetCounterValue) && (attempt < 100)) {
        attempt++;
        console.log(`Attempt: ${attempt}`);
        counterValueAfter = await counter.getValue();
        console.log(`Current counter value: ${counterValueAfter}`);
        queryCounter = await counter.getQueryCounter();
        console.log(`Current query counter: ${queryCounter}`);
        await sleep(5000);
    }
    console.log(`Counter value after: ${counterValueAfter}`);
}