// ===== Catalog & Calculator =====
const catalog = [
  {id:'em_common_uncommon_1000', group:'English Modern', label:'Common / Uncommon (per 1000)', unit:'per_1000', rate:11.00},
  {id:'em_rare', group:'English Modern', label:'Rare', unit:'per_card', rate:0.02},
  {id:'em_all_holos', group:'English Modern', label:'All Holos', unit:'per_card', rate:0.03},
  {id:'em_v', group:'English Modern', label:'V', unit:'per_card', rate:0.35},
  {id:'em_vstar', group:'English Modern', label:'VSTAR', unit:'per_card', rate:0.50},
  {id:'em_vmax', group:'English Modern', label:'VMAX', unit:'per_card', rate:1.00},
  {id:'em_gx', group:'English Modern', label:'GX', unit:'per_card', rate:1.00},
  {id:'em_gx_promo_hidden', group:'English Modern', label:'GX Promo / Hidden Fates', unit:'per_card', rate:0.50},
  {id:'em_ex_fa_sv', group:'English Modern', label:'ex Full Art (SV)', unit:'per_card', rate:0.50},
  {id:'em_ex_sv', group:'English Modern', label:'ex (SV)', unit:'per_card', rate:0.25},
  {id:'em_illustration_rare', group:'English Modern', label:'Illustration Rare', unit:'per_card', rate:1.00},
  {id:'em_special_illustration_rare', group:'English Modern', label:'Special Illustration Rare', unit:'per_card', rate:4.00},
  {id:'em_ex_xy', group:'English Modern', label:'EX (XY era)', unit:'per_card', rate:1.00},
  {id:'em_v_fa_trainer_fa', group:'English Modern', label:'V Full Art / Trainer Full Art', unit:'per_card', rate:0.50},
  {id:'em_mega_ex', group:'English Modern', label:'Mega EX', unit:'per_card', rate:2.75},
  {id:'em_secret_rare', group:'English Modern', label:'Secret Rare (Gold / Rainbow)', unit:'per_card', rate:2.75},
  {id:'em_trainer_gallery', group:'English Modern', label:'Trainer / Galarian Gallery', unit:'per_card', rate:0.25},
  {id:'em_amazing_rare', group:'English Modern', label:'Amazing Rare', unit:'per_card', rate:0.35},
  {id:'em_radiant_rare', group:'English Modern', label:'Radiant Rare', unit:'per_card', rate:0.15},
  {id:'em_baby_shinies', group:'English Modern', label:'Baby Shinies', unit:'per_card', rate:0.75},
  {id:'jp_common_uncommon_1000', group:'Japanese', label:'Common / Uncommon (per 1000)', unit:'per_1000', rate:8.00},
  {id:'jp_all_holos', group:'Japanese', label:'All Holos', unit:'per_card', rate:0.01},
  {id:'jp_v_vstar_ex', group:'Japanese', label:'V / VSTAR / ex', unit:'per_card', rate:0.05},
  {id:'jp_gx_vmax', group:'Japanese', label:'GX / VMAX', unit:'per_card', rate:0.025},
  {id:'jp_wotc_cuc', group:'Japanese', label:'WotC C/UC', unit:'per_card', rate:0.08},
  {id:'jp_wotc_rare', group:'Japanese', label:'WotC Rare', unit:'per_card', rate:0.50},
  {id:'jp_wotc_holo_rare', group:'Japanese', label:'WotC Holo Rare', unit:'per_card', rate:4.00},
  {id:'wotc_cuc_unl', group:'WotC (English)', label:'C/UC Unlimited', unit:'per_card', rate:0.15},
  {id:'wotc_trainers_unl', group:'WotC (English)', label:'Trainers Unlimited', unit:'per_card', rate:0.08},
  {id:'wotc_rare_unl', group:'WotC (English)', label:'Rare Unlimited', unit:'per_card', rate:1.75},
  {id:'wotc_rare_trainers_unl', group:'WotC (English)', label:'Rare Trainers Unlimited', unit:'per_card', rate:0.75},
  {id:'wotc_holo_rare_unl', group:'WotC (English)', label:'Holo Rare Unlimited', unit:'per_card', rate:5.00},
  {id:'wotc_common_1st', group:'WotC (English)', label:'Common 1st Ed', unit:'per_card', rate:0.75},
  {id:'wotc_uncommon_1st', group:'WotC (English)', label:'Uncommon 1st Ed', unit:'per_card', rate:1.00},
  {id:'wotc_trainer_1st', group:'WotC (English)', label:'Trainer 1st Ed', unit:'per_card', rate:0.25},
  {id:'wotc_rare_1st', group:'WotC (English)', label:'Rare 1st Ed', unit:'per_card', rate:5.00},
  {id:'wotc_rare_trainers_1st', group:'WotC (English)', label:'Rare Trainers 1st Ed', unit:'per_card', rate:1.50}
];
const bonusTiers = [
  { threshold: 500, bonus: 0.05, label:"+5% (500+ cards)" },
  { threshold: 1000, bonus: 0.10, label:"+10% (1000+ cards)" },
  { threshold: 2500, bonus: 0.15, label:"+15% (2500+ cards)" }
];
const state = { lines:[] };
function money(n){ return n.toLocaleString(undefined,{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}); }

