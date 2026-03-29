import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { BREED_OPTIONS } from './breeds';

// ── Villanova-inspired palette ──
const V = {
  navy:'#1a1f3a',navyLight:'#252b4a',gold:'#c9a84c',goldLight:'#e8d48b',goldDark:'#a88a2e',
  cream:'#faf8f3',cardBg:'#ffffff',text:'#1a1f3a',textLight:'#6b7194',border:'#e8e4dc',
  accent:'#2d8a6e',danger:'#c0392b',whatsapp:'#25D366',surface:'#f2efe8',
};
const F="'Nunito Sans', sans-serif";
const FD="'Cormorant Garamond', serif";

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

// ═══════════════════════════════════════
// AUTH — Real Supabase Phone OTP
// ═══════════════════════════════════════
function AuthScreen({onLogin}){
  const[mode,setMode]=useState('signup');const[step,setStep]=useState('phone');const[phone,setPhone]=useState('');const[otp,setOtp]=useState('');const[name,setName]=useState('');const[address,setAddress]=useState('');const[error,setError]=useState('');const[sending,setSending]=useState(false);
  const formatPhone=()=>{let p=phone.trim();if(!p.startsWith('+'))p='+'+p;return p.replace(/\s/g,'');};

  const sendOtp=async()=>{
    const d=phone.replace(/[^0-9]/g,'');if(d.length<8){setError('Enter a valid WhatsApp number with country code');return;}
    if(mode==='signup'&&!name.trim()){setError('Enter your name');return;}
    setError('');setSending(true);
    try{const{error:e}=await supabase.auth.signInWithOtp({phone:formatPhone()});if(e)throw e;setStep('otp');}
    catch(err){setError(err.message||'Failed to send code.');}
    setSending(false);
  };

  const verifyOtp=async()=>{
    if(otp.length<4){setError('Enter the verification code');return;}
    setError('');setSending(true);
    try{
      const fp=formatPhone();
      const{data,error:e}=await supabase.auth.verifyOtp({phone:fp,token:otp,type:'sms'});if(e)throw e;
      if(name.trim())await supabase.auth.updateUser({data:{display_name:name.trim(),address:address.trim()||null}});
      const u=data.session?.user;
      if(u)onLogin({id:u.id,phone:u.phone||fp,name:u.user_metadata?.display_name||name.trim()||'PawPrint User',address:u.user_metadata?.address||address.trim()||null});
    }catch(err){setError(err.message||'Invalid code.');}
    setSending(false);
  };

  return(<div style={{minHeight:'100vh',background:V.navy,display:'flex',flexDirection:'column'}}>
    <div style={{padding:'50px 20px 40px',textAlign:'center',position:'relative',overflow:'hidden',background:'linear-gradient(180deg,'+V.navy+' 0%,'+V.navyLight+' 100%)'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,opacity:0.03,backgroundImage:'radial-gradient(circle at 20% 50%, '+V.gold+' 1px, transparent 1px)',backgroundSize:'40px 40px'}}/>
      <div style={{position:'relative'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,marginBottom:8}}><PawIcon size={28} color={V.gold}/><span style={{fontFamily:F,fontSize:11,fontWeight:800,color:V.gold,textTransform:'uppercase',letterSpacing:4}}>Villanova Community</span></div>
        <h1 style={{margin:'8px 0 0',fontFamily:FD,fontSize:38,color:'white',fontWeight:600,letterSpacing:1}}>PawPrint</h1>
        <p style={{margin:'8px 0 0',fontFamily:F,fontSize:14,color:'rgba(255,255,255,0.5)'}}>Every pet has a story. Know theirs.</p>
        <div style={{width:60,height:2,background:V.gold,margin:'16px auto 0',borderRadius:1}}/>
      </div>
    </div>
    <div style={{flex:1,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'30px 20px',background:V.cream}}>
      <div style={{width:'100%',maxWidth:420,background:V.cardBg,borderRadius:16,padding:'32px 28px',border:'1px solid '+V.border,boxShadow:'0 8px 30px rgba(26,31,58,0.08)'}}>
        <div style={{display:'flex',background:V.surface,borderRadius:10,padding:3,marginBottom:24}}>
          {[{k:'signup',l:'Sign Up'},{k:'login',l:'Log In'}].map(m=>(<button type="button" key={m.k} onClick={()=>{setMode(m.k);setStep('phone');setError('');setOtp('');}} style={{flex:1,padding:'10px',borderRadius:8,border:'none',cursor:'pointer',fontFamily:F,fontSize:14,fontWeight:700,background:mode===m.k?'white':'transparent',color:mode===m.k?V.navy:V.textLight,boxShadow:mode===m.k?'0 2px 8px rgba(0,0,0,0.06)':'none',transition:'all 0.2s'}}>{m.l}</button>))}
        </div>
        {step==='phone'?(<>
          <div style={{textAlign:'center',marginBottom:24}}>
            <div style={{width:60,height:60,borderRadius:30,background:V.whatsapp,display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:14,boxShadow:'0 4px 14px rgba(37,211,102,0.3)'}}><WAIcon size={30}/></div>
            <h2 style={{margin:'0 0 4px',fontFamily:FD,fontSize:24,color:V.navy,fontWeight:600}}>{mode==='signup'?'Create Your Account':'Welcome Back'}</h2>
            <p style={{margin:0,fontFamily:F,fontSize:13,color:V.textLight}}>{mode==='signup'?'Sign up with your WhatsApp number':'Log in with your WhatsApp number'}</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {mode==='signup'&&(<><Input label="Your Name" value={name} onChange={setName} placeholder="e.g. Ahmed, Sarah" required/><Input label="Address" value={address} onChange={setAddress} placeholder="Optional" note="Never shown publicly."/></>)}
            <Input label="WhatsApp Number" value={phone} onChange={setPhone} placeholder="e.g. +971 50 123 4567" required type="tel" note="Include country code. Also your contact number for listings."/>
            {error&&<p style={{margin:0,fontSize:12,color:V.danger,fontFamily:F}}>{error}</p>}
            <button type="button" onClick={sendOtp} disabled={sending} style={{width:'100%',padding:'14px',borderRadius:10,border:'none',background:V.whatsapp,color:'white',fontSize:16,fontFamily:F,fontWeight:700,cursor:sending?'wait':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:sending?0.7:1,boxShadow:'0 4px 14px rgba(37,211,102,0.25)'}}>
              <WAIcon size={18}/> {sending?'Sending...':(mode==='signup'?'Send Verification Code':'Send Login Code')}
            </button>
          </div>
          <div style={{marginTop:18,padding:'12px 14px',background:'rgba(45,138,110,0.06)',borderRadius:10,border:'1px solid rgba(45,138,110,0.15)',display:'flex',gap:8,alignItems:'flex-start'}}>
            <span style={{color:V.accent,marginTop:1,flexShrink:0}}><ShieldIcon size={14}/></span>
            <p style={{margin:0,fontFamily:F,fontSize:11,color:V.accent,lineHeight:1.5}}>Your number is only used for login and the WhatsApp contact button. Never displayed publicly.</p>
          </div>
        </>):(<>
          <div style={{textAlign:'center',marginBottom:24}}>
            <h2 style={{margin:'0 0 4px',fontFamily:FD,fontSize:24,color:V.navy,fontWeight:600}}>Verification Code</h2>
            <p style={{margin:0,fontFamily:F,fontSize:13,color:V.textLight}}>Sent to {phone}</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <Input label="6-Digit Code" value={otp} onChange={setOtp} placeholder="e.g. 123456" required maxLength={6}/>
            {error&&<p style={{margin:0,fontSize:12,color:V.danger,fontFamily:F}}>{error}</p>}
            <button type="button" onClick={verifyOtp} disabled={sending} style={{width:'100%',padding:'14px',borderRadius:10,border:'none',background:'linear-gradient(135deg,'+V.navy+','+V.navyLight+')',color:'white',fontSize:16,fontFamily:F,fontWeight:700,cursor:sending?'wait':'pointer',opacity:sending?0.7:1}}>{sending?'Verifying...':(mode==='signup'?'Create Account & Sign In':'Log In')}</button>
            <button type="button" onClick={()=>{setStep('phone');setOtp('');setError('');}} style={{background:'none',border:'none',color:V.gold,fontFamily:F,fontSize:13,cursor:'pointer',fontWeight:700}}>← Change number</button>
          </div>
        </>)}
      </div>
    </div>
  </div>);
}

