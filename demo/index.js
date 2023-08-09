#!/usr/bin/env node
import ParseArgs from "../src/ParseArgs.js";

const options = {    
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
        },
        {
            long: "verbose",
            short: "v",
            type: "count",
        }  
    ]
};

const parseArgs = new ParseArgs(options);
console.log(parseArgs);
