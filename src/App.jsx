import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { BREED_OPTIONS } from './breeds';

const C = {
  bg:'#faf6f1',card:'#fff',primary:'#b45309',primaryLight:'#fbbf24',
  primaryDark:'#78350f',accent:'#059669',text:'#1c1917',
  textMuted:'#78716c',border:'#e7e0d8',danger:'#dc2626',
  whatsapp:'#25D366',surface:'#f5ede4',
};
const F="'DM Sans', sans-serif";
const FD="'Playfair Display', serif";

// ── Icons ──
const PawIcon=({size=20,color='currentColor'})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <ellipse cx="8" cy="6" rx="2.2" ry="2.8"/><ellipse cx="16" cy="6" rx="2.2" ry="2.8"/>
    <ellipse cx="4.5" cy="11" rx="2" ry="2.5"/><ellipse cx="19.5" cy="11" rx="2" ry="2.5"/>
    <path d="M12 22c-4 0-7-3.5-7-6.5S9 10 12 10s7 2 7 5.5S16 22 12 22z"/>
  </svg>
);
const WAIcon=({size=18})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const ShieldIcon=({size=16})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
  </svg>
);
const CatSvg=({size=40})=>(
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M14 8L10 28H18L14 8Z" fill={C.primary} opacity="0.7"/><path d="M50 8L54 28H46L50 8Z" fill={C.primary} opacity="0.7"/>
    <ellipse cx="32" cy="38" rx="18" ry="16" fill={C.primary} opacity="0.6"/>
    <circle cx="25" cy="34" r="3" fill="white"/><circle cx="39" cy="34" r="3" fill="white"/>
    <circle cx="25.5" cy="34.5" r="1.5" fill={C.primaryDark}/><circle cx="39.5" cy="34.5" r="1.5" fill={C.primaryDark}/>
    <ellipse cx="32" cy="40" rx="2" ry="1.2" fill={C.primaryDark}/>
  </svg>
);
const DogSvg=({size=40})=>(
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <ellipse cx="14" cy="24" rx="8" ry="14" fill={C.primary} opacity="0.5" transform="rotate(-15 14 24)"/>
    <ellipse cx="50" cy="24" rx="8" ry="14" fill={C.primary} opacity="0.5" transform="rotate(15 50 24)"/>
    <ellipse cx="32" cy="36" rx="18" ry="16" fill={C.primary} opacity="0.6"/>
    <circle cx="25" cy="32" r="3" fill="white"/><circle cx="39" cy="32" r="3" fill="white"/>
    <circle cx="25.5" cy="32.5" r="1.5" fill={C.primaryDark}/><circle cx="39.5" cy="32.5" r="1.5" fill={C.primaryDark}/>
    <ellipse cx="32" cy="39" rx="4" ry="2.5" fill={C.primaryDark}/>
  </svg>
);
const EditIcon=()=>(
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const GearIcon=({size=20})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

// ── Shared Components ──
function Btn({children,onClick,style,disabled}){
  return <button type="button" onClick={onClick} disabled={disabled} style={{border:'none',cursor:disabled?'default':'pointer',fontFamily:F,fontWeight:600,fontSize:14,borderRadius:10,padding:'10px 18px',transition:'all 0.15s',...style}}>{children}</button>;
}
function Input({label,value,onChange,placeholder,required,type,maxLength,note}){
  return(
    <div>
      {label&&<label style={{display:'block',marginBottom:4,fontWeight:600,color:C.text,fontFamily:F,fontSize:14}}>{label} {required&&<span style={{color:C.danger}}>*</span>}</label>}
      <input type={type||'text'} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
        style={{width:'100%',padding:'10px 14px',borderRadius:10,border:'1.5px solid '+C.border,fontSize:15,fontFamily:F,background:'white',color:C.text,outline:'none',boxSizing:'border-box'}}
        onFocus={e=>{e.target.style.borderColor=C.primary}} onBlur={e=>{e.target.style.borderColor=C.border}}/>
      {note&&<p style={{margin:'3px 0 0',fontSize:11,color:C.textMuted,fontFamily:F}}>{note}</p>}
    </div>
  );
}
function TextArea({label,value,onChange,placeholder,maxLength}){
  return(
    <div>
      {label&&<label style={{display:'block',marginBottom:4,fontWeight:600,color:C.text,fontFamily:F,fontSize:14}}>{label}</label>}
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} rows={3}
        style={{width:'100%',padding:'10px 14px',borderRadius:10,border:'1.5px solid '+C.border,fontSize:15,fontFamily:F,background:'white',color:C.text,outline:'none',boxSizing:'border-box',resize:'vertical',minHeight:70}}
        onFocus={e=>{e.target.style.borderColor=C.primary}} onBlur={e=>{e.target.style.borderColor=C.border}}/>
      {maxLength&&<div style={{textAlign:'right',fontSize:11,color:C.textMuted,marginTop:2}}>{value.length}/{maxLength}</div>}
    </div>
  );
}
function BreedSelect({label,value,onChange,options,required,placeholder,disabled}){
  const[open,setOpen]=useState(false);
  const[q,setQ]=useState('');
  const ref=useRef(null);
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);
  },[]);
  const fil=options.filter(o=>o.toLowerCase().includes(q.toLowerCase()));
  return(
    <div ref={ref} style={{position:'relative'}}>
      {label&&<label style={{display:'block',marginBottom:4,fontWeight:600,color:C.text,fontFamily:F,fontSize:14}}>{label} {required&&<span style={{color:C.danger}}>*</span>}</label>}
      <button type="button" onClick={()=>!disabled&&setOpen(!open)} disabled={disabled} style={{
        width:'100%',padding:'10px 14px',borderRadius:10,border:'1.5px solid '+C.border,fontSize:15,fontFamily:F,
        background:disabled?C.surface:'white',color:value?C.text:C.textMuted,textAlign:'left',cursor:disabled?'default':'pointer',
        boxSizing:'border-box',display:'flex',justifyContent:'space-between',alignItems:'center'
      }}>
        <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{value||placeholder||'Select...'}</span>
        <span style={{fontSize:10,opacity:0.5}}>▼</span>
      </button>
      {open&&(
        <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:50,background:'white',borderRadius:12,border:'1.5px solid '+C.border,boxShadow:'0 8px 30px rgba(0,0,0,0.15)',marginTop:4,maxHeight:260,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'8px 10px',borderBottom:'1px solid '+C.border}}>
            <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search breeds..." style={{width:'100%',padding:'8px 10px',borderRadius:8,border:'1px solid '+C.border,fontSize:14,fontFamily:F,outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{overflowY:'auto',maxHeight:200}}>
            {fil.length===0&&<div style={{padding:'14px 16px',color:C.textMuted,fontSize:13,fontFamily:F}}>No breeds found</div>}
            {fil.map(o=>(
              <button type="button" key={o} onClick={()=>{onChange(o);setOpen(false);setQ('');}} style={{width:'100%',padding:'10px 16px',border:'none',background:o===value?C.surface:'white',textAlign:'left',cursor:'pointer',fontSize:14,fontFamily:F,color:C.text,borderBottom:'0.5px solid '+C.border}}>{o}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function compressImage(dataUrl,maxSize=800){
  return new Promise(resolve=>{
    const img=new Image();
    img.onload=()=>{
      let w=img.width,h=img.height;
      if(w>maxSize||h>maxSize){if(w>h){h=Math.round(h*maxSize/w);w=maxSize;}else{w=Math.round(w*maxSize/h);h=maxSize;}}
      const canvas=document.createElement('canvas');
      canvas.width=w;canvas.height=h;
      canvas.getContext('2d').drawImage(img,0,0,w,h);
      resolve(canvas.toDataURL('image/jpeg',0.7));
    };
    img.src=dataUrl;
  });
}

function PhotoUploader({photos,setPhotos}){
  const fileRef=useRef(null);
  const handleAdd=async e=>{
    const files=Array.from(e.target.files).slice(0,3-photos.length);
    for(const file of files){
      const reader=new FileReader();
      const dataUrl=await new Promise(res=>{reader.onload=ev=>res(ev.target.result);reader.readAsDataURL(file);});
      const compressed=await compressImage(dataUrl);
      setPhotos(p=>p.length>=3?p:[...p,compressed]);
    }
    e.target.value='';
  };
  return(
    <div>
      <label style={{display:'block',marginBottom:6,fontWeight:600,color:C.text,fontFamily:F}}>Photos ({photos.length}/3) <span style={{color:C.danger}}>*</span></label>
      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
        {photos.map((p,i)=>(
          <div key={i} style={{position:'relative',width:96,height:96,borderRadius:12,overflow:'hidden',border:'2px solid '+C.border}}>
            <img src={p} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            <button type="button" onClick={()=>setPhotos(prev=>prev.filter((_,j)=>j!==i))} style={{position:'absolute',top:4,right:4,width:22,height:22,borderRadius:'50%',background:C.danger,color:'white',border:'none',cursor:'pointer',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>×</button>
          </div>
        ))}
        {photos.length<3&&(
          <button type="button" onClick={()=>fileRef.current&&fileRef.current.click()} style={{width:96,height:96,borderRadius:12,border:'2px dashed '+C.border,background:C.surface,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,color:C.textMuted,fontSize:12,fontFamily:F}}>
            <span style={{fontSize:24,lineHeight:1}}>+</span><span>Add photo</span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleAdd} style={{display:'none'}}/>
    </div>
  );
}

// ═══════════════════════════════════════════
// AUTH SCREEN — Real Supabase Phone Auth
// ═══════════════════════════════════════════
function AuthScreen({onLogin}){
  const[mode,setMode]=useState('signup');
  const[step,setStep]=useState('phone');
  const[phone,setPhone]=useState('');
  const[otp,setOtp]=useState('');
  const[name,setName]=useState('');
  const[address,setAddress]=useState('');
  const[error,setError]=useState('');
  const[sending,setSending]=useState(false);

  // Format phone: ensure it starts with +
  const formatPhone=()=>{
    let p=phone.trim();
    if(!p.startsWith('+'))p='+'+p;
    return p.replace(/\s/g,'');
  };

  const sendOtp=async()=>{
    const digits=phone.replace(/[^0-9]/g,'');
    if(digits.length<8){setError('Enter a valid WhatsApp number with country code');return;}
    if(mode==='signup'&&!name.trim()){setError('Enter your name');return;}
    setError('');setSending(true);
    try{
      const formattedPhone=formatPhone();
      const{error:authError}=await supabase.auth.signInWithOtp({phone:formattedPhone});
      if(authError)throw authError;
      setStep('otp');
    }catch(err){
      setError(err.message||'Failed to send code. Check your number and try again.');
    }
    setSending(false);
  };

  const verifyOtp=async()=>{
    if(otp.length<4){setError('Enter the verification code');return;}
    setError('');setSending(true);
    try{
      const formattedPhone=formatPhone();
      const{data,error:authError}=await supabase.auth.verifyOtp({phone:formattedPhone,token:otp,type:'sms'});
      if(authError)throw authError;

      // Store name and address in user metadata
      if(name.trim()){
        await supabase.auth.updateUser({data:{display_name:name.trim(),address:address.trim()||null}});
      }

      const session=data.session;
      const user=session?.user;
      if(user){
        onLogin({
          id:user.id,
          phone:user.phone||formattedPhone,
          name:user.user_metadata?.display_name||name.trim()||'PawPrint User',
          address:user.user_metadata?.address||address.trim()||null,
        });
      }
    }catch(err){
      setError(err.message||'Invalid code. Please try again.');
    }
    setSending(false);
  };

  return(
    <div style={{minHeight:'100vh',background:C.bg,display:'flex',flexDirection:'column'}}>
      <div style={{background:'linear-gradient(135deg,'+C.primaryDark+' 0%,'+C.primary+' 50%,#d97706 100%)',padding:'40px 20px 32px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-20,left:-20,opacity:0.08}}><PawIcon size={120} color="white"/></div>
        <div style={{position:'relative'}}>
          <PawIcon size={32} color="white"/>
          <h1 style={{margin:'8px 0 0',fontFamily:FD,fontSize:26,color:'white',fontWeight:700}}>PawPrint</h1>
          <p style={{margin:'6px 0 0',fontFamily:F,fontSize:13,color:'rgba(255,255,255,0.75)'}}>Every pet has a story. Know theirs.</p>
        </div>
      </div>
      <div style={{flex:1,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'30px 20px'}}>
        <div style={{width:'100%',maxWidth:400,background:C.card,borderRadius:20,padding:'28px 24px',border:'1.5px solid '+C.border,boxShadow:'0 4px 16px rgba(0,0,0,0.06)'}}>
          <div style={{display:'flex',background:C.surface,borderRadius:12,padding:3,marginBottom:20}}>
            {[{k:'signup',l:'Sign Up'},{k:'login',l:'Log In'}].map(m=>(
              <button type="button" key={m.k} onClick={()=>{setMode(m.k);setStep('phone');setError('');setOtp('');}} style={{
                flex:1,padding:'10px',borderRadius:10,border:'none',cursor:'pointer',fontFamily:F,fontSize:14,fontWeight:600,
                background:mode===m.k?'white':'transparent',color:mode===m.k?C.primary:C.textMuted,
                boxShadow:mode===m.k?'0 1px 4px rgba(0,0,0,0.08)':'none',transition:'all 0.2s'
              }}>{m.l}</button>
            ))}
          </div>

          {step==='phone'?(
            <>
              <div style={{textAlign:'center',marginBottom:20}}>
                <div style={{width:56,height:56,borderRadius:28,background:C.whatsapp,display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:12}}>
                  <WAIcon size={28}/>
                </div>
                <h2 style={{margin:'0 0 4px',fontFamily:FD,fontSize:22,color:C.text}}>{mode==='signup'?'Create Your Account':'Welcome Back'}</h2>
                <p style={{margin:0,fontFamily:F,fontSize:13,color:C.textMuted}}>{mode==='signup'?'Sign up with your WhatsApp number':'Log in with your WhatsApp number'}</p>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                {mode==='signup'&&(
                  <>
                    <Input label="Your Name" value={name} onChange={setName} placeholder="e.g. Ahmed, Sarah" required/>
                    <Input label="Address" value={address} onChange={setAddress} placeholder="Optional — helps admins if needed" note="Never shown publicly."/>
                  </>
                )}
                <Input label="WhatsApp Number" value={phone} onChange={setPhone} placeholder="e.g. +971 50 123 4567" required type="tel" note="Include country code. This is also your contact number for pet listings."/>
                {error&&<p style={{margin:0,fontSize:12,color:C.danger,fontFamily:F}}>{error}</p>}
                <Btn onClick={sendOtp} disabled={sending} style={{width:'100%',background:C.whatsapp,color:'white',fontSize:16,padding:'14px 24px',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:sending?0.7:1}}>
                  <WAIcon size={18}/> {sending?'Sending code...':(mode==='signup'?'Send Verification Code':'Send Login Code')}
                </Btn>
              </div>
              <div style={{marginTop:16,padding:'10px 14px',background:'#ecfdf5',borderRadius:10,border:'1px solid #a7f3d0',display:'flex',gap:8,alignItems:'flex-start'}}>
                <span style={{color:C.accent,marginTop:1,flexShrink:0}}><ShieldIcon size={14}/></span>
                <p style={{margin:0,fontFamily:F,fontSize:11,color:'#065f46',lineHeight:1.5}}>Your number is only used for login and the WhatsApp contact button. It's never displayed publicly.</p>
              </div>
            </>
          ):(
            <>
              <div style={{textAlign:'center',marginBottom:20}}>
                <h2 style={{margin:'0 0 4px',fontFamily:FD,fontSize:22,color:C.text}}>Enter Verification Code</h2>
                <p style={{margin:0,fontFamily:F,fontSize:13,color:C.textMuted}}>Sent to {phone}</p>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <Input label="6-Digit Code" value={otp} onChange={setOtp} placeholder="e.g. 123456" required maxLength={6}/>
                {error&&<p style={{margin:0,fontSize:12,color:C.danger,fontFamily:F}}>{error}</p>}
                <Btn onClick={verifyOtp} disabled={sending} style={{width:'100%',background:'linear-gradient(135deg,'+C.primary+','+C.primaryDark+')',color:'white',fontSize:16,padding:'14px 24px',borderRadius:12,opacity:sending?0.7:1}}>
                  {sending?'Verifying...':(mode==='signup'?'Create Account & Sign In':'Log In')}
                </Btn>
                <button type="button" onClick={()=>{setStep('phone');setOtp('');setError('');}} style={{background:'none',border:'none',color:C.primary,fontFamily:F,fontSize:13,cursor:'pointer',fontWeight:600}}>← Change number</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ACCOUNT SETTINGS
// ═══════════════════════════════════════════
function AccountSettings({user,onUpdate,onDelete,onBack}){
  const[name,setName]=useState(user.name||'');
  const[address,setAddress]=useState(user.address||'');
  const[confirmDelete,setConfirmDelete]=useState(false);
  const[saved,setSaved]=useState(false);
  const[saving,setSaving]=useState(false);

  const handleSave=async()=>{
    if(!name.trim()){alert('Name is required');return;}
    setSaving(true);
    try{
      await supabase.auth.updateUser({data:{display_name:name.trim(),address:address.trim()||null}});
      onUpdate({...user,name:name.trim(),address:address.trim()||null});
      setSaved(true);
      setTimeout(()=>setSaved(false),3000);
    }catch(err){alert('Failed to save: '+err.message);}
    setSaving(false);
  };

  return(
    <div style={{animation:'fadeIn 0.3s ease'}}>
      <button type="button" onClick={onBack} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,color:C.primary,fontFamily:F,fontWeight:600,fontSize:14,padding:0,marginBottom:16}}>← Back</button>
      <div style={{background:C.card,borderRadius:20,padding:'28px 24px',border:'1.5px solid '+C.border,boxShadow:'0 4px 16px rgba(0,0,0,0.06)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
          <div style={{width:44,height:44,borderRadius:22,background:C.surface,display:'flex',alignItems:'center',justifyContent:'center'}}><GearIcon size={22}/></div>
          <div>
            <h2 style={{margin:0,fontFamily:FD,fontSize:22,color:C.text}}>Account Settings</h2>
            <p style={{margin:0,fontFamily:F,fontSize:12,color:C.textMuted}}>Manage your profile</p>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <Input label="Your Name" value={name} onChange={setName} placeholder="Your display name" required/>
          <Input label="Address" value={address} onChange={setAddress} placeholder="Optional — never shown publicly" note="Stored privately. Helps admins contact you if needed."/>

          <div style={{padding:'12px 14px',background:C.surface,borderRadius:10}}>
            <p style={{margin:0,fontFamily:F,fontSize:13,color:C.text}}><strong>WhatsApp:</strong> {user.phone}</p>
            <p style={{margin:'4px 0 0',fontFamily:F,fontSize:11,color:C.textMuted}}>To change your number, sign out and create a new account with your new number.</p>
          </div>

          <Btn onClick={handleSave} disabled={saving} style={{width:'100%',padding:'14px 24px',borderRadius:12,background:'linear-gradient(135deg,'+C.primary+','+C.primaryDark+')',color:'white',fontSize:16,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:saving?0.7:1}}>
            {saving?'Saving...':'Save Changes'}
          </Btn>

          {saved&&(
            <div style={{padding:'10px 14px',background:'#ecfdf5',borderRadius:10,border:'1px solid #a7f3d0',fontFamily:F,fontSize:13,color:'#065f46',textAlign:'center'}}>
              ✅ Settings saved!
            </div>
          )}

          <div style={{borderTop:'1px solid '+C.border,paddingTop:16,marginTop:8}}>
            <h3 style={{margin:'0 0 8px',fontFamily:F,fontSize:14,color:C.danger,fontWeight:600}}>Danger Zone</h3>
            <p style={{margin:'0 0 12px',fontFamily:F,fontSize:12,color:C.textMuted}}>Deleting your account removes all your pet listings permanently.</p>
            {!confirmDelete?(
              <Btn onClick={()=>setConfirmDelete(true)} style={{background:'transparent',color:C.danger,border:'1.5px solid '+C.danger,width:'100%',justifyContent:'center'}}>Delete My Account</Btn>
            ):(
              <div style={{padding:14,background:'#fef2f2',borderRadius:12,display:'flex',flexDirection:'column',gap:10}}>
                <p style={{margin:0,fontFamily:F,fontSize:13,color:C.danger,fontWeight:600}}>Are you sure? All your pets will be removed.</p>
                <div style={{display:'flex',gap:10}}>
                  <Btn onClick={onDelete} style={{flex:1,background:C.danger,color:'white',justifyContent:'center'}}>Yes, Delete</Btn>
                  <Btn onClick={()=>setConfirmDelete(false)} style={{flex:1,background:'white',color:C.text,border:'1px solid '+C.border,justifyContent:'center'}}>Cancel</Btn>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PET FORM
// ═══════════════════════════════════════════
function PetForm({initial,user,onSubmit,onCancel,submitLabel}){
  const[type,setType]=useState(initial?.type||'');
  const[breed,setBreed]=useState(initial?.breed||'');
  const[name,setName]=useState(initial?.name||'');
  const[description,setDescription]=useState(initial?.description||'');
  const[photos,setPhotos]=useState(initial?.photo_urls||[]);
  const[errors,setErrors]=useState({});
  const[submitting,setSubmitting]=useState(false);

  const validate=()=>{
    const e={};
    if(!photos.length)e.photos='At least 1 photo required';
    if(!name.trim())e.name='Pet name is required';
    if(!type)e.type='Select cat or dog';
    if(!breed)e.breed='Select a breed';
    setErrors(e);return Object.keys(e).length===0;
  };

  const handleSubmit=async()=>{
    if(!validate()||submitting)return;
    setSubmitting(true);
    try{
      if(initial?.id){
        const{error}=await supabase.from('pets').update({type,breed,name:name.trim(),description:description.trim()||null,photo_urls:photos}).eq('id',initial.id);
        if(error)throw error;
      }else{
        const{error}=await supabase.from('pets').insert({type,breed,name:name.trim(),description:description.trim()||null,owner_id:user.id,whatsapp:user.phone,photo_urls:photos});
        if(error)throw error;
      }
      onSubmit();
    }catch(err){alert('Failed: '+err.message);setSubmitting(false);}
  };

  return(
    <div style={{animation:'fadeIn 0.3s ease'}}>
      <button type="button" onClick={onCancel} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,color:C.primary,fontFamily:F,fontWeight:600,fontSize:14,padding:0,marginBottom:16}}>← Back</button>
      <div style={{background:C.card,borderRadius:20,padding:'28px 24px',border:'1.5px solid '+C.border,boxShadow:'0 4px 16px rgba(0,0,0,0.06)'}}>
        <h2 style={{margin:'0 0 6px',fontFamily:FD,fontSize:22,color:C.text}}>{initial?'Edit Pet':'Register Your Pet'}</h2>
        <p style={{margin:'0 0 20px',fontFamily:F,fontSize:13,color:C.textMuted}}>{initial?"Update your pet's details":'Add your furry friend to PawPrint'}</p>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <PhotoUploader photos={photos} setPhotos={setPhotos}/>
          {errors.photos&&<span style={{color:C.danger,fontSize:12,marginTop:-10,fontFamily:F}}>{errors.photos}</span>}
          <Input label="Pet Name" value={name} onChange={setName} placeholder="e.g. Whiskers, Buddy" required maxLength={40}/>
          {errors.name&&<span style={{color:C.danger,fontSize:12,marginTop:-6,fontFamily:F}}>{errors.name}</span>}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div>
              <label style={{display:'block',marginBottom:4,fontWeight:600,color:C.text,fontFamily:F,fontSize:14}}>Type <span style={{color:C.danger}}>*</span></label>
              <div style={{display:'flex',gap:8}}>
                {['cat','dog'].map(t=>(
                  <button type="button" key={t} onClick={()=>{setType(t);setBreed('');}} style={{flex:1,padding:'10px 8px',borderRadius:10,cursor:'pointer',border:'2px solid '+(type===t?C.primary:C.border),background:type===t?'#fef3c7':'white',fontFamily:F,fontSize:14,fontWeight:600,color:type===t?C.primaryDark:C.textMuted,display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>{t==='cat'?'🐱 Cat':'🐶 Dog'}</button>
                ))}
              </div>
              {errors.type&&<span style={{color:C.danger,fontSize:12,fontFamily:F}}>{errors.type}</span>}
            </div>
            <div>
              <BreedSelect label="Breed" value={breed} onChange={setBreed} options={type?BREED_OPTIONS[type]:[]} required placeholder={type?'Search breeds...':'Pick type first'} disabled={!type}/>
              {errors.breed&&<span style={{color:C.danger,fontSize:12,fontFamily:F}}>{errors.breed}</span>}
            </div>
          </div>
          <TextArea label="Description" value={description} onChange={setDescription} placeholder="Colour, markings, personality..." maxLength={300}/>
          <Btn onClick={handleSubmit} disabled={submitting} style={{width:'100%',padding:'14px 24px',borderRadius:12,background:submitting?C.textMuted:'linear-gradient(135deg,'+C.primary+','+C.primaryDark+')',color:'white',fontSize:16,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:'0 4px 12px rgba(180,83,9,0.25)',marginTop:4}}>
            <PawIcon size={16} color="white"/> {submitting?'Saving...':(submitLabel||'Register Pet')}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PET CARD + DETAIL
// ═══════════════════════════════════════════
function PetCard({pet,onClick}){
  const photo=(pet.photo_urls&&pet.photo_urls[0])||null;
  return(
    <div onClick={onClick} style={{background:C.card,borderRadius:16,overflow:'hidden',cursor:'pointer',border:'1.5px solid '+C.border,transition:'all 0.25s',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)';}}
      onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)';}}>
      <div style={{position:'relative',paddingTop:'75%',background:C.surface}}>
        {photo?<img src={photo} alt={pet.name} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover'}}/>:
          <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>{pet.type==='cat'?<CatSvg size={56}/>:<DogSvg size={56}/>}</div>}
        <span style={{position:'absolute',top:8,right:8,background:pet.type==='cat'?'#fef3c7':'#dbeafe',color:pet.type==='cat'?'#92400e':'#1e40af',padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:0.5,fontFamily:F}}>{pet.type==='cat'?'🐱':'🐶'} {pet.type}</span>
      </div>
      <div style={{padding:'12px 14px'}}>
        <h3 style={{margin:0,fontSize:17,fontFamily:FD,color:C.text}}>{pet.name}</h3>
        <p style={{margin:'3px 0 0',fontSize:12,color:C.textMuted,fontFamily:F}}>{pet.breed}</p>
        {pet.description&&<p style={{margin:'6px 0 0',fontSize:13,color:C.textMuted,fontFamily:F,lineHeight:1.4,overflow:'hidden',textOverflow:'ellipsis',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{pet.description}</p>}
      </div>
    </div>
  );
}

function PetDetail({pet,isOwner,onBack,onDelete,onEdit}){
  const[photoIdx,setPhotoIdx]=useState(0);
  const[confirmDelete,setConfirmDelete]=useState(false);
  const[deleting,setDeleting]=useState(false);
  const photos=pet.photo_urls||[];
  const waLink=pet.whatsapp_link?pet.whatsapp_link+'?text='+encodeURIComponent('Hi! I\'m reaching out about your pet "'+pet.name+'" from PawPrint Villanova.'):'#';

  const handleDelete=async()=>{
    setDeleting(true);
    try{const{error}=await supabase.from('pets').delete().eq('id',pet.id);if(error)throw error;onDelete(pet.id);}
    catch(err){alert('Failed: '+err.message);setDeleting(false);}
  };

  return(
    <div style={{animation:'fadeIn 0.3s ease'}}>
      <button type="button" onClick={onBack} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,color:C.primary,fontFamily:F,fontWeight:600,fontSize:14,padding:0,marginBottom:16}}>← Back</button>
      <div style={{background:C.card,borderRadius:20,overflow:'hidden',border:'1.5px solid '+C.border,boxShadow:'0 4px 16px rgba(0,0,0,0.06)'}}>
        {photos.length>0?(
          <div style={{position:'relative'}}>
            <img src={photos[photoIdx]} alt={pet.name} style={{width:'100%',height:280,objectFit:'cover',display:'block'}}/>
            {photos.length>1&&<div style={{position:'absolute',bottom:12,left:'50%',transform:'translateX(-50%)',display:'flex',gap:6}}>
              {photos.map((_,i)=><button type="button" key={i} onClick={()=>setPhotoIdx(i)} style={{width:i===photoIdx?24:10,height:10,borderRadius:5,background:i===photoIdx?'white':'rgba(255,255,255,0.5)',border:'none',cursor:'pointer'}}/>)}
            </div>}
          </div>
        ):(
          <div style={{height:180,background:C.surface,display:'flex',alignItems:'center',justifyContent:'center'}}>{pet.type==='cat'?<CatSvg size={80}/>:<DogSvg size={80}/>}</div>
        )}
        <div style={{padding:'20px 24px 24px'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
            <span style={{background:pet.type==='cat'?'#fef3c7':'#dbeafe',color:pet.type==='cat'?'#92400e':'#1e40af',padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:700,textTransform:'uppercase',fontFamily:F}}>{pet.type==='cat'?'🐱':'🐶'} {pet.type}</span>
            <span style={{fontSize:13,color:C.textMuted,fontFamily:F}}>{pet.breed}</span>
          </div>
          <h2 style={{margin:'8px 0 4px',fontSize:26,fontFamily:FD,color:C.text}}>{pet.name}</h2>
          {pet.description&&<p style={{margin:'12px 0 0',fontSize:15,color:C.textMuted,fontFamily:F,lineHeight:1.6}}>{pet.description}</p>}
          {!isOwner&&(
            <>
              <div style={{marginTop:20,padding:14,background:'#ecfdf5',borderRadius:14,display:'flex',alignItems:'center',gap:10}}>
                <span style={{color:C.accent,flexShrink:0}}><ShieldIcon size={18}/></span>
                <p style={{margin:0,fontSize:13,fontFamily:F,color:'#065f46',lineHeight:1.5}}>Owner details are private. Tap below to reach them on WhatsApp.</p>
              </div>
              <a href={waLink} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,padding:'14px 28px',borderRadius:14,background:C.whatsapp,color:'white',textDecoration:'none',fontFamily:F,fontWeight:700,fontSize:16,marginTop:16,boxShadow:'0 4px 14px rgba(37,211,102,0.35)'}}>
                <WAIcon size={20}/> Contact Owner via WhatsApp
              </a>
            </>
          )}
          {isOwner&&(
            <div style={{marginTop:20,padding:16,background:'#fef3c7',borderRadius:14,border:'1px solid #fde68a'}}>
              <p style={{margin:'0 0 12px',fontFamily:F,fontSize:13,fontWeight:600,color:'#92400e'}}>🔑 This is your pet — you can manage this listing</p>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                <Btn onClick={onEdit} style={{background:C.primary,color:'white',display:'flex',alignItems:'center',gap:6,flex:1,justifyContent:'center'}}><EditIcon/> Edit</Btn>
                {!confirmDelete?(
                  <Btn onClick={()=>setConfirmDelete(true)} style={{background:'transparent',color:C.danger,border:'1.5px solid '+C.danger,flex:1,justifyContent:'center'}}>Remove</Btn>
                ):(
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <Btn onClick={handleDelete} disabled={deleting} style={{background:C.danger,color:'white',fontSize:13,opacity:deleting?0.6:1}}>{deleting?'Removing...':'Confirm'}</Btn>
                    <Btn onClick={()=>setConfirmDelete(false)} style={{background:'white',color:C.text,border:'1px solid '+C.border,fontSize:13}}>Cancel</Btn>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function App(){
  const[user,setUser]=useState(null);
  const[pets,setPets]=useState([]);
  const[view,setView]=useState('browse');
  const[selectedPet,setSelectedPet]=useState(null);
  const[editPet,setEditPet]=useState(null);
  const[tab,setTab]=useState('all');
  const[search,setSearch]=useState('');
  const[page,setPage]=useState('browse');
  const[toast,setToast]=useState(null);
  const[loading,setLoading]=useState(true);
  const[checkingAuth,setCheckingAuth]=useState(true);

  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(null),3000);};

  // Check for existing session on app load
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){
        const u=session.user;
        setUser({id:u.id,phone:u.phone||'',name:u.user_metadata?.display_name||'PawPrint User',address:u.user_metadata?.address||null});
      }
      setCheckingAuth(false);
    });
    // Listen for auth changes
    const{data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      if(event==='SIGNED_OUT')setUser(null);
    });
    return()=>subscription.unsubscribe();
  },[]);

  const loadPets=async()=>{
    setLoading(true);
    try{
      const{data,error}=await supabase.from('pets_public').select('*').order('created_at',{ascending:false});
      if(error)throw error;
      setPets(data||[]);
    }catch(err){console.error('Load failed:',err);}
    setLoading(false);
  };

  useEffect(()=>{if(user)loadPets();},[user]);

  const handleSignOut=async()=>{
    await supabase.auth.signOut();
    setUser(null);
    setPets([]);
    setView('browse');
    setPage('browse');
  };

  if(checkingAuth){
    return(
      <div style={{minHeight:'100vh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
        <PawIcon size={40} color={C.primary}/>
        <p style={{fontFamily:F,color:C.textMuted,fontSize:14}}>Loading PawPrint...</p>
      </div>
    );
  }

  if(!user)return <AuthScreen onLogin={setUser}/>;

  const myPets=pets.filter(p=>p.owner_id===user.id);
  const handlePetSaved=()=>{loadPets();setView('browse');setEditPet(null);showToast(editPet?'Updated!':'Pet registered! 🎉');};
  const handleDelete=id=>{setPets(p=>p.filter(x=>x.id!==id));setSelectedPet(null);setView('browse');showToast('Listing removed');};

  const handleDeleteAccount=async()=>{
    try{
      await supabase.from('pets').delete().eq('owner_id',user.id);
      await supabase.auth.signOut();
      setUser(null);
      setPets([]);
    }catch(err){alert('Failed: '+err.message);}
  };

  const handleUpdateUser=updated=>{setUser(updated);showToast('Account updated!');};

  const filtered=pets.filter(p=>{
    if(tab!=='all'&&p.type!==tab)return false;
    if(search){const q=search.toLowerCase();return p.name.toLowerCase().includes(q)||p.breed.toLowerCase().includes(q)||(p.description||'').toLowerCase().includes(q);}
    return true;
  });

  return(
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
      `}}/>
      <div style={{minHeight:'100vh',background:C.bg}}>
        <div style={{background:'linear-gradient(135deg,'+C.primaryDark+' 0%,'+C.primary+' 50%,#d97706 100%)',padding:'20px 20px 18px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:-20,left:-20,opacity:0.08}}><PawIcon size={100} color="white"/></div>
          <div style={{position:'relative',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                <PawIcon size={18} color="white"/>
                <span style={{fontFamily:F,fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.7)',textTransform:'uppercase',letterSpacing:2}}>Villanova</span>
              </div>
              <h1 style={{margin:0,fontFamily:FD,fontSize:22,color:'white',fontWeight:700}}>PawPrint</h1>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontFamily:F,fontSize:12,color:'rgba(255,255,255,0.85)',fontWeight:600}}>{user.name}</span>
              <button type="button" onClick={()=>{setView('settings');setPage('browse');}} style={{background:'rgba(255,255,255,0.15)',border:'none',borderRadius:8,padding:'6px 8px',color:'white',cursor:'pointer',display:'flex',alignItems:'center'}}><GearIcon size={16}/></button>
              <button type="button" onClick={handleSignOut} style={{background:'rgba(255,255,255,0.15)',border:'none',borderRadius:8,padding:'6px 12px',color:'white',fontFamily:F,fontSize:11,fontWeight:600,cursor:'pointer'}}>Sign Out</button>
            </div>
          </div>
        </div>

        {view!=='settings'&&(
          <div style={{display:'flex',background:'white',borderBottom:'1.5px solid '+C.border}}>
            {[{k:'browse',l:'🏠 Browse All'},{k:'myPets',l:'🐾 My Pets ('+myPets.length+')'}].map(t=>(
              <button type="button" key={t.k} onClick={()=>{setPage(t.k);setView('browse');setSelectedPet(null);setEditPet(null);}} style={{
                flex:1,padding:'12px 10px',border:'none',cursor:'pointer',fontFamily:F,fontSize:13,fontWeight:600,
                background:page===t.k?'white':'transparent',color:page===t.k?C.primary:C.textMuted,
                borderBottom:page===t.k?'2.5px solid '+C.primary:'2.5px solid transparent'
              }}>{t.l}</button>
            ))}
          </div>
        )}

        <div style={{maxWidth:600,margin:'0 auto',padding:'16px 16px 80px'}}>
          {view==='settings'&&<AccountSettings user={user} onUpdate={handleUpdateUser} onDelete={handleDeleteAccount} onBack={()=>setView('browse')}/>}
          {view==='register'&&<PetForm user={user} onSubmit={handlePetSaved} onCancel={()=>setView('browse')} submitLabel="Register Pet"/>}
          {view==='edit'&&editPet&&<PetForm initial={editPet} user={user} onSubmit={handlePetSaved} onCancel={()=>{setEditPet(null);setView('browse');}} submitLabel="Save Changes"/>}
          {view==='detail'&&selectedPet&&(
            <PetDetail pet={selectedPet} isOwner={selectedPet.owner_id===user.id} onBack={()=>{setSelectedPet(null);setView('browse');}}
              onDelete={handleDelete} onEdit={()=>{setEditPet(selectedPet);setView('edit');}}/>
          )}

          {view==='browse'&&page==='browse'&&(
            <div style={{animation:'fadeIn 0.3s ease'}}>
              <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap'}}>
                <div style={{flex:1,minWidth:160,position:'relative'}}>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or breed..." style={{width:'100%',padding:'10px 14px 10px 36px',borderRadius:12,border:'1.5px solid '+C.border,fontSize:14,fontFamily:F,background:'white',outline:'none',boxSizing:'border-box'}}/>
                  <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',fontSize:16,opacity:0.4}}>🔍</span>
                </div>
                <div style={{display:'flex',gap:4,background:'white',borderRadius:12,padding:3,border:'1.5px solid '+C.border}}>
                  {['all','cat','dog'].map(f=>(
                    <button type="button" key={f} onClick={()=>setTab(f)} style={{padding:'7px 14px',borderRadius:9,border:'none',cursor:'pointer',background:tab===f?C.primary:'transparent',color:tab===f?'white':C.textMuted,fontFamily:F,fontSize:13,fontWeight:600}}>{f==='all'?'All':f==='cat'?'🐱 Cats':'🐶 Dogs'}</button>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',gap:10,marginBottom:18}}>
                <div style={{flex:1,background:'white',borderRadius:12,padding:'10px 14px',border:'1.5px solid '+C.border,textAlign:'center'}}>
                  <div style={{fontSize:20,fontWeight:700,fontFamily:F,color:C.primary}}>{pets.length}</div>
                  <div style={{fontSize:11,color:C.textMuted,fontFamily:F}}>Registered</div>
                </div>
                <div style={{flex:1,background:'#fef3c7',borderRadius:12,padding:'10px 14px',border:'1.5px solid #fde68a',textAlign:'center'}}>
                  <div style={{fontSize:20,fontWeight:700,fontFamily:F,color:'#92400e'}}>{pets.filter(p=>p.type==='cat').length}</div>
                  <div style={{fontSize:11,color:'#92400e',fontFamily:F}}>🐱 Cats</div>
                </div>
                <div style={{flex:1,background:'#dbeafe',borderRadius:12,padding:'10px 14px',border:'1.5px solid #bfdbfe',textAlign:'center'}}>
                  <div style={{fontSize:20,fontWeight:700,fontFamily:F,color:'#1e40af'}}>{pets.filter(p=>p.type==='dog').length}</div>
                  <div style={{fontSize:11,color:'#1e40af',fontFamily:F}}>🐶 Dogs</div>
                </div>
              </div>
              {loading?(
                <div style={{textAlign:'center',padding:'40px 20px'}}><PawIcon size={40} color={C.primary}/><p style={{fontFamily:F,color:C.textMuted,fontSize:14,marginTop:12}}>Loading...</p></div>
              ):filtered.length>0?(
                <div style={{display:'grid',gridTemplateColumns:'repeat(2, 1fr)',gap:14}}>
                  {filtered.map((pet,i)=>(
                    <div key={pet.id} style={{animation:'slideUp 0.3s ease '+(i*0.04)+'s both'}}>
                      <PetCard pet={pet} onClick={()=>{setSelectedPet(pet);setView('detail');}}/>
                    </div>
                  ))}
                </div>
              ):(
                <div style={{textAlign:'center',padding:'48px 20px',background:'white',borderRadius:16,border:'1.5px solid '+C.border}}>
                  <CatSvg size={64}/><h3 style={{fontFamily:FD,color:C.text,marginBottom:4}}>{pets.length===0?'No pets registered yet':'No pets match'}</h3>
                  {pets.length===0&&<p style={{fontFamily:F,color:C.textMuted,fontSize:14}}>Be the first to register!</p>}
                </div>
              )}
            </div>
          )}

          {view==='browse'&&page==='myPets'&&(
            <div style={{animation:'fadeIn 0.3s ease'}}>
              <h2 style={{margin:'0 0 16px',fontFamily:FD,fontSize:20,color:C.text}}>My Pets</h2>
              {myPets.length>0?(
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {myPets.map(pet=>(
                    <div key={pet.id} style={{background:C.card,borderRadius:14,border:'1.5px solid '+C.border,padding:14,display:'flex',gap:14,alignItems:'center',cursor:'pointer'}}
                      onClick={()=>{setSelectedPet(pet);setView('detail');}}>
                      <div style={{width:70,height:70,borderRadius:12,overflow:'hidden',background:C.surface,flexShrink:0}}>
                        {(pet.photo_urls&&pet.photo_urls[0])?<img src={pet.photo_urls[0]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:
                          <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>{pet.type==='cat'?<CatSvg size={36}/>:<DogSvg size={36}/>}</div>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <h3 style={{margin:0,fontFamily:FD,fontSize:16,color:C.text}}>{pet.name}</h3>
                          <span style={{background:pet.type==='cat'?'#fef3c7':'#dbeafe',color:pet.type==='cat'?'#92400e':'#1e40af',padding:'2px 8px',borderRadius:10,fontSize:10,fontWeight:700,textTransform:'uppercase',fontFamily:F}}>{pet.type}</span>
                        </div>
                        <p style={{margin:'2px 0',fontSize:12,color:C.textMuted,fontFamily:F}}>{pet.breed}</p>
                        <div style={{display:'flex',gap:8,marginTop:6}}>
                          <button type="button" onClick={e=>{e.stopPropagation();setEditPet(pet);setView('edit');}} style={{padding:'4px 12px',borderRadius:6,border:'1px solid '+C.border,background:'white',fontFamily:F,fontSize:11,fontWeight:600,color:C.primary,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}><EditIcon/> Edit</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ):(
                <div style={{textAlign:'center',padding:'48px 20px',background:'white',borderRadius:16,border:'1.5px solid '+C.border}}>
                  <PawIcon size={48} color={C.primary}/>
                  <h3 style={{fontFamily:FD,color:C.text,margin:'12px 0 4px'}}>No pets yet</h3>
                  <p style={{fontFamily:F,color:C.textMuted,fontSize:14}}>Tap the button below to register your first pet</p>
                </div>
              )}
            </div>
          )}

          {view==='browse'&&(
            <button type="button" onClick={()=>setView('register')} style={{
              position:'fixed',bottom:24,right:24,height:56,borderRadius:28,
              background:'linear-gradient(135deg,'+C.primary+','+C.primaryDark+')',
              color:'white',border:'none',cursor:'pointer',fontSize:15,display:'flex',
              alignItems:'center',justifyContent:'center',gap:8,padding:'0 22px 0 18px',
              boxShadow:'0 6px 20px rgba(180,83,9,0.35)',zIndex:50,fontFamily:F,fontWeight:700
            }}><span style={{fontSize:22,lineHeight:1}}>+</span> Add Pet</button>
          )}
        </div>

        {toast&&(
          <div style={{position:'fixed',bottom:90,left:'50%',transform:'translateX(-50%)',background:C.primaryDark,color:'white',padding:'10px 20px',borderRadius:12,fontFamily:F,fontSize:14,fontWeight:600,zIndex:100,animation:'toastIn 0.3s ease',boxShadow:'0 4px 16px rgba(0,0,0,0.2)',whiteSpace:'nowrap'}}>{toast}</div>
        )}
      </div>
    </div>
  );
}
