# Node Argument Parser
A simple no-dependency NodeJS module for parsing command line arguments.  Unlike the built-in argument parser, this does not require tracked arguments to be declared in advance. Additionally, it allows for counting argument occurances.

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

### Escape Processing
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
Custom behaviour is defined by passing a definition object to the ParseArgs constructor.
This allows you to define a short form flag, the type of flag, and it's default value.

```
import ParseArgs from "../src/ParseArgs.js";
const parseArgs = new ParseArgs(definitions);
```

The definitions object must contain a 'flags' field which contains an array of flag-definition objects.
``` JS
const definitions = {    
    flags: [
        {
            long: "pack",
            short: "p",
            default: "a.json",
            type: "string",
        },
        {
            long: "verbose",
            short: "v",
            type: "count",
        }  
    ]
};
```

* Flags must have a long form name.
* Flags may have a short form name.
* The default value will be used if no parameter is available on the command line.
* String flags with no default will be assigned the empty string as it's default.
* Boolean and Count flags will not consume a parameter.
* Short forms for a flag will share all values with it's long form.
* Flags with a short form will only have the long form name in the resulting object.
* Flags with an env field will that their value added to process.env in the specified field.

Flags (non-boolean) can be assigned a default value.  These flags will take on the default
value if none is provided.  Count flags have a default value of 0 if not otherwise specified; they will start counting at their default value.

### Default Flags (no type)
* The default value of default flags is boolean false.
* Default flags that are present and did not consume an argument will be assigned the value boolean 'true', unless the default otherwise specified.
* Default flags that are present and consumed an argument will be assigned the consumed arguments value.

### String Flags
* The default value of string flags is a zero-length string unless otherwise specified.
* String flags that are present and did not consume a parameter will be assigned the default value.
* They consume the next parameter if available and use that for their value.

#### definition
``` JS
const definitions = {    
    flags: [
        {
            long: "pack",
            short: "p",
            default: "a.json",
            type: "string",
        }
    ]
}
```

#### result <sup>[1]</sup>
```bash
$ /index.js
{ pack : 'a.json' }

$ /index.js --pack file.tar
{ pack : 'file.tar' }
```

### Boolean Flags
* The value of boolean flags is true if they are present, otherwise false.
* Boolean flags do not have default values.
* They do not consume parameters.

#### definition
``` JS
const definitions = {    
    flags: [
        {
            long: "condense",
            short: "c",
            type: "boolean",
        }
    ]
}
```

#### result <sup>[1]</sup>
```bash
$ /index.js
{ condense : false } # default value

$ /index.js --condense file.tar # last argument ignored
{ condense : true }

$ /index.js -c file.tar # short form flag
{ condense : true }
```

### Count Flags
* The value of count flags is the number of times the flag appears.
* If not present the default value is 0.
* Counting start at the devault value.
* They do not consume parameters.

#### definition
``` JS
const definitions = {    
    flags: [
        {
            long: "verbose",
            short: "v",
            type: "count",
        }
    ]
}
```

#### result <sup>[1]</sup>
```bash
$ /index.js
{ verbose : 0 }

$ /index.js -v 
{ verbose : 1 }

$ /index.js -vv
{ verbose : 2 }
```

## Generating Help

Descriptions are defined on both the root object and the individual flags.

```json
{
    name: "SN-Vacation",
    short: "SHARCNET Vacation Web App",
    desc: "Online stand-alone web appliction to co-ordinate vacation requests.",
    synopsis: "sudo node . [OPTIONS]",
    flags: [
        {
            long: 'verbose',
            type: 'count',
            short: 'v',
            desc: 'Display additional information in the terminal.'
        }
    ]
}
```

### Help String

```js
    import helpString from "@thaerious/parseargs/src/helpString.js";
    logger.console(helpString(options));
```

```
## Notes
[1] Unprocessed arguments ($) excluded for brevity.