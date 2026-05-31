const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { search: /#0D9488/gi, replace: '#3B5BA0' },
  { search: /#0F766E/gi, replace: '#2E4B88' },
  { search: /#14B8A6/gi, replace: '#5072C0' },
  { search: /rgba\(13,148,136/gi, replace: 'rgba(59,91,160' }, // For rgba
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;
        
        for (const r of replacements) {
          if (r.search.test(content)) {
            content = content.replace(r.search, r.replace);
            modified = true;
          }
        }
        
        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Updated: ${fullPath}`);
        }
      }
    }
  }
}

processDirectory(srcDir);
console.log('Color replacement complete.');
