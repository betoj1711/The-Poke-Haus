'use client';
import Image from 'next/image';import {ArrowUpRight,Search} from 'lucide-react';import {useMemo,useState} from 'react';import type {StoreItem} from '@/lib/ebay-store';

const filters=['All','English','Japanese','Sealed'] as const;
export function InventoryShowcase({items}:{items:StoreItem[]}){
  const [filter,setFilter]=useState<(typeof filters)[number]>('All');const [query,setQuery]=useState('');
  const shown=useMemo(()=>items.filter(item=>(filter==='All'||item.category===filter)&&item.title.toLowerCase().includes(query.toLowerCase())).slice(0,12),[items,filter,query]);
  return <section className="inventorySection" id="inventory"><div className="container">
    <div className="inventoryTop"><div><h2 className="display">Fresh from the vault.</h2><p>Real listings from our eBay store. Prices and availability can change quickly.</p></div><label className="inventorySearch"><Search size={18}/><span className="srOnly">Search inventory</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search cards or sets"/></label></div>
    <div className="filterRow" aria-label="Filter inventory">{filters.map(name=><button key={name} onClick={()=>setFilter(name)} className={filter===name?'active':''}>{name}</button>)}</div>
    <div className="productGrid">{shown.map(item=><article className="productCard" key={item.id}><a className="productImage" href={item.url} target="_blank" rel="noopener noreferrer"><Image src={item.image} alt={item.title} fill sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw"/></a><div className="productInfo"><span className="productCondition">{item.condition}</span><h3>{item.title}</h3><div className="productBuy"><strong>{item.price}</strong><a href={item.url} target="_blank" rel="noopener noreferrer">View on eBay <ArrowUpRight size={15}/></a></div></div></article>)}</div>
    {!shown.length&&<p className="emptyProducts">No cards match that search. Try another card, set, or category.</p>}
    <div className="inventoryFoot"><a className="btn shopPrimary" href="https://www.ebay.com/str/thepokehaus28" target="_blank" rel="noopener noreferrer">Browse all eBay listings <ArrowUpRight size={18}/></a></div>
  </div></section>
}
