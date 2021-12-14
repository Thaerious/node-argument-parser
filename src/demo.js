import ParseArgs from "../src/ParseArgs.js";

const options = {
    flags: [
        {
            long: "pack",
            short: "p",
            default: "a.json",
            desc: "retrieve scripts from directories and insert into a game file",
            type: "boolean",
        }
    ]
};

const parsed = new ParseArgs(options).run();
console.log(parsed.directory);
console.log("parsed.args = " + parsed.args);