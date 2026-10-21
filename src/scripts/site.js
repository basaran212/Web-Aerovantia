// Calculadoras, presupuesto automático y formulario de la portada.
import { quoteAero, quoteObra, quoteReforma, quoteSolar } from "./pricing.js";
(function(){
const $ = id => document.getElementById(id);
const num = (n,d=1) => n.toLocaleString('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d});

/* ===== CALCULADORAS Y PRESUPUESTO AUTOMÁTICO ===== */
// Las tarifas y fórmulas viven en pricing.js; aquí solo se leen los campos y se pintan resultados.
const eurx = n => new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0,useGrouping:'always'}).format(n);
const quotes = {};
// Solo se adjunta al formulario el presupuesto que el cliente ha decidido enviar.
let calcShared=null;
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(o=>{const on=o===b;o.setAttribute('aria-selected',on);$('p-'+o.dataset.k).hidden=!on});
}));
// Las páginas de servicio enlazan a /?calc=solar#calculadoras para abrir su pestaña.
const wantedTab=new URLSearchParams(location.search).get('calc');
if(wantedTab)document.querySelector('.tab[data-k="'+wantedTab+'"]')?.click();
const showFrom=(id,q)=>{$(id+'-from').textContent='Desde '+eurx(q.lo);$(id+'-range').textContent='Rango habitual: '+eurx(q.lo)+' – '+eurx(q.hi)};

function calcA(){
  const q=quoteAero({fuel:$('a-fuel').value,spend:+$('a-spend').value,m2:+$('a-m2').value,zone:$('a-zone').value,emitter:$('a-emit').value,irpf:$('a-irpf').checked,insulation:$('a-ins').value});
  $('a-spend-v').textContent=eurx(+$('a-spend').value);$('a-m2-v').textContent=$('a-m2').value+' m²';
  showFrom('a',q);
  const spend=+$('a-spend').value;$('a-n1').textContent=eurx(spend);$('a-n2').textContent=eurx(q.newCost);$('a-b1').style.width='100%';$('a-b2').style.width=(q.newCost/spend*100).toFixed(1)+'%';
  $('a-kw').textContent=q.kw+' kW · SCOP '+num(q.scop);
  $('a-save').textContent=eurx(q.save);$('a-irpf-v').textContent=q.deduction?eurx(q.deduction):'No aplica';
  $('a-ret').textContent=isFinite(q.payback)?num(q.payback)+' años':'—';
  const aWarn=$('a-emit').value==='keep'?'Con radiadores convencionales la bomba trabaja a 50–55 °C y rinde menos. En la visita comprobamos si alguno hay que cambiarlo por uno de baja temperatura.':'';
  $('a-warn').textContent=aWarn;$('a-warn').hidden=!aWarn;
  q.notes=['Bomba de calor recomendada: '+q.kw+' kW, con un rendimiento estacional (SCOP) de '+num(q.scop)+'.',aWarn,'Ahorro estimado frente a tu sistema actual: '+eurx(q.save)+' al año.',
    q.deduction?'Deducción IRPF estimada: '+eurx(q.deduction)+' (40 %, hasta el 31-12-2026, con certificado energético antes y después).':'',
    'Incluye legalización, puesta en marcha y tramitación de ayudas.'].filter(Boolean);
  quotes.aero=q;}
