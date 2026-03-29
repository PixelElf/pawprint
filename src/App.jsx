import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { BREED_OPTIONS } from './breeds';

const V = {
  navy:'#1a1f3a',navyLight:'#252b4a',gold:'#c9a84c',goldLight:'#e8d48b',goldDark:'#a88a2e',
  cream:'#faf8f3',cardBg:'#ffffff',text:'#1a1f3a',textLight:'#6b7194',border:'#e8e4dc',
  accent:'#2d8a6e',danger:'#c0392b',whatsapp:'#25D366',surface:'#f2efe8',
};
const F="'Nunito Sans', sans-serif";
const FD="'Cormorant Garamond', serif";

const LIFESTYLE_OPTIONS = [
  { value: 'indoor', label: '🏠 Indoor', desc: 'Stays inside the home' },
  { value: 'outdoor', label: '🌳 Outdoor', desc: 'Roams outside freely' },
  { value: 'indoor_outdoor', label: '🏠🌳 Both', desc: 'Indoor & outdoor' },
];
const lifestyleLabel = (val) => {
  const opt = LIFESTYLE_OPTIONS.find(o => o.value === val);
  return opt ? opt.label : '🏠🌳 Both';
};

// ── Icons ──
const PawIcon=({size=20,color='currentColor'})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill={color}><ellipse cx="8" cy="6" rx="2.2" ry="2.8"/><ellipse cx="16" cy="6" rx="2.2" ry="2.8"/><ellipse cx="4.5" cy="11" rx="2" ry="2.5"/><ellipse cx="19.5" cy="11" rx="2" ry="2.5"/><path d="M12 22c-4 0-7-3.5-7-6.5S9 10 12 10s7 2 7 5.5S16 22 12 22z"/></svg>);
const WAIcon=({size=18})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>);
const ShieldIcon=({size=16})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>);
const CatSvg=({size=50})=>(<svg width={size} height={size} viewBox="0 0 64 64" fill="none"><path d="M14 8L10 28H18L14 8Z" fill={V.gold} opacity="0.8"/><path d="M50 8L54 28H46L50 8Z" fill={V.gold} opacity="0.8"/><ellipse cx="32" cy="38" rx="18" ry="16" fill={V.gold} opacity="0.5"/><circle cx="25" cy="34" r="3" fill="white"/><circle cx="39" cy="34" r="3" fill="white"/><circle cx="25.5" cy="34.5" r="1.5" fill={V.navy}/><circle cx="39.5" cy="34.5" r="1.5" fill={V.navy}/><ellipse cx="32" cy="40" rx="2" ry="1.2" fill={V.navy}/></svg>);
const DogSvg=({size=50})=>(<svg width={size} height={size} viewBox="0 0 64 64" fill="none"><ellipse cx="14" cy="24" rx="8" ry="14" fill={V.gold} opacity="0.6" transform="rotate(-15 14 24)"/><ellipse cx="50" cy="24" rx="8" ry="14" fill={V.gold} opacity="0.6" transform="rotate(15 50 24)"/><ellipse cx="32" cy="36" rx="18" ry="16" fill={V.gold} opacity="0.5"/><circle cx="25" cy="32" r="3" fill="white"/><circle cx="39" cy="32" r="3" fill="white"/><circle cx="25.5" cy="32.5" r="1.5" fill={V.navy}/><circle cx="39.5" cy="32.5" r="1.5" fill={V.navy}/><ellipse cx="32" cy="39" rx="4" ry="2.5" fill={V.navy}/></svg>);
const EditIcon=()=>(<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const GearIcon=({size=18})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>);

