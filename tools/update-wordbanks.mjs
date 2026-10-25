import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
const hash=b=>createHash('sha256').update(b).digest('hex');
export async function siteDirectory(root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')){try{await fs.access(path.join(root,'dist/index.html'));return path.join(root,'dist');}catch{return root;}}
export async function updateCatalog(site){
 const {parseWordbank}=await import(pathToFileURL(path.join(site,'wordbank.js')));
 const sandbox={console,Buffer,Uint8Array,ArrayBuffer,DataView,TextDecoder,TextEncoder,module:{exports:{}}};sandbox.exports=sandbox.module.exports;
 vm.runInNewContext(await fs.readFile(path.join(site,'vendor/xlsx.full.min.js'),'utf8'),sandbox,{timeout:10000});
 const XLSX=sandbox.module.exports.read?sandbox.module.exports:sandbox.XLSX;if(!XLSX?.read)throw Error('Excel读取组件不可用');
 const dir=path.join(site,'wordbanks');await fs.mkdir(dir,{recursive:true});
 const files=(await fs.readdir(dir,{withFileTypes:true})).filter(f=>f.isFile()&&!f.name.startsWith('~$')&&/\.xlsx$/i.test(f.name)).map(f=>f.name).sort();
 const compiled=[];
 for(const file of files){try{const bytes=await fs.readFile(path.join(dir,file));if(bytes.length>20*1024*1024)throw Error('超过20 MB');const stem=file.replace(/\.xlsx$/i,''),id='bundled:'+hash(Buffer.from(file.normalize('NFC'))).slice(0,16),version=hash(bytes);
  const workbook=XLSX.read(bytes,{type:'buffer',cellHTML:false,cellFormula:false}),sheets={};for(const name of ['单词表','文章表','题目表']){if(workbook.Sheets[name]){const range=XLSX.utils.decode_range(workbook.Sheets[name]['!ref']||'A1');if(range.e.r>20000||range.e.c>50)throw Error(name+'范围过大');sheets[name]=XLSX.utils.sheet_to_json(workbook.Sheets[name],{header:1,defval:'',blankrows:true,raw:false});}}
  const bank=parseWordbank(sheets,id);const cellIds=new Map(bank.entries.map(e=>[e.id,e.id+':'+hash(Buffer.from(e.word)).slice(0,8)]));for(const e of bank.entries)e.id=cellIds.get(e.id);for(const g of bank.groups){g.wordIds=g.wordIds.map(id=>cellIds.get(id));for(const q of g.cloze.questions)q.wordId=cellIds.get(q.wordId);}const sourceKey=['NAWL','TSL','BSL','FEL','MOEL','NGSL-S','NGSL-GR'].find(key=>new RegExp(key.replace('-','[- _]?'),'i').test(stem))||null;
  for(const g of bank.groups)g.cloze.contentVersion=hash(Buffer.from(JSON.stringify(g.cloze))).slice(0,16);
  const dataFile='wordbanks/generated/'+id.split(':')[1]+'-'+version.slice(0,12)+'.json';
  const metadata={id,name:stem,version,entryCount:bank.entries.length,groupCount:bank.groups.length,sourceKey,sourceFile:'wordbanks/'+encodeURIComponent(file),dataFile,source:sourceKey?'NGSL Project · '+sourceKey+' · 本站整理版':'自带Excel词库'};
  compiled.push({metadata,data:{...metadata,entries:bank.entries,groups:bank.groups}});
 }catch(e){throw Error(`${file}：${e.errors?e.errors.join('；'):e.message}`);}}
 // All files must pass validation before replacing the published catalog.
 await fs.mkdir(path.join(dir,'generated'),{recursive:true});for(const item of compiled)await fs.writeFile(path.join(site,item.metadata.dataFile),JSON.stringify(item.data));
 const decks=compiled.map(c=>c.metadata),catalog={schemaVersion:1,version:hash(Buffer.from(JSON.stringify(decks))),decks};
 const target=path.join(site,'wordbanks/catalog.json');await fs.writeFile(target+'.tmp',JSON.stringify(catalog));await fs.rename(target+'.tmp',target);
 const keep=new Set(compiled.map(c=>path.basename(c.metadata.dataFile)));for(const file of await fs.readdir(path.join(dir,'generated')))if(file.endsWith('.json')&&!keep.has(file))await fs.unlink(path.join(dir,'generated',file));
 console.log(`已校验并更新 ${decks.length} 个自带词库：${decks.map(d=>d.name+'（'+d.entryCount+'词 / '+d.groupCount+'篇）').join('、')}`);return catalog;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{await updateCatalog(process.argv[2]?path.resolve(process.argv[2]):await siteDirectory());}catch(e){console.error(e.message);process.exitCode=1;}}
