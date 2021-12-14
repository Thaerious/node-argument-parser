Description
===========

ParseArgs helps you maintain a consistent pattern for command line arguments in NodeJS CLI programs.

Features:
* Parses single hyphen (-) and double hyphen (--) arguments.
* Permits configuration files.
* Count flag occurances.

NPM
---

```
npm i @thaerious/parseargs
```

Usage
-----

``` 
import ParseArgs from "@thaerious/parseArgs"
const args = new ParseArgs().loadOptions(options).run();

if (args.flags["flag_name"]) /* do something */ ;
if (args.count("flag_name"] > 0) /* do something */;
```

Default Behaviour
-----------------

Using src/demo.js:

```
const parsed = new ParseArgs().run();
console.log(parsed.directory);
```

Flags consume the next available value.

```
$ node src/demo.js --flag x
{ flag: 'x' }
```

If the next value is a flag, flags get the value 'true'.

```
$ node src/demo.js --flag -f x
{ flag: true, f: 'x' }
```

Only the last of occurance of the flag counts.

```
$ node src/demo.js --flag a --flag b
{ flag: 'b' }
```

Nothing after a double dash is processed.  Use 'parsed.args' to get an array of
unconsumed arguments (include the node command and the filename).

```
$ node src/demo.js --flag a -- -b x
{ flag: 'a' }

# parsed.args = {/opt/node/17.0.1/bin/node, /mnt/d/project/trunk/node-argument-parser/src/demo.js, -b, x}
```


Custom Behaviour
----------------

* Flags with options must have a long form name.
* The default value will be used if no value is presented.
* Setting type to boolean will prevent the flag from consuming a parameter.

```
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
```