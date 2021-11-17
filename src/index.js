import ParseArgs from "../src/ParseArgs.js";

const options = {
      flags: [
          {
              long:  "alpha",
              short: "a",
              type:  "boolean",
          },
          {
              long:    "foxtrot",
              short:   "f",
              default: "dance",
          },
          {
              long:  "xray",
              short: "x"
          },
      ],
  };
 
const parser = new ParseArgs();
parser.loadOptions(options);
const argv = process.argv;
const s1 = parser.createStack(argv);
const s2 = parser.splitSingles(s1);
const s3 = parser.nameParameters(s2);
const s4 = parser.applyValues(s3);
parser.process(s4);

console.log(s2);
console.log(parser);