import fs from 'node:fs';
import assert from 'node:assert/strict';
import {newTrip,move,selectTask,selectWindow,interact,stops} from '../../games/semester.mjs';
function arrive(state,id){const goal=stops.find(s=>s.id===id);let s=state;while(s.position.x!==goal.x)s=move(s,s.position.x<goal.x?'right':'left').state;while(s.position.y!==goal.y)s=move(s,s.position.y<goal.y?'down':'up').state;return s;}
function visit(s,task,window){s=selectTask(s,task).state;s=selectWindow(s,window).state;return interact(arrive(s,window)).state;}
const rows=[['course-plan','department',true],['course-plan','academic',true],['course-record','classroom',false],['course-record','academic',true],['graduation','department',true],['graduation','academic',true],['credit','academic',true],['credit','department',false],['credit','classroom',false],[null,'department',false]].map(([task,window,expected])=>{
 let s=newTrip();if(task&&task!=='course-plan')s=visit(s,'course-plan','department');if(['graduation','credit'].includes(task))s=visit(s,'course-record','academic');if(task){s=selectTask(s,task).state;s=selectWindow(s,window).state;}s=arrive(s,window);const r=interact(s);assert.equal(r.accepted,expected);return {task,window,accepted:r.accepted,reason:r.reason||'ok',roundBefore:s.round,roundAfter:r.state.round};
});
fs.writeFileSync(new URL('ten-combinations.json',import.meta.url),JSON.stringify(rows,null,2));
for(const r of rows)console.log(`${r.task||'no-task'} -> ${r.window}: ${r.accepted?'YES':'NO'} ${r.reason}`);
