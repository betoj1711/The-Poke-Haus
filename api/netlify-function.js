// Netlify Function: /api/tcg
// Set environment variables in Netlify UI: TCGPLAYER_PUBLIC, TCGPLAYER_PRIVATE
export async function handler(event) {
  const params = new URLSearchParams(event.rawQuery || '');
  const name = params.get('name') || '';
  const set = params.get('set') || '';
  if(!name) return { statusCode: 400, body: 'Missing name' };

  const tokenRes = await fetch('https://api.tcgplayer.com/token', {
    method: 'POST',
    headers: {'Content-Type':'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.TCGPLAYER_PUBLIC,
      client_secret: process.env.TCGPLAYER_PRIVATE
    })
  });
  if(!tokenRes.ok) return { statusCode: 500, body: 'Auth error' };
  const tokenJson = await tokenRes.json();
  const bearer = tokenJson.access_token;

  const searchBody = {sort:'Relevance', limit: 1, offset: 0, filters: [{ name: 'ProductName', values: [name]}]};
  const prodRes = await fetch('https://api.tcgplayer.com/catalog/products/search', {
    method:'POST',
    headers: { 'Authorization': `bearer ${bearer}`, 'Content-Type':'application/json' },
    body: JSON.stringify(searchBody)
  });
  if(!prodRes.ok) return { statusCode: 500, body: 'Search error' };
  const prod = await prodRes.json();
  const ids = prod?.results || [];
  if(ids.length===0) return { statusCode: 200, body: JSON.stringify({name, set, market: 0}) };

  const priceRes = await fetch(`https://api.tcgplayer.com/pricing/product/${ids[0]}`, {
    headers: { 'Authorization': `bearer ${bearer}` }
  });
  if(!priceRes.ok) return { statusCode: 500, body: 'Price error' };
  const priceJson = await priceRes.json();
  let market = 0;
  for(const p of priceJson.results||[]){
    if(p.marketPrice && p.marketPrice > market) market = p.marketPrice;
  }
  const meta = { salesRank: 1500, volume30d: 20 }; // placeholder

  return { statusCode: 200, headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name, set, market, ...meta }) };
}
