import fs from "fs";

class ParseArgs {
    constructor(options = {}) {
        this.options = options;
        this.consumers = [];
        this.aliases = {};
        this.ignoreFlags = false;

        // parsed values
        this.processed = {
            flags: {},
            args: [],
        }

        this.setupOptions();
    }

    loadOptions(filename = ".parseArgs"){
        if (typeof filename == "string"){
            const json = fs.readFileSync(filename);
            this.options = JSON.parse(json);
        } else {
            this.options = filename;
        }

        this.setupOptions();
        return this;
    }

    run(argv = process.argv) {
        for (const arg of argv) this.process(arg);
        return this;
    }

    get flags() {
        return this.processed.flags;
    }

    get args() {
        return this.processed.args;
    }

    process(arg) {
        if (this.ignoreFlags){
            if (this.consumers.length > 0) this.consumeArgument(arg);
            else this.processed.args.push(arg);
            return;
        }

        if (arg === "--"){
            this.ignoreFlags = true;
            return;
        }

        if (arg.startsWith("--")) this.processDoubleDash(arg, true);
        else if (arg.startsWith("  ")) this.processDoubleDash(arg, false);
        else if (arg.startsWith(" ") && arg.length === 2) this.processSingleDash(arg);
        else if (arg.startsWith("-")) this.processInlineSingleDash(arg);
        else if (this.consumers.length > 0) this.consumeArgument(arg);
        else this.processed.args.push(arg);
    }

    processDoubleDash(arg, clearConsumers) {
        if (clearConsumers) this.consumers = [];
        const flag = arg.substr(2);
        this.processed.flags[flag] = true;

        if (!this.options.dict[flag]?.boolean) {
            this.consumers.push((value) => this.processed.flags[flag] = value);
        }
    }

    processSingleDash(arg) {
        const flag = arg.substr(1);

        if (this.aliases[flag]) {
            this.process("  " + this.aliases[flag]);
        } else {
            this.processed.flags[arg.substr(1)] = true;
        }
    }

    processInlineSingleDash(arg){
        this.consumers = [];
        for (let c of [...arg.substr(1)]) {
            this.process(" " + c);
        }
    }

    consumeArgument(arg){
        const consumer = this.consumers.shift();
        consumer(arg);
    }

    setupOptions() {
        this.options.dict = {};
        if (!this.options.flags) return;

        for (const flag of this.options.flags) {
            // fill the default values
            this.processed.flags[flag.long] = flag.default ? flag.default : false;

            if (flag.short) {
                this.aliases[flag.short] = flag.long;
            }

            // Dictionary provides an easy lookup by flag name.
            this.options.dict[flag.long] = flag;
        }
    }
}

export default ParseArgs;