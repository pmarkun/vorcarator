(() => {
  const view=VocaratorView.create(VORCARO_DATA),sample=document.getElementById('sample'),mark=sample.querySelector('.vocarator-mark');
  document.getElementById('base-count').textContent=`${VORCARO_DATA.nodes.length} entidades · ${VORCARO_DATA.edges.length} relações`;
  function refresh(){VocaratorTheme.apply(mark);view.setTheme(VocaratorTheme.detect(document.body));}
  document.querySelectorAll('[data-preview]').forEach(button=>button.onclick=()=>{sample.dataset.theme=button.dataset.preview;document.querySelectorAll('[data-preview]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));refresh();});
  const open=e=>{e.preventDefault();view.open('vogue');};mark.onclick=open;mark.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')open(e);};
  globalThis.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change',refresh);refresh();
})();
