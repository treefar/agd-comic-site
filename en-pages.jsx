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
const siteRequestedLanguage = typeof document !== 'undefined' ? new URLSearchParams(window.location.search).get('lang') : 'zh';
const siteLanguage = ['en','ja'].includes(siteRequestedLanguage) ? siteRequestedLanguage : 'zh';
const siteMessages = siteLanguage==='ja' && typeof SITE_JA_MESSAGES!=='undefined' ? SITE_JA_MESSAGES : SITE_EN_MESSAGES;
const siteLanguageUrl = (language, hash) => {
 if(hash && language===siteLanguage)return hash;
 if(typeof document==='undefined')return (language==='zh'?'?':'?lang='+language)+(hash||'#hero');
 const url=new URL(window.location.href);
 if(language==='en'||language==='ja')url.searchParams.set('lang',language);else url.searchParams.delete('lang');
 if(hash)url.hash=hash;
 return (url.search||'?')+(url.hash||'#hero');
};
const siteTextCache = new Map();
const siteUntranslated = new Set();
const siteNormalize = s => s.replace(/\s+/g,' ').trim();
const sitePhraseKeys = Object.keys(siteMessages).filter(k=>k.length>=2 && /[㐀-鿿]/.test(k)).sort((a,b)=>b.length-a.length);
const sitePhrasePattern = new RegExp(sitePhraseKeys.map(k=>Array.from(k).map(c=>[46,42,43,63,94,36,123,125,40,41,124,91,93,92].includes(c.charCodeAt(0))?String.fromCharCode(92)+c:c).join('')).join('|'),'g');
const siteText = value => {
 if(siteLanguage==='zh'||typeof value!=='string')return value;
 if(siteTextCache.has(value))return siteTextCache.get(value);
 const key=siteNormalize(value);
 if(!/[㐀-鿿]/.test(value)&&!Object.prototype.hasOwnProperty.call(siteMessages,key))return value;
 let result=Object.prototype.hasOwnProperty.call(siteMessages,key)?siteMessages[key]:null;
 if(result!==null)result=(value.match(/^\s*/)?.[0]||'')+result+(value.match(/\s*$/)?.[0]||'');
 if(result===null){result=value.replace(sitePhrasePattern,k=>siteMessages[k]);siteUntranslated.add(key);}
 siteTextCache.set(value,result);return result;
};
const siteChildren = child => Array.isArray(child)?child.map(siteChildren):typeof child==='string'?siteText(child):child;
function siteCreateElement(type, props, ...children) {
 if(window.__STUDENT_GUIDE_FILE__ && type==='a' && props?.href?.startsWith('#') && !props.href.startsWith('#/students/'))props={...props,href:(window.__SITE_REVIEW_BASE__||'https://treefar.link/agd-comic-site/')+(siteLanguage==='zh'?'':'?lang='+siteLanguage)+props.href};
 if(typeof type==='string' && siteLanguage!=='zh' && !props?.['data-language-choice']) {
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
 document.documentElement.lang=siteLanguage==='zh'?'zh-Hant':siteLanguage;
 document.documentElement.dataset.siteLanguage=siteLanguage;
 if(siteLanguage==='en')document.title='Animation & Game Design · Shu-Te University';
 if(siteLanguage==='ja')document.title='アニメとゲームデザイン学科 · 樹徳科技大学';
 window.__SITE_UNTRANSLATED__=siteUntranslated;
}
Object.assign(window,{siteLanguage,siteText,siteLanguageUrl});
