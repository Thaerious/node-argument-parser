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

const args = new ParseArgs(options);
// console.log(args.pack, args.exit, args.verbose);
console.log(args.packed, args.name, args.default);