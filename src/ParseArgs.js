import fs from "fs";

const CHAR_FLAG_REGEX = /^-[a-zA-Z0-9]/g;
const WORD_FLAG_REGEX = /^--[a-zA-Z0-9-_.]+/g;

class ParseArgs {
    constructor(options = {flags : []}) {
        // parsed values
        this.processed = {
            flags: {},
            count : {},
            args: [],
        }

        this.loadOptions(options);
    }

    /**
     * Load options from an options object or JSON string of an 
     * options object.
     **/
    loadOptions(options){
        if (typeof options === "string"){
            this.options = JSON.parse(options);
        } else {
            this.options = options;
        }
            
        this.setupOptions();
        return this;
    }

    run(argv = process.argv) {
        const s1 = this.createStack(argv);
        const s2 = this.splitSingles(s1);
        const s3 = this.nameParameters(s2);
        const s4 = this.applyValues(s3);
        const s5 = this.process(s4);
        this.doCount(s5);
        return this;
    }

    get directory(){
        const r = {};
        for (const flag in this.processed.count){
            r[flag] = this.processed.flags[flag];
        }
        return r;
    }

    get flags() {
        return {...this.processed.flags};
    }

    get args() {
        return [...this.processed.args];
    }

    count(flag){
        return this.processed.count[flag] ?? 0;
    }

    /**
     * Step 1:
     * Create a stack of objects from array of all arguments
     * Each object contains only the raw command line value
     */
    createStack(argv){
        return argv.map(value => ({raw : value}));
    }

    /**
     * Process the result from create stack to split up multiple singles
     * If singles are conjoined (-abf), they become multipled objects on the stack (-a -b -f).
     */
    splitSingles(argv){
        return argv.map(value => {
            const match = value.raw.match(/^-[a-zA-Z][a-zA-Z]+/g);
            if (match){
                return [...value.raw.substring(1)].map(char => ({raw : `-${char}`}));
            }
            else return value;
        }).flat();
    }

    /**
     * Each parameters will get a name.
     * The name is the parameter without dashes.
     * If it's a single character with a matching long-form, the long-form is used.
     * Parameters without dashes will not be given a name.
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
     *   op = a parementer with special meaning
     */
    nameParameters(argv){
        return argv.map(value => {
            const singleDash = value.raw.match(CHAR_FLAG_REGEX);
            const doubleDash = value.raw.match(WORD_FLAG_REGEX);

            if (value.raw === "--"){
                value.type = "op";
            }
            else if (singleDash){
                value.name = value.raw.substring(1);
                value.name = this.options.aliases[value.name] ?? value.name;  
                value.type = "key";         
            }
            else if (doubleDash){
                value.name = value.raw.substring(2);
                value.type = "key";
            } else {
                value.type = "value";
            }
            return value;
        });
    }

    /**
     * Process each parameter returned from nameParameters and apply a value.
     * 
     * Apply one of the following rules in order to all key parameters:
     * If the option-type is boolean the value is true.
     * If the option is long form and the next command line parameter is a value then use that value.
     * If the option has a default then use the default value.
     * The value is set to true.
     * 
     * Values which are used for a key are not returned in the resulting array.
     * A '--' operator will terminate processing and just push remaining commmand line parameters
     * back on to the returned array.
     **/
    applyValues(argv){
        const argr = []; // return arguments
        const terminate_op = false;

        for (let i = 0; i< argv.length; i++){            
            const value = argv[i];

            // create dummy option when none available
            const option = this.options.dict[value.name] ?? {long : value.name};
            
            if (value.raw === "--"){ // early termination
                for (let j = i+1; j < argv.length; j++){
                    argr.push({
                        raw : argv[j].raw,
                        type : "value"
                    });
                }
                return argr;
            }

            if (value.type !== 'key'){
                argr.push(value);
            }
            else if (option.type === "boolean"){
                // it is a key and of type boolean so it's value is true
                value.value = true;
                argr.push(value);
            }
            else if (argv[i + 1] && argv[i + 1].type === 'value'){
                // the next object is a value, use it's value for this key
                value.value = argv[++i].raw;
                argr.push(value);
            }
            else if (option.default){
                // no value provided use the default value if provided
                value.value = option.default;
                argr.push(value);
            }
            else{
                // no default, use true
                value.value = true;
                argr.push(value);
            }
        }
        return argr;
    }

    /**
     * Go through each object returned from applyValues and if it's a key, put the key:value
     * pair in the processed.flags object, otherwise push the unprocessed value to the processed.args
     * array.
     */
    process(argv){
        argv.map(value => {
            if (value.type === "key") this.processed.flags[value.name] = value.value;
            else this.processed.args.push(value.raw);
        });
        return argv;
    }

    /**
     * Count the occurances of all flags on the argument stack.
     * Default to zero if the flag is in the options.
     */
    doCount(argv){
        this.options.flags.map(value => {
            this.processed.count[value.long] = 0;
        });
        argv.map(value => {
            if (value.type === "key"){
                this.processed.count[value.name] = this.processed.count[value.name] ?? 0;
                this.processed.count[value.name]++;
            }
        });
        return argv;
    }

    setupOptions() {
        this.options.dict = {};
        this.options.aliases = {};

        if (!this.options.flags) return;

        for (const flag of this.options.flags) {
            // fill the default values
            this.processed.flags[flag.long] = flag.default ? flag.default : false;

            if (flag.short) {
                this.options.aliases[flag.short] = flag.long;
            }

            // Dictionary provides an easy lookup by flag name.
            this.options.dict[flag.long] = flag;
        }
    }
}

export default ParseArgs;