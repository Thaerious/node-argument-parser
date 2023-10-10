import assert from "assert";
import ParseArgs from '../src/ParseArgs.js';

const options = {
    flags: [
        {
            long: "port",
            short: "p",
            default: 8080,
            desc: "start server on the specified port",
            type: "number",
            env: "PORT",
        }
    ]
};

describe(`add flag values to process.env`, () => {
    it(`default value set`, () => {
        const parsed = new ParseArgs(options, []);
        assert.strictEqual(Number(process.env.PORT), 8080);
    });

    it(`specified value`, () => {
        const argv = ["--port", "7000"];
        const parsed = new ParseArgs(options, argv);
        assert.strictEqual(Number(process.env.PORT), 7000);
    });    
});
