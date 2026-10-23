const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {inspect,check}=require('./check-site-build.cjs');
const source=fs.readFileSync('index.html','utf8'),html=fs.readFileSync('.measure-ui-polish-20261023-03/index.html','utf8');
test('existing compiled local review satisfies the metadata and dependency checks',()=>assert.equal(check(process.cwd(),'.measure-ui-polish-20261023-03').pass,true));
test('a lost school section fails the release check',()=>assert.equal(inspect(source,html.replace('id="faculty"','id="lost-faculty"')).find(c=>c.id==='static-chapters').pass,false));
test('metadata drift cannot silently replace the existing site information',()=>assert.equal(inspect(source,html.replace('<title>','<title>changed ')).find(c=>c.id==='seo-preserved').pass,false));
test('a browser compiler dependency cannot be introduced into the review bundle',()=>assert.equal(inspect(source,html.replace('</head>','<script src="https://unpkg.com/x"></script></head>')).find(c=>c.id==='no-browser-compiler').pass,false));
