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

const parseArgs = new ParseArgs().config(options).run();

for (const flag in parseArgs.flags){
      console.log(`parseArgs.flags["${flag}"] = ${parseArgs.flags[flag]}`);
}