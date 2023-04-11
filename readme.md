# Description
Simple command line argument parser for NodeJS CLI programs to maintain a consistent pattern for command line arguments.

Features:
* Parses single hyphen (-) and double hyphen (--) arguments.
* Permits configuration files or objects.
* Count flag occurances.

# Usage
``` bash
npm i @thaerious/parseargs
```

``` js
import ParseArgs from "@thaerious/parseArgs"
const args = new ParseArgs().run();

if (args.flags["flag_name"]) /* do something */ ;
if (args.tally["flag_name"] > 0) /* do something */;
```

## Default Behaviour
Default behaviour is used when no configuration has been set.

Flags consume the next argument as their value.

``` bash
$ node src/demo.js --flag x
# { flag: 'x' }
```

Flags are preceeded by a single or double dash. Otherwise they are considered
values and assigend to the preceeding flag.
Flags without a value is assigned boolean 'true'.
``` bash
$ node src/demo.js --flag -f x
# { flag: true, f: 'x' }
```

The flag will take the value of it's last assignment.
``` bash
$ node src/demo.js --flag a --flag b
# { flag: 'b' }
```

Nothing after a double dash is processed.  Use the '#args' field to get an array of
unconsumed arguments (include the node command and the filename).
``` bash
$ node src/demo.js --flag a -- -b x
# { flag: 'a' }
# args.args = {/opt/node/17.0.1/bin/node, /mnt/d/project/trunk/node-argument-parser/src/demo.js, -b, x}
```


## Custom Behaviour
* Flags with options must have a long form name.
* The default value will be used if no value is available.
* Flags of type 'string' with no default will be assigned the empty string as it's default.
* Setting type to boolean will prevent the flag from consuming a parameter.

``` js
const options = {    
    flags: [
        {
            long: "pack",
            short: "p",
            default: "a.json",
            desc: "retrieve scripts from directories and insert into a game file",
            type: "string",
        },
        {
            long: "exit",
            short: "x",
            desc: "exit after executing",
            type: "boolean",
        }  
    ]
};

import ParseArgs from "@thaerious/parseArgs"
const args = new ParseArgs().config(opton).run();

if (args.flags["flag_name"]) /* do something */ ;
if (args.tally["flag_name"] > 0) /* do something */;

```