// noinspection JSUnresolvedFunction

import assert from 'assert';
import ParseArgs from '../src/ParseArgs.js';
import FS from 'fs';

let defaultOptions = FS.readFileSync("test/parseArgs.json", "utf-8");

describe(`default behaviour`, () => {
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

    describe(`Unprocessed args, are put into the args field which is an array.`, () => {
        describe(`node . --email who@where.com -n name password`, () => {
            it(`n will be boolean true"`, () => {
                const argv = "node . --email who@where.com -n name password".split(/[ ]+/g);
                const parsed = new ParseArgs().run(argv);
                assert.strictEqual(parsed.flags.n, true);
            });

            it(`the 3rd unprocessed arg will be 'name'`, () => {
                const argv = "node . --email who@where.com -n name password".split(/[ ]+/g);
                const parsed = new ParseArgs().run(argv);
                assert.strictEqual(parsed.args[2], 'name');
            });

            it(`the 4th unprocessed arg will be 'password'`, () => {
                const argv = "node . --email who@where.com -n name password".split(/[ ]+/g);
                const parsed = new ParseArgs().run(argv);
                assert.strictEqual(parsed.args[3], 'password');
            });
        });
    });

    describe(`repeat variables will be overwritten`, () => {
        describe(`node . --email who@where.com --email where@who.com`, () => {
            it(`email will equal where@who.com`, () => {
                const argv = "node . --email who@where.com --email where@who.com".split(/[ ]+/g);
                const parsed = new ParseArgs().loadOptions(defaultOptions).run(argv);
                assert.strictEqual(parsed.flags.email, 'where@who.com');
            });
        });
    });

    describe(`double hyphen parses as parameters not flags`, () => {
        describe(`node . --email who@where.com -- --notaflag`, () => {
            it(`third argument will be '--notaflag'`, () => {
                const argv = "node . --email who@where.com -- --notaflag".split(/[ ]+/g);
                const parsed = new ParseArgs().loadOptions(defaultOptions).run(argv);
                assert.strictEqual(parsed.args[2], '--notaflag');
            });
        });
    });
});

describe(`custom behaviour`, () => {
    describe(`node . --email who@where.com -n user`, () => {
        it(`email will be who@where.com`, () => {
            const argv = "node . --email who@where.com -n user".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(defaultOptions).run(argv);
            assert.strictEqual(parsed.flags.email, 'who@where.com');
        });
        it(`name will be user`, () => {
            const argv = "node . --email who@where.com -n user".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(defaultOptions).run(argv);
            assert.strictEqual(parsed.flags.name, 'user');
        });
        it(`password will be super_secret (the default value)`, () => {
            const argv = "node . --email who@where.com -n user".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(defaultOptions).run(argv);
            assert.strictEqual(parsed.flags.password, 'super_secret');
        });
    });

    describe(`multiple inline character flags`, () => {
        describe(`node . -en who@where.com user`, () => {
            it(`email will be who@where.com`, () => {
                const argv = "node . -en who@where.com user".split(/[ ]+/g);
                const parsed = new ParseArgs().loadOptions(defaultOptions).run(argv);
                assert.strictEqual(parsed.flags.email, 'who@where.com');
            });
            it(`name will be user`, () => {
                const argv = "node . -en who@where.com user".split(/[ ]+/g);
                const parsed = new ParseArgs().loadOptions(defaultOptions).run(argv);
                assert.strictEqual(parsed.flags.name, 'user');
            });
        });
        describe(`extra arguments go into the args field`, () => {
            describe(`node . -en who@where.com user extra1 extra2`, () => {
                it(`the 1st unprocessed arg will be 'node'`, () => {
                    const argv = "node . -en who@where.com user extra1 extra2".split(/[ ]+/g);
                    const parsed = new ParseArgs().loadOptions(defaultOptions).run(argv);
                    assert.strictEqual(parsed.args[0], 'node');
                });
                it(`the 2nd unprocessed arg will be '.'`, () => {
                    const argv = "node . -en who@where.com user extra1 extra2".split(/[ ]+/g);
                    const parsed = new ParseArgs().loadOptions(defaultOptions).run(argv);
                    assert.strictEqual(parsed.args[1], '.');
                });
                it(`the 3rd unprocessed arg will be 'extra1'`, () => {
                    const argv = "node . -en who@where.com user extra1 extra2".split(/[ ]+/g);
                    const parsed = new ParseArgs().loadOptions(defaultOptions).run(argv);
                    assert.strictEqual(parsed.args[2], 'extra1');
                });
                it(`the 4th unprocessed arg will be 'extra2'`, () => {
                    const argv = "node . -en who@where.com user extra1 extra2".split(/[ ]+/g);
                    const parsed = new ParseArgs().loadOptions(defaultOptions).run(argv);
                    assert.strictEqual(parsed.args[3], 'extra2');
                });
            });
        });
    });

    describe(`boolean set to true, doesn't read next argument (value is set to true when present)`, () => {
        it(`value will be 'true' when 'boolean' flag present`, () => {
            const argv = "node . --has-value ima-arg".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(defaultOptions).run(argv);
            assert.strictEqual(parsed.flags['has-value'], true);
        });
        it(`third arg will be present (not consumed by flag)`, () => {
            const argv = "node . --has-value ima-arg".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(defaultOptions).run(argv);
            assert.strictEqual(parsed.args[2], "ima-arg");
        });
        it(`value will be 'false' when 'boolean' flag not present`, () => {
            const argv = "node . ima-arg".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(defaultOptions).run(argv);
            assert.strictEqual(parsed.flags['has-value'], false);
        });
    });
});