import assert from "assert";
import ParseArgs from "../src/ParseArgs.js";

const options = {
    flags: [
        {
            long: "pack",
            short: "p",
            default: "a.json",
            desc: "retrieve scripts from directories and insert into a game file",
        },
        {
            long: "do_action",
            type: "boolean",
        },
        {
            long: "not_found",
            type: "boolean",
        },        
    ],
};

describe(`Testing parse args behaviours`, () => {

    describe(`flags included in options will have a default value when not present in args`, function () {
        it("value is defined", () => {
            const argv = "node . --email who@where.com -n user".split(/[ ]+/g);
            const parsed = new ParseArgs(options, argv);
            assert.notStrictEqual(parsed.pack, undefined);
        });
        it(`value is equal to the default`, () => {
            const argv = "node . --email who@where.com -n user".split(/[ ]+/g);
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed.pack, "a.json");
        });
    });

    describe(`boolean flags`, function () {
        it(`boolean flags do not consume arguments`, () => {
            const argv = "node . --do_action value".split(/[ ]+/g);
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed.$.length, 3);
        });        
        it(`boolean flags are true when present in args`, () => {
            const argv = "node . --do_action value".split(/[ ]+/g);
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed["do_action"], true);
        });
        it(`boolean flags are false when not present in args`, () => {
            const argv = "node . --do_action value".split(/[ ]+/g);
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed["not_found"], false);
        });
    });

    describe(`undefined flags`, function () {
        it(`undefined flags without a consumable are assigned the value 'true'`, () => {
            const argv = "node . --a_flag".split(/[ ]+/g);
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed["a_flag"], true);
        });
        it(`undefined flags with a consumable are assigned a string value`, () => {
            const argv = "node . --a_flag value".split(/[ ]+/g);
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed["a_flag"], "value");
            assert.strictEqual(typeof parsed["a_flag"], "string");
        });
    });
});

