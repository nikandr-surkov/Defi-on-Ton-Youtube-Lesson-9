import "@stdlib/deploy";
import "./messages.tact";

contract Counter with Deployable {

    val: Int as uint32;
    queryCounter: Int as uint32;

    init() {
        self.val = 0;
        self.queryCounter = 0;        
    }

    // Step 6: anyone can ask this contract to add 1 (i.e. the other contract)
    receive("increment") {
        self.val = self.val + 1;
        self.reply(CounterValue{value: self.val}.toCell());
    }

    // Step 3: this contract replies with its current value to anyone (i.e. the other contract)
    receive("query") {
        self.queryCounter = self.queryCounter + 1;
        self.reply(CounterValue{value: self.val}.toCell());
    }

    get fun value(): Int {
        return self.val;
    }

    get fun queryCounter(): Int {
        return self.queryCounter;
    }

}
