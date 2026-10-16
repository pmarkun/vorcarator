// Apenas JSON é importado. Código remoto nunca é executado.
(() => {
  const URL_BASE = 'https://raw.githubusercontent.com/pmarkun/vorcarator/main/vocarator/base-inicial.json';
  const LIMIT = 2_000_000;
  let pending;
  async function download() {
    const response = await fetch(URL_BASE, {cache:'no-store', credentials:'omit', redirect:'error', signal:AbortSignal.timeout(20000)});
    if (!response.ok) throw Error(`Servidor respondeu ${response.status}. A base atual foi mantida.`);
    const reader = response.body.getReader(); const chunks=[]; let length=0;
    try {
      while (true) {
        const {done,value}=await reader.read(); if(done)break;
        length+=value.byteLength; if(length>LIMIT)throw Error('Base maior que 2 MB.'); chunks.push(value);
      }
    } finally { await reader.cancel().catch(()=>{}); }
    const bytes=new Uint8Array(length); let offset=0;
    for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    const data=VocaratorCore.validate(JSON.parse(new TextDecoder().decode(bytes)));
    if(typeof data.updated!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(data.updated))throw Error('Data da base inválida.');
    // Um único write após todas as verificações: falhas nunca substituem a base.
    const checkedAt=new Date().toISOString();
    await chrome.storage.local.set({dataset:data,baseCheckedAt:checkedAt});
    return {updated:data.updated,nodes:data.nodes.length,edges:data.edges.length,checkedAt};
  }
  globalThis.VocaratorRemote={URL_BASE,update(){if(!pending)pending=download().finally(()=>{pending=null;});return pending;}};
})();
