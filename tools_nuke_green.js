const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function walk(dir, callback) {
    fs.readdir(dir, function(err, files) {
        if (err) throw err;
        files.forEach(function(file) {
            let filepath = path.join(dir, file);
            fs.stat(filepath, function(err, stats) {
                if (stats.isDirectory()) {
                    walk(filepath, callback);
                } else if (stats.isFile() && (filepath.endsWith('.tsx') || filepath.endsWith('.ts') || filepath.endsWith('.css'))) {
                    callback(filepath);
                }
            });
        });
    });
}

walk(directoryPath, function(filepath) {
    fs.readFile(filepath, 'utf8', function(err, data) {
        if (err) throw err;
        
        let original = data;
        // Replace emerald with sky (light blue)
        data = data.replace(/emerald/g, 'sky');
        // Replace teal with cyan
        data = data.replace(/teal/g, 'cyan');
        // Replace any rogue green with indigo
        data = data.replace(/green/g, 'indigo');
        
        if (original !== data) {
            fs.writeFile(filepath, data, function(err) {
                if (err) throw err;
                console.log('Updated: ' + filepath);
            });
        }
    });
});

// Touch tailwind.config.ts to force recompilation
const twPath = path.join(__dirname, 'tailwind.config.ts');
if (fs.existsSync(twPath)) {
    let twData = fs.readFileSync(twPath, 'utf8');
    fs.writeFileSync(twPath, twData + '\n// trigger rebuild ' + Date.now());
    console.log('Touched tailwind.config.ts');
}

console.log('Script initiated.');
