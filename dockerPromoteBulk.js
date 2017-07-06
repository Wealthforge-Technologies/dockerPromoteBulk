#!/usr/bin/env node
const fs = require('fs');

var util=require('util')
var exec=require('child_process').exec;

var argv = require ("argp").createParser ({ once: true })
    .allowUndefinedArguments ()
    .allowUndefinedOptions ()
    .argv ();

// console.log(argv);

if (!argv.user ) {
    console.log('--user (your docker hub user) is required \n--folder (the relative or absolute path from the run context to find the properly formatted files) is optional');
    return 1;
}
var sourceFolder = '.';
if (argv.folder) {
    sourceFolder=argv.folder;
}

var total ='';
const ignore = ['.git', 'dockerPromoteBulk.js', 'README.md', 'package.json','exportObject.json', 'node_modules', 'package-lock.json', 'ci.exportObject.json', '.gitignore'];

var exportObject={
    user: argv.user,
    images:[]
};

fs.readdirSync(sourceFolder).forEach(file => {
    if (!ignore.includes(file)) {
        let image = file;
        let build = fs.readFileSync(sourceFolder+'/'+file).toString().replace(/(\r\n|\n|\r)/gm,"");
        exportObject.images.push({
            build : build,
            image : image,
            fullImage : argv.user+'/'+file
        });
        // console.log(file);
        // console.log(fs.readFileSync(file).toString().replace(/(\r\n|\n|\r)/gm,""));
    }
    else{
        // console.log('ignoring '+file);
    }
})


fs.writeFile(sourceFolder+'/'+'exportObject.json', JSON.stringify(exportObject), function(err) {
    if (err) throw err;
});
