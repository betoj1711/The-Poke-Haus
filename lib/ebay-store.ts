export type StoreItem={id:string;title:string;image:string;price:string;url:string;condition:string;category:'English'|'Japanese'|'Sealed'};

const fallback:StoreItem[]=[
  {id:'188732755943',title:'Boltund 239/190 Shiny Rare — Shiny Star V',image:'https://i.ebayimg.com/images/g/3tgAAeSwnQxqb2qF/s-l800.jpg',price:'$5.00',url:'https://www.ebay.com/itm/188732755943',condition:'Near Mint',category:'Japanese'},
  {id:'188732752279',title:'Duraludon 291/190 Shiny Rare — Shiny Star V',image:'https://i.ebayimg.com/images/g/JpEAAeSw8QJqb2nb/s-l800.jpg',price:'$3.00',url:'https://www.ebay.com/itm/188732752279',condition:'Near Mint',category:'Japanese'},
  {id:'187036921776',title:'Hisuian Typhlosion V 028/067 — Battle Region',image:'https://i.ebayimg.com/images/g/xWUAAOSwsOJn0RU4/s-l800.jpg',price:'$3.00',url:'https://www.ebay.com/itm/187036921776',condition:'Near Mint',category:'Japanese'},
  {id:'187036322247',title:'Jynx ex 191/165 Full Art — Pokémon 151',image:'https://i.ebayimg.com/images/g/mrsAAeSw3QtqcjTQ/s-l800.jpg',price:'$8.00',url:'https://www.ebay.com/itm/187036322247',condition:'Near Mint',category:'English'},
  {id:'188657411301',title:'Nymble 096/094 Illustration Rare — Phantasmal Flames',image:'https://i.ebayimg.com/images/g/cgsAAeSwQQxqeTse/s-l800.jpg',price:'$3.00',url:'https://www.ebay.com/itm/188657411301',condition:'Near Mint',category:'English'},
  {id:'188671133375',title:'Charizard GX 9/68 Holo Rare — Hidden Fates',image:'https://i.ebayimg.com/images/g/8JQAAeSwhINqXlOw/s-l800.jpg',price:'$13.00',url:'https://www.ebay.com/itm/188671133375',condition:'Near Mint',category:'English'},
  {id:'186944185045',title:'2022 Trick or Trade BOOster — Two Sealed Packs',image:'https://i.ebayimg.com/images/g/-AEAAOSw3QVnqmh4/s-l800.jpg',price:'$3.95',url:'https://www.ebay.com/itm/186944185045',condition:'Factory Sealed',category:'Sealed'},
  {id:'187033137805',title:'Keldeo V 053/202 Ultra Rare — Sword & Shield',image:'https://i.ebayimg.com/images/g/kcgAAOSwtzdnzyAc/s-l800.jpg',price:'$3.00',url:'https://www.ebay.com/itm/187033137805',condition:'Near Mint',category:'English'},
];

async function token(){
  const id=process.env.EBAY_CLIENT_ID,secret=process.env.EBAY_CLIENT_SECRET;
  if(!id||!secret)return null;
  const response=await fetch('https://api.ebay.com/identity/v1/oauth2/token',{method:'POST',headers:{Authorization:`Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope',next:{revalidate:6300}});
  if(!response.ok)return null;
  return (await response.json()).access_token as string;
}

export async function getStoreItems():Promise<StoreItem[]>{
  try{
    const access=await token();
    if(!access)return fallback;
    const params=new URLSearchParams({q:'Pokemon',filter:'sellers:{the_poke_haus}',limit:'200',sort:'newlyListed'});
    const response=await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`,{headers:{Authorization:`Bearer ${access}`,'X-EBAY-C-MARKETPLACE-ID':'EBAY_US'},next:{revalidate:900}});
    if(!response.ok)return fallback;
    const data=await response.json();
    const items=(data.itemSummaries??[]).filter((item:any)=>item.image?.imageUrl).map((item:any):StoreItem=>({id:item.itemId,title:item.title,image:item.image.imageUrl,price:new Intl.NumberFormat('en-US',{style:'currency',currency:item.price?.currency??'USD'}).format(Number(item.price?.value??0)),url:item.itemWebUrl,condition:item.condition??'See listing',category:/japanese/i.test(item.title)?'Japanese':/sealed|pack|booster|box/i.test(item.title)?'Sealed':'English'}));
    return items.length?items:fallback;
  }catch{return fallback}
}
