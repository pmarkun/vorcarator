(() => {
  const css=`
:host{all:initial;display:block;font:14px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#232b1c;color-scheme:light;--paper:#fafbf6;--surface:#f0f3e7;--ink:#232b1c;--muted:#647057;--line:#dbe1d0;--accent:#526c26;--strong:#26341b;--on-strong:#f1f6e2}
:host([data-ui-theme=dark]){color-scheme:dark;--paper:#191f18;--surface:#242d20;--ink:#edf2e5;--muted:#b1bea5;--line:#3a4733;--accent:#c0d78f;--strong:#d2e7a8;--on-strong:#202a17}
*{box-sizing:border-box}button,a,summary{font:inherit}button,summary{cursor:pointer}a{color:var(--accent);text-underline-offset:3px}button{color:inherit}button:focus-visible,a:focus-visible,summary:focus-visible{outline:2px solid var(--accent);outline-offset:3px}button:disabled{opacity:.35;cursor:default}.brand{font-weight:800;letter-spacing:-.8px;font-size:17px}.banner{background:var(--paper);color:var(--ink);border-bottom:1px solid var(--line);padding:7px 16px;display:flex;align-items:center;gap:14px;min-height:42px}.banner .brand{font-size:13px}.banner .blurb{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}.banner button{border:1px solid var(--line);background:var(--surface);color:var(--ink);padding:4px 10px;border-radius:6px;font-size:12px;white-space:nowrap}.banner .dismiss{border:0;background:transparent;width:28px;padding:2px;font-size:18px;color:var(--muted)}
.layer{position:fixed;inset:0;z-index:2147483647;margin:0;border:0;padding:0;max-width:none;max-height:none;width:100vw;height:100vh;height:100dvh;background:transparent;color:var(--ink);overflow:hidden}.layer[open]{display:flex;justify-content:flex-end}.layer::backdrop{background:#0a120947;backdrop-filter:blur(2px)}.panel{width:min(540px,100vw);height:100%;overflow:auto;overscroll-behavior:contain;background:var(--paper);color:var(--ink);box-shadow:-12px 0 60px #0002;padding:0 28px 28px;scrollbar-gutter:stable}header{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:18px 0;background:var(--paper);border-bottom:1px solid var(--line);gap:12px}header .tools{display:flex;gap:8px}.icon{display:grid;place-items:center;width:34px;height:34px;border:1px solid var(--line);border-radius:8px;background:var(--surface);font-size:20px}.back{font-size:17px}.kind{color:var(--muted);font-size:12px;margin:24px 0 6px}h1{font-size:30px;letter-spacing:-1.1px;line-height:1.15;margin:0 0 10px;overflow-wrap:anywhere}h2{font-size:15px;margin:22px 0 10px;font-weight:700}.muted{color:var(--muted);font-size:13px}.summary{padding:14px 16px;background:var(--surface);border-radius:10px;margin-top:18px;font-size:13px}.graph{border:1px solid var(--line);border-radius:12px;padding:16px;margin:22px 0}.node{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;text-align:left;border:1px solid var(--line);border-radius:8px;background:var(--paper);padding:10px 12px;color:var(--ink)}.node.root{background:var(--strong);color:var(--on-strong);border-color:var(--strong)}.node.selected{border-color:var(--accent)}.node strong{font-size:13px}.node small{color:var(--muted);font-size:11px}.node.root small{color:inherit;opacity:.8}.node span{display:flex;flex-direction:column}.edge{padding:9px 12px 9px 20px;margin-left:18px;border-left:1px solid var(--accent);font-size:11px;color:var(--muted)}.card{border-top:1px solid var(--line)}.card summary{padding:15px 0;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:13px;font-weight:650}.card summary::-webkit-details-marker{display:none}.card summary::after{content:'+';font-size:20px;font-weight:400;color:var(--muted)}.card[open] summary::after{content:'−'}.card summary span{display:flex;flex-direction:column}.card summary small{font-weight:400;color:var(--muted);font-size:11px;margin-top:3px}.evidence{padding:0 0 16px}.meta{font-size:11px;color:var(--accent)}p{margin:8px 0 12px}.notice{border-left:2px solid var(--line);padding-left:12px;font-size:12px;color:var(--muted)}.sources{display:flex;flex-direction:column;gap:6px;font-size:12px}.related{display:flex;flex-direction:column;gap:8px}.related button{padding:10px 12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:8px;text-align:left}.related small{display:block;color:var(--muted);font-size:11px}footer{border-top:1px solid var(--line);padding-top:16px;margin-top:24px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;font-size:11px;color:var(--muted)}
@media(max-width:500px){.panel{padding:0 18px 20px}.banner{gap:8px;padding:7px 10px}.banner .brand{display:none}h1{font-size:26px}.graph{padding:12px}}
@media(prefers-reduced-motion:no-preference){.panel{animation:arrive .16s ease-out}@keyframes arrive{from{transform:translateX(16px);opacity:.6}to{transform:translateX(0);opacity:1}}}`;
  function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
  function aboutURL(){return globalThis.chrome?.runtime?.getURL?chrome.runtime.getURL('sobre.html'):new URL('sobre.html',location.href).href;}
  globalThis.VocaratorView={
    create(data){
      const host=document.createElement('div');host.dataset.vocarator='ui';host.style.setProperty('display','block','important');
      const shadow=host.attachShadow({mode:'open'});shadow.append(el('style',css));document.body.prepend(host);
      let layer=null,previous=null,history=[];
      function close(restore=true){if(layer?.open&&layer.close)layer.close();layer?.remove();layer=null;history=[];if(restore)previous?.focus?.({preventScroll:true});}
      function open(id,back=false){
        const node=data.nodes.find(n=>n.id===id);if(!node)return;
        if(!layer)previous=document.activeElement;
        if(!back&&history.at(-1)!==id)history.push(id);
        if(layer?.open&&layer.close)layer.close();layer?.remove();
        layer=el('dialog',undefined,'layer');layer.setAttribute('aria-label','Relações de '+node.name);
        const panel=el('section',undefined,'panel');panel.tabIndex=-1;
        const header=el('header');header.append(el('strong','vocarator','brand'));
        const tools=el('div',undefined,'tools');const prev=el('button','←','icon back');prev.disabled=history.length<2;prev.title='Voltar';prev.setAttribute('aria-label','Voltar para a conexão anterior');prev.onclick=()=>{history.pop();open(history.at(-1),true);};
        const x=el('button','×','icon');x.title='Fechar (Esc)';x.setAttribute('aria-label','Fechar grafo');x.onclick=()=>close();tools.append(prev,x);header.append(tools);
        panel.append(header,el('p',node.kind||'Entidade','kind'),el('h1',node.name));
        const p=VocaratorCore.path(data,id);
        if(p){
          panel.append(el('p',p.edges.length?`${p.edges.length} ${p.edges.length===1?'conexão':'conexões'} até Daniel Vorcaro`:'Ponto central da rede cadastrada','muted'));
          if(node.banner)panel.append(el('p',node.banner,'summary'));
          const graph=el('div',undefined,'graph');graph.setAttribute('aria-label','Grafo de relações');
          p.nodes.forEach((nid,i)=>{const n=data.nodes.find(n=>n.id===nid);const b=el('button',undefined,'node'+(nid===data.root?' root':'')+(nid===id?' selected':''));const names=el('span');names.append(el('strong',n.name),el('small',n.kind||'Entidade'));b.append(names,el('span',nid===id?'●':'↗'));b.setAttribute('aria-label','Explorar '+n.name);b.onclick=()=>open(nid);graph.append(b);if(p.edges[i]){const e=p.edges[i];graph.append(el('div',(e.from===nid?'↓ ':'↑ ')+e.label,'edge'));}});panel.append(graph);
          const evidence=p.edges.length?p.edges:data.edges.filter(e=>e.from===id||e.to===id);
          if(id===data.root){const related=el('div',undefined,'related');panel.append(el('h2','Explorar conexões diretas'));evidence.forEach(e=>{const nid=e.from===id?e.to:e.from;const n=data.nodes.find(n=>n.id===nid);const b=el('button',n.name+' ↗');b.append(el('small',e.label));b.onclick=()=>open(nid);related.append(b);});panel.append(related);}
          panel.append(el('h2','Contexto e fontes'));
          evidence.forEach((e,i)=>{
            const card=el('details',undefined,'card');card.open=i===0;
            const title=el('summary'),caption=el('span',e.label);caption.append(el('small',e.date));title.append(caption);
            const body=el('div',undefined,'evidence');const from=data.nodes.find(n=>n.id===e.from),to=data.nodes.find(n=>n.id===e.to);
            body.append(el('p',e.status,'meta'),el('p',`${from.name} → ${to.name}`,'muted'),el('p',e.detail));
            if(e.response)body.append(el('p','Resposta do citado: '+e.response,'notice'));
            const sources=el('div',undefined,'sources');e.sources.forEach(s=>{const a=el('a',s.title+' ↗');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';sources.append(a);});body.append(sources);card.append(title,body);panel.append(card);
          });
          const others=id===data.root?[]:data.edges.filter(e=>(e.from===id||e.to===id)&&!evidence.includes(e));
          if(others.length){
            const related=el('div',undefined,'related');panel.append(el('h2','Outras relações desta entidade'));
            others.forEach(e=>{const nid=e.from===id?e.to:e.from;const n=data.nodes.find(n=>n.id===nid);const b=el('button',n.name+' ↗');b.append(el('small',e.label));b.onclick=()=>open(nid);related.append(b);});panel.append(related);
          }
        }else panel.append(el('p','Nenhum caminho cadastrado até o nó central.'));
        panel.append(el('p','Cada conexão descreve um vínculo específico. O caminho não mede influência. Uma relação histórica pode já ter terminado.','notice'));
        const footer=el('footer');const about=el('a','Sobre o projeto ↗');about.href=aboutURL();about.target='_blank';about.rel='noopener noreferrer';footer.append(el('span','Base: '+data.updated+' · Consulta local'),about);panel.append(footer);
        layer.append(panel);shadow.append(layer);layer.addEventListener('cancel',e=>{e.preventDefault();close();});
        layer.addEventListener('click',e=>{if(e.target===layer)close();});
        layer.addEventListener('wheel',e=>{if(e.target===layer)e.preventDefault();},{passive:false});
        layer.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){const items=[...panel.querySelectorAll('button:not(:disabled),a[href],summary')].filter(n=>!n.closest('details:not([open]) .evidence'));const first=items[0],last=items.at(-1);if(e.shiftKey&&(shadow.activeElement===first||shadow.activeElement===panel)){e.preventDefault();last?.focus();}else if(!e.shiftKey&&shadow.activeElement===last){e.preventDefault();first?.focus();}}});
        if(layer.showModal)layer.showModal();else{layer.setAttribute('open','');layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');}panel.focus({preventScroll:true});
      }
      return {open,setTheme(theme){host.dataset.uiTheme=theme;},banner(node){
        const b=el('div',undefined,'banner');b.setAttribute('aria-label','Vocarator: vínculo deste veículo');b.append(el('strong','vocarator','brand'),el('span',node.name+' · '+(node.bannerLabel||'relação cadastrada; veja o contexto'),'blurb'));
        const more=el('button','Ver contexto ↗');more.title=node.banner||'Ver relação e fontes';more.onclick=()=>open(node.id);
        const x=el('button','×','dismiss');x.setAttribute('aria-label','Ocultar aviso');x.title='Ocultar aviso nesta página';x.onclick=()=>b.remove();b.append(more,x);shadow.append(b);
      },destroy(){close(false);host.remove();}};
    }
  };
})();
