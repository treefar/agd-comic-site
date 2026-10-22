import fs from 'node:fs';const p='student-guide.jsx';let s=fs.readFileSync(p,'utf8');s=s.replace("setQuery('');input.current", "setQuery('');setAudience('all');input.current");fs.writeFileSync(p,s);
