import ParseArgs from "../src/ParseArgs.js";

const parsed = new ParseArgs().loadOptions().run();
console.log(parsed);