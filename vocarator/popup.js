let current;
const status=document.getElementById('status');
async function load(){const s=await chrome.storage.local.get(['enabled','dataset','markerStyle','baseCheckedAt']);current=s.dataset||VORCARO_DATA;document.getElementById('checked').textContent=s.baseCheckedAt?'Última consulta: '+new Date(s.baseCheckedAt).toLocaleString('pt-BR'):'Atualize relações e fontes sem reinstalar a extensão.';document.getElementById('enabled').checked=s.enabled!==false;document.querySelector(`input[name=style][value="${s.markerStyle==='highlight'?'highlight':'subtle'}"]`).checked=true;document.getElementById('count').textContent=`${current.nodes.length} entidades · ${current.edges.length} relações · Base: ${current.updated}`;}
async function save(values,message){try{await chrome.storage.local.set(values);status.textContent=message;}catch{status.textContent='Não foi possível salvar. Tente novamente.';}}
document.getElementById('enabled').onchange=e=>save({enabled:e.target.checked},e.target.checked?'Marcações ativadas.':'Marcações removidas.');
document.querySelectorAll('input[name=style]').forEach(input=>input.onchange=e=>save({markerStyle:e.target.value},e.target.value==='highlight'?'Destaque com fundo ativado.':'Marcador discreto ativado.'));
document.getElementById('import').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>2000000)throw Error('Limite de 2 MB.');const data=VocaratorCore.validate(JSON.parse(await file.text()));await chrome.storage.local.set({dataset:data});await load();status.textContent='Base importada. Páginas abertas foram atualizadas.';}catch(err){status.textContent=err.message;}e.target.value='';};
document.getElementById('export').onclick=()=>{if(!current)return;const url=URL.createObjectURL(new Blob([JSON.stringify(current,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='vocarator-base.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
document.getElementById('reset').onclick=async()=>{try{await chrome.storage.local.remove('dataset');await load();status.textContent='Base inicial restaurada.';}catch{status.textContent='Não foi possível restaurar a base.';}};
load().catch(()=>status.textContent='Abra este menu pela extensão instalada.');

document.getElementById('update').onclick=async()=>{
  const button=document.getElementById('update');button.disabled=true;status.textContent='Buscando a base publicada…';
  try{const result=await chrome.runtime.sendMessage({type:'update-base'});if(!result?.ok)throw Error(result?.error||'Não foi possível atualizar.');await load();status.textContent='Base atualizada. As páginas abertas já usam os novos dados.';}
  catch(error){status.textContent=error.message+' A base atual foi mantida.';}
  finally{button.disabled=false;}
};
