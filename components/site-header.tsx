'use client';
import Image from 'next/image';
import Link from 'next/link';
import {Menu, X, ArrowUpRight, Search} from 'lucide-react';
import {useState} from 'react';

const EBAY='https://www.ebay.com/str/thepokehaus28';
export function SiteHeader(){
  const [open,setOpen]=useState(false);
  return <><header className="header shopHeader"><div className="container nav">
    <Link href="/" aria-label="The Poke Haus home"><Image className="logo" src="/logo.png" alt="The Poke Haus" width={160} height={112} priority/></Link>
    <nav className="navlinks" aria-label="Main navigation"><Link href="/#inventory">Shop Cards</Link><Link href="/#inventory">New Arrivals</Link><Link href="/#shop">Collections</Link><Link href="/sell">Sell Cards</Link></nav>
    <a className="headerSearch" href="/#inventory" aria-label="Search cards"><Search size={17}/> Search cards</a>
    <a className="btn shopPrimary headerCta" href={EBAY} target="_blank" rel="noopener noreferrer">Shop eBay <ArrowUpRight size={17}/></a>
    <button className="mobileMenu" aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
  </div>{open&&<nav className="mobileNav"><a href={EBAY} target="_blank" rel="noopener noreferrer">Shop eBay <ArrowUpRight size={17}/></a><Link href="/sell" onClick={()=>setOpen(false)}>Sell Cards</Link><Link href="/faq" onClick={()=>setOpen(false)}>FAQ</Link><Link href="/contact" onClick={()=>setOpen(false)}>Contact</Link></nav>}</header>
  <div className="mobileCta"><a className="btn shopPrimary" href={EBAY} target="_blank" rel="noopener noreferrer">Shop the eBay Store <ArrowUpRight size={17}/></a></div></>
}
