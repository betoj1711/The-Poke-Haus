export type Demand='fast'|'normal'|'slow'|'overstock';
const bands:Record<Demand,[number,number]>={fast:[.75,.8],normal:[.6,.7],slow:[.4,.55],overstock:[0,.4]};
export function bulkEstimate(x:{ultraRare:number;premium:number;reverseHolo:number}){return x.ultraRare*.5+x.premium+x.reverseHolo*.02}
export function marketOffer(market:number,demand:Demand,percent?:number){const [low,high]=bands[demand];const rate=Math.min(high,Math.max(low,percent??((low+high)/2)));return market*rate}
export function customerFacingOffer(amount:number,manualOverride?:number){return Math.floor(manualOverride??amount)}
