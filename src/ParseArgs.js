import fs from "fs";

const CHAR_FLAG_REGEX = /^-[a-zA-Z0-9]/g;
const WORD_FLAG_REGEX = /^--[a-zA-Z0-9-_.]+/g;

class ParseArgs {
    constructor() {
        this.processed = {
            flags: {},
            count : {},
            args: [],
        }

        this.options = {
            flags: [],
            dict: {},
            aliases: {}
        }
    }

    /**
     * Load options from an options object or JSON string of an config object.
     * This will overwrite previous configurations.
     **/
    config(options){
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

    /**
     * Return a non-reflective object with all flag key-values.
     */
    get flags() {
        return {...this.processed.flags};
    }

    /**
     * Return a non-reflective array with all unprocessed values.
     */    
    get args() {
        return [...this.processed.args];
    }

    /**
     * Return a non-reflective object with all flag counts.
     */    
    get tally(){
        return { ...this.processed.count };
    }

    /**
     * Return the count for a specfic flag, 0 if the flag doesn't exist.
     */        
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
     * Apply one of the following rules (in order) to all key parameters:
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
        const returnArgs = []; // return arguments
        const terminate_op = false;

        for (let i = 0; i< argv.length; i++){            
            const arg = argv[i];

            // create dummy option when none available
            const option = this.options.dict[arg.name] ?? {long : arg.name};
            
            if (arg.raw === "--"){ // early termination
                for (let j = i+1; j < argv.length; j++){
                    returnArgs.push({
                        raw : argv[j].raw,
                        type : "value"
                    });
                }
                return returnArgs;
            }
            
            if (arg.type !== 'key'){
                returnArgs.push(arg);
            }
            else if (option.type === "boolean"){
                // it is a key and of type boolean so it's value is true
                arg.value = true;
                returnArgs.push(arg);
            }
            else if (argv[i + 1] && argv[i + 1].type === 'value'){
                // the next object is a value, use it for this key
                arg.value = argv[++i].raw;
                if (option.type == "string") arg.value = `${arg.value}`;
                returnArgs.push(arg);
            }
            else if (option.default){
                // no value provided use the default value if provided
                arg.value = option.default;
                if (option.type == "string") arg.value = `${arg.value}`;
                returnArgs.push(arg);
            }
            else{
                // no default, use true
                arg.value = true;
                returnArgs.push(arg);
            }
        }
        return returnArgs;
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
    doCount(argv) {
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

        for (const flagOption of this.options.flags) {
            // fill the default values
            if (flagOption.type === "string") {
                this.processed.flags[flagOption.long] = flagOption.default ? `${flagOption.default}` : "";
            } else {
                this.processed.flags[flagOption.long] = flagOption.default ? flagOption.default : false;
            }

            if (flagOption.short) {
                this.options.aliases[flagOption.short] = flagOption.long;
            }

            // Dictionary provides an easy lookup by flag name.
            this.options.dict[flagOption.long] = flagOption;
        }
    }
}

export default ParseArgs;