import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchPets, createPet, deletePet as deletePetApi, uploadBase64Photo } from './supabase';
import { BREED_OPTIONS } from './breeds';

// ── Theme ──
const C = {
  bg: '#faf6f1', card: '#fff', primary: '#b45309', primaryLight: '#fbbf24',
  primaryDark: '#78350f', accent: '#059669', text: '#1c1917',
  textMuted: '#78716c', border: '#e7e0d8', danger: '#dc2626',
  whatsapp: '#25D366', surface: '#f5ede4',
};

const font = "'DM Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

// ── Icons ──
const PawIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <ellipse cx="8" cy="6" rx="2.2" ry="2.8" /><ellipse cx="16" cy="6" rx="2.2" ry="2.8" />
    <ellipse cx="4.5" cy="11" rx="2" ry="2.5" /><ellipse cx="19.5" cy="11" rx="2" ry="2.5" />
    <path d="M12 22c-4 0-7-3.5-7-6.5S9 10 12 10s7 2 7 5.5S16 22 12 22z" />
  </svg>
);

const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const ShieldIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
  </svg>
);

const CatIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M14 8L10 28H18L14 8Z" fill={C.primary} opacity="0.7" />
    <path d="M50 8L54 28H46L50 8Z" fill={C.primary} opacity="0.7" />
    <ellipse cx="32" cy="38" rx="18" ry="16" fill={C.primary} opacity="0.6" />
    <circle cx="25" cy="34" r="3" fill="white" /><circle cx="39" cy="34" r="3" fill="white" />
    <circle cx="25.5" cy="34.5" r="1.5" fill={C.primaryDark} /><circle cx="39.5" cy="34.5" r="1.5" fill={C.primaryDark} />
    <ellipse cx="32" cy="40" rx="2" ry="1.2" fill={C.primaryDark} />
  </svg>
);

const DogIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <ellipse cx="14" cy="24" rx="8" ry="14" fill={C.primary} opacity="0.5" transform="rotate(-15 14 24)" />
    <ellipse cx="50" cy="24" rx="8" ry="14" fill={C.primary} opacity="0.5" transform="rotate(15 50 24)" />
    <ellipse cx="32" cy="36" rx="18" ry="16" fill={C.primary} opacity="0.6" />
    <circle cx="25" cy="32" r="3" fill="white" /><circle cx="39" cy="32" r="3" fill="white" />
    <circle cx="25.5" cy="32.5" r="1.5" fill={C.primaryDark} /><circle cx="39.5" cy="32.5" r="1.5" fill={C.primaryDark} />
    <ellipse cx="32" cy="39" rx="4" ry="2.5" fill={C.primaryDark} />
  </svg>
);

