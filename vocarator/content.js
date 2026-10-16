(() => {
  if(globalThis.__vocarator)return;globalThis.__vocarator=true;
  let observer,view,timer,data,match,mode='subtle';const pending=new Set();let themeDirty=false;
  const skip="script,style,noscript,textarea,input,select,button,code,pre,svg,canvas,[contenteditable]:not([contenteditable='false']),[role='textbox'],[data-vocarator],.vocarator-mark,.vocarator-tag";
  function annotate(root){
    if(!root.isConnected || root.parentElement?.closest(skip))return;
    const nodes=[];
    if(root.nodeType===Node.TEXT_NODE)nodes.push(root);
    else {if(root.matches?.(skip))return;const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement?.closest(skip)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});while(walk.nextNode())nodes.push(walk.currentNode);}
    for(const n of nodes){
      if(!n.isConnected||!n.textContent.trim())continue;
      const hits=match(n.textContent);if(!hits.length)continue;
      const f=document.createDocumentFragment();let end=0;
      for(const h of hits){
        f.append(document.createTextNode(n.textContent.slice(end,h.start)));
        const mark=document.createElement('span');mark.className='vocarator-mark';mark.dataset.entity=h.id;mark.textContent=h.text;mark.tabIndex=0;mark.role='button';
        mark.setAttribute('aria-label',h.text+': ver relações e fontes no Vocarator');
        const path=VocaratorCore.path(data,h.id);mark.title=path?.edges[0]?`${path.edges[0].label} · Clique para ver contexto e fontes`:'Ver relações e fontes';
        const badge=document.createElement('span');badge.className='vocarator-tag';badge.textContent='V';badge.setAttribute('aria-hidden','true');mark.append(badge);
        const open=e=>{if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;if(e.type==='click'&&globalThis.getSelection()?.isCollapsed===false)return;e.preventDefault();e.stopPropagation();view.open(h.id);};
        mark.onclick=open;mark.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){open(e);}};
        f.append(mark);end=h.start+h.text.length;
      }
      f.append(document.createTextNode(n.textContent.slice(end)));n.replaceWith(f);
    }
  }
  function refresh(){
    const seen=new Set();
    document.querySelectorAll('.vocarator-mark').forEach(mark=>{VocaratorTheme.apply(mark,mode);const badge=mark.querySelector('.vocarator-tag');if(badge)badge.hidden=seen.has(mark.dataset.entity);seen.add(mark.dataset.entity);});
    view?.setTheme(VocaratorTheme.detect(document.body));
  }
  const observe=()=>observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','style','data-theme','data-color-mode','data-bs-theme','color-scheme']});
  function schedule(){clearTimeout(timer);timer=setTimeout(()=>{observer?.disconnect();const roots=[...pending];pending.clear();roots.forEach(annotate);refresh();themeDirty=false;observe();},150);}
  function stop(){
    clearTimeout(timer);observer?.disconnect();pending.clear();themeDirty=false;view?.destroy();view=null;
    document.querySelectorAll('.vocarator-mark').forEach(n=>{n.querySelectorAll('.vocarator-tag').forEach(b=>b.remove());const parent=n.parentNode;n.replaceWith(document.createTextNode(n.textContent));parent?.normalize();});
  }
  function start(settings){
    stop();if(settings.enabled===false)return;
    try{data=VocaratorCore.validate(settings.dataset||VORCARO_DATA);}catch(err){console.warn('Vocarator: base inválida',err.message);return;}
    mode=settings.markerStyle==='highlight'?'highlight':'subtle';match=VocaratorCore.matcher(data);
    view=VocaratorView.create(data);const site=VocaratorCore.domain(data,location.hostname);if(site)view.banner(site);
    annotate(document.body);refresh();
    observer=new MutationObserver(records=>{
      let changed=false;
      for(const r of records){
        if(r.target.nodeType===1&&r.target.closest?.('[data-vocarator]'))continue;
        if(r.type==='attributes'){if(!r.target.closest?.('.vocarator-mark')){themeDirty=true;changed=true;}}
        else if(r.type==='characterData'){pending.add(r.target);changed=true;}
        else {r.addedNodes.forEach(n=>{if(!n.matches?.('[data-vocarator]'))pending.add(n);});changed=true;}
      }
      if(changed||themeDirty)schedule();
    });observe();
  }
  const colorScheme=globalThis.matchMedia?.('(prefers-color-scheme: dark)');colorScheme?.addEventListener('change',()=>{if(view){themeDirty=true;schedule();}});
  if(globalThis.chrome?.storage){const keys=['enabled','dataset','markerStyle'];chrome.storage.local.get(keys).then(start);chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&keys.some(k=>changes[k]))chrome.storage.local.get(keys).then(start);});}
  else start({});
})();