function calcS(){
  const roof=$('s-type').value,flat=roof==='plana';
  $('s-orient-f').hidden=$('s-tilt-f').hidden=flat;
  const q=quoteSolar({bill:+$('s-bill').value,zone:$('s-zone').value,roof,orient:$('s-orient').value,tilt:+document.querySelector('input[name="s-tilt"]:checked').value,shade:$('s-shade').value,area:+$('s-area').value,battery:+$('s-bat').value,aero:$('s-aero').checked,ev:$('s-ev').checked,irpf:$('s-irpf').checked});
  $('s-bill-v').textContent=eurx(+$('s-bill').value)+'/mes';$('s-area-v').textContent=$('s-area').value+' m²';
  showFrom('s',q);
  $('s-n1').textContent=eurx(q.annual);$('s-n2').textContent=eurx(q.after);$('s-b1').style.width='100%';$('s-b2').style.width=(q.after/q.annual*100).toFixed(1)+'%';
  $('s-kwp').textContent=num(q.kwp,1)+' kWp · '+q.panels+' paneles';$('s-prod').textContent=Math.round(q.prod).toLocaleString('es-ES',{useGrouping:'always'})+' kWh';
  $('s-save').textContent=eurx(q.save);$('s-irpf-v').textContent=q.deduction?eurx(q.deduction):'No aplica';$('s-ret').textContent=num(q.payback)+' años';
  const sWarn=[
    q.asbestos?'El fibrocemento suele contener amianto: hay que retirarlo con una empresa autorizada (RERA) antes de instalar. No está incluido en este precio.':'',
    !flat&&q.factor<0.7?'Con esta orientación los paneles producen bastante menos. Normalmente compensa más una estructura en otra zona de la parcela o en una pérgola; lo vemos en la visita.':'',
    q.limitedByRoof?'Tu tejado no da para cubrir todo tu consumo: hemos ajustado la instalación a los '+q.panels+' paneles que caben.':'',
  ].filter(Boolean);
  $('s-warn').textContent=sWarn.join(' ');$('s-warn').hidden=!sWarn.length;
  q.notes=['Producción estimada: '+Math.round(q.prod).toLocaleString('es-ES',{useGrouping:'always'})+' kWh al año, '+Math.round(q.factor*100)+' % de la que daría un tejado ideal orientado al sur ('+Math.round(q.selfPct*100)+' % de tu consumo cubierto con energía solar).','Ahorro estimado: '+eurx(q.save)+' al año.',
    q.deduction?'Deducción IRPF estimada: '+eurx(q.deduction)+' (40 %, hasta el 31-12-2026, con certificado energético antes y después).':'',
    ...sWarn,
    'Incluye legalización del autoconsumo con compensación de excedentes y tramitación de bonificaciones de IBI e ICIO si tu municipio las ofrece.'].filter(Boolean);
  quotes.solar=q;}
function calcR(){
  const type=$('r-type').value,m2=+$('r-m2').value;
  const maxN=type==='kit'?2:5;$('r-n').max=maxN;if(+$('r-n').value>maxN)$('r-n').value=maxN;
  const units=+$('r-n').value;
  const unitM2=type==='int'||type==='design';
  $('r-m2-f').hidden=!unitM2;$('r-n-f').hidden=unitM2;$('r-m2-v').textContent=m2+' m²';$('r-n-v').textContent=units+(units>1?' unidades':' unidad');
  $('r-floor').disabled=type!=='int';$('r-proj').disabled=$('r-dom').disabled=type==='design';
  const q=quoteReforma({type,level:+document.querySelector('input[name="r-q"]:checked').value,m2,units,floor:$('r-floor').checked,domotics:$('r-dom').checked,project:$('r-proj').checked});
  showFrom('r',q);
  $('r-m2p-l').textContent=unitM2?'Precio por m²':(type==='kit'?'Precio por cocina':'Precio por baño');
  $('r-m2p').textContent=unitM2?eurx(q.perM2[0])+' – '+eurx(q.perM2[1]):eurx(q.lo/units)+' – '+eurx(q.hi/units);$('r-time').textContent=q.weeks[0]+'–'+q.weeks[1]+' semanas';$('r-pay').textContent=type==='design'?'50 % · 50 %':q.payments;
  q.notes=['Plazo estimado: '+q.weeks[0]+'–'+q.weeks[1]+' semanas.',type==='design'?'Incluye planos, renders 3D y selección de materiales.':'Pagos por hitos de obra: '+q.payments+'.',
    'No incluye mobiliario suelto ni electrodomésticos salvo que se indique.'];
  quotes.ref=q;}