// ── Searchable Breed Dropdown ──
function BreedSelect({ label, value, onChange, options, required, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: C.text, fontFamily: font, fontSize: 14 }}>
        {label} {required && <span style={{ color: C.danger }}>*</span>}
      </label>
      <button onClick={() => !disabled && setOpen(!open)} disabled={disabled} style={{
        width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`,
        fontSize: 15, fontFamily: font, background: disabled ? C.surface : 'white',
        color: value ? C.text : C.textMuted, textAlign: 'left', cursor: disabled ? 'default' : 'pointer',
        boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || placeholder}</span>
        <span style={{ fontSize: 10, opacity: 0.5 }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: 'white', borderRadius: 12, border: `1.5px solid ${C.border}`,
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)', marginTop: 4, maxHeight: 260,
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          <div style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}` }}>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search breeds..."
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, fontFamily: font, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 200 }}>
            {filtered.length === 0 && <div style={{ padding: '14px 16px', color: C.textMuted, fontSize: 13, fontFamily: font }}>No breeds found</div>}
            {filtered.map(o => (
              <button key={o} onClick={() => { onChange(o); setOpen(false); setSearch(''); }}
                style={{
                  width: '100%', padding: '10px 16px', border: 'none', background: o === value ? C.surface : 'white',
                  textAlign: 'left', cursor: 'pointer', fontSize: 14, fontFamily: font,
                  color: C.text, borderBottom: `0.5px solid ${C.border}`
                }}>{o}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Photo Uploader ──
function PhotoUploader({ photos, setPhotos }) {
  const fileRef = useRef(null);
  const handleAdd = (e) => {
    const files = Array.from(e.target.files);
    files.slice(0, 3 - photos.length).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos(prev => prev.length >= 3 ? prev : [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: C.text, fontFamily: font }}>
        Photos ({photos.length}/3) <span style={{ color: C.danger }}>*</span>
      </label>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {photos.map((p, i) => (
          <div key={i} style={{ position: 'relative', width: 96, height: 96, borderRadius: 12, overflow: 'hidden', border: `2px solid ${C.border}` }}>
            <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))} style={{
              position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%',
              background: C.danger, color: 'white', border: 'none', cursor: 'pointer', fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1
            }}>×</button>
          </div>
        ))}
        {photos.length < 3 && (
          <button onClick={() => fileRef.current?.click()} style={{
            width: 96, height: 96, borderRadius: 12, border: `2px dashed ${C.border}`,
            background: C.surface, cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 4, color: C.textMuted, fontSize: 12, fontFamily: font
          }}>
            <span style={{ fontSize: 24, lineHeight: 1 }}>+</span><span>Add photo</span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleAdd} style={{ display: 'none' }} />
    </div>
  );
}

// ── Form Fields ──
function InputField({ label, value, onChange, placeholder, required, type = 'text', maxLength, note }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: C.text, fontFamily: font, fontSize: 14 }}>
        {label} {required && <span style={{ color: C.danger }}>*</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: font, background: 'white', color: C.text, outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
      {note && <p style={{ margin: '3px 0 0', fontSize: 11, color: C.textMuted, fontFamily: font }}>{note}</p>}
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, maxLength }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: C.text, fontFamily: font, fontSize: 14 }}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} rows={3}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: font, background: 'white', color: C.text, outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: 70 }}
        onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
      {maxLength && <div style={{ textAlign: 'right', fontSize: 11, color: C.textMuted, marginTop: 2 }}>{value.length}/{maxLength}</div>}
    </div>
  );
}

// ── Privacy Banner ──
function PrivacyBanner() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 14px', background: '#ecfdf5', borderRadius: 10, border: '1px solid #a7f3d0' }}>
      <span style={{ color: C.accent, marginTop: 1, flexShrink: 0 }}><ShieldIcon size={16} /></span>
      <div style={{ fontFamily: font, fontSize: 12, color: '#065f46', lineHeight: 1.5 }}>
        <strong>Your privacy is protected.</strong> Your name, address, and number are never shown publicly. Only the WhatsApp button is visible — no one sees your number until you reply.
      </div>
    </div>
  );
}

