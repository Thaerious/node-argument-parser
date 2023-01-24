import ParseArgs from "../src/ParseArgs.js";

const options = {
    flags: [
        {
            long: "pack",
            short: "p",
            default: "a.json",
            desc: "retrieve scripts from directories and insert into a game file",
            type: "boolean",
        },
        {
            long: "imaflag",
            short: "i",
            desc: "let the world know I'm a flag"            
        },                
    ]
};

const parsed = new ParseArgs(options).run();
console.log(parsed.flags);
console.log(parsed.tally);
console.log("parsed.args = " + parsed.args);
