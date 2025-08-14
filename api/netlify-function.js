// Netlify Function: /api/tcg (optional)
export async function handler(event){ const params=new URLSearchParams(event.rawQuery||''); const name=params.get('name')||''; const set=params.get('set')||''; if(!name) return {statusCode:400,body:'Missing name'};
  // TODO: Implement TCGplayer OAuth + fetch pricing. Return {name,set,market,salesRank,volume30d}
  return {statusCode:200,headers:{'Content-Type':'application/json'},body:JSON.stringify({name,set,market:5.00,salesRank:1500,volume30d:20})};
}