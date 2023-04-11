// noinspection JSUnresolvedFunction

import assert from 'assert';
import ParseArgs from '../src/ParseArgs.js';
import FS from 'fs';

let defaultOptions = FS.readFileSync("test/parseArgs.json", "utf-8");

describe(`default behaviour (no options)`, () => {
    describe(`single char flags`, () => {
        it(`-a flag gives a == true`, () => {
            const argv = ["-a"];
            const parsed = new ParseArgs().run(argv);
            assert.strictEqual(parsed.flags.a, true);
        });
    });

    describe(`inline single char flags`, () => {
        it(`-ab flag gives a == true & b == true`, () => {
            const argv = ["-ab"];
            const parsed = new ParseArgs().run(argv);
            assert.strictEqual(parsed.flags.a, true);
            assert.strictEqual(parsed.flags.b, true);
        });
    });

    describe(`double hyphen flags`, () => {
        describe(`node . --email who@where.com --name --password true`, () => {
            it(`email will be set to the string "who@where.com"`, () => {
                const argv = "node . --email who@where.com --name --password true".split(/[ ]+/g);
                const parsed = new ParseArgs().run(argv);
                assert.strictEqual(parsed.flags.email, 'who@where.com');
            });
            it(`name will be set to boolean true`, () => {
                const argv = "node . --email who@where.com --name --password true".split(/[ ]+/g);
                const parsed = new ParseArgs().run(argv);
                assert.strictEqual(parsed.flags.name, true);
            });
            it(`password will be set to string true`, () => {
                const argv = "node . --email who@where.com --name --password true".split(/[ ]+/g);
                const parsed = new ParseArgs().run(argv);
                assert.strictEqual(parsed.flags.password, 'true');
            });
        });
    });

    describe(`repeat variables will be overwritten`, () => {
        describe(`node . --email who@where.com --email where@who.com`, () => {
            it(`email will equal where@who.com`, () => {
                const argv = "node . --email who@where.com --email where@who.com".split(/[ ]+/g);
                const parsed = new ParseArgs().config(defaultOptions).run(argv);
                assert.strictEqual(parsed.flags.email, 'where@who.com');
            });
        });
    });

    describe(`double hyphen parses as parameters not flags`, () => {
        describe(`node . --email who@where.com -- --notaflag`, () => {
            it(`third argument will be '--notaflag'`, () => {
                const argv = "node . --email who@where.com -- --notaflag".split(/[ ]+/g);
                const parsed = new ParseArgs().config(defaultOptions).run(argv);
                assert.strictEqual(parsed.args[2], '--notaflag');
            });
        });
    });
});

describe(`custom behaviour`, () => {
    describe(`node . --email who@where.com -n user`, () => {
        it(`email will be who@where.com`, () => {
            const argv = "node . --email who@where.com -n user".split(/[ ]+/g);
            const parsed = new ParseArgs().config(defaultOptions).run(argv);
            assert.strictEqual(parsed.flags.email, 'who@where.com');
        });
        it(`name will be user`, () => {
            const argv = "node . --email who@where.com -n user".split(/[ ]+/g);
            const parsed = new ParseArgs().config(defaultOptions).run(argv);
            assert.strictEqual(parsed.flags.name, 'user');
        });
        it(`password will be super_secret (the default value)`, () => {
            const argv = "node . --email who@where.com -n user".split(/[ ]+/g);
            const parsed = new ParseArgs().config(defaultOptions).run(argv);
            assert.strictEqual(parsed.flags.password, 'super_secret');
        });
    });

    describe(`boolean set to true, doesn't consume next argument (value is set to true when present)`, () => {
        it(`value will be 'true' when 'boolean' flag present`, () => {
            const argv = "node . --has-value ima-arg".split(/[ ]+/g);
            const parsed = new ParseArgs().config(defaultOptions).run(argv);
            assert.strictEqual(parsed.flags['has-value'], true);
        });
        it(`third arg will be present (not consumed by flag)`, () => {
            const argv = "node . --has-value ima-arg".split(/[ ]+/g);
            const parsed = new ParseArgs().config(defaultOptions).run(argv);
            assert.strictEqual(parsed.args[2], "ima-arg");
        });
        it(`value will be 'false' when 'boolean' flag not present`, () => {
            const argv = "node . ima-arg".split(/[ ]+/g);
            const parsed = new ParseArgs().config(defaultOptions).run(argv);
            assert.strictEqual(parsed.flags['has-value'], false);
        });
    });
});