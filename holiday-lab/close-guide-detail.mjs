import fs from 'node:fs';let p='student-guide.jsx',s=fs.readFileSync(p,'utf8');s=s.replace('        </article>)}</div>}', '          </details>\n        </article>)}</div>}');fs.writeFileSync(p,s);
