export type EmailEvent='order_submitted'|'offer_sent'|'offer_accepted'|'tracking_added'|'package_delivered'|'inspection_complete'|'final_offer_sent'|'payment_sent';
export async function sendOrderEmail(event:EmailEvent,to:string,data:Record<string,unknown>){console.info('[email stub]',{event,to,data});return {id:`stub-${Date.now()}`}}
