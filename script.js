// ===== Bulk Buy Calculator + Buy Rates Renderer =====

// Full catalog (same structure as before; add/edit rates anytime)
const catalog = [
  // ——— English Modern ———
  {id:'em_common_uncommon_1000', group:'English Modern', label:'Common / Uncommon (per 1000)', unit:'per_1000', rate:11.00},
  {id:'em_rare',                        group:'English Modern', label:'Rare',                                 unit:'per_card', rate:0.02},
  {id:'em_all_holos',                   group:'English Modern', label:'All Holos',                            unit:'per_card', rate:0.03},
  {id:'em_v',                           group:'English Modern', label:'V',                                    unit:'per_card', rate:0.35},
  {id:'em_vstar',                       group:'English Modern', label:'VSTAR',                                unit:'per_card', rate:0.50},
  {id:'em_vmax',                        group:'English Modern', label:'VMAX',                                 unit:'per_card', rate:1.00},
  {id:'em_gx',                          group:'English Modern', label:'GX',                                   unit:'per_card', rate:1.00},
  {id:'em_gx_promo_hidden',             group:'English Modern', label:'GX Promo / Hidden Fates',              unit:'per_card', rate:0.50},
  {id:'em_ex_fa_sv',                    group:'English Modern', label:'ex Full Art (Scarlet & Violet)',       unit:'per_card', rate:0.50},
  {id:'em_ex_sv',                       group:'English Modern', label:'ex (Scarlet & Violet)',                unit:'per_card', rate:0.25},
  {id:'em_illustration_rare',           group:'English Modern', label:'Illustration Rare',                    unit:'per_card', rate:1.00},
  {id:'em_special_illustration_rare',   group:'English Modern', label:'Special Illustration Rare',            unit:'per_card', rate:4.00},
  {id:'em_ex_xy',                       group:'English Modern', label:'EX (XY era)',                          unit:'per_card', rate:1.00},
  {id:'em_v_fa_trainer_fa',             group:'English Modern', label:'V Full Art / Trainer Full Art',        unit:'per_card', rate:0.50},
  {id:'em_mega_ex',                     group:'English Modern', label:'Mega EX',                              unit:'per_card', rate:2.75},
  {id:'em_secret_rare',                 group:'English Modern', label:'Secret Rare (Gold / Rainbow)',         unit:'per_card', rate:2.75},
  {id:'em_trainer_gallery',             group:'English Modern', label:'Trainer / Galarian Gallery',           unit:'per_card', rate:0.25},
  {id:'em_amazing_rare',                group:'English Modern', label:'Amazing Rare',                         unit:'per_card', rate:0.35},
  {id:'em_radiant_rare',                group:'English Modern', label:'Radiant Rare',                         unit:'per_card', rate:0.15},
  {id:'em_baby_shinies',                group:'English Modern', label:'Baby Shinies',                         unit:'per_card', rate:0.75},

  // ——— Japanese ———
  {id:'jp_common_uncommon_1000',        group:'Japanese',       label:'Common / Uncommon (per 1000)',         unit:'per_1000', rate:8.00},
  {id:'jp_all_holos',                   group:'Japanese',       label:'All Holos',                            unit:'per_card', rate:0.01},
  {id:'jp_v_vstar_ex',                  group:'Japanese',       label:'V / VSTAR / ex',                       unit:'per_card', rate:0.05},
  {id:'jp_gx_vmax',                     group:'Japanese',       label:'GX / VMAX',                            unit:'per_card', rate:0.025},
  {id:'jp_wotc_cuc',                    group:'Japanese',       label:'WotC C/UC',                            unit:'per_card', rate:0.08},
  {id:'jp_wotc_rare',                   group:'Japanese',       label:'WotC Rare',                            unit:'per_card', rate:0.50},
  {id:'jp_wotc_holo_rare',              group:'Japanese',       label:'WotC Holo Rare',                       unit:'per_card', rate:4.00},

  // ——— WotC (English) ———
  {id:'wotc_cuc_unl',                   group:'WotC (English)', label:'Common / Uncommon — Unlimited',         unit:'per_card', rate:0.15},
  {id:'wotc_trainers_unl',              group:'WotC (English)', label:'Trainers — Unlimited',                  unit:'per_card', rate:0.08},
  {id:'wotc_rare_unl',                  group:'WotC (English)', label:'Rare — Unlimited',                      unit:'per_card', rate:1.75},
  {id:'wotc_rare_trainers_unl',         group:'WotC (English)', label:'Rare Trainers — Unlimited',             unit:'per_card', rate:0.75},
  {id:'wotc_holo_rare_unl',             group:'WotC (English)', label:'Holo Rare — Unlimited',                 unit:'per_card', rate:5.00},
  {id:'wotc_common_1st',                group:'WotC (English)', label:'Common — 1st Edition',                  unit:'per_card', rate:0.75},
  {id:'wotc_uncommon_1st',              group:'WotC (English)', label:'Uncommon — 1st Edition',                unit:'per_card', rate:1.00},
  {id:'wotc_trainer_1st',               group:'WotC (English)', label:'Trainer — 1st Edition',                 unit:'per_card', rate:0.25},
  {id:'wotc_rare_1st',                  group:'WotC (English)', label:'Rare — 1st Edition',                    unit:'per_card', rate:5.00},
  {id:'wotc_rare_trainers_1st',         group:'WotC (English)', label:'Rare Trainers — 1st Edition',           unit:'per_card', rate:1.50},
];

