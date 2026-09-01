import {NextResponse} from 'next/server';

const DESTINATION='sell@thepokehaus.com';
const clean=(value:unknown,max=5000)=>String(value??'').trim().slice(0,max);
const escapeHtml=(value:string)=>value.replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]??char));

export async function POST(request:Request){
  try{
    const body=await request.json();
    if(body.website)return NextResponse.json({ok:true});
    const kind=body.kind==='sell'?'sell':'contact';
    const name=clean(body.name,120),email=clean(body.email,180),message=clean(body.message);
    if(!name||!email||!/^\S+@\S+\.\S+$/.test(email))return NextResponse.json({error:'Please provide your name and a valid email.'},{status:400});
    if(kind==='contact'&&!message)return NextResponse.json({error:'Please enter a message.'},{status:400});
    const apiKey=process.env.RESEND_API_KEY;
    if(!apiKey)return NextResponse.json({error:'Email delivery is not configured yet.'},{status:503});

    const fields=kind==='sell'?[
      ['Collection type',clean(body.collectionType,120)],['Estimated payout',clean(body.estimate,40)],
      ['Bulk V / ex',clean(body.counts?.bulk,20)],['Premium cards',clean(body.counts?.premium,20)],
      ['Reverse holos',clean(body.counts?.reverse,20)],['Handoff method',clean(body.sellerRoute,120)],['Phone',clean(body.phone,80)],
      ['Payout preference',clean(body.payoutMethod,80)],['Payout handle',clean(body.payoutDetails,180)],
      ['Photo / video link',clean(body.mediaLink,1000)],['Collection notes',clean(body.notes)],
    ]:[['Message',message]];
    const rows=fields.filter(([,value])=>value).map(([label,value])=>`<tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>${escapeHtml(label)}</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(value).replace(/\n/g,'<br>')}</td></tr>`).join('');
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({
      from:process.env.EMAIL_FROM??'The Poke Haus Website <requests@mail.thepokehaus.com>',to:[DESTINATION],reply_to:email,
      subject:kind==='sell'?`New card collection request from ${name}`:`Website message from ${name}`,
      html:`<h1>${kind==='sell'?'New card collection request':'New website message'}</h1><p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}</p><table style="border-collapse:collapse;width:100%">${rows}</table>`,
    })});
    if(!response.ok){console.error('Email provider rejected request',response.status);return NextResponse.json({error:'We could not send your request. Please try again.'},{status:502})}
    return NextResponse.json({ok:true});
  }catch{return NextResponse.json({error:'Invalid request.'},{status:400})}
}
