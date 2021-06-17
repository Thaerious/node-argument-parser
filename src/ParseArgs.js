class ParseArgs {
    constructor(options = {}) {
        this.options = options;
        this.consumers = [];
        this.aliases = {};

        this.processed = {
            flags: {},
            args: [],
        }

        this.setup();
    }

    run(argv) {
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
        if (arg.startsWith("--")) this.processDoubleDash(arg, true);
        else if (arg.startsWith("  ")) this.processDoubleDash(arg, false);
        else if (arg.startsWith(" ") && arg.length === 2) this.processSingleDash(arg);
        else if (arg.startsWith("-")) this.processInlineSingleDash(arg);
        else if (this.consumers.length > 0) this.consumeArgument(arg);
        else this.processed.args.push(arg);
    }

    processDoubleDash(arg) {
        const flag = arg.substr(2);
        this.processed.flags[flag] = true;

        if (!this.options[flag]?.boolean) {
            this.consumers.push((value) => this.processed.flags[flag] = value);
        }
    }

    processSingleDash(arg, clearConsumers) {
        const flag = arg.substr(1);

        if (clearConsumers) this.consumers = [];

        if (this.aliases[flag]) {
            this.process("--" + this.aliases[flag]);
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
        const consumer = this.consumers.pop();
        consumer(arg);
    }

    setup() {
        for (const flag in this.options) {
            const option = this.options[flag];

            this.processed.flags[flag] = option.default ? option.default : false;

            if (option.short) {
                this.aliases[option.short] = flag;
            }
        }
    }
}

export default ParseArgs;