// ═══════════════════════════════════════
// ACCOUNT SETTINGS
// ═══════════════════════════════════════
function AccountSettings({user,onUpdate,onDelete,onBack}){
  const[name,setName]=useState(user.name||'');const[address,setAddress]=useState(user.address||'');const[saved,setSaved]=useState(false);const[saving,setSaving]=useState(false);const[confirmDel,setConfirmDel]=useState(false);
  const handleSave=async()=>{if(!name.trim()){alert('Name is required');return;}setSaving(true);try{await supabase.auth.updateUser({data:{display_name:name.trim(),address:address.trim()||null}});onUpdate({...user,name:name.trim(),address:address.trim()||null});setSaved(true);setTimeout(()=>setSaved(false),3000);}catch(err){alert('Failed: '+err.message);}setSaving(false);};

  return(<div style={{animation:'fadeIn 0.3s ease'}}>
    <button type="button" onClick={onBack} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,color:V.gold,fontFamily:F,fontWeight:700,fontSize:14,padding:0,marginBottom:16}}>← Back</button>
    <div style={{background:V.cardBg,borderRadius:16,padding:'32px 28px',border:'1px solid '+V.border,boxShadow:'0 8px 30px rgba(26,31,58,0.08)'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
        <div style={{width:44,height:44,borderRadius:22,background:V.surface,display:'flex',alignItems:'center',justifyContent:'center'}}><GearIcon size={22}/></div>
        <div><h2 style={{margin:0,fontFamily:FD,fontSize:24,color:V.navy,fontWeight:600}}>Account Settings</h2><p style={{margin:0,fontFamily:F,fontSize:12,color:V.textLight}}>Manage your profile</p></div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <Input label="Your Name" value={name} onChange={setName} placeholder="Your display name" required/>
        <Input label="Address" value={address} onChange={setAddress} placeholder="Optional — never shown publicly" note="Stored privately."/>
        <div style={{padding:'14px 16px',background:V.surface,borderRadius:10}}><p style={{margin:0,fontFamily:F,fontSize:14,color:V.navy}}><strong>WhatsApp:</strong> {user.phone}</p><p style={{margin:'4px 0 0',fontFamily:F,fontSize:11,color:V.textLight}}>To change your number, sign out and create a new account.</p></div>
        <button type="button" onClick={handleSave} disabled={saving} style={{width:'100%',padding:'14px',borderRadius:10,border:'none',background:'linear-gradient(135deg,'+V.navy+','+V.navyLight+')',color:'white',fontSize:16,fontFamily:F,fontWeight:700,cursor:saving?'wait':'pointer',opacity:saving?0.7:1}}>{saving?'Saving...':'Save Changes'}</button>
        {saved&&<div style={{padding:'10px 14px',background:'rgba(45,138,110,0.06)',borderRadius:10,border:'1px solid rgba(45,138,110,0.15)',fontFamily:F,fontSize:13,color:V.accent,textAlign:'center'}}>✅ Saved!</div>}
        <div style={{borderTop:'1px solid '+V.border,paddingTop:20,marginTop:8}}>
          <h3 style={{margin:'0 0 8px',fontFamily:F,fontSize:14,color:V.danger,fontWeight:700}}>Danger Zone</h3>
          <p style={{margin:'0 0 12px',fontFamily:F,fontSize:12,color:V.textLight}}>Deleting your account removes all your pet listings permanently.</p>
          {!confirmDel?(<button type="button" onClick={()=>setConfirmDel(true)} style={{padding:'10px 20px',borderRadius:8,background:'transparent',color:V.danger,border:'1.5px solid '+V.danger,fontFamily:F,fontWeight:700,fontSize:13,cursor:'pointer',width:'100%'}}>Delete My Account</button>
          ):(<div style={{padding:14,background:'#fef2f2',borderRadius:12,display:'flex',flexDirection:'column',gap:10}}>
            <p style={{margin:0,fontFamily:F,fontSize:13,color:V.danger,fontWeight:700}}>Are you sure? All pets will be removed.</p>
            <div style={{display:'flex',gap:10}}><button type="button" onClick={onDelete} style={{flex:1,padding:'10px',borderRadius:8,background:V.danger,color:'white',border:'none',fontFamily:F,fontWeight:700,fontSize:13,cursor:'pointer'}}>Yes, Delete</button><button type="button" onClick={()=>setConfirmDel(false)} style={{flex:1,padding:'10px',borderRadius:8,background:'white',color:V.text,border:'1px solid '+V.border,fontFamily:F,fontSize:13,cursor:'pointer'}}>Cancel</button></div>
          </div>)}
        </div>
      </div>
    </div>
  </div>);
}

