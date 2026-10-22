import test from 'node:test';import assert from 'node:assert/strict';
import {evaluateExpression,expressionFeedback} from '../games/lunar-new-year.mjs';
test('a strongly opposite brow tilt is described as opposite, not as flat',()=>{
 const opposite={brow:30,eyes:1.4,mouth:1,pose:0},flat={...opposite,brow:0};
 assert.equal(evaluateExpression(0,opposite).reason,'surprise-brow');assert.equal(evaluateExpression(0,{...opposite,brow:-30}).ok,true);
 const a=expressionFeedback('surprise-brow',opposite),b=expressionFeedback('surprise-brow',flat);
 assert.match(a.zh,/另一邊/);assert.match(a.en,/other way/);assert.match(a.ja,/逆向き/);
 assert.doesNotMatch(a.zh,/很平|平直/);assert.doesNotMatch(a.en,/level|flat/);assert.notDeepEqual(a,b);
});
