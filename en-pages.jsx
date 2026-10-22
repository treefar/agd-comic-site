/* Shared language renderer. Canonical data and component logic stay unchanged.
 * Only DOM text and accessible labels are translated; IDs, filter values, URLs,
 * class names, event handlers and React components retain their original values.
 */
const siteLegacyRoutes = {intro:'#hero',highlights:'#about',faculty:'#faculty',curriculum:'#/curriculum/map',labs:'#labs',works:'#works',visit:'#/admission/visit'};
if(typeof document !== 'undefined' && /^#\/en\//.test(window.location.hash)) {
 const url=new URL(window.location.href);const legacy=url.hash.slice(5);
 url.searchParams.set('lang','en');url.hash=siteLegacyRoutes[legacy] || '#/'+legacy;
 window.history.replaceState(null,'',url);
}
const siteLanguage = typeof document !== 'undefined' && new URLSearchParams(window.location.search).get('lang')==='en' ? 'en' : 'zh';
const siteLanguageUrl = (language, hash) => {
 if(typeof document==='undefined')return language==='en'?'?lang=en#hero':'#hero';
 const url=new URL(window.location.href);
 if(language==='en')url.searchParams.set('lang','en');else url.searchParams.delete('lang');
 if(hash)url.hash=hash;
 return url.pathname+url.search+url.hash;
};
const siteTextCache = new Map();
const siteUntranslated = new Set();
const siteNormalize = s => s.replace(/\s+/g,' ').trim();
const sitePhraseKeys = Object.keys(SITE_EN_MESSAGES).filter(k=>k.length>=2 && /[㐀-鿿]/.test(k)).sort((a,b)=>b.length-a.length);
const sitePhrasePattern = new RegExp(sitePhraseKeys.map(k=>Array.from(k).map(c=>[46,42,43,63,94,36,123,125,40,41,124,91,93,92].includes(c.charCodeAt(0))?String.fromCharCode(92)+c:c).join('')).join('|'),'g');
const siteText = value => {
 if(siteLanguage!=='en'||typeof value!=='string'||!/[㐀-鿿]/.test(value))return value;
 if(siteTextCache.has(value))return siteTextCache.get(value);
 const key=siteNormalize(value);
 let result=Object.prototype.hasOwnProperty.call(SITE_EN_MESSAGES,key)?SITE_EN_MESSAGES[key]:null;
 if(result===null){result=value.replace(sitePhrasePattern,k=>SITE_EN_MESSAGES[k]);siteUntranslated.add(key);}
 siteTextCache.set(value,result);return result;
};
const siteChildren = child => Array.isArray(child)?child.map(siteChildren):typeof child==='string'?siteText(child):child;
function siteCreateElement(type, props, ...children) {
 if(typeof type==='string' && siteLanguage==='en') {
  props=props?{...props}:{};
  for(const key of ['title','alt','aria-label','placeholder'])if(typeof props[key]==='string')props[key]=siteText(props[key]);
  if(type==='a' && typeof props.href==='string' && props.href.startsWith('mailto:')) {
   const email=new URL(props.href);for(const key of ['subject','body'])if(email.searchParams.has(key))email.searchParams.set(key,siteText(email.searchParams.get(key)));props.href=email.href;
  }
  if(type==='a' && typeof props.href==='string' && props.href.startsWith('#/en/')) {
   const legacy=props.href.slice(5);props.href=siteLanguageUrl('en',siteLegacyRoutes[legacy]||'#/'+legacy);
  }
  children=children.map(siteChildren);
 }
 return React.createElement(type,props,...children);
}
const EnSubNav = () => null; // Legacy landing component is retained in pages.jsx but no longer used.
const EnglishDetail = ({slug}) => {
 const href=siteLanguageUrl('en',siteLegacyRoutes[slug]||'#hero');
 React.useEffect(()=>window.location.replace(href),[href]);
 return <a href={href}>Open English site</a>;
};
if(typeof document!=='undefined') {
 document.documentElement.lang=siteLanguage==='en'?'en':'zh-Hant';
 document.documentElement.dataset.siteLanguage=siteLanguage;
 if(siteLanguage==='en')document.title='Animation & Game Design · Shu-Te University';
 window.__SITE_UNTRANSLATED__=siteUntranslated;
}
Object.assign(window,{siteLanguage,siteText,siteLanguageUrl});
