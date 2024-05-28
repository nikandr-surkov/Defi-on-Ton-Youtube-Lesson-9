import "@stdlib/deploy";
import "./messages";

contract BulkAdder with Deployable {

    target: Int as uint32;

    init() {
        self.target = 0;        
    }

    // Step 1: user sends the target value we need to hit
    receive(msg: Reach) {
        self.target = msg.target;
        // Step 2: ask the other contract for the current counter value
        send(
            SendParameters{
                to: msg.counter,
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: "query".asComment()
            }
        );
    }

    // Step 4: the other contract sends us its current value
    receive(msg: CounterValue) {
        if(msg.value < self.target) {
            // Step 5: if it's too low, ask it to add 1 more
            send(
                SendParameters{
                    to: sender(),
                    value: 0,
                    mode: SendRemainingValue + SendIgnoreErrors,
                    body: "increment".asComment()
                }
            );
        }
    }

}
