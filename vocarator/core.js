(() => {
  const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function matcher(data) {
    const aliases = data.nodes.flatMap(n => (n.aliases || []).map(a => [a, n.id])).sort((a,b) => b[0].length-a[0].length);
    const ids = new Map(aliases.map(([a,id]) => [a.toLocaleLowerCase("pt-BR"), id]));
    const regex = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${aliases.map(([a]) => escape(a)).join("|")})(?![\\p{L}\\p{N}_])`, "giu");
    return text => [...text.matchAll(regex)].map(m => ({start:m.index, text:m[0], id:ids.get(m[0].toLocaleLowerCase("pt-BR"))}));
  }
  function path(data, start) {
    const queue = [{nodes:[start], edges:[]}], seen = new Set([start]);
    while(queue.length) {
      const p=queue.shift(), last=p.nodes.at(-1);
      if(last===data.root) return p;
      for(const edge of data.edges) {
        const next=edge.from===last?edge.to:edge.to===last?edge.from:null;
        if(next && !seen.has(next)) {seen.add(next);queue.push({nodes:[...p.nodes,next],edges:[...p.edges,edge]});}
      }
    }
    return null;
  }
  function domain(data, host) {
    return data.nodes.find(n => (n.domains||[]).some(d => host===d || host.endsWith("."+d)));
  }
  function validate(data) {
    if(!data || data.version!==1 || !Array.isArray(data.nodes) || !data.nodes.length || data.nodes.length>2000 || !Array.isArray(data.edges) || data.edges.length>5000) throw Error("Base inválida ou grande demais.");
    const ids = new Set(); const aliases = new Set();
    const str = x => typeof x === "string" && x.length>0 && x.length<1500;
    for(const n of data.nodes) {
      if(!str(n.id)||ids.has(n.id)||!str(n.name)||!Array.isArray(n.aliases)||!n.aliases.length||n.aliases.some(a=>!str(a)||aliases.has(a.toLowerCase()))) throw Error("Nomes, aliases ou identificadores inválidos/duplicados.");
      n.aliases.forEach(a=>aliases.add(a.toLowerCase()));ids.add(n.id);
      if(n.domains && (!Array.isArray(n.domains)||n.domains.some(d=>typeof d!=="string"||!/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(d)))) throw Error("Domínio inválido.");
    }
    if(!ids.has(data.root)) throw Error("Nó central ausente.");
    for(const e of data.edges) {
      if(!ids.has(e.from)||!ids.has(e.to)||!str(e.label)||!str(e.detail)||!str(e.status)||!str(e.date)||!Array.isArray(e.sources)||!e.sources.length) throw Error("Toda relação precisa de nós, descrição, data, status e fonte.");
      for(const s of e.sources) {if(!str(s.title)||!str(s.url)||new URL(s.url).protocol!=="https:") throw Error("Fonte precisa de título e endereço HTTPS.");}
    }
    return data;
  }
  globalThis.VocaratorCore={matcher,path,domain,validate};
})();
