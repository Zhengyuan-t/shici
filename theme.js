(()=>{
  const key='tenwords.theme',system=matchMedia('(prefers-color-scheme: dark)');
  let preference='system';
  try{const saved=localStorage.getItem(key);if(['system','light','dark'].includes(saved))preference=saved;}catch{}
  function apply(){const dark=preference==='dark'||(preference==='system'&&system.matches);document.documentElement.dataset.theme=dark?'dark':'light';document.documentElement.style.colorScheme=dark?'dark':'light';document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#000000':'#f5f5f7');}
  apply();
  system.addEventListener('change',apply);
  document.addEventListener('DOMContentLoaded',()=>{const select=document.querySelector('#theme-select');select.value=preference;select.addEventListener('change',()=>{preference=select.value;try{localStorage.setItem(key,preference);}catch{}apply();});});
})();
