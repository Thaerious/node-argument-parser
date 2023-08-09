/**
 * An object that defines how to handle intercepted 'get' operations.
 * This handler returns the value of the flag when performing a 'get'.
 * The '4' parameter returns the target object without the handler.
 */
const handler = {
    get(target, prop, reciever) {
        if (prop === "$") return target;

        if (!target[prop]) {
            target[prop] = {
                options: {
                    long: prop,
                    type: "default",
                    default: undefined
                },
                value: undefined,
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
            if (option.type === "default") option.default = option.default ?? undefined;
            if (option.type === undefined) option.default = option.default ?? undefined;

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