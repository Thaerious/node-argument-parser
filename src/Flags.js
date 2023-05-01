
const handler = {
    get(target, prop, reciever) {
        if (prop === "$") return target;

        if (!target[prop]) {
            target[prop] = {
                options: {
                    long: prop,
                    type: "default",
                    default: false
                },
                value: false,
                rule_applied: 0
            }
        }

        return target[prop];
    }
}

class Flags {
    constructor(options = { flags: [] }) {
        for (const option of options.flags) {
            if (option.type === "count" && !option.hasOwnProperty("default")) {
                option.default = 0;
            }

            if (option.type === "string") option.default = `${option.default}`;
            if (option.type === "boolean") option.default = false;           
            if (option.type === undefined) option.default = option.default ?? false;

            const flag = {
                options: option,
                rule_applied: 1,
                value: option.default
            };

            this[option.long] = flag;
            if (option.short) this[option.short] = flag;
        }

        return new Proxy(this, handler)
    }
}

export default Flags;