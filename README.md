# clwhy

clwhy is a teeny tiny Node.js CLI framework meant for rapid terminal work rather than full-fledged command line programs.

There's no explicit API; require clwhy, and all exported functions will be available as subcommands in the terminal.

The first argument for exported functions is either a JSON object or string piped from STDIN. The rest correspond to positional arguments (always strings) on the command line. The return value is written to STDOUT, either as JSON or a string.

## Example

```javascript
require('clwhy');
exports.addToField = (input, field, n) => {
    input[field] += parseInt(n);
    return input;
};
```

```
$ echo '{"a": 1}' | node script.js addToField a 2
{
  "a": 3
}
```

## Export Commands to Shell Session

Running your script without a subcommand will output a list of shell function definitions. Combined with the eval command, this can be used to add commands directly to the current shell session, so you don't have to keep typing "node filename command."

```
$ eval $(node script.js)
$ echo '{"a": 1}' | add a 2
{
  "a": 3
}
```