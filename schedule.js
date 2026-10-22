export const DAY=24*60*60*1000;
export const RETRY_DELAY=10*60*1000;
export const INTERVALS=[1,3,7,14,30];
export const MILESTONES=[{count:7,label:'初次启程'},{count:30,label:'渐入佳境'},{count:100,label:'百词积累'},{count:300,label:'稳步前行'},{count:700,label:'持续成长'},{count:1000,label:'千词里程'}];
export function correctReview(previous={},now=Date.now(),revealed=false){
 if(revealed)return {...previous,level:0,due:now+RETRY_DELAY,lastReview:now,correct:(previous.correct||0)+1};
 if(previous.due>now)return {...previous,lastPractice:now,correct:(previous.correct||0)+1};
 const level=Math.min(INTERVALS.length,(previous.level||0)+1);
 return {...previous,level,due:now+INTERVALS[level-1]*DAY,lastReview:now,correct:(previous.correct||0)+1};
}
export function wrongReview(previous={},now=Date.now()){return {...previous,level:0,due:now,lastReview:now,lapses:(previous.lapses||0)+1};}
export function dueIds(learned,schedule={},now=Date.now()){return [...new Set(learned)].filter(id=>(schedule[id]?.due??0)<=now).sort((a,b)=>(schedule[a]?.due??0)-(schedule[b]?.due??0));}
export function newMilestones(total,seen=[]){const claimed=new Set(seen);return MILESTONES.filter(m=>m.count<=total&&!claimed.has(m.count));}
export function validGroupSize(value){const n=Number(value);return Number.isInteger(n)&&n>=1&&n<=100?n:null;}
