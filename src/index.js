import ParseArgs from "../src/ParseArgs.js";

const parsed = new ParseArgs().run(process.argv);
console.log(parsed);