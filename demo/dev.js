#!/usr/bin/env node
import ParseArgs from "../src/ParseArgs.js";

const definitions = {    
    flags: [
        {
            long: "verbose",
            short: "v",
            type: "count",
            default: -1
        }
    ]
}

const parseArgs = new ParseArgs(definitions);
console.log(parseArgs);