const bonusTiers = [
  { threshold: 500,  bonus: 0.05 },
  { threshold: 1000, bonus: 0.10 },
  { threshold: 2500, bonus: 0.15 },
];

const state = { lines: [] };

function money(n){
  return n.toLocaleString(undefined,{ style:'currency', currency:'USD', minimumFractionDigits:2, maximumFractionDigits:2 });
}

// ---- Buy Rates (right-hand card on sell.html) ----
function groupedCatalog(){
  const g = {};
  catalog.forEach(c => { if(!g[c.group]) g[c.group] = []; g[c.group].push(c); });
  return g;
}
function renderCatalog(){
  const wrap = document.getElementById('catalog');
  if(!wrap) return;
  wrap.innerHTML = '';
  const groups = groupedCatalog();
  for(const gr in groups){
    const h = document.createElement('div');
    h.className = 'muted tiny';
    h.style.margin = '8px 0 6px';
    h.textContent = gr;
    wrap.appendChild(h);
    groups[gr].forEach(c => {
      const row = document.createElement('div');
      row.className = 'row';
      row.style.justifyContent = 'space-between';
      row.innerHTML = `
        <div>${c.label} <span class="tiny" style="opacity:.8;">(${c.unit==='per_1000'?'per 1000':'per card'})</span></div>
        <div style="font-weight:700">${money(c.rate)}</div>`;
      wrap.appendChild(row);
    });
  }
}

