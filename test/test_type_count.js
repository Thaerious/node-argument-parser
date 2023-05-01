import assert from "assert";
import ParseArgs from "../src/ParseArgs.js";

const options = {
    flags: [
        {
            long: "verbose",
            short: "v",
            type: "count"
        },
        {
            long: "countme",
            short: "c",
            type: "count",
            default: 7
        }
    ],
};

describe(`tally the number of times a flag occurs`, () => {
    it(`occurs 0 times if not present without a default value`, () => {
        const argv = "node . --flag".split(/[ ]+/g);
        const parsed = new ParseArgs(options, argv);
        assert.strictEqual(parsed.verbose, 0);
    });

    it(`occurs default times if not present with a default value`, () => {
        const argv = "node . --flag".split(/[ ]+/g);
        const parsed = new ParseArgs(options, argv);
        assert.strictEqual(parsed.countme, 7);
    });    

    it(`occurs 1 time if present without a default value`, () => {
        const argv = "node . --verbose".split(/[ ]+/g);
        const parsed = new ParseArgs(options, argv);
        assert.strictEqual(parsed.verbose, 1);
    });

    it(`increments default value`, () => {
        const argv = "node . --countme".split(/[ ]+/g);
        const parsed = new ParseArgs(options, argv);
        assert.strictEqual(parsed.countme, 8);
    });     
});
