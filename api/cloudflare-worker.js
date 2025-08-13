// Cloudflare Worker: /api/tcg — proxy to TCGplayer API
// 1) Get keys at https://developer.tcgplayer.com/
// 2) Set secrets: wrangler secret put TCGPLAYER_PUBLIC ; wrangler secret put TCGPLAYER_PRIVATE
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const name = url.searchParams.get('name') || '';
    const set = url.searchParams.get('set') || '';
    if(!name) return new Response('Missing name', {status:400});

    // OAuth token
    const tokenRes = await fetch('https://api.tcgplayer.com/token', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: env.TCGPLAYER_PUBLIC,
        client_secret: env.TCGPLAYER_PRIVATE
      })
    });
    if(!tokenRes.ok) return new Response('Auth error', {status:500});
    const tokenJson = await tokenRes.json();
    const bearer = tokenJson.access_token;

    // Search catalog products
    // Simplified: search + take first Pokémon match; you can refine by set if provided
    const searchBody = {sort:'Relevance', limit: 1, offset: 0, filters: [{ name: 'ProductName', values: [name]}]};
    const prodRes = await fetch('https://api.tcgplayer.com/catalog/products/search', {
      method:'POST',
      headers: { 'Authorization': `bearer ${bearer}`, 'Content-Type':'application/json' },
      body: JSON.stringify(searchBody)
    });
    if(!prodRes.ok) return new Response('Search error', {status:500});
    const prod = await prodRes.json();
    const ids = prod?.results || [];
    if(ids.length===0) return new Response(JSON.stringify({name, set, market:0}), {headers:{'Content-Type':'application/json'}});

    // Get pricing for first result
    const priceRes = await fetch(`https://api.tcgplayer.com/pricing/product/${ids[0]}`, {
      headers: { 'Authorization': `bearer ${bearer}` }
    });
    if(!priceRes.ok) return new Response('Price error', {status:500});
    const priceJson = await priceRes.json();
    // Market price can vary by sku (condition, etc.). Grab the NM holo or highest market.
    let market = 0;
    for(const p of priceJson.results||[]){
      if(p.marketPrice && p.marketPrice > market) market = p.marketPrice;
    }

    // Fake velocity meta (TCGplayer has sales data in some endpoints; adapt as needed)
    const meta = { salesRank: 1500, volume30d: 20 }; // placeholder

    return new Response(JSON.stringify({ name, set, market, ...meta }), {headers:{'Content-Type':'application/json'}});
  }
};