function addLine(defaultId){
  const tr = document.createElement('tr');
  const select = document.createElement('select'); select.style.width='100%';
  const groups = [...new Set(catalog.map(c=>c.group))];
  groups.forEach(gr=>{
    const og=document.createElement('optgroup'); og.label=gr;
    catalog.filter(c=>c.group===gr).forEach(c=>{
      const o=document.createElement('option'); o.value=c.id; o.textContent=c.label; og.appendChild(o);
    });
    select.appendChild(og);
  });
  if(defaultId) select.value = defaultId;
  const unitCell=document.createElement('td');
  const rateCell=document.createElement('td'); rateCell.className='right';
  const qtyInput=document.createElement('input'); qtyInput.type='number'; qtyInput.min='0'; qtyInput.step='1'; qtyInput.placeholder='0';
  const qtyCell=document.createElement('td'); qtyCell.className='right'; qtyCell.appendChild(qtyInput);
  const subCell=document.createElement('td'); subCell.className='right'; subCell.textContent='$0.00';
  const rmBtn=document.createElement('button'); rmBtn.className='btn blue'; rmBtn.type='button'; rmBtn.textContent='Remove';
  const rmCell=document.createElement('td'); rmCell.appendChild(rmBtn);
  const catCell=document.createElement('td'); catCell.appendChild(select);
  tr.appendChild(catCell); tr.appendChild(unitCell); tr.appendChild(rateCell); tr.appendChild(qtyCell); tr.appendChild(subCell); tr.appendChild(rmCell);
  document.getElementById('lineItems').appendChild(tr);

  function refresh(){ const item=catalog.find(c=>c.id===select.value); unitCell.textContent=item.unit==='per_1000'?'per 1000':'per card'; rateCell.textContent=money(item.rate); calc(); }
  select.addEventListener('change',()=>{refresh(); saveLines();});
  qtyInput.addEventListener('input',()=>{calc(); saveLines();});
  rmBtn.addEventListener('click',()=>{ tr.remove(); calc(); saveLines();});
  refresh();
}
function saveLines(){
  const rows=[...document.querySelectorAll('#lineItems tr')];
  state.lines = rows.map(tr=>{
    const id=tr.querySelector('select').value;
    const qty=parseInt(tr.querySelector('input[type=number]').value||'0',10);
    return {id, qty};
  });
}
function activeBonus(cardCount){ let b=0; for(const t of bonusTiers){ if(cardCount>=t.threshold) b=Math.max(b,t.bonus); } return b; }
function calc(){
  let subtotal=0, cardCount=0;
  const rows=[...document.querySelectorAll('#lineItems tr')];
  rows.forEach(tr=>{
    const id=tr.querySelector('select').value;
    const qty=parseFloat(tr.querySelector('input[type=number]').value||'0');
    const item=catalog.find(c=>c.id===id);
    let sub=0;
    if(item.unit==='per_card'){ sub = qty*item.rate; cardCount+=qty; }
    else { sub = (qty/1000)*item.rate; cardCount+=qty; }
    tr.querySelector('td.right:nth-child(5)').textContent = money(sub);
    subtotal += sub;
  });
  const lang = parseFloat(document.getElementById('language').value || '1');
  const bonus = activeBonus(cardCount);
  const adjusted = subtotal * (1+bonus) * lang;
  document.getElementById('total').textContent = money(adjusted);
  document.getElementById('bonusNote').textContent = bonus>0 ? `Bonus applied: ${(bonus*100).toFixed(0)}% for ${cardCount.toLocaleString()} cards` : '';
  // Hidden fields for Formspree
  document.getElementById('estimate_total').value = adjusted.toFixed(2);
  document.getElementById('language_multiplier').value = lang;
  document.getElementById('no_energy').value = document.getElementById('noEnergy').checked ? 'yes':'no';
  const summary = state.lines.map(l=>{ const it=catalog.find(c=>c.id===l.id)||{}; return {group:it.group,label:it.label,unit:it.unit,rate:it.rate,qty:l.qty}; });
  document.getElementById('estimate_lines').value = JSON.stringify(summary);
  document.getElementById('estimate_id').value = 'TPH-'+Math.random().toString(36).slice(2,8).toUpperCase();
}
function renderCatalog(){
  const wrap=document.getElementById('catalog'); wrap.innerHTML='';
  const groups=[...new Set(catalog.map(c=>c.group))];
  groups.forEach(gr=>{
    const det=document.createElement('details');
    const sum=document.createElement('summary'); sum.textContent=gr; det.appendChild(sum);
    const tbl=document.createElement('table');
    const thead=document.createElement('thead'); thead.innerHTML='<tr><th>Label</th><th>Unit</th><th class="right">Rate</th></tr>'; tbl.appendChild(thead);
    const tb=document.createElement('tbody');
    catalog.filter(c=>c.group===gr).forEach(c=>{
      const tr=document.createElement('tr');
      tr.innerHTML = `<td>${c.label}</td><td>${c.unit==='per_1000'?'per 1000':'per card'}</td><td class="right">${money(c.rate)}</td>`;
      tb.appendChild(tr);
    });
    tbl.appendChild(tb); det.appendChild(tbl); wrap.appendChild(det);
  });
}

