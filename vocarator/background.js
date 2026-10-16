importScripts('core.js','remote.js');
chrome.runtime.onMessage.addListener((message,sender,respond)=>{
  // Somente páginas da própria extensão podem disparar a importação.
  if(sender.id!==chrome.runtime.id || !sender.url?.startsWith(chrome.runtime.getURL('')) || message?.type!=='update-base')return;
  VocaratorRemote.update().then(result=>respond({ok:true,...result})).catch(error=>respond({ok:false,error:error.message||'Falha ao atualizar. A base atual foi mantida.'}));
  return true;
});
