# Description
This is a simple no-dependency NodeJS module for parsing command line arguments. It helps you build command line tools by parsing command line flags. Unlike the built-in argument parser, this module does not require the programmer to declare tracked arguments in advance. Additionally, it allows for counting argument occurances.

Features:
* Parses single hyphen (-) and double hyphen (--) arguments.
* Permits but does not require custom configuration.
* Count flag occurances.

## Installation
``` bash
npm i @thaerious/parseargs
```

## Default Behaviour
```
import ParseArgs from "../src/ParseArgs.js";
const parseArgs = new ParseArgs();
```

Command line arguments which are prefixed by a single '-', or double '--' dash are considered 'flags'.  All other arguments are considered 'parameters'.  

* A flag followed immediately by a parameter will be assigned that parameters string value.  
* A flag with no parameter will be assigned boolean 'true'.
* Single dash flags consist of a single character and can be chained.
* The -- flag without text ends parsing.
* Flag names are case sensitive.

_see /demo/default.js for examples_

### Double Dash Flags
Flags starting with two dashes take the name of the string after the dashes.  If it is followed by a parameter the flag will be assigned that value, otherwise it is assigned boolean 'true'.

### Single Dash Flags
Flags starting with a single dash can be chained.  Single dash flags consist of a single character. Only the last flag in the chain will be assigned a parameter value.

### Example
``` bash
$> node demo/default.js --path . --no-copy -abc all

{
  path: '.',
  'no-copy': true,
  a: true,
  b: true,
  c: 'all',
  '$': [
    '/opt/node/19.3.0/bin/node',
    '/home/user/parser/demo/default.js'
  ]
}
```

### Escape processing
All arguments found after a lone '--' are not processed and will be appended to the '$' field.
``` bash
$> node demo/default.js --input filename --output -- not_processed

{
  input: 'filename',
  output: true,
  '$': [
    '/opt/node/19.3.0/bin/node',
    '/home/user/parser/demo/default.js',
    'not_processed'
  ]
}
```


## The ParseArgs object
To access a flag's value on the 'ParseArgs' object, treat the flag like a normal POJO value.
For example to access the alpha flag use: ``parseArgs.alpha`` or ``parseArgs["alpha"]``.

To access the remaining unprocessed arguments use: ``parseArgs.$``.

## Custom Behaviour
* Flags must have a long form name.
* Flags may have a short form name.
* The default value will be used if no parameter is available on the command line.
* String flags with no default will be assigned the empty string as it's default.
* Boolean and Count flags will not consume a parameter.
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
* String flags that are present and did not consume a parameter will be assigned the default value.
* They consume the next parameter if available and use that for their value.

### Boolean Flags
* The value of boolean flags is true if they are present, otherwise false.
* Boolean flags do not have default values.
* They do not consume parameters.

### Count Flags
* The value of count flags is the number of times the flag appears.
* If not present the default value is 0.
* Counting start at the devault value.
* They do not consume parameters.