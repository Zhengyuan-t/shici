export function shuffle(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function nextBatch(entries,done,random=false,size=10){const seen=new Set(done);const remaining=entries.filter(e=>!seen.has(e.id));return (random?shuffle(remaining):remaining).slice(0,size).map(e=>e.id);}
export function completeBatch(done,active){return [...new Set([...done,...active])];}
export function normalizeAnswer(value){return String(value).trim().toLocaleLowerCase('en');}
export function spellingWord(word){return word.replace(/\s*\([^)]*\)\s*$/,'').replace(/^(bass|bow|content|minute|recount)[12]$/i,'$1').trim();}
export function matchesAnswer(input,word){return [word,spellingWord(word)].some(w=>normalizeAnswer(input)===normalizeAnswer(w));}
export function detectLanguage(rows){return rows.filter(r=>/[\u3400-\u9fff]/.test(String(r[1]??''))).length>rows.length/2?'zh':'en';}
export function detectsHeader(row){return /^(单词|英文单词|英文|word|words|vocabulary|词汇)$/i.test(String(row?.[0]??'').trim()) && /释义|意思|解释|meaning|definition|translation|中文|英文|释意/i.test(String(row?.[1]??''));}
export function parseRows(rows,{header=false,language='auto',prefix='import'}={}){const selected=rows.slice(header?1:0).map((row,index)=>({row,index:index+(header?2:1)})).filter(({row})=>String(row[0]??'').trim()&&String(row[1]??'').trim());const lang=language==='auto'?detectLanguage(selected.map(x=>x.row)):language;return {lang,entries:selected.map(({row,index})=>({id:`${prefix}:A${index}`,word:String(row[0]).trim(),[lang]:String(row[1]).trim(),cell:`A${index}`})),skipped:rows.length-(header?1:0)-selected.length};}
