// Exact context identities only; all source/raw/finite/screenshot guards remain in coverage-index.
function hasExactFiniteContexts(proof,verification,requiredCases){
 const games=verification.games?.map(g=>g.game);
 if(!games?.length||new Set(games).size!==games.length||!Array.isArray(proof.candidates))return false;
 const expected=requiredCases.filter(c=>games.includes(c.id.split('/')[0])&&c.id.endsWith('/game/error-longest'));
 const key=c=>JSON.stringify([c.canonical_id,c.width,c.height]);
 const want=new Set(expected.map(c=>key({...c,canonical_id:c.id}))),got=proof.candidates.map(key);
 return expected.length===games.length*6&&got.length===want.size&&new Set(got).size===got.length&&got.every(k=>want.has(k));
}
function finiteCanonicalScope(candidate,verification){
 const game=candidate.canonical_id.split('/')[0],g=verification.games.find(g=>g.game===game);
 if(!g)return {eligible:false,reason:'No game-scope record'};
 const unresolved=g.unproven_dynamic_secondary||[];
 if(g.canonical_error_longest_eligible===false||unresolved.length)return {eligible:false,reason:'Static fixed-feedback proof only; dynamic secondary obligation remains unproven',unproven_dynamic_secondary:unresolved};
 if(g.canonical_error_longest_eligible===true&&Array.isArray(g.unproven_dynamic_secondary))return {eligible:true,reason:'Explicit handler and secondary scope verified'};
 if(['constitution','lunar-new-year','lantern','children'].includes(game))return {eligible:true,reason:'Previously independently verified legacy finite proof; all existing source/raw/image guards still apply'};
 return {eligible:false,reason:'No explicit full error-longest scope approval; fixed-hint supplement only'};
}
module.exports={hasExactFiniteContexts,finiteCanonicalScope};
