import assert from "assert";
import ParseArgs from "../src/ParseArgs.js";

const options = {
    flags: [
        {
            long: "pack",
            short: "p",
            default: "a.json",
            desc: "retrieve scripts from directories and insert into a game file"            
        },
    ],
};

describe(`count the number of times a flag occurs`, () => {
    describe(`known flags get 0 if not present`, () => {
        it(`occurs 1 time`, () => {
            const argv = "node . --flag".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.strictEqual(parsed.count("pack"), 0);
        });
    });    
    describe(`unknown flags get 0 if not present`, () => {
        it(`occurs 1 time`, () => {
            const argv = "node . --flag".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.strictEqual(parsed.count("notaflag"), 0);
        });
    });        
    describe(`default long form flag`, () => {
        it(`occurs 1 time`, () => {
            const argv = "node . --flag".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.notStrictEqual(parsed.count["flag"], 1);
        });
        it(`occurs 3 times`, () => {
            const argv = "node . --flag --flag --flag".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.notStrictEqual(parsed.count["flag"], 3);
        });
    });
    describe(`default short form flag`, () => {
        it(`occurs 1 time`, () => {
            const argv = "node . -f".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.notStrictEqual(parsed.count["f"], 1);
        });
        it(`occurs 3 times seperated`, () => {
            const argv = "node . -f -f -f".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.notStrictEqual(parsed.count["f"], 3);
        });
        it(`occurs 3 times conjoined`, () => {
            const argv = "node . -fff".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.notStrictEqual(parsed.count["f"], 3);
        });        
    });    
    describe(`mixed form flags`, () => {
        it(`occurs 2 times`, () => {
            const argv = "node . -p --pack".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.notStrictEqual(parsed.count["pack"], 1);
        });
        it(`occurs 4 times seperated`, () => {
            const argv = "node . -pp --pack --pack".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.notStrictEqual(parsed.count["pack"], 4);
        });
        it(`occurs 5 times conjoined`, () => {
            const argv = "node . -p -pp --pack -p".split(/[ ]+/g);
            const parsed = new ParseArgs().loadOptions(options).run(argv);
            assert.notStrictEqual(parsed.count["f"], 5);
        });        
    });        
});
