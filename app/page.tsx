import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight, Check, PackageCheck, ShieldCheck, Sparkles, Star} from 'lucide-react';
import {PageShell} from '@/components/page-shell';
import {InventoryShowcase} from '@/components/inventory-showcase';
import {getStoreItems} from '@/lib/ebay-store';

const EBAY = 'https://www.ebay.com/str/thepokehaus28';
const categories = [
  {name:'English singles', note:'Modern sets, staples & chase cards', image:'/english-singles.jpg', href:`${EBAY}/English-Pokemon-TCG-Singles/_i.html?store_cat=4220809319`},
  {name:'Japanese singles', note:'Premium print quality & unique art', image:'/japanese-singles.jpg', href:`${EBAY}/Japanese-Pokemon-TCG-Singles/_i.html?store_cat=4224505419`},
  {name:'Shiny favorites', note:'Scarlet & Violet shiny vault', image:'/shiny-vault.jpg', href:`${EBAY}/Shiny-Scarlet-Violet/_i.html?store_cat=4235681719`},
];

export default async function Home(){
  const items=await getStoreItems();
  const org={"@context":"https://schema.org","@type":"Organization","name":"The Poke Haus","url":"https://thepokehaus.com","sameAs":[EBAY]};
  return <PageShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(org)}}/>
    <main>
      <section className="shopHero">
        <div className="shopHeroCopy">
          <h1 className="display">Your next favorite card is already here.</h1>
          <p>Fresh Pokémon singles, sealed finds, and collector favorites—updated directly from our eBay store.</p>
          <div className="actions">
            <a className="btn shopPrimary" href="#inventory">Shop new arrivals</a>
            <a className="btn shopSecondary" href={EBAY} target="_blank" rel="noopener noreferrer">Browse all cards <ArrowUpRight size={19}/></a>
          </div>
          <p className="microcopy"><Check size={15}/> Secure checkout and buyer protection through eBay</p>
        </div>
        <div className="shopHeroVisual productHero" aria-label="Featured cards from the eBay store">{items.slice(0,4).map((item,index)=><a key={item.id} className={`heroCard heroCard${index+1}`} href={item.url} target="_blank" rel="noopener noreferrer"><Image src={item.image} alt={item.title} fill priority={index<2} sizes="240px"/></a>)}</div>
      </section>

      <InventoryShowcase items={items}/>

      <section className="salesProof" aria-label="Why collectors shop with us">
        <div className="container proofGrid">
          <div><Star/><strong>99.7% positive feedback</strong><span>Trusted eBay seller</span></div>
          <div><Sparkles/><strong>2,000+ items sold</strong><span>Growing collector community</span></div>
          <div><ShieldCheck/><strong>Carefully checked</strong><span>Clear, honest condition notes</span></div>
          <div><PackageCheck/><strong>Protected shipping</strong><span>Packed with collectors in mind</span></div>
        </div>
      </section>

      <section className="categorySection" id="shop">
        <div className="container">
          <div className="shopSectionHead"><div><p className="sectionLabel">Shop by collection</p><h2 className="display">Start with what you collect.</h2></div><a href={EBAY} target="_blank" rel="noopener noreferrer">Browse every listing <ArrowUpRight size={18}/></a></div>
          <div className="categoryGrid">
            {categories.map((category)=><a className="categoryCard" key={category.name} href={category.href} target="_blank" rel="noopener noreferrer">
              <Image src={category.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw"/>
              <div className="categoryShade"/>
              <div className="categoryCopy"><h3>{category.name}</h3><p>{category.note}</p><span>Shop now <ArrowUpRight size={16}/></span></div>
            </a>)}
          </div>
        </div>
      </section>

      <section className="collectorPromise" id="why-us"><div className="container promiseGrid">
        <div><p className="sectionLabel">San Antonio–based eBay store</p><h2 className="display">Cards worth collecting. Service worth coming back for.</h2></div>
        <div className="promiseCopy"><p>Whether you’re finishing a binder, upgrading a deck, or hunting a favorite illustration, our eBay store makes the purchase feel simple and dependable.</p><ul><li><Check/>Curated singles and focused bundles</li><li><Check/>Near-mint inventory clearly presented</li><li><Check/>Local bulk buying by appointment</li></ul><a className="textLink" href={EBAY} target="_blank" rel="noopener noreferrer">See what’s on eBay <ArrowUpRight size={18}/></a></div>
      </div></section>

      <section className="sellBand"><div className="container sellBandInner"><div><p className="sectionLabel">San Antonio meetup or ship to us</p><h2 className="display">Have Pokémon bulk to sell?</h2><p>Get a simple bulk estimate online. Local sellers can arrange a safe public meetup in San Antonio; everyone else can ship with tracking.</p></div><Link className="btn shopSecondary light" href="/sell">Price my bulk</Link></div></section>

      <section className="finalShop"><div className="container"><Image src="/logo.png" alt="The Poke Haus" width={170} height={120}/><h2 className="display">Your next favorite card is waiting.</h2><p>Shop the latest singles, bundles, and collectible finds on eBay.</p><a className="btn shopPrimary" href={EBAY} target="_blank" rel="noopener noreferrer">Shop the eBay Store <ArrowUpRight size={19}/></a></div></section>
    </main>
  </PageShell>
}
