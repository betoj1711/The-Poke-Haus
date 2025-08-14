// Bulk calculator (abbrev version)
const catalog=[
  {id:'em_common_uncommon_1000',group:'English Modern',label:'Common / Uncommon (per 1000)',unit:'per_1000',rate:11.00},
  {id:'em_v',group:'English Modern',label:'V',unit:'per_card',rate:0.35},
  {id:'em_vstar',group:'English Modern',label:'VSTAR',unit:'per_card',rate:0.50},
  {id:'em_secret_rare',group:'English Modern',label:'Secret Rare (Gold / Rainbow)',unit:'per_card',rate:2.75},
  {id:'em_radiant_rare',group:'English Modern',label:'Radiant Rare',unit:'per_card',rate:0.15},
  {id:'wotc_holo_rare_unl',group:'WotC (English)',label:'Holo Rare Unlimited',unit:'per_card',rate:5.00}
];
const bonusTiers=[{threshold:500,bonus:.05},{threshold:1000,bonus:.10},{threshold:2500,bonus:.15}];
const state={lines:[]};
function money(n){return n.toLocaleString(undefined,{style:'currency',currency:'USD',minimumFractionDigits:2})}
function addLine(){
  const tr=document.createElement('tr'),select=document.createElement('select');select.style.width='100%';
  const groups=[...new Set(catalog.map(c=>c.group))];
  groups.forEach(gr=>{const og=document.createElement('optgroup');og.label=gr;catalog.filter(c=>c.group===gr).forEach(c=>{const o=document.createElement('option');o.value=c.id;o.textContent=c.label;og.appendChild(o)});select.appendChild(og)});
  const unitCell=document.createElement('td'),rateCell=document.createElement('td');rateCell.className='right';
  const qtyInput=document.createElement('input');qtyInput.type='number';qtyInput.min='0';qtyInput.step='1';qtyInput.placeholder='0';
  const qtyCell=document.createElement('td');qtyCell.className='right';qtyCell.appendChild(qtyInput);
  const subCell=document.createElement('td');subCell.className='right';subCell.textContent='$0.00';
  const rmBtn=document.createElement('button');rmBtn.className='btn red';rmBtn.type='button';rmBtn.textContent='Remove';
  const rmCell=document.createElement('td');rmCell.appendChild(rmBtn);
  const catCell=document.createElement('td');catCell.appendChild(select);
  tr.appendChild(catCell);tr.appendChild(unitCell);tr.appendChild(rateCell);tr.appendChild(qtyCell);tr.appendChild(subCell);tr.appendChild(rmCell);
  document.getElementById('lineItems').appendChild(tr);
  function refresh(){const item=catalog.find(c=>c.id===select.value);unitCell.textContent=item.unit==='per_1000'?'per 1000':'per card';rateCell.textContent=money(item.rate);calc()}
  select.addEventListener('change',()=>{refresh();saveLines()});qtyInput.addEventListener('input',()=>{calc();saveLines()});rmBtn.addEventListener('click',()=>{tr.remove();calc();saveLines()});refresh();
}
function saveLines(){
  const rows=[...document.querySelectorAll('#lineItems tr')];
  state.lines=rows.map(tr=>({id:tr.querySelector('select').value,qty:parseInt(tr.querySelector('input[type=number]').value||'0',10)}));
}
function activeBonus(n){let b=0;for(const t of bonusTiers){if(n>=t.threshold)b=Math.max(b,t.bonus)}return b}
function calc(){
  let subtotal=0,count=0;
  [...document.querySelectorAll('#lineItems tr')].forEach(tr=>{
    const id=tr.querySelector('select').value,qty=parseFloat(tr.querySelector('input[type=number]').value||'0'),it=catalog.find(c=>c.id===id);
    let sub=0; if(it.unit==='per_card'){sub=qty*it.rate;count+=qty}else{sub=(qty/1000)*it.rate;count+=qty}
    tr.querySelector('td.right:nth-child(5)').textContent=money(sub);subtotal+=sub;
  });
  const lang=parseFloat(document.getElementById('language').value||'1');const bonus=activeBonus(count);const adjusted=subtotal*(1+bonus)*lang;
  document.getElementById('total').textContent=money(adjusted);
  document.getElementById('bonusNote').textContent=bonus>0?`Bonus: ${(bonus*100).toFixed(0)}% for ${count.toLocaleString()} cards`:'';
  const et=document.getElementById('estimate_total');if(et)et.value=adjusted.toFixed(2);
  const lm=document.getElementById('language_multiplier');if(lm)lm.value=lang;
  const ne=document.getElementById('no_energy');if(ne)ne.value=document.getElementById('noEnergy').checked?'yes':'no';
  const el=document.getElementById('estimate_lines');if(el){const summary=state.lines.map(l=>{const it=catalog.find(c=>c.id===l.id)||{};return{group:it.group,label:it.label,unit:it.unit,rate:it.rate,qty:l.qty}});el.value=JSON.stringify(summary)}
  const ei=document.getElementById('estimate_id');if(ei)ei.value='TPH-'+Math.random().toString(36).slice(2,8).toUpperCase();
}
document.addEventListener('DOMContentLoaded',()=>{const tbody=document.getElementById('lineItems');if(tbody){addLine();calc();document.getElementById('addLine').addEventListener('click',()=>addLine());document.getElementById('language').addEventListener('change',calc);document.getElementById('noEnergy').addEventListener('change',calc);document.getElementById('resetBtn').addEventListener('click',()=>{tbody.innerHTML='';state.lines=[];addLine();calc()})}});
