import assert from 'assert';
import ParseArgs from '../src/ParseArgs.js';

// Test that arguments flagged as strings in the config always returns a string value.

const options = {
    flags: [
        {
            long: "value"
        }
    ],
    flags: [
        {
            long: "declared",
            type: "default"
        }
    ],
};

describe(`Test Default Type`, () => {
    describe("no declared type in options", () => {
        it(`if not present value is undefined`, () => {
            const argv = [];
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed.value, undefined);
        });

        it(`if present w/o next argument, value is true`, () => {
            const argv = ["--value"];
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed.value, true);
        });

        it(`if present w/ next argument, value is next argument`, () => {
            const argv = ["--value", "is_set"];
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed.value, "is_set");
        });
    });
    describe("declared 'default' in options", () => {
        it(`if not present value is undefined`, () => {
            const argv = [];
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed.declared, undefined);
        });

        it(`if present w/o next argument, value is true`, () => {
            const argv = ["--declared"];
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed.declared, true);
        });

        it(`if present w/ next argument, value is next argument`, () => {
            const argv = ["--declared", "is_set"];
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed.declared, "is_set");
        });
    });
    describe("no options provided", () => {
        it(`if not present value is undefined`, () => {
            const argv = [];
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed.flag, undefined);
        });

        it(`if present w/o next argument, value is true`, () => {
            const argv = ["--flag"];
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed.flag, true);
        });

        it(`if present w/ next argument, value is next argument`, () => {
            const argv = ["--flag", "is_set"];
            const parsed = new ParseArgs(options, argv);
            assert.strictEqual(parsed.flag, "is_set");
        });
    });
});