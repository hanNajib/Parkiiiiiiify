/**
 * Fix wayfinder generated route files to use @ alias instead of relative paths
 * Run this after: php artisan wayfinder:generate
 * Usage: node fix-wayfinder-imports.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const routesDir = path.join(__dirname, 'resources/js/routes');

function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const hasChanged = content.includes('./../../wayfinder') || content.includes('./../wayfinder');
    
    if (hasChanged) {
      // Replace relative wayfinder imports with @ alias
      content = content.replace(
        /from ['"]\.\/\.\.\/\.\.\/wayfinder['"]/g,
        "from '@/wayfinder'"
      );
      content = content.replace(
        /from ['"]\.\/\.\.\/wayfinder['"]/g,
        "from '@/wayfinder'"
      );
      
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ Fixed: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.ts') && file.startsWith('index.ts')) {
      fixImportsInFile(filePath);
    }
  }
}

console.log('🔧 Fixing wayfinder generated imports...\n');
walkDir(routesDir);
console.log('\n✅ Done! All wayfinder imports fixed to use @ alias.');
