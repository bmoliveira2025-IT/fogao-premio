const fs = require('fs');

function parseGEData(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // We expect window.dataSportsSchedule = { ... };
    // This script will be called with the extracted JS snippet that starts with window.dataSportsSchedule = {

    let result;
    // Dangerous but we are running in a controlled env and this is GE's own script
    const mockWindow = {};
    try {
        // Use eval but wrap it in a function to avoid global pollution
        // or just replace 'window.' with 'mockWindow.'
        const scriptToEval = content.replace(/window\./g, 'this.');
        const fn = new Function(scriptToEval);
        const context = {};
        fn.call(context);
        result = context.dataSportsSchedule;
        console.log(JSON.stringify(result));
    } catch (e) {
        process.stderr.write('Error parsing JS: ' + e.message + '\n');
        process.exit(1);
    }
}

const args = process.argv.slice(2);
if (args.length > 0) {
    parseGEData(args[0]);
} else {
    process.stderr.write('Usage: node parse_ge.js <file_path>\n');
    process.exit(1);
}