// ===== eBay RSS feed (best-effort) =====
async function loadEbayFeed(){
  const grid = document.getElementById('ebay-grid');
  if(!grid) return;
  const RSS = 'https://www.ebay.com/sch/thepokehaus28/m.html?_rss=1';
  try{
    const res = await fetch(RSS);
    const txt = await res.text();
    const xml = new window.DOMParser().parseFromString(txt, 'text/xml');
    const items = [...xml.querySelectorAll('item')].slice(0, 12);
    if(items.length === 0) throw new Error('No items in RSS');
    items.forEach(it=>{
      const title = it.querySelector('title')?.textContent || 'eBay listing';
      const link = it.querySelector('link')?.textContent || '#';
      const desc = it.querySelector('description')?.textContent || '';
      // Try to extract price and image from description (best effort)
      const priceMatch = desc.match(/\$[0-9,]+(\.[0-9]{2})?/);
      const imgMatch = desc.match(/https?:\/\/[^\\s\"]+\\.(jpg|jpeg|png|gif)/i);
      const div = document.createElement('a');
      div.href = link; div.target = '_blank'; div.rel = 'noopener'; div.className='ebay-item';
      div.innerHTML = `
        <img class="thumb" src="${imgMatch ? imgMatch[0] : 'assets/logo.png'}" alt="Listing image">
        <div class="pad">
          <h4>${title}</h4>
          <div class="price">${priceMatch ? priceMatch[0] : ''}</div>
        </div>`;
      grid.appendChild(div);
    });
  }catch(err){
    // graceful fallback
    grid.innerHTML = `<div class="notice">Could not load eBay items here. <a href="https://www.ebay.com/str/thepokehaus28" target="_blank" rel="noopener">Tap to view our store →</a></div>`;
  }
}

// Boot
document.addEventListener('DOMContentLoaded', ()=>{
  addLine(); calc(); renderCatalog(); loadEbayFeed();
  document.getElementById('addLine').addEventListener('click',()=>addLine());
  document.getElementById('language').addEventListener('change',calc);
  document.getElementById('noEnergy').addEventListener('change',calc);
  document.getElementById('resetBtn').addEventListener('click',()=>{ document.getElementById('lineItems').innerHTML=''; state.lines=[]; addLine(); calc(); });
  document.getElementById('year').textContent = new Date().getFullYear();

  // Lightweight Formspree UX
  document.getElementById('sellForm').addEventListener('submit', function(){ calc(); setTimeout(()=>{ const msg=document.getElementById('formMsg'); if(msg) msg.style.display='block'; }, 400); });
});
