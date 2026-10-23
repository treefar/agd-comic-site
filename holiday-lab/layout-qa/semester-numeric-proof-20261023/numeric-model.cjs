// Font-unit outline model only. No browser, canvas, text painting or product state.
const CEILING=4294967294;
function validate(guard,digits){
 if(!Number.isInteger(guard.min)||!Number.isInteger(guard.max)||guard.min<0||guard.max<guard.min||guard.max>CEILING||![0,1].includes(guard.parity))throw Error('invalid numeric guard');
 if(digits.length!==10||digits.some((d,i)=>d.digit!==String(i)||!Number.isFinite(d.advance)||d.advance<=0||d.bounds.length!==4||d.bounds.some(v=>!Number.isFinite(v))))throw Error('invalid digit metadata');
 if(new Set(digits.map(d=>d.advance)).size!==1||digits.some(d=>d.bounds[0]<0||d.bounds[2]>d.advance||d.bounds[0]>d.bounds[2]))throw Error('glyph slot/equal advance premise fails');
}
function metrics(text,digits,segment=[0,text.length]){
 const part=text.slice(...segment),g=[...part].map(c=>digits[Number(c)]),advance=g.length*digits[0].advance;
 if(!g.length)throw Error('empty segment');
 return {length:g.length,advance,xMin:g[0].bounds[0],xMax:advance-digits[0].advance+g.at(-1).bounds[2],yMin:Math.min(...g.map(x=>x.bounds[1])),yMax:Math.max(...g.map(x=>x.bounds[3]))};
}
const key=m=>[m.length,m.advance,m.xMin,m.xMax,m.yMin,m.yMax].join('/');
const metricKey=(text,digits,segment)=>key(metrics(text,digits,segment));
function classes(guard,digits,options={}){
 validate(guard,digits);const result=[],stats=[];
 for(let length=String(guard.min).length;length<=String(guard.max).length;length++){
  if(options.length&&length!==options.length)continue;
  const lo=String(Math.max(guard.min,length===1?0:10**(length-1))),hi=String(Math.min(guard.max,10**length-1));if(lo.length!==length||hi.length!==length||Number(lo)>Number(hi))continue;
  const segment=options.segment||[0,length];if(segment[0]<0||segment[1]>length||segment[0]>=segment[1])throw Error('invalid segment');
  let states=new Map([['start',{tightLow:true,tightHigh:true,first:null,last:null,yMin:null,yMax:null,witness:''}]]),visits=1,maxLayer=1;
  for(let index=0;index<length;index++){
   const next=new Map();
   for(const s of states.values())for(let digit=s.tightLow?Number(lo[index]):0;digit<=(s.tightHigh?Number(hi[index]):9);digit++){
    if(index===length-1&&digit%2!==guard.parity)continue;
    const inside=index>=segment[0]&&index<segment[1],g=digits[digit],n={tightLow:s.tightLow&&digit===Number(lo[index]),tightHigh:s.tightHigh&&digit===Number(hi[index]),first:inside&&s.first===null?digit:s.first,last:inside?digit:s.last,yMin:inside?(s.yMin===null?g.bounds[1]:Math.min(s.yMin,g.bounds[1])):s.yMin,yMax:inside?(s.yMax===null?g.bounds[3]:Math.max(s.yMax,g.bounds[3])):s.yMax,witness:s.witness+digit};
    const k=JSON.stringify([n.tightLow,n.tightHigh,n.first,n.last,n.yMin,n.yMax]);if(!next.has(k)||next.get(k).witness>n.witness)next.set(k,n);
   }
   states=next;visits+=states.size;maxLayer=Math.max(maxLayer,states.size);
  }
  const unique=new Map();for(const s of states.values()){const m=metrics(s.witness,digits,segment),k=key(m);if(!unique.has(k))unique.set(k,{key:k,witness:s.witness,metrics:m,length,segment});}
  result.push(...unique.values());stats.push({length,segment,prefix_states_visited:visits,largest_layer:maxLayer,metric_classes:unique.size});
 }
 Object.defineProperty(result,'stats',{value:stats,enumerable:false});return result;
}
function bounds(rows){if(!rows.length)return null;const out={};for(const field of ['advance','xMin','xMax','yMin','yMax']){const low=rows.reduce((a,b)=>b.metrics[field]<a.metrics[field]?b:a),high=rows.reduce((a,b)=>b.metrics[field]>a.metrics[field]?b:a);out[field]={lower:low.metrics[field],lower_witness:low.witness,upper:high.metrics[field],upper_witness:high.witness};}return out;}
module.exports={CEILING,validate,metrics,metricKey,classes,bounds};
