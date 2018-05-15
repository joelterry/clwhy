function stdin() {
    return process.stdin.isTTY ? Promise.resolve(null) :
    new Promise(function(resolve, reject) {
        var inputChunks = [];
        process.stdin.setEncoding('utf8');
        process.stdin.on('readable', () => {
            var chunk = process.stdin.read();
            if (chunk !== null) {
                inputChunks.push(chunk);
            }
        });
        process.stdin.on('end', () => {
            var inputString = inputChunks.join("");
            try {
                resolve(JSON.parse(inputString));
            } catch(e) {
                resolve(inputString);
            }
        });
    });
}

var ran = false;

process.on('beforeExit', () => {
    if (ran || !module.parent) return;
    if (process.argv.length < 3) return process.stdout.write(
        Object.entries(module.parent.exports)
        .filter(([k, v]) => typeof(v) === "function")
        .map(([k, v]) => `${k} () { node ${module.parent.filename} ${k} "$@"; };`)
        .join("\n") + "\n"
    );
    ran = true;
    var name = process.argv[2] || "";
    var func = module.parent.exports[name];
    var args = process.argv.slice(3);
    if (!func || typeof(func) !== "function") {
        console.error("Undefined command: " + name);
        process.exit(1);
    }
    stdin()
    .then(input => func.apply(null, [input].concat(args)))
    .then(output => typeof(output) === "object" ? JSON.stringify(output, null, 2) : String(output))
    .then(outputString => process.stdout.write(outputString))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
});