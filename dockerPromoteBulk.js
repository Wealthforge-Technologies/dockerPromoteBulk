#!/usr/bin/env node
const fs = require('fs');

var util=require('util')
var exec=require('child_process').exec;

var argv = require ("argp").createParser ({ once: true })
    .allowUndefinedArguments ()
    .allowUndefinedOptions ()
    .argv ();

// console.log(argv);

if (!argv.user || !argv.environment) {
    console.log('--user (your docker hub user) & --environment (The destination of all these images) are required. \n--folder (the relative or absolute path from the run context to find the properly formatted files) is optional');
    return 1;
}
var sourceFolder = '.';
if (argv.folder) {
    sourceFolder=argv.folder;
}

var total ='';
const ignore = ['.git', 'dockerPromoteBulk.js', 'README.md', 'package.json','exportObject.json'];

var exportObject={
    environment: argv.environment,
    user: argv.user,
    images:[]
};

fs.readdirSync(sourceFolder).forEach(file => {
    if (!ignore.includes(file)) {
        let image = file;
        let build = fs.readFileSync(file).toString().replace(/(\r\n|\n|\r)/gm,"");
        exportObject.images.push({
            [file] : build
        });
        // console.log(file);
        // console.log(fs.readFileSync(file).toString().replace(/(\r\n|\n|\r)/gm,""));
        var promoteStatement='dockerPromote '+argv.user+'/'+file+' '+ build +' '+argv.environment;
        // console.log(promoteStatement);
        total = total + '\n' + promoteStatement;
    }
    else{
        // console.log('ignoring '+file);
    }
})



console.log('/////////////////////////////////// about to execute')
console.log(total)
exportObject.command = total;
console.log('/////////////////////////////////// output of execution')
exec(total,function(err,stdout,stderr){
    exportObject.stdout = stdout;
    exportObject.stderr = stderr;
    console.log(stdout)

    fs.writeFile('exportObject.json', JSON.stringify(exportObject), function(err) {
        if (err) throw err;
    });
})