function calcO(){
  const m2=+$('o-m2').value;$('o-m2-v').textContent=m2+' m²';
  const q=quoteObra({m2,level:+document.querySelector('input[name="o-q"]:checked').value,energy:$('o-energy').checked,soft:$('o-soft').checked,pool:$('o-pool').checked});
  showFrom('o',q);
  $('o-m2p').textContent=eurx(q.perM2[0])+' – '+eurx(q.perM2[1]);$('o-time').textContent=q.months[0]+'–'+q.months[1]+' meses';
  q.notes=['Plazo estimado de obra: '+q.months[0]+'–'+q.months[1]+' meses desde la licencia.','No incluye el terreno, acometidas ni urbanización exterior.',
    'Vivienda de nueva construcción: IVA del 10 % incluido.'];
  quotes.obra=q;}
const CALC={aero:calcA,solar:calcS,ref:calcR,obra:calcO};
['a-fuel','a-spend','a-m2','a-ins','a-emit','a-zone','a-irpf'].forEach(id=>$(id).addEventListener('input',calcA));
['s-bill','s-zone','s-type','s-orient','s-shade','s-area','s-bat','s-aero','s-ev','s-irpf'].forEach(id=>$(id).addEventListener('input',calcS));
document.querySelectorAll('input[name="s-tilt"]').forEach(r=>r.addEventListener('input',calcS));
['r-type','r-m2','r-n','r-floor','r-dom','r-proj'].forEach(id=>$(id).addEventListener('input',calcR));
document.querySelectorAll('input[name="r-q"]').forEach(r=>r.addEventListener('input',calcR));
['o-m2','o-energy','o-soft','o-pool'].forEach(id=>$(id).addEventListener('input',calcO));
document.querySelectorAll('input[name="o-q"]').forEach(r=>r.addEventListener('input',calcO));
calcA();calcS();calcR();calcO();

// Presupuesto automático
const dlg=$('quote');let current=null;
function quoteRef(){const d=new Date(),p=n=>String(n).padStart(2,'0');return 'AV-'+String(d.getFullYear()).slice(2)+p(d.getMonth()+1)+p(d.getDate())+'-'+Math.random().toString(36).slice(2,6).toUpperCase()}
function quoteText(q){return 'Presupuesto orientativo '+q.ref+' · '+q.title+'\n'+q.lines.map(l=>'· '+l.label+': '+eurx(l.lo)+' – '+eurx(l.hi)).join('\n')+'\nDesde '+eurx(q.lo)+' (IVA incluido)'}
function openQuote(k){
  CALC[k]();const q=quotes[k];q.ref=quoteRef();current=q;
  const d=new Date();$('q-meta').textContent='Ref. '+q.ref+' · '+d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'});
  $('q-title').textContent=q.title;$('q-from').textContent=eurx(q.lo);
  $('q-lines').replaceChildren(...q.lines.map(l=>{const tr=document.createElement('tr');[l.label,eurx(l.lo),eurx(l.hi)].forEach(t=>{const td=document.createElement('td');td.textContent=t;tr.append(td)});return tr}));
  $('q-lo').textContent=eurx(q.lo);$('q-hi').textContent=eurx(q.hi);
  $('q-notes').replaceChildren(...q.notes.map(n=>{const li=document.createElement('li');li.textContent=n;return li}));
  $('q-wa').href='https://wa.me/34689042717?text='+encodeURIComponent('Hola, he calculado mi presupuesto en la web y quiero una visita.\n\n'+quoteText(q));
  $('q-company').textContent='Aerovantia · Euforico Equilibrio S.L. · NIF B45917622 · Olías del Rey (Toledo) · 689 042 717 · info@aerovantia.es';
  dlg.showModal();
}
document.querySelectorAll('[data-quote]').forEach(b=>b.addEventListener('click',()=>openQuote(b.dataset.quote)));
dlg.addEventListener('click',e=>{if(e.target===dlg||e.target.closest('[data-close]'))dlg.close()});
// El título del documento es el nombre que el navegador propone para el PDF.
let pageTitle=document.title;
$('q-pdf').addEventListener('click',()=>{pageTitle=document.title;document.title='Presupuesto Aerovantia '+current.ref;document.documentElement.classList.add('printing-quote');print()});
addEventListener('afterprint',()=>{document.documentElement.classList.remove('printing-quote');document.title=pageTitle});

