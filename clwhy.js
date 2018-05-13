function stdin() {
    if (process.stdin.isTTY) {
        return Promise.resolve(null);
    }
    return new Promise(function(resolve, reject) {
        var inputChunks = [];
        process.stdin.setEncoding('utf8');
        process.stdin.on('readable', () => {
            const chunk = process.stdin.read();
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

module.exports = function(funcMap) {
    if (process.argv.length < 3 || !module.parent) {
        return;
    }
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
    .then(outputString => {process.stdout.write(outputString)})
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
}