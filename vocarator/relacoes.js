(() => {
  let base,view;const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function render(){
    const query=normalize(document.getElementById('filter').value);const rows=document.getElementById('rows');rows.replaceChildren();let found=0;
    for(const e of base.edges){
      const from=base.nodes.find(n=>n.id===e.from),to=base.nodes.find(n=>n.id===e.to);if(!normalize([from.name,to.name,e.label,e.detail,e.date].join(' ')).includes(query))continue;found++;
      const tr=document.createElement('tr');const cells=Array.from({length:4},()=>document.createElement('td'));
      for(const n of [from,to]){const b=document.createElement('button');b.textContent=n.name;b.onclick=()=>view.open(n.id);cells[0].append(b,document.createElement('br'));}
      cells[1].textContent=e.label+' · '+e.date;const status=document.createElement('small');status.textContent=e.status;cells[1].append(document.createElement('br'),status);
      const detail=document.createElement('p');detail.textContent=e.detail;cells[2].append(detail);if(e.response){const p=document.createElement('p');p.textContent='Resposta: '+e.response;cells[2].append(p);}
      for(const s of e.sources){const a=document.createElement('a');a.textContent=s.title+' ↗';a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';cells[3].append(a,document.createElement('br'));}tr.append(...cells);rows.append(tr);
    }
    document.getElementById('filter-count').textContent=query?`${found} ${found===1?'relação encontrada':'relações encontradas'}`:'';
    if(!found){const tr=document.createElement('tr');tr.className='empty';const td=document.createElement('td');td.colSpan=4;td.textContent='Nenhuma relação encontrada. Tente outro nome ou tipo de vínculo.';tr.append(td);rows.append(tr);}
  }
  function load(dataset){base=VocaratorCore.validate(dataset||VORCARO_DATA);view?.destroy();view=VocaratorView.create(base);view.setTheme(VocaratorTheme.detect(document.body));document.getElementById('count').textContent=`${base.nodes.length} entidades · ${base.edges.length} relações · Base revisada em ${base.updated}`;render();}
  document.getElementById('filter').oninput=render;
  if(globalThis.chrome?.storage){chrome.storage.local.get('dataset').then(s=>load(s.dataset));chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.dataset)load(changes.dataset.newValue);});}else load();
  globalThis.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change',()=>view?.setTheme(VocaratorTheme.detect(document.body)));
})();
