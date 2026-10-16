(() => {
  const palettes = {
    light: {ink:'#28320f', surface:'#e9efc8', accent:'#687b25'},
    dark: {ink:'#f1f7d9', surface:'#344322', accent:'#bed984'}
  };
  function parseColor(value) {
    value=String(value).trim();
    if(value==='transparent')return [0,0,0,0];
    if(/^#[a-f\d]{3,8}$/i.test(value)){
      let hex=value.slice(1);if(hex.length===3||hex.length===4)hex=[...hex].map(x=>x+x).join('');
      if(hex.length===6||hex.length===8)return [parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16),hex.length===8?parseInt(hex.slice(6,8),16)/255:1];
    }
    if(/^rgba?\(/i.test(value)){
      const numbers=value.match(/[\d.]+/g)?.map(Number);
      if(numbers?.length>=3)return [numbers[0],numbers[1],numbers[2],numbers[3]??1];
    }
    // The canvas color parser also understands oklch(), lab() and color().
    if(globalThis.document){
      const context=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
      if(context){context.clearRect(0,0,1,1);context.fillStyle=value;context.fillRect(0,0,1,1);const rgba=context.getImageData(0,0,1,1).data;return [rgba[0],rgba[1],rgba[2],rgba[3]/255];}
    }
    return [0,0,0,0];
  }
  function luminance(rgb) {
    const linear=rgb.slice(0,3).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;});
    return linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;
  }
  function contrast(a,b) {const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
  function detect(element) {
    const layers=[];
    for(let node=element;node;node=node.parentElement){const color=parseColor(getComputedStyle(node).backgroundColor);layers.push(color);if(color[3]>=1)break;}
    const dark=globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches;
    let background=dark?[18,22,17]:[255,255,255];
    for(const layer of layers.reverse())background=background.map((v,i)=>layer[i]*layer[3]+v*(1-layer[3]));
    return luminance(background)<.35?'dark':'light';
  }
  function apply(element,mode='subtle') {element.dataset.vocaratorTheme=detect(element.parentElement||element);element.dataset.vocaratorStyle=mode;}
  globalThis.VocaratorTheme={detect,apply,parseColor,luminance,contrast,palettes};
})();
