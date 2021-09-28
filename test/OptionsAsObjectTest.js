import assert from 'assert';
import ParseArgs from "../src/ParseArgs.js";

const options = {
    flags: [
        {
            long: "email",
            short: "e",
            default: "",
            description: "user email",
        },
        {
            long: "name",
            short: "n",
            description: "user name",
        },
        {
            long: "password",
            short: "p",
            default: "super_secret",
            description: "user name",
        },
        {
            long: "has-value",
            short: "h",
            boolean: true,
        },
    ],
};

describe(`custom behaviour`, () => {
    describe(`node . --email who@where.com -n user`, () => {
        it(`email will be who@where.com`, () => {
            const argv = "node . --email who@where.com -n user".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.strictEqual(parsed.flags.email, "who@where.com");
        });
        it(`name will be user`, () => {
            const argv = "node . --email who@where.com -n user".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.strictEqual(parsed.flags.name, "user");
        });
        it(`password will be super_secret (the default value)`, () => {
            const argv = "node . --email who@where.com -n user".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.strictEqual(parsed.flags.password, "super_secret");
        });
    });

    describe(`multiple inline character flags`, () => {
        describe(`node . -en who@where.com user`, () => {
            it(`email will be who@where.com`, () => {
                const argv = "node . -en who@where.com user".split(/[ ]+/g);
                const parsed = new ParseArgs().loadOptions(options).run(argv);
                assert.strictEqual(parsed.flags.email, "who@where.com");
            });
            it(`name will be user`, () => {
                const argv = "node . -en who@where.com user".split(/[ ]+/g);
                const parsed = new ParseArgs().loadOptions(options).run(argv);
                assert.strictEqual(parsed.flags.name, "user");
            });
        });
        describe(`extra arguments go into the args field`, () => {
            describe(`node . -en who@where.com user extra1 extra2`, () => {
                it(`the 1st unprocessed arg will be 'node'`, () => {
                    const argv =
                        "node . -en who@where.com user extra1 extra2".split(
                            /[ ]+/g
                        );
                    const parsed = new ParseArgs().loadOptions(options).run(argv);
                    assert.strictEqual(parsed.args[0], "node");
                });
                it(`the 2nd unprocessed arg will be '.'`, () => {
                    const argv =
                        "node . -en who@where.com user extra1 extra2".split(
                            /[ ]+/g
                        );
                    const parsed = new ParseArgs().loadOptions(options).run(argv);
                    assert.strictEqual(parsed.args[1], ".");
                });
                it(`the 3rd unprocessed arg will be 'extra1'`, () => {
                    const argv =
                        "node . -en who@where.com user extra1 extra2".split(
                            /[ ]+/g
                        );
                    const parsed = new ParseArgs().loadOptions(options).run(argv);
                    assert.strictEqual(parsed.args[2], "extra1");
                });
                it(`the 4th unprocessed arg will be 'extra2'`, () => {
                    const argv =
                        "node . -en who@where.com user extra1 extra2".split(
                            /[ ]+/g
                        );
                    const parsed = new ParseArgs().loadOptions(options).run(argv);
                    assert.strictEqual(parsed.args[3], "extra2");
                });
            });
        });
    });

    describe(`boolean set to true, doesn't read next argument (value is set to true when present)`, () => {
        it(`value will be 'true' when 'boolean' flag present`, () => {
            const argv = "node . --has-value ima-arg".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.strictEqual(parsed.flags["has-value"], true);
        });
        it(`third arg will be present (not consumed by flag)`, () => {
            const argv = "node . --has-value ima-arg".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.strictEqual(parsed.args[2], "ima-arg");
        });
        it(`value will be 'false' when 'boolean' flag not present`, () => {
            const argv = "node . ima-arg".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.strictEqual(parsed.flags["has-value"], false);
        });
    });
});
