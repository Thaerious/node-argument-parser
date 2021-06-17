// noinspection JSUnresolvedFunction

import assert from 'assert';
import ParseArgs from "../src/ParseArgs.js";

describe(`default behaviour`, ()=>{
    describe(`single char flags`, ()=>{
        it(`-a flag gives a == true`, ()=>{
            const argv = ["-a"];
            const parsed = new ParseArgs().run(argv);
            assert.strictEqual(parsed.flags.a, true);
        });
    });

    describe(`inline single char flags`, ()=>{
        it(`-ab flag gives a == true & b == true`, ()=>{
            const argv = ["-ab"];
            const parsed = new ParseArgs().run(argv);
            assert.strictEqual(parsed.flags.a, true);
            assert.strictEqual(parsed.flags.b, true);
        });
    });

    describe(`double hyphen flags`, ()=>{
        describe(`node . --email who@where.com --name --password true`, ()=> {
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

    describe(`Unprocessed args, are put into the args field which is an array.`, ()=>{
        describe(`node . --email who@where.com -n name password`, ()=>{
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
});