// ── Pet Card ──
function PetCard({ pet, onClick }) {
  const photoUrl = pet.photo_urls?.[0];
  return (
    <div onClick={onClick} style={{
      background: C.card, borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
      border: `1.5px solid ${C.border}`, transition: 'all 0.25s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}>
      <div style={{ position: 'relative', paddingTop: '75%', background: C.surface }}>
        {photoUrl ? (
          <img src={photoUrl} alt={pet.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {pet.type === 'cat' ? <CatIcon size={56} /> : <DogIcon size={56} />}
          </div>
        )}
        <span style={{
          position: 'absolute', top: 8, right: 8, background: pet.type === 'cat' ? '#fef3c7' : '#dbeafe',
          color: pet.type === 'cat' ? '#92400e' : '#1e40af', padding: '3px 10px', borderRadius: 20,
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: font
        }}>{pet.type === 'cat' ? '🐱' : '🐶'} {pet.type}</span>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <h3 style={{ margin: 0, fontSize: 17, fontFamily: fontDisplay, color: C.text }}>{pet.name}</h3>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: C.textMuted, fontFamily: font }}>{pet.breed}</p>
        {pet.description && <p style={{ margin: '6px 0 0', fontSize: 13, color: C.textMuted, fontFamily: font, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{pet.description}</p>}
      </div>
    </div>
  );
}

// ── Pet Detail ──
function PetDetail({ pet, onBack, onDelete }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const waLink = pet.whatsapp_link
    ? `${pet.whatsapp_link}?text=${encodeURIComponent(`Hi! I'm reaching out about your pet "${pet.name}" from the Villanova Pet Registry.`)}`
    : '#';

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePetApi(pet.id);
      onDelete(pet.id);
    } catch (err) {
      alert('Failed to remove: ' + err.message);
      setDeleting(false);
    }
  };

  const photos = pet.photo_urls || [];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: C.primary, fontFamily: font, fontWeight: 600, fontSize: 14, padding: 0, marginBottom: 16 }}>
        ← Back to registry
      </button>
      <div style={{ background: C.card, borderRadius: 20, overflow: 'hidden', border: `1.5px solid ${C.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
        {photos.length > 0 && (
          <div style={{ position: 'relative' }}>
            <img src={photos[photoIdx]} alt={pet.name} style={{ width: '100%', height: 300, objectFit: 'cover', display: 'block' }} />
            {photos.length > 1 && (
              <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                {photos.map((_, i) => (
                  <button key={i} onClick={() => setPhotoIdx(i)} style={{
                    width: i === photoIdx ? 24 : 10, height: 10, borderRadius: 5,
                    background: i === photoIdx ? 'white' : 'rgba(255,255,255,0.5)',
                    border: 'none', cursor: 'pointer'
                  }} />
                ))}
              </div>
            )}
          </div>
        )}
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{
              background: pet.type === 'cat' ? '#fef3c7' : '#dbeafe',
              color: pet.type === 'cat' ? '#92400e' : '#1e40af', padding: '4px 12px', borderRadius: 20,
              fontSize: 12, fontWeight: 700, textTransform: 'uppercase', fontFamily: font
            }}>{pet.type === 'cat' ? '🐱' : '🐶'} {pet.type}</span>
            <span style={{ fontSize: 13, color: C.textMuted, fontFamily: font }}>{pet.breed}</span>
          </div>
          <h2 style={{ margin: '8px 0 4px', fontSize: 28, fontFamily: fontDisplay, color: C.text }}>{pet.name}</h2>
          {pet.description && <p style={{ margin: '12px 0 0', fontSize: 15, color: C.textMuted, fontFamily: font, lineHeight: 1.6 }}>{pet.description}</p>}

          <div style={{ marginTop: 20, padding: 16, background: '#ecfdf5', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: C.accent, flexShrink: 0 }}><ShieldIcon size={18} /></span>
            <p style={{ margin: 0, fontSize: 13, fontFamily: font, color: '#065f46', lineHeight: 1.5 }}>
              Owner details are private. Tap below to message them on WhatsApp.
            </p>
          </div>

          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px 28px',
            borderRadius: 14, background: C.whatsapp, color: 'white', textDecoration: 'none', fontFamily: font,
            fontWeight: 700, fontSize: 16, marginTop: 16, boxShadow: '0 4px 14px rgba(37,211,102,0.35)'
          }}>
            <WhatsAppIcon size={20} /> Contact Owner via WhatsApp
          </a>

          <div style={{ marginTop: 20, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} style={{
                padding: '10px 18px', borderRadius: 10, background: 'transparent', color: C.danger,
                border: `1.5px solid ${C.danger}`, cursor: 'pointer', fontFamily: font, fontWeight: 600, fontSize: 13, opacity: 0.7
              }}>Remove this listing</button>
            ) : (
              <div style={{ padding: 14, background: '#fef2f2', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, fontFamily: font, color: C.danger }}>Are you sure?</span>
                <button onClick={handleDelete} disabled={deleting} style={{
                  padding: '6px 16px', borderRadius: 8, background: C.danger, color: 'white',
                  border: 'none', cursor: 'pointer', fontFamily: font, fontWeight: 600, fontSize: 13, opacity: deleting ? 0.6 : 1
                }}>{deleting ? 'Removing...' : 'Yes, remove'}</button>
                <button onClick={() => setConfirmDelete(false)} style={{
                  padding: '6px 16px', borderRadius: 8, background: 'white', color: C.text,
                  border: `1px solid ${C.border}`, cursor: 'pointer', fontFamily: font, fontSize: 13
                }}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Registration Form ──
function RegistrationForm({ onSubmit, onCancel }) {
  const [type, setType] = useState('');
  const [breed, setBreed] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');
  const [unit, setUnit] = useState('');
  const [suburb, setSuburb] = useState('Villanova');
  const [whatsapp, setWhatsapp] = useState('');
  const [photos, setPhotos] = useState([]); // base64 strings
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!photos.length) errs.photos = 'At least 1 photo required';
    if (!name.trim()) errs.name = 'Pet name is required';
    if (!type) errs.type = 'Select cat or dog';
    if (!breed) errs.breed = 'Select a breed';
    if (!whatsapp.trim()) errs.whatsapp = 'WhatsApp number is required';
    else if (whatsapp.replace(/[^0-9]/g, '').length < 8) errs.whatsapp = 'Enter a valid number with country code';
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      // 1. Create pet row first to get the UUID
      const fullAddress = [address.trim(), unit.trim(), suburb.trim()].filter(Boolean).join(', ') || null;
      const pet = await createPet({
        type, breed, name: name.trim(), description: description.trim(),
        ownerName: ownerName.trim() || null, address: fullAddress,
        whatsapp: whatsapp.trim(), photoUrls: [],
      });

      // 2. Upload photos to Supabase Storage
      const urls = [];
      for (let i = 0; i < photos.length; i++) {
        const url = await uploadBase64Photo(photos[i], pet.id, i);
        urls.push(url);
      }

      // 3. Update the pet row with photo URLs
      const { supabase } = await import('./supabase');
      await supabase.from('pets').update({ photo_urls: urls }).eq('id', pet.id);

      onSubmit({ ...pet, photo_urls: urls });
    } catch (err) {
      alert('Registration failed: ' + err.message);
      setSubmitting(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: C.primary, fontFamily: font, fontWeight: 600, fontSize: 14, padding: 0, marginBottom: 16 }}>
        ← Back to registry
      </button>
      <div style={{ background: C.card, borderRadius: 20, padding: '28px 24px', border: `1.5px solid ${C.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
        <h2 style={{ margin: '0 0 6px', fontFamily: fontDisplay, fontSize: 24, color: C.text }}>Register Your Pet</h2>
        <p style={{ margin: '0 0 20px', fontFamily: font, fontSize: 14, color: C.textMuted }}>Add your furry friend to the Villanova community registry</p>
        <PrivacyBanner />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 18 }}>
          <PhotoUploader photos={photos} setPhotos={setPhotos} />
          {errors.photos && <span style={{ color: C.danger, fontSize: 12, marginTop: -12, fontFamily: font }}>{errors.photos}</span>}

          {/* Pet details */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
            <h3 style={{ margin: '0 0 14px', fontFamily: font, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: C.textMuted }}>Pet Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <InputField label="Pet Name" value={name} onChange={setName} placeholder="e.g. Whiskers, Buddy" required maxLength={40} />
              {errors.name && <span style={{ color: C.danger, fontSize: 12, marginTop: -10, fontFamily: font }}>{errors.name}</span>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, color: C.text, fontFamily: font, fontSize: 14 }}>
                    Type <span style={{ color: C.danger }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['cat', 'dog'].map(t => (
                      <button key={t} onClick={() => { setType(t); setBreed(''); }} style={{
                        flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
                        border: `2px solid ${type === t ? C.primary : C.border}`,
                        background: type === t ? '#fef3c7' : 'white', fontFamily: font, fontSize: 14, fontWeight: 600,
                        color: type === t ? C.primaryDark : C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                      }}>{t === 'cat' ? '🐱 Cat' : '🐶 Dog'}</button>
                    ))}
                  </div>
                  {errors.type && <span style={{ color: C.danger, fontSize: 12, fontFamily: font }}>{errors.type}</span>}
                </div>
                <div>
                  <BreedSelect label="Breed" value={breed} onChange={setBreed}
                    options={type ? BREED_OPTIONS[type] : []} required
                    placeholder={type ? 'Search breeds...' : 'Pick type first'} disabled={!type} />
                  {errors.breed && <span style={{ color: C.danger, fontSize: 12, fontFamily: font }}>{errors.breed}</span>}
                </div>
              </div>
              <TextAreaField label="Description" value={description} onChange={setDescription}
                placeholder="Colour, markings, personality, anything helpful to identify your pet..." maxLength={300} />
            </div>
          </div>

          {/* WhatsApp (required) */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
            <h3 style={{ margin: '0 0 4px', fontFamily: font, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: C.textMuted }}>
              Contact <span style={{ fontSize: 11, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— Required</span>
            </h3>
            <p style={{ margin: '0 0 14px', fontSize: 12, fontFamily: font, color: C.textMuted }}>
              Your number is never displayed. It only powers the "Contact Owner" button via WhatsApp.
            </p>
            <InputField label="WhatsApp Number" value={whatsapp} onChange={setWhatsapp}
              placeholder="e.g. +971 50 123 4567" required type="tel"
              note="Include country code (e.g. +971, +27, +44). Your number stays completely hidden." />
            {errors.whatsapp && <span style={{ color: C.danger, fontSize: 12, fontFamily: font }}>{errors.whatsapp}</span>}
          </div>

          {/* Owner details (optional) */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
            <h3 style={{ margin: '0 0 4px', fontFamily: font, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: C.textMuted }}>
              Owner Details <span style={{ fontSize: 11, fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: C.accent }}>— Optional & Private</span>
            </h3>
            <p style={{ margin: '0 0 14px', fontSize: 12, fontFamily: font, color: C.textMuted }}>
              This info is stored privately and never shown publicly. It helps admins if needed.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <InputField label="Your Name" value={ownerName} onChange={setOwnerName} placeholder="Optional" maxLength={60} />
              <InputField label="Street Address" value={address} onChange={setAddress} placeholder="Optional" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <InputField label="Unit / Complex" value={unit} onChange={setUnit} placeholder="Optional" />
                <InputField label="Suburb / Area" value={suburb} onChange={setSuburb} placeholder="Villanova" />
              </div>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={submitting} style={{
            width: '100%', padding: '14px 24px', borderRadius: 12, border: 'none',
            background: submitting ? C.textMuted : `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
            color: 'white', fontSize: 16, fontWeight: 700, fontFamily: font,
            cursor: submitting ? 'wait' : 'pointer', boxShadow: '0 4px 12px rgba(180,83,9,0.25)', marginTop: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            {submitting ? (
              <>Registering...</>
            ) : (
              <><PawIcon size={16} color="white" /> Register Pet</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──
export default function App() {
  const [view, setView] = useState('browse');
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const loadPets = useCallback(async () => {
    try {
      const data = await fetchPets();
      setPets(data);
      setError(null);
    } catch (err) {
      setError('Could not load pets. Check your internet connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPets(); }, [loadPets]);

  const handlePetAdded = (pet) => {
    loadPets(); // Refresh from server
    setView('browse');
    showToast(`${pet.name} registered! 🎉`);
  };

  const handleDelete = (id) => {
    setPets(prev => prev.filter(p => p.id !== id));
    setSelectedPet(null);
    setView('browse');
    showToast('Listing removed');
  };

  const filtered = pets.filter(p => {
    if (filter !== 'all' && p.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
    }
    return true;
  });

  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <PawIcon size={40} color={C.primary} />
      <p style={{ fontFamily: font, color: C.textMuted, fontSize: 14 }}>Loading registry...</p>
    </div>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; -webkit-font-smoothing: antialiased; }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${C.primaryDark} 0%, ${C.primary} 50%, #d97706 100%)`,
          padding: '28px 20px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -20, left: -20, opacity: 0.08 }}><PawIcon size={120} color="white" /></div>
          <div style={{ position: 'absolute', bottom: -10, right: -10, opacity: 0.08 }}><PawIcon size={80} color="white" /></div>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
              <PawIcon size={22} color="white" />
              <span style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 2 }}>Villanova Community</span>
            </div>
            <h1 style={{ margin: 0, fontFamily: fontDisplay, fontSize: 28, color: 'white', fontWeight: 700 }}>Pet Registry</h1>
            <p style={{ margin: '6px 0 0', fontFamily: font, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Know your neighbours' pets — keep them safe</p>
          </div>
        </div>

        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px 80px' }}>
          {error && (
            <div style={{ padding: '12px 16px', background: '#fef2f2', borderRadius: 12, border: '1px solid #fecaca', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: font, fontSize: 13, color: C.danger }}>{error}</span>
              <button onClick={loadPets} style={{ padding: '6px 14px', borderRadius: 8, background: C.danger, color: 'white', border: 'none', cursor: 'pointer', fontFamily: font, fontWeight: 600, fontSize: 12 }}>Retry</button>
            </div>
          )}

          {view === 'register' ? (
            <RegistrationForm onSubmit={handlePetAdded} onCancel={() => setView('browse')} />
          ) : selectedPet ? (
            <PetDetail pet={selectedPet} onBack={() => setSelectedPet(null)} onDelete={handleDelete} />
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              {/* Search + filter */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or breed..."
                    style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: font, background: 'white', outline: 'none', boxSizing: 'border-box' }} />
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>🔍</span>
                </div>
                <div style={{ display: 'flex', gap: 4, background: 'white', borderRadius: 12, padding: 3, border: `1.5px solid ${C.border}` }}>
                  {['all', 'cat', 'dog'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                      padding: '7px 14px', borderRadius: 9, border: 'none', cursor: 'pointer',
                      background: filter === f ? C.primary : 'transparent',
                      color: filter === f ? 'white' : C.textMuted, fontFamily: font, fontSize: 13, fontWeight: 600
                    }}>{f === 'all' ? 'All' : f === 'cat' ? '🐱 Cats' : '🐶 Dogs'}</button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <div style={{ flex: 1, background: 'white', borderRadius: 12, padding: '12px 14px', border: `1.5px solid ${C.border}`, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: font, color: C.primary }}>{pets.length}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, fontFamily: font }}>Registered</div>
                </div>
                <div style={{ flex: 1, background: '#fef3c7', borderRadius: 12, padding: '12px 14px', border: '1.5px solid #fde68a', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: font, color: '#92400e' }}>{pets.filter(p => p.type === 'cat').length}</div>
                  <div style={{ fontSize: 11, color: '#92400e', fontFamily: font }}>🐱 Cats</div>
                </div>
                <div style={{ flex: 1, background: '#dbeafe', borderRadius: 12, padding: '12px 14px', border: '1.5px solid #bfdbfe', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: font, color: '#1e40af' }}>{pets.filter(p => p.type === 'dog').length}</div>
                  <div style={{ fontSize: 11, color: '#1e40af', fontFamily: font }}>🐶 Dogs</div>
                </div>
              </div>

              {/* Grid */}
              {filtered.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                  {filtered.map((pet, i) => (
                    <div key={pet.id} style={{ animation: `slideUp 0.3s ease ${i * 0.05}s both` }}>
                      <PetCard pet={pet} onClick={() => setSelectedPet(pet)} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 20px', background: 'white', borderRadius: 16, border: `1.5px solid ${C.border}` }}>
                  {pets.length === 0 ? (
                    <><CatIcon size={64} /><h3 style={{ fontFamily: fontDisplay, color: C.text, marginBottom: 4 }}>No pets registered yet</h3><p style={{ fontFamily: font, color: C.textMuted, fontSize: 14 }}>Be the first to add your pet!</p></>
                  ) : (
                    <p style={{ fontFamily: font, color: C.textMuted, fontSize: 14 }}>No pets match your search</p>
                  )}
                </div>
              )}

              {/* FAB */}
              <button onClick={() => setView('register')} style={{
                position: 'fixed', bottom: 24, right: 24, height: 56, borderRadius: 28,
                background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
                color: 'white', border: 'none', cursor: 'pointer', fontSize: 15, display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 22px 0 18px',
                boxShadow: '0 6px 20px rgba(180,83,9,0.35)', zIndex: 50, fontFamily: font, fontWeight: 700
              }}>
                <span style={{ fontSize: 22, lineHeight: 1 }}>+</span> Add Pet
              </button>
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
            background: C.primaryDark, color: 'white', padding: '10px 20px', borderRadius: 12,
            fontFamily: font, fontSize: 14, fontWeight: 600, zIndex: 100,
            animation: 'toastIn 0.3s ease', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', whiteSpace: 'nowrap'
          }}>{toast}</div>
        )}
      </div>
    </>
  );
}