// Pasar el cálculo al formulario
const INTEREST_OF={aero:['aero'],solar:['pv'],ref:['ref'],obra:['new']};
function shareToForm(k,q){
  calcShared={tipo:q.title,resumen:(q.ref?q.ref+' · ':'')+q.summary.replace(/ (\d+) €/,(m,n)=>' '+eurx(+n))};
  $('f-calc').textContent='Tu presupuesto: '+calcShared.tipo+' — '+calcShared.resumen+'. Lo usaremos para preparar tu visita.';$('f-calc').hidden=false;
  ['aero','pv','bat','ev','ref','int','new'].forEach(i=>{if($('i-'+i))$('i-'+i).checked=INTEREST_OF[k].includes(i)});
  if(k==='solar'){$('i-bat').checked=+$('s-bat').value>0;$('i-ev').checked=$('s-ev').checked}
  if(k==='ref')$('i-int').checked=$('r-type').value==='design'||$('r-proj').checked;
  if(k==='obra')$('i-aero').checked=$('o-energy').checked;
}
document.querySelectorAll('[data-from]').forEach(a=>a.addEventListener('click',()=>{const k=a.dataset.from;CALC[k]();shareToForm(k,quotes[k])}));
$('q-book').addEventListener('click',()=>{const k=current.kind;shareToForm(k,current);dlg.close()});

// Formulario: si hay webhook (PUBLIC_LEAD_WEBHOOK_URL) se envía por POST; si no, se abre el
// correo del cliente con la solicitud ya redactada para que no se pierda ningún contacto.
const WEBHOOK_URL=import.meta.env.PUBLIC_LEAD_WEBHOOK_URL||'';
const LEAD_EMAIL='info@aerovantia.es';
const INTEREST={aero:'Aerotermia',pv:'Placas solares',bat:'Batería',ev:'Cargador VE',ref:'Reforma',int:'Interiorismo',new:'Obra nueva'};
$('leadForm').addEventListener('submit',async e=>{e.preventDefault();
  const err=$('f-err'),ok=$('f-ok'),btn=e.submitter||$('leadForm').querySelector('button[type=submit]');err.hidden=true;ok.hidden=true;
  const name=$('f-name').value.trim(),phone=$('f-phone').value.replace(/\s/g,''),town=$('f-town').value.trim();
  if(!name||!town){err.textContent='Indica tu nombre y municipio.';err.hidden=false;return}
  if(!/^(\+34)?[6789]\d{8}$/.test(phone)){err.textContent='Revisa el teléfono: 9 cifras, empezando por 6, 7, 8 o 9.';err.hidden=false;return}
  if(!$('f-rgpd').checked){err.textContent='Necesitamos tu consentimiento para poder llamarte.';err.hidden=false;return}
  const interest=Object.keys(INTEREST).filter(k=>$('i-'+k)?.checked);
  const payload={name,phone,town,interest:interest.map(k=>INTEREST[k]),calc:calcShared,page:location.href,ts:new Date().toISOString()};
  const first=name.split(' ')[0];
  if(WEBHOOK_URL){
    if(btn.disabled)return;btn.disabled=true;
    try{const r=await fetch(WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!r.ok)throw new Error(r.status);
      ok.textContent='Gracias, '+first+'. Te llamamos en menos de 24 h laborables.';$('leadForm').reset()}
    catch(_){err.textContent='No se ha podido enviar. Llámanos o escríbenos por WhatsApp al 689 042 717, o a '+LEAD_EMAIL+'.';err.hidden=false;btn.disabled=false;return}
  }else{
    const lines=['Nombre: '+name,'Teléfono: '+phone,'Municipio: '+town,'Me interesa: '+(payload.interest.join(', ')||'—')];
    if(calcShared)lines.push('Mi cálculo: '+calcShared.tipo+' — '+calcShared.resumen);
    lines.push('','Acepto la política de privacidad para que Aerovantia me contacte.');
    const body=lines.join('\n');
    location.href='mailto:'+LEAD_EMAIL+'?subject='+encodeURIComponent('Estudio gratuito — '+name+' ('+town+')')+'&body='+encodeURIComponent(body);
    ok.textContent='Se ha abierto tu correo con la solicitud lista: solo tienes que enviarla. Si prefieres, llámanos al 689 042 717.';
  }
  ok.hidden=false;});
})();
