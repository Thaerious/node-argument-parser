Description
===========

ParseArgs helps you maintain a consistent pattern for organizing
command line arguments for NodeJS CLI programs.

Features:
* Parses single hyphen (-) and double hyphen (--) arguments.
* Permits configuration files.

NPM
---

```
npm i @thaerious/parseargs
```

Usage
-----

``` 
import ParseArgs from "@thaerious/parseArgs"
const parsed = new ParseArgs().loadOptions(options).run();
```

Default Behaviour
-----------------

A flag is any argument proceeded by one or two hyphens.
Two hyphens indicates a full word flag, while a single
hyphen indicated one or more single letter flags.

```
$ node . --b --aflag -a -de  
```
Creates 5 flags {b, aflag, a, d, e}.

The value of the set flag defaults to boolean 'true' when no parameters are provided.

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

A double-hyphen flag will use the next argument as it's parameters
if the next argument is not a flag (starts with '-' or '--').
Otherwise, it will be set to boolean true.
If true is provided on the command line, it will be a string not a boolean.

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

An array of unconsumed arguments can be accessed through the 'args' field.
This includes the node executable and the program filename.
```
$ node . -e who@where.com

console.log(parsed.args[0]);
console.log(parsed.args[1]);
console.log(parsed.args[2]);

> /opt/bin/node.exe
> /src/index.js
> who@where.com
```

To include spaces in the parameter, wrap it in double quotes.  This is 
NodeJS behaviour, not ParseArgs specific.
```
$ node . --name "john doe"

console.log(parsed.flags.name);

> john doe
```

A double-hyphen without a string attached caused all following arguments to
be parsed as arguments not as flags, regardless of format.
```
$ node . --email who@where.com -- --notaflag

console.log(parsed.args[2]);

> --notaflag
```

Custom Behaviour
----------------

The parseArgs behaviour can be customized either by passing an description
object with the constructor, or calling the #loadOptions method.
The #loadOptions method will load a json file containing the options.
By default the filename is ".parseArgs", or one can be provided.

Options Object
-----------------------
```
flags : [
          {
             "long" : "name",
             "short" : "n",
             "default" : "value",
             "desc" : "set the name of the thing",
             "boolean" : ("true", "false")
        }
    ]
}
```

The descriptor is an object with a 'flags' field.  The 'flags' field
contains an array of objects, with each element defining a flag.
This object can have the following fields:
* long : the long form flag
* short : single character flag
* default : default value when flag not defined
* desc : string to print out in help
* boolean : if true, this flag's value is true/false, and will not consume the next argument (default is false). 

Any flag that has both a long and a short will be stored using the long
value.  The default value is used when the flag isn't present.
The long value for a flag is required, all other fields are optional.

Multiple inline character flags that have a 'long' value can have their 
values set after all the flags are declared.  They will be processed in
the order they are found in the flag.

```
$ node . -epn who@where.com mypassword user

console.log(parsed.flags.email);
console.log(parsed.flags.password);
console.log(parsed.user);

> who@where.com
> mypassword
> user
```