// ═══════════════════════════════════════
// PET FORM
// ═══════════════════════════════════════
function PetForm({initial,user,onSubmit,onCancel,submitLabel}){
  const[type,setType]=useState(initial?.type||'');const[breed,setBreed]=useState(initial?.breed||'');const[name,setName]=useState(initial?.name||'');const[description,setDescription]=useState(initial?.description||'');const[photos,setPhotos]=useState(initial?.photo_urls||[]);const[errors,setErrors]=useState({});const[submitting,setSubmitting]=useState(false);
  const validate=()=>{const e={};if(!photos.length)e.photos='At least 1 photo';if(!name.trim())e.name='Required';if(!type)e.type='Required';if(!breed)e.breed='Required';setErrors(e);return Object.keys(e).length===0;};
  const handleSubmit=async()=>{if(!validate()||submitting)return;setSubmitting(true);try{
    if(initial?.id){const{error}=await supabase.from('pets').update({type,breed,name:name.trim(),description:description.trim()||null,photo_urls:photos}).eq('id',initial.id);if(error)throw error;}
    else{const{error}=await supabase.from('pets').insert({type,breed,name:name.trim(),description:description.trim()||null,owner_id:user.id,whatsapp:user.phone,photo_urls:photos});if(error)throw error;}
    onSubmit();}catch(err){alert('Failed: '+err.message);setSubmitting(false);}};

  return(<div style={{animation:'fadeIn 0.3s ease'}}>
    <button type="button" onClick={onCancel} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,color:V.gold,fontFamily:F,fontWeight:700,fontSize:14,padding:0,marginBottom:16}}>← Back</button>
    <div style={{background:V.cardBg,borderRadius:16,padding:'32px 28px',border:'1px solid '+V.border,boxShadow:'0 8px 30px rgba(26,31,58,0.08)'}}>
      <h2 style={{margin:'0 0 4px',fontFamily:FD,fontSize:26,color:V.navy,fontWeight:600}}>{initial?'Edit Pet':'Register Your Pet'}</h2>
      <p style={{margin:'0 0 24px',fontFamily:F,fontSize:13,color:V.textLight}}>{initial?"Update details":"Add your furry friend to PawPrint"}</p>
      <div style={{display:'flex',flexDirection:'column',gap:18}}>
        <PhotoUploader photos={photos} setPhotos={setPhotos}/>{errors.photos&&<span style={{color:V.danger,fontSize:12,marginTop:-10,fontFamily:F}}>{errors.photos}</span>}
        <Input label="Pet Name" value={name} onChange={setName} placeholder="e.g. Whiskers, Buddy" required maxLength={40}/>{errors.name&&<span style={{color:V.danger,fontSize:12,marginTop:-8,fontFamily:F}}>{errors.name}</span>}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <div><label style={{display:'block',marginBottom:5,fontWeight:700,color:V.navy,fontFamily:F,fontSize:13,textTransform:'uppercase',letterSpacing:0.5}}>Type <span style={{color:V.danger}}>*</span></label>
            <div style={{display:'flex',gap:8}}>{['cat','dog'].map(t=>(<button type="button" key={t} onClick={()=>{setType(t);setBreed('');}} style={{flex:1,padding:'12px 8px',borderRadius:8,cursor:'pointer',border:'2px solid '+(type===t?V.gold:V.border),background:type===t?'rgba(201,168,76,0.08)':'white',fontFamily:F,fontSize:14,fontWeight:700,color:type===t?V.navy:V.textLight,display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>{t==='cat'?'🐱 Cat':'🐶 Dog'}</button>))}</div>
            {errors.type&&<span style={{color:V.danger,fontSize:12,fontFamily:F}}>{errors.type}</span>}</div>
          <div><BreedSelect label="Breed" value={breed} onChange={setBreed} options={type?BREED_OPTIONS[type]:[]} required placeholder={type?'Search breeds...':'Pick type first'} disabled={!type}/>{errors.breed&&<span style={{color:V.danger,fontSize:12,fontFamily:F}}>{errors.breed}</span>}</div>
        </div>
        <TextArea label="Description" value={description} onChange={setDescription} placeholder="Colour, markings, personality..." maxLength={300}/>
        <button type="button" onClick={handleSubmit} disabled={submitting} style={{width:'100%',padding:'15px',borderRadius:10,border:'none',background:submitting?V.textLight:'linear-gradient(135deg,'+V.navy+','+V.navyLight+')',color:'white',fontSize:16,fontWeight:700,fontFamily:F,cursor:submitting?'wait':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:'0 4px 16px rgba(26,31,58,0.2)',marginTop:4,letterSpacing:0.3}}>
          <PawIcon size={16} color={V.gold}/> {submitting?'Saving...':(submitLabel||'Register Pet')}
        </button>
      </div>
    </div>
  </div>);
}

