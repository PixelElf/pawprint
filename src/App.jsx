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
        {
