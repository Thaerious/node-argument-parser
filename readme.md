# Description
This is a simple no-dependency NodeJS module for parsing command line arguments in CLI programs. It helps you build command line tools by parsing passed in command line flags. Unlike the built-in argument parser, this module does not require the programmer to declare tracked arguments in advance. Additionally, it allows for counting argument occurances.

Features:
* Parses single hyphen (-) and double hyphen (--) arguments.
* Permits but does not require custom configuration.
* Count flag occurances.

# Installation
``` bash
npm i @thaerious/parseargs
```

# Usage
## Default Behaviour
Flags are prefixed by a single '-', or double '--' dash.  Command line arguments without a dash are treated as (no-flag) values.  A flag followed immediately by a value will be assigned that value.  A flag with no following value will be assigned boolean 'true'.

``` js
import ParseArgs from "@thaerious/parseArgs"
const args = new ParseArgs();
console.log(args.packed, args.name, args.default);
```

``` bash
$ ./index.js --packed --name mittens
true, mittens
```

The flag 'packed' has the value of true because it was not followed by a value.  The flag 'name' has the value 'mittens' because it immediately follows the flag.

## Single Dash Flags
Flags starting with a single dash can be chained.  Only the last flag in the chain will assume a value, if the value is present.

``` js
import ParseArgs from "@thaerious/parseArgs"
const args = new ParseArgs();
console.log(args.a, args.b, args.c);
```

``` bash
$ ./index.js demo/index.js -abc 3
true true 3
```

## Unknown Flags
Flags without a configuration and not present on the command line will have the value 'undefined'.

``` js
import ParseArgs from "@thaerious/parseArgs"
const args = new ParseArgs();
console.log(args.a);
```

``` bash
$ ./index.js demo/index.js
undefined
```

## Custom Behaviour
* Flags must have a long form name.
* Flags may have a short form name.
* The default value will be used if no value is available from the command line.
* String flags with no default will be assigned the empty string as it's default.
* Boolean and Count flags will not consume a command line argument.
* Short forms for a flag will share all values with it's long form.

Flags (non-boolean) can be assigned a default value.  These flags will take on the default
value if none is provided.  Count flags have a default value of 0 if not otherwise specified; they will start counting at their default value.

``` js
import ParseArgs from "../src/ParseArgs.js";
const options = {    
    flags: [
        {
            long: "pack",
            short: "p",
            default: "a.json",
            type: "string",
        },
        {
            long: "exit",
            short: "x",
            type: "boolean",
        },
        {
            long: "verbose",
            short: "v",
            type: "count",
        }  
    ]
};

import ParseArgs from "@thaerious/parseArgs"
const args = new ParseArgs(options);
console.log(args.pack, args.exit, args.verbose);
```

```bash
$ /index.js
a.json false 0
```

### Default Flags (no type)
* The default value of default flags is boolean false.
* Default flags that are present and did not consume an argument will be assigned the value boolean 'true', unless the default otherwise specified.
* Default flags that are present and consumed an argument will be assigned the consumed arguments value.

### String Flags
* The default value of string flags is a zero-length string unless otherwise specified.
* String flags that are present and did not consume an argument will be assigned their default value.
* They consume the next argument if available and use that for their value.

### Boolean Flags
* The value of boolean flags is true if they are present, otherwise false.
* Boolean flags do not have default values.
* They do not consume arguments.

### Count Flags
* The value of count flags is the number of times the flag appears.
* If not defined the default value is 0.
* Counting start at the devault value.
* They do not consume arguments.