export function migrateBuiltinState(state,entries,version){
 if(state.builtinVersion===version)return false;
 const p=state.progress?.builtin,valid=new Set(entries.map(e=>e.id));
 if(p){const missing=(p.learned||[]).filter(id=>!valid.has(id));if(missing.length){state.builtinProgressArchive??={};state.builtinProgressArchive[state.builtinVersion||'legacy-v1']??=JSON.parse(JSON.stringify(p));}
  for(const field of ['learned','reviewActive','reviewSeen','retry','relearn','reviewFailures'])if(Array.isArray(p[field]))p[field]=p[field].filter(id=>valid.has(id));
  if(Array.isArray(p.history))p.history=p.history.map(ids=>ids.filter(id=>valid.has(id))).filter(ids=>ids.length);
  if(p.srs)p.srs=Object.fromEntries(Object.entries(p.srs).filter(([id])=>valid.has(id)));
  p.active=[];p.historyIndex=null;
 }
 state.builtinVersion=version;return true;
}
