import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';import {siteDirectory} from './update-wordbanks.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),site=await siteDirectory(root),out=path.join(root,'.pages-dist');
await fs.rm(out,{recursive:true,force:true});const banned=new Set(['.git','.github','.openai','.pages-dist','tools','tests','work','outputs','node_modules','package.json','package-lock.json']);
await fs.cp(site,out,{recursive:true,filter:src=>{const rel=path.relative(site,src),first=rel.split(path.sep)[0];return !banned.has(first)&&(!first.startsWith('.')||first==='.nojekyll'||first==='');}});await fs.writeFile(path.join(out,'.nojekyll'),'');console.log('静态发布目录已生成：.pages-dist');
