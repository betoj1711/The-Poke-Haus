'use client';
import {FormEvent,useState} from 'react';

export function ContactForm(){
  const [status,setStatus]=useState<'idle'|'sending'|'sent'|'error'>('idle');const [error,setError]=useState('');
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const element=event.currentTarget;setStatus('sending');setError('');const form=new FormData(element);
    try{const response=await fetch('/api/requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind:'contact',name:form.get('name'),email:form.get('email'),message:form.get('message'),website:form.get('website')})});const data=await response.json();if(response.ok){setStatus('sent');element.reset()}else{setStatus('error');setError(data.error??'Please try again.')}}catch{setStatus('error');setError('Connection problem. Please try again.')}
  }
  return <form className="card" onSubmit={submit}><div className="formGrid"><div className="field"><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" required/></div><div className="field"><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" required/></div></div><div className="field honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div><div className="field" style={{marginTop:18}}><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" rows={6} required/></div><button className="btn primary" style={{marginTop:20}} disabled={status==='sending'}>{status==='sending'?'Sending…':'Send message'}</button><div className={`formNotice ${status}`} role="status">{status==='sent'?'Thanks — your message was sent to sell@thepokehaus.com.':status==='error'?error:''}</div></form>
}
