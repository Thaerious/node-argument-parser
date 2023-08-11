#!/usr/bin/env node
import ParseArgs from "../src/ParseArgs.js";
import helpString from "../src/helpString.js";

const options = {    
    name: "index",
    short: "demonstrate simple parse args usage",
    synopsis: "node index.js [OPTIONS]",
    flags: [
        {
            long: "pack",
            short: "p",
            default: "a.json",
            type: "string",
        },
        {
            long: "exit",
            short: "x",
            type: "boolean",
            desc: "Exit after use."
        },
        {
            long: "verbose",
            short: "v",
            type: "count",
            desc: "Display more information.  Multiple -v options increase the verbosity."
        }  
    ]
};

console.log(helpString(options));
const parseArgs = new ParseArgs(options);
console.log(parseArgs);
