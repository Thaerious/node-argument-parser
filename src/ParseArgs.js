import Flags from "./Flags.js";

const CHAR_FLAG_REGEX = /^-[a-zA-Z0-9]/g;
const WORD_FLAG_REGEX = /^--[a-zA-Z0-9-_.]+/g;

class ParseArgs {
    constructor(options, argv = process.argv) {
        options = {
            flags: [],
            ...options
        }

        if (typeof options === "string") {
            this.flags = new Flags(JSON.parse(options));
        } else {
            this.flags = new Flags(options);
        }

        const s1 = this.createStack(argv);
        const s2 = this.splitSingles(s1);
        const s3 = this.nameParameters(s2);
        this.args = this.applyValues(s3);

        // Assign values to final result.
        const map = {}
        for (let key in this.flags) {
            // Copy short value to long.
            if (key === this.flags[key].options.short) {
                const long = this.flags[key].options.long;
                map[long] = this.flags[key].value;
            }
            else
            {
                map[key] = this.flags[key].value;
            }

            // Assign to process.env if needed.
            if (this.flags[key].options.env) {
                console.log(this.flags[key]);
                process.env[this.flags[key].options.env] = this.flags[key].value;
            }
        }
        map.$ = this.args;
        
        return map;
    }

    /**
     * Step 1:
     * Create a stack of objects from the arguments array.
     * Each object contains only the raw command line argument.
     */
    createStack(argv) {
        return argv.map(value => ({ raw: value }));
    }

    /**
     * Step 2:
     * Split up multiple singles on the stack.
     * If singles are conjoined (-abf), they become multipled objects on the stack (-a -b -f).
     */
    splitSingles(stack) {
        return stack.map(value => {
            const match = value.raw.match(/^-[a-zA-Z][a-zA-Z]+/g);
            if (match) {
                return [...value.raw.substring(1)].map(char => ({ raw: `-${char}` }));
            }
            else return value;
        }).flat();
    }

    /** Step 3:
     * Assign each parameter a name and a type.
     * The type is determined by the number of dashes in front of the parameter.
     * The name is the parameter without dashes.
     * If it's a single character flag with a matching long-form flag, the long-form is used.
     * Arguments without dashes (parameters) are not assigned a name.
     * 
     * { 
     *   raw  : string
     *   name : string
     *   type : [key, value, op]
     * }
     * 
     * Each parameter will get a type:
     *   key = a paremeter's name
     *   value = a potential value
     *   op = special operation parameter
     */
    nameParameters(stack) {
        return stack.map(value => {
            const singleDash = value.raw.match(CHAR_FLAG_REGEX);
            const doubleDash = value.raw.match(WORD_FLAG_REGEX);

            if (value.raw === "--") {
                value.type = "op";
            }
            else if (singleDash) {
                value.name = value.raw.substring(1);
                value.type = "key";
            }
            else if (doubleDash) {
                value.name = value.raw.substring(2);
                value.type = "key";
            } else {
                value.type = "value";
            }
            return value;
        });
    }

    /**
     * Step 4:
     * Process annotated parameter object.
     * 
     * Apply one of the following rules (in order) to all key parameters:
     * If the option-type is boolean the value is true.
     * If the option-type if count the value is 1.
     * If the option is long form and the next command line parameter is a value then use that value.
     * If the option has a default then use the default value.
     * The value is set to true.
     * 
     * Values which are used for a key are not returned in the resulting array.
     * A '--' operator will terminate processing and just push remaining commmand line parameters
     * back on to the returned array.
     **/
    applyValues(stack) {
        const returnArgs = []; // return arguments

        for (let i = 0; i < stack.length; i++) {
            const arg = stack[i];

            if (arg.raw === "--") { // early termination
                for (let j = i + 1; j < stack.length; j++) {
                    returnArgs.push(stack[j].raw);
                }
                return returnArgs;
            }

            if (arg.type !== 'key') {
                returnArgs.push(arg.raw);
                continue;
            }

            const flag = this.flags[arg.name];

            if (flag.options.type === "boolean") {
                flag.value = true;
                flag.rule_applied = 11;
            }
            else if (flag.options.type === "count") {
                flag.value++;
                flag.rule_applied = 12;
            }
            else if (stack[i + 1] && stack[i + 1].type === 'value') {
                if (flag.options.type === "string") {
                    flag.value = `${stack[++i].raw}`;
                    flag.rule_applied = 13;
                }
                else if (flag.options.type === "number") {
                    flag.value = Number(`${stack[++i].raw}`);
                    flag.rule_applied = 14;
                }                
                else {
                    flag.value = stack[++i].raw;
                    flag.rule_applied = 15;
                }
            }
            else if (flag.options.default) {
                if (flag.options.type === "string") {
                    flag.value = `${flag.options.default}`;
                    flag.rule_applied = 16;
                }
                else if (flag.options.type === "number") {
                    flag.value = Number(`${stack[++i].raw}`);
                    flag.rule_applied = 17;
                }                                
                else {
                    flag.value = flag.options.default;
                    flag.rule_applied = 18;
                }
            }
            else {
                flag.value = true;
                flag.rule_applied = 19;
            }
        }
        return returnArgs;
    }
}

export default ParseArgs;