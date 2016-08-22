var net = require("net"),
    repl = require("repl"),
    connections = 0;
var ServiceManager = require("./ServiceManager");
var sm = new ServiceManager();

var r = repl.start({
    prompt: "Node.js via stdin> ",
    input: process.stdin,
    output: process.stdout
});
r.context.sm = sm;
