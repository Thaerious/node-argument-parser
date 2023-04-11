import assert from "assert";
import ParseArgs from "../src/ParseArgs.js";
import FS from "fs";
import exp from "constants";

/**
 * Multiple short flags referes to a single dash followed by more than one character.
 *
 * Example: -afx
 * Flags a, f, and x are toggled.
 * Fags a, and f will take on the default values because they are first.
 * The last flag will take on the default value unless there is command line paramter immediately
 * following it.
 *
 * Example: -afx value
 * Flag a will be the default value
 * Flag f will be the default value
 * Flag x will be 'value' (assuming it has boolean set to false in the settings).
 *
 * In order for a flag to consume a parameter it must be present in the options object.
 **/

const options = {
    flags: [
        {
            long:  "alpha",
            short: "a",
            type:  "boolean",
        },
        {
            long:    "foxtrot",
            short:   "f",
            default: "dance",
        },
        {
            long:  "xray",
            short: "x",
        },
    ],
};

describe(`multiple single character flags`, () => {
    describe(`-af`, () => {
        it(`a/alpha will be true because it is type:boolean with default value`, () => {
            const argv = "node . -af".split(/[ ]+/g);
            const parsed = new ParseArgs().config(options).run(argv);
			const actual = parsed.flags.alpha;
			const expected = true;
            assert.strictEqual(actual, expected);
        });
        it(`f/foxtrot has default value 'dance' because no parameters were provided`, () => {
            const argv = "node . -af".split(/[ ]+/g);
            const parsed = new ParseArgs().config(options).run(argv);
			const actual = parsed.flags.foxtrot;
			const expected = "dance";
            assert.strictEqual(actual, expected);
        });		
        it(`x/xray is false because it has no default and isn't flagged`, () => {
            const argv = "node . -af".split(/[ ]+/g);
            const parsed = new ParseArgs().config(options).run(argv);
			const actual = parsed.flags.foxtrot;
			const expected = "dance";
            assert.strictEqual(actual, expected);
        });		
    });
    describe(`-axbf ballroom`, () => {
        it(`a/alpha will be true because it is type:boolean with default value`, () => {
            const argv = "node . -axbf ballroom".split(/[ ]+/g);
            const parsed = new ParseArgs().config(options).run(argv);
			const actual = parsed.flags.alpha;
			const expected = true;
            assert.strictEqual(actual, expected);
        });
        it(`f/foxtrot has value 'ballroom' because a parameter was provided`, () => {
            const argv = "-axbf ballroom".split(/[ ]+/g);
            const parsed = new ParseArgs().config(options).run(argv);
			const actual = parsed.flags.foxtrot;
			const expected = "ballroom";
            assert.strictEqual(actual, expected);
        });		
        it(`x/xray is true it is flagged`, () => {
            const argv = "-axbf ballroom".split(/[ ]+/g);
            const parsed = new ParseArgs().config(options).run(argv);
			const actual = parsed.flags.xray;
			const expected = true;
            assert.strictEqual(actual, expected);
        });		
    });   
    describe(`-ax ballroom`, () => {
        it(`x/xray is not set to boolean so it consumes an argument`, () => {
            const argv = "-ax ballroom".split(/[ ]+/g);
            const parsed = new ParseArgs().config(options).run(argv);
			const actual = parsed.flags.xray;
			const expected = "ballroom";
            assert.strictEqual(actual, expected);
        });		
    }); 
    describe(`-xa ballroom`, () => {
        it(`runme a/alpha is set to boolean so it doesn't consume an argument`, () => {
            const argv = "-xa ballroom".split(/[ ]+/g);
            const parsed = new ParseArgs().config(options).run(argv);
			const actual = parsed.flags.alpha;
			const expected = true;
            assert.strictEqual(actual, expected);
        });		
        it(`x/xray doesn't consume an argument because it comes first`, () => {
            const argv = "-xa ballroom".split(/[ ]+/g);
            const parsed = new ParseArgs().config(options).run(argv);
			const actual = parsed.flags.xray;
			const expected = true;
            assert.strictEqual(actual, expected);
        });	   
        it(`there is an argument because 'ballroom' is never consumed`, () => {
            const argv = "-xa ballroom".split(/[ ]+/g);
            const parsed = new ParseArgs().config(options).run(argv);
			const actual = parsed.args[0];
			const expected = "ballroom";
            assert.strictEqual(actual, expected);
        });	     
        it(`f/foxtrot has default value 'dance' because the flag was never set`, () => {
            const argv = "node . -af".split(/[ ]+/g);
            const parsed = new ParseArgs().config(options).run(argv);
			const actual = parsed.flags.foxtrot;
			const expected = "dance";
            assert.strictEqual(actual, expected);
        });	                
    });             
});
