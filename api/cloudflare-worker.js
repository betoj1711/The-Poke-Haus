// Cloudflare Worker: /api/tcg (optional)
export default { async fetch(request, env){ const u=new URL(request.url); const name=u.searchParams.get('name')||''; const set=u.searchParams.get('set')||''; if(!name) return new Response('Missing name',{status:400});
  // TODO: Implement TCGplayer OAuth + fetch pricing. Return {name,set,market,salesRank,volume30d}
  return new Response(JSON.stringify({name,set,market:5.00,salesRank:1500,volume30d:20}),{headers:{'Content-Type':'application/json'}});
}}