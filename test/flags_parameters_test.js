import assert from 'assert';
import ParseArgs from "../src/ParseArgs.js";

const options = {
    flags: [
        {
            long: "pack",
            short: "p",
            default: "a.json",
            desc: "retrieve scripts from directories and insert into a game file",
            boolean: false,
        },
    ],
};

describe(`test flag name and values`, () => {
      it(`flag pack will exist`, () => {
            const argv = "node . --email who@where.com -n user".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.notStrictEqual(parsed.flags.pack, undefined);
      });
      it(`flag pack has correct ("a.json") default value`, () => {
            const argv = "node . --email who@where.com -n user".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.strictEqual(parsed.flags.pack, "a.json");
      });
});

