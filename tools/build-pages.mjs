import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {siteDirectory} from './update-wordbanks.mjs';

export async function buildPages(root){
 const site=await siteDirectory(root),out=path.join(root,'.pages-dist');
 const banned=new Set(['.git','.github','.openai','.pages-dist','tools','tests','work','outputs','node_modules','package.json','package-lock.json']);
 await fs.rm(out,{recursive:true,force:true});
 await fs.mkdir(out,{recursive:true});
 // Copy allowed children, never a directory into one of its own descendants.
 // This supports both dist/ source checkouts and flat GitHub Pages repositories.
 for(const entry of await fs.readdir(site,{withFileTypes:true})){
  if(banned.has(entry.name)||(entry.name.startsWith('.')&&entry.name!=='.nojekyll')||entry.isSymbolicLink())continue;
  await fs.cp(path.join(site,entry.name),path.join(out,entry.name),{recursive:true});
 }
 await fs.writeFile(path.join(out,'.nojekyll'),'');
 console.log('静态发布目录已生成：.pages-dist');
 return out;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await buildPages(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
