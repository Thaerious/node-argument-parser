import assert from "assert";
import Flags from "../src/Flags.js";

const options = {
    flags: [
        {
            long: "pack",
            short: "p",
            default: "a.json",
            desc: "retrieve scripts from directories and insert into a game file",
            type: "string",
        },
        {
            long: "imaflag",
            short: "i",
            desc: "let the world know I'm a flag"
        },
        {
            long: "count",
            short: "c",
            desc: "count me",
            type: "count"
        },
    ]
};

describe(`Tast Flags.js`, function () {
    before(function () {
        this.flags = new Flags(options);
    });

    describe(`known flag`, function () {
        it(`exists for the long form name`, function () {
            assert.ok(this.flags.pack);
        });

        it(`exists for the short form name`, function () {
            assert.ok(this.flags.p);
        });
        
        it(`long and short form are the same object`, function () {
            assert.strictEqual(this.flags.pack, this.flags.p);
        });    
        
        it(`has default value`, function () {
            assert.strictEqual(this.flags.pack.value, "a.json");
        });           
    });

    describe(`flag without type has an udefined default value`, function () {
        it(`has value 'undefined'`, function () {
            assert.strictEqual(undefined, this.flags.imaflag.value);
        });
    });    
    
    describe(`count flag without type default value`, function () {
        it(`has value 0`, function () {
            assert.strictEqual(0, this.flags.count.value);
        });
    });

    describe(`unknown flag`, function () {
        it(`exists for the long form name`, function () {
            assert.ok(this.flags.unknown);
        });
        
        it(`has default value of undefined`, function () {
            assert.strictEqual(this.flags.unknown.value, undefined);
        });           
    });    
}); 