import assert from 'assert';
import ParseArgs from '../src/ParseArgs.js';
import FS from 'fs';

// Test that arguments flagged as strings in the config always returns a string value.

const options = {
    flags: [
        {
            long: "value",
            short: "v",
            default: 2,
            type: "string",
            desc: "i'm just a string value",
        }
    ],
};


describe(`test type = string`, () => {
    describe(`single dash flags`, () => {
        it(`-v flag contains the string value "3"`, () => {
            const argv = ["-v", "3"];
            const parsed = new ParseArgs().config(options).run(argv);
            assert.strictEqual(parsed.flags.value, "3");
        });
    });

    describe(`double dash flags`, () => {
        it(`--value flag contains the string value "3"`, () => {
            const argv = ["--value", "3"];
            const parsed = new ParseArgs().config(options).run(argv);
            assert.strictEqual(parsed.flags.value, "3");
        });
    });    

    describe(`flag default value`, () => {
        it(`--value flag contains the string value "2"`, () => {
            const argv = ["-v"];
            const parsed = new ParseArgs().config(options).run(argv);
            assert.strictEqual(parsed.flags.value, "2");
        });
    });      
    
    describe(`flag default value`, () => {
        it(`unassigned flag contains the default string value "2"`, () => {
            const argv = [];
            const parsed = new ParseArgs().config(options).run(argv);
            assert.strictEqual(parsed.flags.value, "2");
        });
    });        
});