// ---- Calculator table (left card) ----
function addLine(){
  const tbody = document.getElementById('lineItems');
  if(!tbody) return;

  const tr = document.createElement('tr');

  // Category select
  const sel = document.createElement('select'); sel.style.width = '100%';
  const groups = [...new Set(catalog.map(c=>c.group))];
  groups.forEach(gr=>{
    const og = document.createElement('optgroup'); og.label = gr;
    catalog.filter(c=>c.group===gr).forEach(c=>{
      const o = document.createElement('option'); o.value = c.id; o.textContent = c.label; og.appendChild(o);
    });
    sel.appendChild(og);
  });

  const unitCell = document.createElement('td');
  const rateCell = document.createElement('td'); rateCell.className='right';
  const qtyInput = document.createElement('input'); qtyInput.type='number'; qtyInput.min='0'; qtyInput.step='1'; qtyInput.placeholder='0';
  const qtyCell = document.createElement('td'); qtyCell.className='right'; qtyCell.appendChild(qtyInput);
  const subCell = document.createElement('td'); subCell.className='right'; subCell.textContent='$0.00';
  const rmBtn = document.createElement('button'); rmBtn.type='button'; rmBtn.className='btn red'; rmBtn.textContent='Remove';
  const rmCell = document.createElement('td'); rmCell.appendChild(rmBtn);
  const catCell = document.createElement('td'); catCell.appendChild(sel);

  tr.appendChild(catCell);
  tr.appendChild(unitCell);
  tr.appendChild(rateCell);
  tr.appendChild(qtyCell);
  tr.appendChild(subCell);
  tr.appendChild(rmCell);
  tbody.appendChild(tr);

  function refreshRow(){
    const item = catalog.find(c=>c.id === sel.value);
    if(!item) return;
    unitCell.textContent = item.unit === 'per_1000' ? 'per 1000' : 'per card';
    rateCell.textContent = money(item.rate);
    calc();
  }

  sel.addEventListener('change', ()=>{ refreshRow(); saveLines(); });
  qtyInput.addEventListener('input', ()=>{ calc(); saveLines(); });
  rmBtn.addEventListener('click', ()=>{ tr.remove(); calc(); saveLines(); });

  // initialize this row
  refreshRow();
}

function saveLines(){
  const rows = [...document.querySelectorAll('#lineItems tr')];
  state.lines = rows.map(tr => {
    const id = tr.querySelector('select')?.value;
    const qty = parseInt(tr.querySelector('input[type=number]')?.value || '0', 10);
    return { id, qty };
  });
}

function activeBonus(n){
  let b = 0;
  for(const t of bonusTiers){ if(n >= t.threshold) b = Math.max(b, t.bonus); }
  return b;
}

function calc(){
  let subtotal = 0, count = 0;
  const rows = [...document.querySelectorAll('#lineItems tr')];
  rows.forEach(tr=>{
    const id = tr.querySelector('select')?.value;
    const qty = parseFloat(tr.querySelector('input[type=number]')?.value || '0');
    const it = catalog.find(c=>c.id===id);
    if(!it) return;
    let sub = 0;
    if(it.unit === 'per_card'){ sub = qty * it.rate; count += qty; }
    else { sub = (qty/1000) * it.rate; count += qty; }
    tr.querySelector('td.right:nth-child(5)').textContent = money(sub);
    subtotal += sub;
  });

  const lang = parseFloat(document.getElementById('language')?.value || '1');
  const bonus = activeBonus(count);
  const adjusted = subtotal * (1+bonus) * lang;

  const totalEl = document.getElementById('total');
  if(totalEl) totalEl.textContent = money(adjusted);

  const note = document.getElementById('bonusNote');
  if(note) note.textContent = bonus>0 ? `Bonus: ${(bonus*100).toFixed(0)}% for ${count.toLocaleString()} cards` : '';

  // hidden fields for Formspree
  const et = document.getElementById('estimate_total'); if(et) et.value = adjusted.toFixed(2);
  const lm = document.getElementById('language_multiplier'); if(lm) lm.value = lang;
  const ne = document.getElementById('no_energy'); if(ne) ne.value = document.getElementById('noEnergy')?.checked ? 'yes':'no';
  const el = document.getElementById('estimate_lines');
  if(el){
    const lines = state.lines.map(l=>{
      const it = catalog.find(c=>c.id===l.id) || {};
      return { group: it.group, label: it.label, unit: it.unit, rate: it.rate, qty: l.qty };
    });
    el.value = JSON.stringify(lines);
  }
  const ei = document.getElementById('estimate_id'); if(ei) ei.value = 'TPH-'+Math.random().toString(36).slice(2,8).toUpperCase();
}

