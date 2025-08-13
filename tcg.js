// High-Value calculator with optional TCGplayer fetch via /api/tcg (serverless proxy)
const hvState = { rows: [] };

function money(n){ return n.toLocaleString(undefined,{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}); }
function tierFromSales(meta){
  // meta example: {salesRank: number, volume30d: number}
  if(!meta) return {label:'Medium', pct:0.70};
  if((meta.salesRank && meta.salesRank <= 500) || (meta.volume30d && meta.volume30d >= 50)) return {label:'High', pct:0.80};
  if((meta.salesRank && meta.salesRank <= 2000) || (meta.volume30d && meta.volume30d >= 10)) return {label:'Medium', pct:0.70};
  return {label:'Low', pct:0.60};
}
function conditionMultiplier(cond){
  // Lightly Played slight deduction, Moderately more
  if(cond==='LP') return 0.92;
  if(cond==='MP') return 0.85;
  return 1.0; // NM
}
function pushRow(row){
  hvState.rows.push(row);
  renderHV();
}
function addManual(){
  const name = document.getElementById('cardName').value.trim();
  const set = document.getElementById('cardSet').value.trim();
  const cond = document.getElementById('condition').value;
  const qty = Math.max(1, parseInt(document.getElementById('qty').value||'1',10));
  const market = parseFloat(prompt('Enter Market Price (USD) for this card:','5.00')||'0');
  if(!name || market < 5) { alert('Card name required and market must be $5+'); return; }
  const tier = tierFromSales(null);
  const payout = market * tier.pct * conditionMultiplier(cond);
  pushRow({name,set,cond,qty,market,tier:tier.label,pct:tier.pct,payout});
}
async function fetchMarket(){
  const name = document.getElementById('cardName').value.trim();
  const set = document.getElementById('cardSet').value.trim();
  const cond = document.getElementById('condition').value;
  const qty = Math.max(1, parseInt(document.getElementById('qty').value||'1',10));
  if(!name){ alert('Enter a card name'); return; }
  try{
    const url = `/api/tcg?name=${encodeURIComponent(name)}&set=${encodeURIComponent(set)}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('Proxy returned an error');
    const data = await res.json();
    // Expected data: {name,set,market, salesRank, volume30d}
    const market = parseFloat(data.market||0);
    if(market < 5){ alert('Under $5 — ignored'); return; }
    const tierObj = tierFromSales({salesRank:data.salesRank, volume30d:data.volume30d});
    const payout = market * tierObj.pct * conditionMultiplier(cond);
    pushRow({name:data.name||name,set:data.set||set,cond,qty,market,tier:tierObj.label,pct:tierObj.pct,payout});
  }catch(e){
    console.warn(e);
    alert('Could not fetch from TCGplayer proxy. Add manual or set up the API proxy (see README).');
  }
}
function renderHV(){
  const tbody = document.getElementById('hvBody'); tbody.innerHTML='';
  let total = 0;
  hvState.rows.forEach((r,i)=>{
    const sub = r.payout * r.qty;
    total += sub;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.name}</td>
      <td>${r.set||''}</td>
      <td>${r.cond}</td>
      <td class="right">${money(r.market)}</td>
      <td>${r.tier}</td>
      <td class="right">${money(r.payout)}</td>
      <td class="right">${r.qty}</td>
      <td class="right">${money(sub)}</td>
      <td><button class="btn red tiny" data-i="${i}">Remove</button></td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('hvTotal').textContent = money(total);
  // sync hidden fields
  const lines = hvState.rows.map(r=>({name:r.name,set:r.set,cond:r.cond,qty:r.qty,market:r.market,tier:r.tier,percent:r.pct,payoutPer:r.payout}));
  const hf = document.getElementById('hv_lines'); if(hf) hf.value = JSON.stringify(lines);
  const ht = document.getElementById('hv_total'); if(ht) ht.value = total.toFixed(2);
  // remove bindings
  [...tbody.querySelectorAll('button.tiny')].forEach(btn=>{
    btn.addEventListener('click',()=>{
      const idx = parseInt(btn.getAttribute('data-i'),10);
      hvState.rows.splice(idx,1); renderHV();
    });
  });
}
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('fetchBtn').addEventListener('click', fetchMarket);
  document.getElementById('addManualBtn').addEventListener('click', addManual);
  document.getElementById('hvReset').addEventListener('click', ()=>{ hvState.rows=[]; renderHV(); });
});