// ═══════════════════════════════════════
// PET CARD — Property listing style
// ═══════════════════════════════════════
function PetCard({pet,onClick}){
  const photo=(pet.photo_urls&&pet.photo_urls[0])||null;const isCat=pet.type==='cat';
  return(<div onClick={onClick} style={{background:V.cardBg,borderRadius:14,overflow:'hidden',cursor:'pointer',border:'1px solid '+V.border,transition:'all 0.3s',boxShadow:'0 2px 12px rgba(26,31,58,0.06)'}}
    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 30px rgba(26,31,58,0.12)';}}
    onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 2px 12px rgba(26,31,58,0.06)';}}>
    <div style={{position:'relative',paddingTop:'70%',background:'linear-gradient(135deg,'+V.navyLight+','+V.navy+')'}}>
      {photo?<img src={photo} alt={pet.name} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>{isCat?<CatSvg size={60}/>:<DogSvg size={60}/>}</div>}
      <div style={{position:'absolute',top:12,left:12,background:isCat?'rgba(201,168,76,0.9)':'rgba(45,138,110,0.9)',color:'white',padding:'4px 12px',borderRadius:6,fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:1,fontFamily:F,backdropFilter:'blur(4px)'}}>{isCat?'🐱 Cat':'🐶 Dog'}</div>
      <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,rgba(26,31,58,0.85))',padding:'20px 14px 10px'}}><p style={{margin:0,fontFamily:F,fontSize:11,color:'rgba(255,255,255,0.7)',fontWeight:600,textTransform:'uppercase',letterSpacing:0.5}}>{pet.breed}</p></div>
    </div>
    <div style={{padding:'14px 16px 16px'}}>
      <h3 style={{margin:0,fontSize:20,fontFamily:FD,color:V.navy,fontWeight:600}}>{pet.name}</h3>
      {pet.description&&<p style={{margin:'8px 0 0',fontSize:13,color:V.textLight,fontFamily:F,lineHeight:1.5,overflow:'hidden',textOverflow:'ellipsis',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{pet.description}</p>}
      <div style={{display:'flex',gap:12,marginTop:12,paddingTop:12,borderTop:'1px solid '+V.border}}>
        <div style={{display:'flex',alignItems:'center',gap:5}}><PawIcon size={14} color={V.gold}/><span style={{fontFamily:F,fontSize:12,color:V.textLight,fontWeight:600}}>{pet.breed.split(' ')[0]}</span></div>
        <div style={{display:'flex',alignItems:'center',gap:5}}><span style={{fontSize:12}}>{isCat?'🏠':'🌳'}</span><span style={{fontFamily:F,fontSize:12,color:V.textLight,fontWeight:600}}>{isCat?'Indoor/Outdoor':'Outdoor'}</span></div>
      </div>
    </div>
  </div>);
}

// ═══════════════════════════════════════
// PET DETAIL
// ═══════════════════════════════════════
function PetDetail({pet,isOwner,onBack,onDelete,onEdit}){
  const[photoIdx,setPhotoIdx]=useState(0);const[confirmDel,setConfirmDel]=useState(false);const[deleting,setDeleting]=useState(false);
  const photos=pet.photo_urls||[];const isCat=pet.type==='cat';
  const waLink=(pet.whatsapp_link||'#')+'?text='+encodeURIComponent('Hi! I\'m reaching out about your pet "'+pet.name+'" from PawPrint Villanova.');
  const handleDelete=async()=>{setDeleting(true);try{const{error}=await supabase.from('pets').delete().eq('id',pet.id);if(error)throw error;onDelete(pet.id);}catch(err){alert('Failed: '+err.message);setDeleting(false);}};

  return(<div style={{animation:'fadeIn 0.3s ease'}}>
    <button type="button" onClick={onBack} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,color:V.gold,fontFamily:F,fontWeight:700,fontSize:14,padding:0,marginBottom:16}}>← Back to registry</button>
    <div style={{background:V.cardBg,borderRadius:16,overflow:'hidden',border:'1px solid '+V.border,boxShadow:'0 8px 30px rgba(26,31,58,0.08)'}}>
      {photos.length>0?(<div style={{position:'relative'}}><img src={photos[photoIdx]} alt={pet.name} style={{width:'100%',height:300,objectFit:'cover',display:'block'}}/>{photos.length>1&&<div style={{position:'absolute',bottom:14,left:'50%',transform:'translateX(-50%)',display:'flex',gap:6}}>{photos.map((_,i)=><button type="button" key={i} onClick={()=>setPhotoIdx(i)} style={{width:i===photoIdx?24:10,height:10,borderRadius:5,background:i===photoIdx?'white':'rgba(255,255,255,0.5)',border:'none',cursor:'pointer'}}/>)}</div>}</div>
      ):(<div style={{height:200,background:'linear-gradient(135deg,'+V.navyLight+','+V.navy+')',display:'flex',alignItems:'center',justifyContent:'center'}}>{isCat?<CatSvg size={90}/>:<DogSvg size={90}/>}</div>)}
      <div style={{padding:'24px 28px 28px'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
          <span style={{background:isCat?V.gold:V.accent,color:'white',padding:'5px 14px',borderRadius:6,fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:1,fontFamily:F}}>{isCat?'🐱 Cat':'🐶 Dog'}</span>
          <span style={{fontSize:14,color:V.textLight,fontFamily:F,fontWeight:600}}>{pet.breed}</span>
        </div>
        <h2 style={{margin:'8px 0 0',fontSize:30,fontFamily:FD,color:V.navy,fontWeight:600}}>{pet.name}</h2>
        {pet.description&&<p style={{margin:'14px 0 0',fontSize:15,color:V.textLight,fontFamily:F,lineHeight:1.7}}>{pet.description}</p>}
        {!isOwner&&(<>
          <div style={{marginTop:24,padding:16,background:'rgba(45,138,110,0.05)',borderRadius:12,border:'1px solid rgba(45,138,110,0.12)',display:'flex',alignItems:'center',gap:10}}><span style={{color:V.accent,flexShrink:0}}><ShieldIcon size={18}/></span><p style={{margin:0,fontSize:13,fontFamily:F,color:V.accent,lineHeight:1.5}}>Owner details are private. Tap below to reach them on WhatsApp.</p></div>
          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,padding:'15px 28px',borderRadius:12,background:V.whatsapp,color:'white',textDecoration:'none',fontFamily:F,fontWeight:800,fontSize:16,marginTop:16,boxShadow:'0 4px 16px rgba(37,211,102,0.3)',letterSpacing:0.3}}><WAIcon size={20}/> Contact Owner via WhatsApp</a>
        </>)}
        {isOwner&&(<div style={{marginTop:24,padding:18,background:'rgba(201,168,76,0.08)',borderRadius:12,border:'1px solid rgba(201,168,76,0.2)'}}>
          <p style={{margin:'0 0 14px',fontFamily:F,fontSize:13,fontWeight:700,color:V.goldDark}}>🔑 Your pet — manage this listing</p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <button type="button" onClick={onEdit} style={{flex:1,padding:'10px 18px',borderRadius:8,border:'none',background:V.navy,color:'white',fontFamily:F,fontWeight:700,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}><EditIcon/> Edit</button>
            {!confirmDel?(<button type="button" onClick={()=>setConfirmDel(true)} style={{flex:1,padding:'10px 18px',borderRadius:8,background:'transparent',color:V.danger,border:'1.5px solid '+V.danger,fontFamily:F,fontWeight:700,fontSize:14,cursor:'pointer'}}>Remove</button>
            ):(<div style={{display:'flex',gap:8}}><button type="button" onClick={handleDelete} disabled={deleting} style={{padding:'8px 16px',borderRadius:8,background:V.danger,color:'white',border:'none',fontFamily:F,fontWeight:700,fontSize:13,cursor:'pointer',opacity:deleting?0.6:1}}>{deleting?'Removing...':'Confirm'}</button><button type="button" onClick={()=>setConfirmDel(false)} style={{padding:'8px 16px',borderRadius:8,background:'white',color:V.text,border:'1px solid '+V.border,fontFamily:F,fontSize:13,cursor:'pointer'}}>Cancel</button></div>)}
          </div>
        </div>)}
      </div>
    </div>
  </div>);
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function App(){
  const[user,setUser]=useState(null);const[pets,setPets]=useState([]);const[view,setView]=useState('browse');const[selectedPet,setSelectedPet]=useState(null);const[editPet,setEditPet]=useState(null);const[tab,setTab]=useState('all');const[search,setSearch]=useState('');const[page,setPage]=useState('browse');const[toast,setToast]=useState(null);const[loading,setLoading]=useState(true);const[checkingAuth,setCheckingAuth]=useState(true);
  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(null),3000);};

  // Check existing session
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{if(session?.user){const u=session.user;setUser({id:u.id,phone:u.phone||'',name:u.user_metadata?.display_name||'PawPrint User',address:u.user_metadata?.address||null});}setCheckingAuth(false);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((ev,session)=>{if(ev==='SIGNED_OUT')setUser(null);});
    return()=>subscription.unsubscribe();
  },[]);

  const loadPets=async()=>{setLoading(true);try{const{data,error}=await supabase.from('pets_public').select('*').order('created_at',{ascending:false});if(error)throw error;setPets(data||[]);}catch(err){console.error(err);}setLoading(false);};
  useEffect(()=>{if(user)loadPets();},[user]);

  const handleSignOut=async()=>{await supabase.auth.signOut();setUser(null);setPets([]);setView('browse');setPage('browse');};
  const handleDeleteAccount=async()=>{try{await supabase.from('pets').delete().eq('owner_id',user.id);await supabase.auth.signOut();setUser(null);setPets([]);}catch(err){alert('Failed: '+err.message);}};

  if(checkingAuth)return(<div style={{minHeight:'100vh',background:V.navy,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}><PawIcon size={40} color={V.gold}/><p style={{fontFamily:F,color:'rgba(255,255,255,0.5)',fontSize:14}}>Loading PawPrint...</p></div>);
  if(!user)return <AuthScreen onLogin={setUser}/>;

  const myPets=pets.filter(p=>p.owner_id===user.id);
  const handlePetSaved=()=>{loadPets();setView('browse');setEditPet(null);showToast(editPet?'Updated!':'Pet registered! 🎉');};
  const handleDelete=id=>{setPets(p=>p.filter(x=>x.id!==id));setSelectedPet(null);setView('browse');showToast('Listing removed');};
  const filtered=pets.filter(p=>{if(tab!=='all'&&p.type!==tab)return false;if(search){const q=search.toLowerCase();return p.name.toLowerCase().includes(q)||p.breed.toLowerCase().includes(q)||(p.description||'').toLowerCase().includes(q);}return true;});

  return(<div>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Nunito+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
    <style dangerouslySetInnerHTML={{__html:`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}body{margin:0}`}}/>
    <div style={{minHeight:'100vh',background:V.cream}}>
      {/* Header */}
      <div style={{background:V.navy,padding:'0 20px',position:'sticky',top:0,zIndex:40}}>
        <div style={{maxWidth:640,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',height:60}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <PawIcon size={20} color={V.gold}/>
            <div><span style={{fontFamily:FD,fontSize:18,color:'white',fontWeight:600,display:'block',lineHeight:1.1}}>PawPrint</span><span style={{fontFamily:F,fontSize:9,color:V.gold,fontWeight:800,textTransform:'uppercase',letterSpacing:2}}>Villanova</span></div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontFamily:F,fontSize:12,color:'rgba(255,255,255,0.7)',fontWeight:600}}>{user.name}</span>
            <button type="button" onClick={()=>{setView('settings');setPage('browse');}} style={{background:'rgba(255,255,255,0.08)',border:'none',borderRadius:6,padding:'6px 8px',color:V.gold,cursor:'pointer',display:'flex',alignItems:'center'}}><GearIcon size={15}/></button>
            <button type="button" onClick={handleSignOut} style={{background:'rgba(201,168,76,0.15)',border:'none',borderRadius:6,padding:'6px 14px',color:V.gold,fontFamily:F,fontSize:11,fontWeight:700,cursor:'pointer'}}>Sign Out</button>
          </div>
        </div>
      </div>

      {/* Nav */}
      {view!=='settings'&&(<div style={{background:'white',borderBottom:'1px solid '+V.border,position:'sticky',top:60,zIndex:39}}>
        <div style={{maxWidth:640,margin:'0 auto',display:'flex'}}>
          {[{k:'browse',l:'🏠 Browse All'},{k:'myPets',l:'🐾 My Pets ('+myPets.length+')'}].map(t=>(<button type="button" key={t.k} onClick={()=>{setPage(t.k);setView('browse');setSelectedPet(null);setEditPet(null);}} style={{flex:1,padding:'14px 10px',border:'none',cursor:'pointer',fontFamily:F,fontSize:13,fontWeight:700,background:page===t.k?'white':'transparent',color:page===t.k?V.navy:V.textLight,borderBottom:page===t.k?'3px solid '+V.gold:'3px solid transparent'}}>{t.l}</button>))}
        </div>
      </div>)}

      <div style={{maxWidth:640,margin:'0 auto',padding:'20px 16px 90px'}}>
        {view==='settings'&&<AccountSettings user={user} onUpdate={u=>{setUser(u);showToast('Saved!');}} onDelete={handleDeleteAccount} onBack={()=>setView('browse')}/>}
        {view==='register'&&<PetForm user={user} onSubmit={handlePetSaved} onCancel={()=>setView('browse')} submitLabel="Register Pet"/>}
        {view==='edit'&&editPet&&<PetForm initial={editPet} user={user} onSubmit={handlePetSaved} onCancel={()=>{setEditPet(null);setView('browse');}} submitLabel="Save Changes"/>}
        {view==='detail'&&selectedPet&&<PetDetail pet={selectedPet} isOwner={selectedPet.owner_id===user.id} onBack={()=>{setSelectedPet(null);setView('browse');}} onDelete={handleDelete} onEdit={()=>{setEditPet(selectedPet);setView('edit');}}/>}

        {view==='browse'&&page==='browse'&&(<div style={{animation:'fadeIn 0.3s ease'}}>
          {/* Hero stats */}
          <div style={{background:'linear-gradient(135deg,'+V.navy+' 0%,'+V.navyLight+' 100%)',borderRadius:16,padding:'28px 24px',marginBottom:20,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,opacity:0.04,backgroundImage:'radial-gradient(circle, '+V.gold+' 1px, transparent 1px)',backgroundSize:'30px 30px'}}/>
            <div style={{position:'relative'}}>
              <h2 style={{margin:'0 0 4px',fontFamily:FD,fontSize:24,color:'white',fontWeight:600}}>Villanova Pet Registry</h2>
              <p style={{margin:'0 0 16px',fontFamily:F,fontSize:13,color:'rgba(255,255,255,0.5)'}}>Browse registered pets in our community</p>
              <div style={{display:'flex',gap:10}}>
                {[{n:pets.length,l:'Registered',bg:'rgba(255,255,255,0.08)',c:'white'},{n:pets.filter(p=>p.type==='cat').length,l:'Cats',bg:'rgba(201,168,76,0.15)',c:V.goldLight},{n:pets.filter(p=>p.type==='dog').length,l:'Dogs',bg:'rgba(45,138,110,0.15)',c:'#7ddfbe'}].map((s,i)=>(<div key={i} style={{flex:1,background:s.bg,borderRadius:10,padding:'12px 10px',textAlign:'center'}}><div style={{fontSize:22,fontWeight:800,fontFamily:F,color:s.c}}>{s.n}</div><div style={{fontSize:10,color:'rgba(255,255,255,0.5)',fontFamily:F,fontWeight:700,textTransform:'uppercase',letterSpacing:1}}>{s.l}</div></div>))}
              </div>
            </div>
          </div>

          {/* Search + filter */}
          <div style={{display:'flex',gap:10,marginBottom:18,flexWrap:'wrap'}}>
            <div style={{flex:1,minWidth:160,position:'relative'}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or breed..." style={{width:'100%',padding:'11px 14px 11px 38px',borderRadius:10,border:'1.5px solid '+V.border,fontSize:14,fontFamily:F,background:'white',outline:'none',boxSizing:'border-box'}}/>
              <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',fontSize:15,opacity:0.35}}>🔍</span>
            </div>
            <div style={{display:'flex',gap:3,background:'white',borderRadius:10,padding:3,border:'1.5px solid '+V.border}}>
              {['all','cat','dog'].map(f=>(<button type="button" key={f} onClick={()=>setTab(f)} style={{padding:'8px 16px',borderRadius:8,border:'none',cursor:'pointer',background:tab===f?V.navy:'transparent',color:tab===f?'white':V.textLight,fontFamily:F,fontSize:13,fontWeight:700}}>{f==='all'?'All':f==='cat'?'🐱 Cats':'🐶 Dogs'}</button>))}
            </div>
          </div>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <h3 style={{margin:0,fontFamily:FD,fontSize:20,color:V.navy,fontWeight:600}}>Registered Pets in Villanova</h3>
            <span style={{fontFamily:F,fontSize:12,color:V.textLight,fontWeight:600}}>{filtered.length} found</span>
          </div>

          {loading?(<div style={{textAlign:'center',padding:'40px 20px'}}><PawIcon size={40} color={V.gold}/><p style={{fontFamily:F,color:V.textLight,fontSize:14,marginTop:12}}>Loading...</p></div>
          ):filtered.length>0?(<div style={{display:'grid',gridTemplateColumns:'repeat(2, 1fr)',gap:16}}>{filtered.map((pet,i)=>(<div key={pet.id} style={{animation:'slideUp 0.3s ease '+(i*0.04)+'s both'}}><PetCard pet={pet} onClick={()=>{setSelectedPet(pet);setView('detail');}}/></div>))}</div>
          ):(<div style={{textAlign:'center',padding:'50px 20px',background:'white',borderRadius:16,border:'1px solid '+V.border}}><CatSvg size={70}/><h3 style={{fontFamily:FD,color:V.navy,marginBottom:4,marginTop:16}}>{pets.length===0?'No pets registered yet':'No pets match'}</h3>{pets.length===0&&<p style={{fontFamily:F,color:V.textLight,fontSize:14}}>Be the first to register!</p>}</div>)}
        </div>)}

        {view==='browse'&&page==='myPets'&&(<div style={{animation:'fadeIn 0.3s ease'}}>
          <h2 style={{margin:'0 0 18px',fontFamily:FD,fontSize:22,color:V.navy,fontWeight:600}}>My Pets</h2>
          {myPets.length>0?(<div style={{display:'flex',flexDirection:'column',gap:14}}>
            {myPets.map(pet=>(<div key={pet.id} style={{background:V.cardBg,borderRadius:14,border:'1px solid '+V.border,padding:16,display:'flex',gap:16,alignItems:'center',cursor:'pointer',transition:'all 0.2s',boxShadow:'0 2px 8px rgba(26,31,58,0.04)'}} onClick={()=>{setSelectedPet(pet);setView('detail');}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 6px 20px rgba(26,31,58,0.1)';}} onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 2px 8px rgba(26,31,58,0.04)';}}>
              <div style={{width:75,height:75,borderRadius:10,overflow:'hidden',background:'linear-gradient(135deg,'+V.navyLight+','+V.navy+')',flexShrink:0}}>
                {(pet.photo_urls&&pet.photo_urls[0])?<img src={pet.photo_urls[0]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>{pet.type==='cat'?<CatSvg size={38}/>:<DogSvg size={38}/>}</div>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h3 style={{margin:0,fontFamily:FD,fontSize:18,color:V.navy,fontWeight:600}}>{pet.name}</h3><span style={{background:pet.type==='cat'?V.gold:V.accent,color:'white',padding:'3px 10px',borderRadius:5,fontSize:10,fontWeight:800,textTransform:'uppercase',fontFamily:F}}>{pet.type}</span></div>
                <p style={{margin:'3px 0',fontSize:12,color:V.textLight,fontFamily:F,fontWeight:600}}>{pet.breed}</p>
                <div style={{display:'flex',gap:8,marginTop:8}}><button type="button" onClick={e=>{e.stopPropagation();setEditPet(pet);setView('edit');}} style={{padding:'5px 14px',borderRadius:6,border:'1px solid '+V.border,background:'white',fontFamily:F,fontSize:11,fontWeight:700,color:V.navy,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}><EditIcon/> Edit</button></div>
              </div>
            </div>))}
          </div>):(<div style={{textAlign:'center',padding:'50px 20px',background:'white',borderRadius:16,border:'1px solid '+V.border}}><PawIcon size={50} color={V.gold}/><h3 style={{fontFamily:FD,color:V.navy,margin:'14px 0 4px'}}>No pets yet</h3><p style={{fontFamily:F,color:V.textLight,fontSize:14}}>Tap below to register your first pet</p></div>)}
        </div>)}

        {view==='browse'&&(<button type="button" onClick={()=>setView('register')} style={{position:'fixed',bottom:24,right:24,height:56,borderRadius:28,background:'linear-gradient(135deg,'+V.gold+','+V.goldDark+')',color:V.navy,border:'none',cursor:'pointer',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'0 24px 0 18px',boxShadow:'0 6px 24px rgba(201,168,76,0.4)',zIndex:50,fontFamily:F,fontWeight:800}}><span style={{fontSize:22,lineHeight:1}}>+</span> Add Pet</button>)}
      </div>

      {toast&&(<div style={{position:'fixed',bottom:90,left:'50%',transform:'translateX(-50%)',background:V.navy,color:'white',padding:'12px 24px',borderRadius:12,fontFamily:F,fontSize:14,fontWeight:700,zIndex:100,animation:'toastIn 0.3s ease',boxShadow:'0 6px 20px rgba(26,31,58,0.25)',whiteSpace:'nowrap',border:'1px solid rgba(201,168,76,0.3)'}}>{toast}</div>)}
    </div>
  </div>);
}
