import fs from 'fs';
import path from 'path';

function checkFileImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const dir = path.dirname(filePath);
  const regex = /from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      let resolved = path.resolve(dir, importPath);
      if (fs.existsSync(resolved + '.tsx') || fs.existsSync(resolved + '.ts')) {
         // good
      } else {
         console.log('Missing or case-mismatch:', importPath, 'in', filePath);
      }
    }
  }
}

const adminDir = path.join(process.cwd(), 'src', 'components', 'admin');
fs.readdirSync(adminDir).forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    checkFileImports(path.join(adminDir, file));
  }
});
