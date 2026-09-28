'use client';
import {useEffect,useRef,useState} from 'react';

const library=[
 {kind:'compressor',name:'Compresor hermético',icon:'⚫',w:120,h:130},
 {kind:'condenser',name:'Condensador',icon:'♨',w:210,h:130},
 {kind:'drier',name:'Filtro secador',icon:'▰',w:130,h:55},
 {kind:'capillary',name:'Capilar',icon:'〰',w:160,h:65},
 {kind:'evaporator',name:'Evaporador',icon:'❄',w:210,h:130},
 {kind:'valve',name:'Válvula expansión',icon:'◆',w:105,h:85},
 {kind:'fan',name:'Ventilador',icon:'✣',w:120,h:120}
];
export default function Home(){
 const canvasRef=useRef(null),fileRef=useRef(null);const [items,setItems]=useState([]),[pipes,setPipes]=useState([]),[tool,setTool]=useState('select'),[selected,setSelected]=useState(null),[color,setColor]=useState('#ef4444'),[width,setWidth]=useState(8),[speed,setSpeed]=useState(1),[playing,setPlaying]=useState(true),[saved,setSaved]=useState(false),[grid,setGrid]=useState(true),[labels,setLabels]=useState(true);const drag=useRef(null),start=useRef(null),anim=useRef(0);
 const pos=e=>{const r=canvasRef.current.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
 const save=()=>{localStorage.setItem('enfriar-editor',JSON.stringify({items,pipes}));setSaved(true);setTimeout(()=>setSaved(false),1200)};
 const load=()=>{try{const d=JSON.parse(localStorage.getItem('enfriar-editor'));if(d){setItems(d.items||[]);setPipes(d.pipes||[])}}catch{}};
 const clear=()=>{if(confirm('¿Vaciar todo el circuito?')){setItems([]);setPipes([]);setSelected(null)}};
 const demo=()=>{const parts=[
 {id:crypto.randomUUID(),kind:'compressor',name:'Compresor',x:70,y:390,w:120,h:130,rot:0},
 {id:crypto.randomUUID(),kind:'condenser',name:'Condensador',x:290,y:90,w:210,h:130,rot:0},
 {id:crypto.randomUUID(),kind:'drier',name:'Filtro secador',x:600,y:125,w:130,h:55,rot:0},
 {id:crypto.randomUUID(),kind:'capillary',name:'Capilar',x:820,y:115,w:160,h:65,rot:0},
 {id:crypto.randomUUID(),kind:'evaporator',name:'Evaporador',x:760,y:410,w:210,h:130,rot:0}
 ];setItems(parts);setPipes([
 {id:crypto.randomUUID(),a:{x:190,y:430},b:{x:290,y:155},color:'#ef4444',width:8},
 {id:crypto.randomUUID(),a:{x:500,y:155},b:{x:600,y:152},color:'#ef4444',width:8},
 {id:crypto.randomUUID(),a:{x:730,y:152},b:{x:820,y:147},color:'#f59e0b',width:8},
 {id:crypto.randomUUID(),a:{x:980,y:147},b:{x:970,y:475},color:'#2563eb',width:8},
 {id:crypto.randomUUID(),a:{x:760,y:475},b:{x:130,y:520},color:'#2563eb',width:8}
 ])};
 const addPart=p=>setItems(v=>[...v,{id:crypto.randomUUID(),kind:p.kind,name:p.name,x:90+v.length*18,y:90+v.length*12,w:p.w,h:p.h,rot:0}]);
 const addImage=e=>{const f=e.target.files?.[0];if(!f)return;const reader=new FileReader();reader.onload=()=>{const url=reader.result,im=new Image();im.onload=()=>setItems(v=>[...v,{id:crypto.randomUUID(),kind:'image',name:f.name,url,x:100,y:100,w:Math.min(260,im.width),h:Math.min(200,im.height),rot:0}]);im.src=url};reader.readAsDataURL(f);e.target.value=''};
 const exportPNG=()=>{const a=document.createElement('a');a.download='circuito-refrigeracion.png';a.href=canvasRef.current.toDataURL('image/png');a.click()};;
 const down=e=>{const p=pos(e);if(tool==='pipe'){start.current=p;return}const hit=[...items].reverse().find(i=>p.x>=i.x&&p.x<=i.x+i.w&&p.y>=i.y&&p.y<=i.y+i.h);if(hit){setSelected(hit.id);drag.current={id:hit.id,dx:p.x-hit.x,dy:p.y-hit.y}}else setSelected(null)};
 const move=e=>{if(!drag.current)return;const p=pos(e);setItems(v=>v.map(i=>i.id===drag.current.id?{...i,x:p.x-drag.current.dx,y:p.y-drag.current.dy}:i))};
 const up=e=>{if(tool==='pipe'&&start.current){const p=pos(e);setPipes(v=>[...v,{id:crypto.randomUUID(),a:start.current,b:p,color,width:Number(width)}]);start.current=null}drag.current=null};
 useEffect(()=>{const ctx=canvasRef.current?.getContext('2d');if(!ctx)return;const imgs={};items.filter(i=>i.url).forEach(i=>{const im=new Image();im.src=i.url;imgs[i.id]=im});
 const part=(i)=>{ctx.save();ctx.translate(i.x+i.w/2,i.y+i.h/2);ctx.rotate((i.rot||0)*Math.PI/180);ctx.translate(-i.w/2,-i.h/2);ctx.lineWidth=3;ctx.strokeStyle='#334155';ctx.fillStyle='#e2e8f0';
 if(i.kind==='compressor'){ctx.fillStyle='#202a35';ctx.beginPath();ctx.ellipse(i.w/2,i.h*.58,i.w*.38,i.h*.4,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#475569';ctx.fillRect(i.w*.3,i.h*.08,i.w*.4,i.h*.18);ctx.fillStyle='#94a3b8';ctx.fillRect(i.w*.12,i.h*.85,i.w*.76,8)}
 else if(i.kind==='condenser'||i.kind==='evaporator'){ctx.strokeStyle=i.kind==='condenser'?'#ef4444':'#2563eb';ctx.lineWidth=5;for(let y=18;y<i.h-10;y+=20){ctx.beginPath();ctx.moveTo(8,y);ctx.lineTo(i.w-8,y);ctx.stroke()}ctx.strokeStyle='#64748b';ctx.lineWidth=1;for(let x=15;x<i.w;x+=15){ctx.beginPath();ctx.moveTo(x,8);ctx.lineTo(x,i.h-8);ctx.stroke()}}
 else if(i.kind==='drier'){ctx.fillStyle='#c08457';ctx.beginPath();ctx.roundRect(8,i.h*.2,i.w-16,i.h*.6,18);ctx.fill();ctx.fillStyle='#a16207';ctx.fillRect(0,i.h*.42,15,8);ctx.fillRect(i.w-15,i.h*.42,15,8)}
 else if(i.kind==='capillary'){ctx.strokeStyle='#b45309';ctx.lineWidth=4;for(let n=0;n<4;n++){ctx.beginPath();ctx.ellipse(i.w/2,i.h/2,18+n*12,10+n*5,0,0,Math.PI*2);ctx.stroke()}}
 else if(i.kind==='valve'){ctx.fillStyle='#d97706';ctx.beginPath();ctx.moveTo(10,i.h/2);ctx.lineTo(i.w/2,12);ctx.lineTo(i.w-10,i.h/2);ctx.lineTo(i.w/2,i.h-12);ctx.closePath();ctx.fill()}
 else if(i.kind==='fan'){ctx.fillStyle='#64748b';ctx.beginPath();ctx.arc(i.w/2,i.h/2,10,0,Math.PI*2);ctx.fill();for(let a=0;a<4;a++){ctx.save();ctx.translate(i.w/2,i.h/2);ctx.rotate(a*Math.PI/2);ctx.beginPath();ctx.ellipse(0,-28,13,30,.25,0,Math.PI*2);ctx.fill();ctx.restore()}}
 else if(i.url&&imgs[i.id]?.complete)ctx.drawImage(imgs[i.id],0,0,i.w,i.h);
 ctx.restore();if(labels){ctx.fillStyle='#334155';ctx.font='12px Arial';ctx.textAlign='center';ctx.fillText(i.name||'',i.x+i.w/2,i.y+i.h+16)}if(i.id===selected){ctx.strokeStyle='#0284c7';ctx.lineWidth=2;ctx.setLineDash([6,4]);ctx.strokeRect(i.x-5,i.y-5,i.w+10,i.h+10);ctx.setLineDash([])}};
 const draw=t=>{const c=canvasRef.current;ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);if(grid){ctx.strokeStyle='#e5e7eb';ctx.lineWidth=1;for(let x=0;x<c.width;x+=25){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,c.height);ctx.stroke()}for(let y=0;y<c.height;y+=25){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(c.width,y);ctx.stroke()}}items.forEach(part);pipes.forEach(q=>{ctx.strokeStyle=q.color;ctx.lineWidth=q.width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(q.a.x,q.a.y);ctx.lineTo(q.b.x,q.b.y);ctx.stroke();const dx=q.b.x-q.a.x,dy=q.b.y-q.a.y,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len;for(let d=(t*.08*speed)%28;d<len;d+=28){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(q.a.x+ux*d,q.a.y+uy*d,Math.max(2,q.width/4),0,Math.PI*2);ctx.fill()}});if(playing)anim.current=requestAnimationFrame(draw)};draw(0);return()=>cancelAnimationFrame(anim.current)},[items,pipes,selected,playing,speed,grid,labels]);
 const edit=(fn)=>setItems(v=>v.map(i=>i.id===selected?fn(i):i));const del=()=>{if(selected){setItems(v=>v.filter(i=>i.id!==selected));setSelected(null)}else setPipes(v=>v.slice(0,-1))};
 const duplicate=()=>{const i=items.find(x=>x.id===selected);if(i)setItems(v=>[...v,{...i,id:crypto.randomUUID(),x:i.x+25,y:i.y+25,name:i.name+' copia'}])};
 useEffect(()=>{const key=e=>{if((e.key==='Delete'||e.key==='Backspace')&&selected){e.preventDefault();del()}if(e.key==='Escape'){setSelected(null);setTool('select')}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();save()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='d'){e.preventDefault();duplicate()}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[selected,items,pipes]);
 return <main><header><div><b>ENFRI.AR</b><span>Editor didáctico de refrigeración</span></div><nav><button onClick={()=>fileRef.current.click()}>＋ Subir imagen</button><button className={tool==='select'?'on':''} onClick={()=>setTool('select')}>↖ Seleccionar</button><button className={tool==='pipe'?'on':''} onClick={()=>setTool('pipe')}>〰 Tubería</button><button onClick={()=>setPlaying(v=>!v)}>{playing?'⏸ Pausar':'▶ Flujo'}</button><button onClick={save}>💾 {saved?'Guardado':'Guardar'}</button><button onClick={load}>↥ Recuperar</button><button onClick={exportPNG}>↓ PNG</button><button className={grid?'on':''} onClick={()=>setGrid(v=>!v)}># Grilla</button><button className={labels?'on':''} onClick={()=>setLabels(v=>!v)}>Aa Nombres</button></nav></header><input ref={fileRef} hidden type="file" accept="image/*" onChange={addImage}/><section className="work"><aside><div className="quick"><button onClick={demo}>Circuito base</button><button onClick={clear}>Nuevo</button></div><h3>Componentes</h3><div className="parts">{library.map(p=><button key={p.kind} onClick={()=>addPart(p)}><i>{p.icon}</i><span>{p.name}</span></button>)}</div><hr/><h3>Tubería / flujo</h3><label>Color<input type="color" value={color} onChange={e=>setColor(e.target.value)}/></label><label>Grosor <b>{width}px</b><input type="range" min="2" max="30" value={width} onChange={e=>setWidth(e.target.value)}/></label><label>Velocidad <b>{speed}×</b><input type="range" min=".2" max="3" step=".2" value={speed} onChange={e=>setSpeed(e.target.value)}/></label><button onClick={()=>setPipes(v=>v.map((p,n)=>n===v.length-1?{...p,color,width:Number(width)}:p))}>Aplicar a última tubería</button><hr/><h3>Seleccionado</h3><div className="row"><button onClick={()=>edit(i=>({...i,w:Math.max(40,i.w-20),h:Math.max(35,i.h-15)}))}>− tamaño</button><button onClick={()=>edit(i=>({...i,w:i.w+20,h:i.h+15}))}>＋ tamaño</button></div><div className="row"><button onClick={()=>edit(i=>({...i,rot:(i.rot||0)-15}))}>↶ Girar</button><button onClick={()=>edit(i=>({...i,rot:(i.rot||0)+15}))}>↷ Girar</button></div><button onClick={duplicate}>Duplicar seleccionado</button><button className="danger" onClick={del}>Eliminar</button><p className="hint">Agregá componentes y movelos libremente. Para unirlos, elegí “Tubería” y arrastrá. Atajos: Supr elimina · Esc selecciona · Ctrl+S guarda · Ctrl+D duplica.</p></aside><div className="stage"><canvas ref={canvasRef} width={1200} height={700} onPointerDown={down} onPointerMove={move} onPointerUp={up}/><div className="status">{tool==='pipe'?'Dibujando tuberías':'Seleccionando'} · {items.length} componentes · {pipes.length} tuberías</div></div></section></main>
}