document.addEventListener('DOMContentLoaded', ()=>{
  // Render rates list
  renderCatalog();

  // Wire calculator
  const tbody = document.getElementById('lineItems');
  if(tbody){
    addLine();
    calc();
    const addBtn = document.getElementById('addLine'); if(addBtn) addBtn.addEventListener('click', addLine);
    const langSel = document.getElementById('language'); if(langSel) langSel.addEventListener('change', calc);
    const neChk = document.getElementById('noEnergy'); if(neChk) neChk.addEventListener('change', calc);
    const reset = document.getElementById('resetBtn'); if(reset) reset.addEventListener('click', ()=>{
      tbody.innerHTML=''; state.lines=[]; addLine(); calc();
    });
  }
});
// ===== Clean Formspree summary + subject on submit =====
(function(){
  const form = document.getElementById('sellForm');
  if(!form) return;

  form.addEventListener('submit', (e)=>{
    // Gather calculator totals
    const total = parseFloat(document.getElementById('estimate_total')?.value || '0');
    const linesRaw = document.getElementById('estimate_lines')?.value || '[]';
    let lines = [];
    try { lines = JSON.parse(linesRaw); } catch(_){}

    // Derive total card count
    const cardCount = lines.reduce((sum, l)=> sum + (parseInt(l.qty||0,10)), 0);

    // Gather contact & shipping
    const name  = (form.querySelector('[name="name"]')?.value || '').trim();
    const email = (form.querySelector('[name="email"]')?.value || '').trim();
    const phone = (form.querySelector('[name="phone"]')?.value || '').trim();
    const ship  = (form.querySelector('[name="ship_from"]')?.value || '').trim();
    const carrier = (form.querySelector('[name="carrier"]')?.value || '').trim();
    const paypal = (form.querySelector('[name="paypal_email"]')?.value || '').trim();
    const links  = (form.querySelector('[name="photo_links"]')?.value || '').trim();
    const notes  = (form.querySelector('[name="notes"]')?.value || '').trim();

    // Language & energy flags (from calculator controls)
    const langMult = document.getElementById('language_multiplier')?.value || '1';
    const noEnergy = document.getElementById('no_energy')?.value || 'no';
    const estimateId = document.getElementById('estimate_id')?.value || 'TPH-' + Math.random().toString(36).slice(2,8).toUpperCase();

    // Build a clean, readable summary
    const linesList = lines.map(l=>{
      const unit = l.unit === 'per_1000' ? 'per 1000' : 'per card';
      return `• ${l.label} — ${l.qty} (${unit} @ $${Number(l.rate).toFixed(2)})`;
    }).join('\n');

    const summary = [
      `Estimate ID: ${estimateId}`,
      `Total (est): $${total.toFixed(2)} • Cards: ${cardCount}`,
      ``,
      `Contact`,
      `- Name: ${name}`,
      `- Email: ${email}`,
      phone ? `- Phone: ${phone}` : null,
      ``,
      `Shipping`,
      `- Ship-From: ${ship}`,
      `- Carrier: ${carrier}`,
      ``,
      `Payout`,
      `- Method: PayPal Goods & Services`,
      `- PayPal Email: ${paypal}`,
      ``,
      `Lot Details`,
      links ? `- Photo Links: ${links}` : null,
      notes ? `- Notes: ${notes}` : null,
      `- Language Multiplier: ${langMult}`,
      `- No Energy Confirmed: ${noEnergy}`,
      ``,
      `Buy Rate Lines`,
      linesList || '(no lines entered)'
    ].filter(Boolean).join('\n');

    // Set hidden fields for Formspree email
    const summaryField = document.getElementById('summary_field');
    if(summaryField) summaryField.value = summary;

    const subject = document.getElementById('subject_field');
    if(subject) subject.value = `TPH Bulk — $${total.toFixed(2)} est • ${cardCount} cards • ${estimateId}`;

    // Ensure PayPal-only
    const payoutField = form.querySelector('[name="payout"]');
    if(payoutField) payoutField.value = 'paypal_goods_and_services';

    // Ensure we have both name + PayPal
    if(!name || !paypal){
      e.preventDefault();
      alert('Please enter your name and PayPal email.');
      return false;
    }
  });
})();
