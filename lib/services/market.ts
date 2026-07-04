export async function getTcgPlayerPrice(_cardId:string){return {marketPrice:null,source:'stub' as const}}
export async function getEbaySoldComps(_query:string){return {average:null,sales:[],source:'stub' as const}}
export async function getCardMetadata(_query:string){return {cards:[],source:'stub' as const}}
export async function scanCardImage(_url:string){return {matches:[],source:'stub' as const}}
