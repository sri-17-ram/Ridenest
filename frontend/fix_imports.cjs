const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = walkSync(filePath, filelist);
    }
    else {
      if (filePath.endsWith('.jsx')) {
        filelist.push(filePath);
      }
    }
  });
  return filelist;
};

const allFiles = walkSync(srcDir);

const allLucideIcons = new Set([
  'MapPin', 'Truck', 'Clock', 'ShieldCheck', 'Activity', 'Users', 'Route', 
  'AlertTriangle', 'User', 'Compass', 'Info', 'Building', 'Building2', 'Bus', 
  'School', 'Shield', 'Navigation', 'Car', 'CheckCircle', 'XCircle', 'CheckCircle2'
]);

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace Building2 with Building
  if (content.includes('Building2')) {
    content = content.replace(/Building2/g, 'Building');
    changed = true;
  }
  
  if (content.includes('CheckCircle2')) {
    content = content.replace(/CheckCircle2/g, 'CheckCircle');
    changed = true;
  }

  // Find all used components
  const usedTags = new Set();
  const regex = /<([A-Z][a-zA-Z0-9]*)\b/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    usedTags.add(match[1]);
  }

  // Find lucide imports
  const lucideRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/;
  const lucideMatch = lucideRegex.exec(content);
  
  if (lucideMatch) {
    const imported = new Set(lucideMatch[1].split(',').map(s => s.trim()));
    let needsUpdate = false;
    usedTags.forEach(tag => {
      if (allLucideIcons.has(tag) && !imported.has(tag)) {
        imported.add(tag);
        needsUpdate = true;
        console.log(`Adding ${tag} to ${file}`);
      }
    });

    if (needsUpdate || changed) {
      const newImport = `import { ${Array.from(imported).join(', ')} } from 'lucide-react'`;
      content = content.replace(lucideMatch[0], newImport);
      changed = true;
    }
  } else {
    // Check if any lucide icons are used but not imported at all
    const needed = Array.from(usedTags).filter(tag => allLucideIcons.has(tag));
    if (needed.length > 0) {
      content = `import { ${needed.join(', ')} } from 'lucide-react';\n` + content;
      changed = true;
      console.log(`Adding NEW lucide import to ${file}`);
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});
