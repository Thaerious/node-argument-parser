import ParseArgs from "../src/ParseArgs.js";

const parsed = new ParseArgs().loadOptions().run(process.argv);
console.log(parsed);