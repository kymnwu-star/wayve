const fs = require('fs');
const path = require('path');

const replacements = [
  {
    from: 'https://jasonteale.com/blog/wp-content/uploads/2021/02/D79A3022_AuroraHDR2019-edit-1200x600.jpg',
    to: 'https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=800'
  },
  {
    from: 'https://www.lemon8-app.com/jins_taste/7339793132049007106?region=kr',
    to: 'https://images.unsplash.com/photo-1603525281488-8422731cde7e?q=80&w=800'
  },
  {
    from: 'https://ak-d.tripcdn.com/sl/app/d1/20210204/a933f7c4627b4b10b0b8efebdf9168f1_1000.jpg',
    to: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800'
  }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!fullPath.includes('.git') && !fullPath.includes('node_modules') && !fullPath.includes('.next')) {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const req of replacements) {
        if (content.includes(req.from)) {
          content = content.split(req.from).join(req.to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done replacing broken image URLs!');
