Description
===========

ParseArgs helps you maintain a consistent pattern for organizing
command line arguments for NodeJS CLI programs.

Features:
* Parses single hyphen (-) and double hyphen (--) arguments.
* Permits configuration files.
* Callbacks to intercept and process arguments.

Usage:

``` 
import ParseArgs from "@thaerious/parseArgs"
const parsed = new ParseArgs().run(); 
```
 
Default Behaviour:

A flag is any argument proceeded by one or two hyphens.
Two hyphens indicates a full word flag, while a single
hyphen indicated one or more single letter flags.

```
$ node . --b --aflag -a --de  
```
Creates 5 flags {b, aflag, a, d, e}.

The value of the flag defaults to boolean 'true'.

```
import ParseArgs from "@thaerious/parseArgs"
const parsed = new ParseArgs().run(process.argv); 

console.log(parsed.flags.a);
console.log(parsed.flags.b);
console.log(parsed.flags.c);

> true
> true
> undefined
```

The value of a double-hyphen flag will be the next argument
if it's not a flag.  Otherwise, it will be boolean true.
If true is provided on the command line, it will be a string not
a boolean.

```
$ node . --email who@where.com --name --password name

console.log(parsed.flags.email);
console.log(typeof(parsed.flags.name));
console.log(typeof(parsed.flags.password));

> who@where.com
> boolean
> string
```

By default, single character flags do not accept arguments, they
are boolean only.

```
$ node . -e who@where.com

console.log(parsed.flags.e);

> true
```

Unprocessed args, are put into the args field which is an array.
```
$ node . -e who@where.com

console.log(parsed.args[0]);
console.log(parsed.args[1]);
console.log(parsed.args[2]);

> /opt/bin/node.exe
> /src/index.js
> who@where.com
```