// ── Shared UI ──
function Input({label,value,onChange,placeholder,required,type,maxLength,note}){
  return(<div>
    {label&&<label style={{display:'block',marginBottom:5,fontWeight:700,color:V.navy,fontFamily:F,fontSize:13,textTransform:'uppercase',letterSpacing:0.5}}>{label} {required&&<span style={{color:V.danger}}>*</span>}</label>}
    <input type={type||'text'} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
      style={{width:'100%',padding:'12px 16px',borderRadius:8,border:'1.5px solid '+V.border,fontSize:15,fontFamily:F,background:'white',color:V.text,outline:'none',boxSizing:'border-box',transition:'border-color 0.2s'}}
      onFocus={e=>{e.target.style.borderColor=V.gold}} onBlur={e=>{e.target.style.borderColor=V.border}}/>
    {note&&<p style={{margin:'4px 0 0',fontSize:11,color:V.textLight,fontFamily:F}}>{note}</p>}
  </div>);
}
function TextArea({label,value,onChange,placeholder,maxLength}){
  return(<div>
    {label&&<label style={{display:'block',marginBottom:5,fontWeight:700,color:V.navy,fontFamily:F,fontSize:13,textTransform:'uppercase',letterSpacing:0.5}}>{label}</label>}
    <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} rows={3}
      style={{width:'100%',padding:'12px 16px',borderRadius:8,border:'1.5px solid '+V.border,fontSize:15,fontFamily:F,background:'white',color:V.text,outline:'none',boxSizing:'border-box',resize:'vertical',minHeight:80}}
      onFocus={e=>{e.target.style.borderColor=V.gold}} onBlur={e=>{e.target.style.borderColor=V.border}}/>
    {maxLength&&<div style={{textAlign:'right',fontSize:11,color:V.textLight,marginTop:2}}>{value.length}/{maxLength}</div>}
  </div>);
}
function BreedSelect({label,value,onChange,options,required,placeholder,disabled}){
  const[open,setOpen]=useState(false);const[q,setQ]=useState('');const ref=useRef(null);
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[]);
  const fil=options.filter(o=>o.toLowerCase().includes(q.toLowerCase()));
  return(<div ref={ref} style={{position:'relative'}}>
    {label&&<label style={{display:'block',marginBottom:5,fontWeight:700,color:V.navy,fontFamily:F,fontSize:13,textTransform:'uppercase',letterSpacing:0.5}}>{label} {required&&<span style={{color:V.danger}}>*</span>}</label>}
    <button type="button" onClick={()=>!disabled&&setOpen(!open)} disabled={disabled} style={{width:'100%',padding:'12px 16px',borderRadius:8,border:'1.5px solid '+V.border,fontSize:15,fontFamily:F,background:disabled?V.surface:'white',color:value?V.text:V.textLight,textAlign:'left',cursor:disabled?'default':'pointer',boxSizing:'border-box',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{value||placeholder}</span><span style={{fontSize:10,opacity:0.4}}>▼</span>
    </button>
    {open&&(<div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:50,background:'white',borderRadius:10,border:'1.5px solid '+V.border,boxShadow:'0 12px 40px rgba(26,31,58,0.15)',marginTop:4,maxHeight:260,display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{padding:'8px 10px',borderBottom:'1px solid '+V.border}}><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search breeds..." style={{width:'100%',padding:'8px 12px',borderRadius:6,border:'1px solid '+V.border,fontSize:14,fontFamily:F,outline:'none',boxSizing:'border-box'}}/></div>
      <div style={{overflowY:'auto',maxHeight:200}}>{fil.length===0&&<div style={{padding:'14px 16px',color:V.textLight,fontSize:13,fontFamily:F}}>No breeds found</div>}{fil.map(o=>(<button type="button" key={o} onClick={()=>{onChange(o);setOpen(false);setQ('');}} style={{width:'100%',padding:'10px 16px',border:'none',background:o===value?V.surface:'white',textAlign:'left',cursor:'pointer',fontSize:14,fontFamily:F,color:V.text,borderBottom:'0.5px solid '+V.border}}>{o}</button>))}</div>
    </div>)}
  </div>);
}
function compressImage(dataUrl,maxSize=800){return new Promise(resolve=>{const img=new Image();img.onload=()=>{let w=img.width,h=img.height;if(w>maxSize||h>maxSize){if(w>h){h=Math.round(h*maxSize/w);w=maxSize;}else{w=Math.round(w*maxSize/h);h=maxSize;}}const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);resolve(c.toDataURL('image/jpeg',0.7));};img.src=dataUrl;});}
function PhotoUploader({photos,setPhotos}){
  const fileRef=useRef(null);
  const handleAdd=async e=>{const files=Array.from(e.target.files).slice(0,3-photos.length);for(const file of files){const r=new FileReader();const d=await new Promise(res=>{r.onload=ev=>res(ev.target.result);r.readAsDataURL(file);});const compressed=await compressImage(d);setPhotos(p=>p.length>=3?p:[...p,compressed]);}e.target.value='';};
  return(<div>
    <label style={{display:'block',marginBottom:6,fontWeight:700,color:V.navy,fontFamily:F,fontSize:13,textTransform:'uppercase',letterSpacing:0.5}}>Photos ({photos.length}/3) <span style={{color:V.danger}}>*</span></label>
    <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
      {photos.map((p,i)=>(<div key={i} style={{position:'relative',width:100,height:100,borderRadius:10,overflow:'hidden',border:'2px solid '+V.border,boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}><img src={p} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/><button type="button" onClick={()=>setPhotos(prev=>prev.filter((_,j)=>j!==i))} style={{position:'absolute',top:4,right:4,width:22,height:22,borderRadius:'50%',background:V.danger,color:'white',border:'none',cursor:'pointer',fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>×</button></div>))}
      {photos.length<3&&(<button type="button" onClick={()=>fileRef.current&&fileRef.current.click()} style={{width:100,height:100,borderRadius:10,border:'2px dashed '+V.gold,background:V.surface,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,color:V.gold,fontSize:12,fontFamily:F,fontWeight:700}}><span style={{fontSize:28,lineHeight:1}}>+</span><span>Add</span></button>)}
    </div>
    <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleAdd} style={{display:'none'}}/>
  </div>);
}

// ── Lifestyle Selector ──
function LifestyleSelector({value, onChange}) {
  return (
    <div>
      <label style={{display:'block',marginBottom:5,fontWeight:700,color:V.navy,fontFamily:F,fontSize:13,textTransform:'uppercase',letterSpacing:0.5}}>Lifestyle <span style={{color:V.danger}}>*</span></label>
      <div style={{display:'flex',gap:8}}>
        {LIFESTYLE_OPTIONS.map(opt => (
          <button type="button" key={opt.value} onClick={() => onChange(opt.value)} style={{
            flex:1, padding:'10px 6px', borderRadius:8, cursor:'pointer',
            border:'2px solid '+(value===opt.value?V.gold:V.border),
            background:value===opt.value?'rgba(201,168,76,0.08)':'white',
            fontFamily:F, fontSize:12, fontWeight:700,
            color:value===opt.value?V.navy:V.textLight,
            display:'flex', flexDirection:'column', alignItems:'center', gap:2, transition:'all 0.2s'
          }}>
            <span style={{fontSize:16}}>{opt.value==='indoor'?'🏠':opt.value==='outdoor'?'🌳':'🏠🌳'}</span>
            <span>{opt.value==='indoor'?'Indoor':opt.value==='outdoor'?'Outdoor':'Both'}</span>
          </button>
        ))}
      </div>
      <p style={{margin:'4px 0 0',fontSize:11,color:V.textLight,fontFamily:F}}>
        {value==='indoor'?'Stays inside — important if spotted outdoors':value==='outdoor'?'Roams freely outside the home':'Moves between indoors and outdoors'}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════
// AUTH
// ═══════════════════════════════════════
function AuthScreen({onLogin}){
  const[mode,setMode]=useState('signup');const[step,setStep]=useState('phone');const[phone,setPhone]=useState('');const[otp,setOtp]=useState('');const[name,setName]=useState('');const[address,setAddress]=useState('');const[error,setError]=useState('');const[sending,setSending]=useState(false);
  const formatPhone=()=>{let p=phone.trim();if(!p.startsWith('+'))p='+'+p;return p.replace(/\s/g,'');};
  const sendOtp=async()=>{const d=phone.replace(/[^0-9]/g,'');if(d.length<8){setError('Enter a valid WhatsApp number with country code');return;}if(mode==='signup'&&!name.trim()){setError('Enter your name');return;}setError('');setSending(true);try{const{error:e}=await supabase.auth.signInWithOtp({phone:formatPhone()});if(e)throw e;setStep('otp');}catch(err){setError(err.message||'Failed to send code.');}setSending(false);};
  const verifyOtp=async()=>{if(otp.length<4){setError('Enter the verification code');return;}setError('');setSending(true);try{const fp=formatPhone();const{data,error:e}=await supabase.auth.verifyOtp({phone:fp,token:otp,type:'sms'});if(e)throw e;if(name.trim())await supabase.auth.updateUser({data:{display_name:name.trim(),address:address.trim()||null}});const u=data.session?.user;if(u)onLogin({id:u.id,phone:u.phone||fp,name:u.user_metadata?.display_name||name.trim()||'PawPrint User',address:u.user_metadata?.address||address.trim()||null});}catch(err){setError(err.message||'Invalid code.');}setSending(false);};

  return(<div style={{minHeight:'100vh',background:V.navy,display:'flex',flexDirection:'column'}}>
    <div style={{padding:'50px 20px 40px',textAlign:'center',position:'relative',overflow:'hidden',background:'linear-gradient(180deg,'+V.navy+' 0%,'+V.navyLight+' 100%)'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,opacity:0.03,backgroundImage:'radial-gradient(circle at 20% 50%, '+V.gold+' 1px, transparent 1px)',backgroundSize:'40px 40px'}}/>
      <div style={{position:'relative'}}><div style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:8}}><PawIcon size={28} color={V.gold}/><span style={{fontFamily:F,fontSize:11,fontWeight:800,color:V.gold,textTransform:'uppercase',letterSpacing:4}}>Villanova Community</span></div>
        <h1 style={{margin:'8px 0 0',fontFamily:FD,fontSize:38,color:'white',fontWeight:600,letterSpacing:1}}>PawPrint</h1>
        <p style={{margin:'8px 0 0',fontFamily:F,fontSize:14,color:'rgba(255,255,255,0.5)'}}>Every pet has a story. Know theirs.</p>
        <div style={{width:60,height:2,background:V.gold,margin:'16px auto 0',borderRadius:1}}/></div>
    </div>
    <div style={{flex:1,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'30px 20px',background:V.cream}}>
      <div style={{width:'100%',maxWidth:420,background:V.cardBg,borderRadius:16,padding:'32px 28px',border:'1px solid '+V.border,boxShadow:'0 8px 30px rgba(26,31,58,0.08)'}}>
        <div style={{display:'flex',background:V.surface,borderRadius:10,padding:3,marginBottom:24}}>
          {[{k:'signup',l:'Sign Up'},{k:'login',l:'Log In'}].map(m=>(<button type="button" key={m.k} onClick={()=>{setMode(m.k);setStep('phone');setError('');setOtp('');}} style={{flex:1,padding:'10px',borderRadius:8,border:'none',cursor:'pointer',fontFamily:F,fontSize:14,fontWeight:700,background:mode===m.k?'white':'transparent',color:mode===m.k?V.navy:V.textLight,boxShadow:mode===m.k?'0 2px 8px rgba(0,0,0,0.06)':'none',transition:'all 0.2s'}}>{m.l}</button>))}
        </div>
        {step==='phone'?(<>
          <div style={{textAlign:'center',marginBottom:24}}><div style={{width:60,height:60,borderRadius:30,background:V.whatsapp,display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:14,boxShadow:'0 4px 14px rgba(37,211,102,0.3)'}}><WAIcon size={30}/></div>
            <h2 style={{margin:'0 0 4px',fontFamily:FD,fontSize:24,color:V.navy,fontWeight:600}}>{mode==='signup'?'Create Your Account':'Welcome Back'}</h2>
            <p style={{margin:0,fontFamily:F,fontSize:13,color:V.textLight}}>{mode==='signup'?'Sign up with your WhatsApp number':'Log in with your WhatsApp number'}</p></div>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {mode==='signup'&&(<><Input label="Your Name" value={name} onChange={setName} placeholder="e.g. Ahmed, Sarah" required/><Input label="Address" value={address} onChange={setAddress} placeholder="Optional" note="Never shown publicly."/></>)}
            <Input label="WhatsApp Number" value={phone} onChange={setPhone} placeholder="e.g. +971 50 123 4567" required type="tel" note="Include country code. Also your contact number for listings."/>
            {error&&<p style={{margin:0,fontSize:12,color:V.danger,fontFamily:F}}>{error}</p>}
            <button type="button" onClick={sendOtp} disabled={sending} style={{width:'100%',padding:'14px',borderRadius:10,border:'none',background:V.whatsapp,color:'white',fontSize:16,fontFamily:F,fontWeight:700,cursor:sending?'wait':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:sending?0.7:1,boxShadow:'0 4px 14px rgba(37,211,102,0.25)'}}><WAIcon size={18}/> {sending?'Sending...':(mode==='signup'?'Send Verification Code':'Send Login Code')}</button>
          </div>
          <div style={{marginTop:18,padding:'12px 14px',background:'rgba(45,138,110,0.06)',borderRadius:10,border:'1px solid rgba(45,138,110,0.15)',display:'flex',gap:8,alignItems:'flex-start'}}><span style={{color:V.accent,marginTop:1,flexShrink:0}}><ShieldIcon size={14}/></span><p style={{margin:0,fontFamily:F,fontSize:11,color:V.accent,lineHeight:1.5}}>Your number is only used for login and the WhatsApp contact button. Never displayed publicly.</p></div>
        </>):(<>
          <div style={{textAlign:'center',marginBottom:24}}><h2 style={{margin:'0 0 4px',fontFamily:FD,fontSize:24,color:V.navy,fontWeight:600}}>Verification Code</h2><p style={{margin:0,fontFamily:F,fontSize:13,color:V.textLight}}>Sent to {phone}</p></div>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <Input label="6-Digit Code" value={otp} onChange={setOtp} placeholder="e.g. 123456" required maxLength={6}/>
            {error&&<p style={{margin:0,fontSize:12,color:V.danger,fontFamily:F}}>{error}</p>}
            <button type="button" onClick={verifyOtp} disabled={sending} style={{width:'100%',padding:'14px',borderRadius:10,border:'none',background:'linear-gradient(135deg,'+V.navy+','+V.navyLight+')',color:'white',fontSize:16,fontFamily:F,fontWeight:700,cursor:sending?'wait':'pointer',opacity:sending?0.7:1}}>{sending?'Verifying...':(mode==='signup'?'Create Account & Sign In':'Log In')}</button>
            <button type="button" onClick={()=>{setStep('phone');setOtp('');setError('');}} style={{background:'none',border:'none',color:V.gold,fontFamily:F,fontSize:13,cursor:'pointer',fontWeight:700}}>← Change number</button>
          </div>
        </>)}
  
