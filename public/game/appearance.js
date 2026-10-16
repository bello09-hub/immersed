/* Presentation-only appearance extension for the supplied offline game. */
(()=>{
const original=window.__immSvg;
const valid=(n,max,fallback=0)=>Number.isInteger(n)&&n>=0&&n<max?n:fallback;
const features=a=>({face:valid(a.face,3),nose:valid(a.nose,3),mouth:valid(a.mouth,3),freckles:valid(a.freckles,2),beard:valid(a.beard,4)});
window.__immSvg=(appearance,P)=>{
 const l={...appearance,...features(appearance)},age=P.age??20,male=P.sex==='Male';
 const phase=age<3?'Baby':age<13?'Child':age<20?'Teen':age<45?'Adult':age<65?'Mature':'Elder';
 const cls=`portrait-age-${phase.toLowerCase()}`;
 let svg=original(l,{...P,className:`${P.className||''} ${cls}`});
 svg=svg.replace(/aria-label="[^"]*"/,`aria-label="${phase} character portrait, age ${age}${male&&age>=65?', white hair and beard':''}"`).replace('<svg ','<svg data-portrait-age="'+age+'" ');
 // Face structure remains recognizable while becoming softer in childhood.
 const face='M52 68Q52 34 80 33Q108 34 108 68Q108 90 98 104Q90 115 80 115Q70 115 62 104Q52 90 52 68Z';
 const shapes=['M50 68Q49 33 80 32Q111 33 110 68Q111 97 97 108Q80 122 63 108Q49 97 50 68Z',face,'M51 68Q51 33 80 32Q109 33 109 68L107 98Q99 115 80 116Q61 115 53 98Z'];
 svg=svg.split(face).join(age<13?shapes[0]:shapes[l.face]);
 const oldNose='M80 73Q76.5 84 75.5 88Q80 91.5 84.5 88Q83.5 84 80 73';
 if(l.nose===1)svg=svg.replace(oldNose,'M80 76Q76 84 75 87Q80 90 85 87Q84 83 80 76');
 if(l.nose===2)svg=svg.replace(oldNose,'M80 72Q76 84 73 89Q80 93 87 89Q83 84 80 72');
 if(l.mouth===1)svg=svg.replace('M70 99Q80 110 90 99','M68 98Q80 113 92 98');
 if(l.mouth===2)svg=svg.replace('M70 99Q80 110 90 99','M72 100Q80 107 88 100');
 let extras='';
 if(l.freckles)extras+='<g class="portrait-freckles">'+[[59,86],[63,89],[67,85],[94,85],[98,89],[102,86]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.2"/>`).join('')+'</g>';
 if(age>=45)extras+='<path class="portrait-age-detail" d="M67 54Q80 51 93 54M65 58Q80 55 95 58M58 80l-4 2m4 1l-4 3M102 80l4 2m-4 1l4 3"/>';
 if(male&&age>=18&&(l.beard>0||age>=65)){
  const style=age>=65&&l.beard===0?2:l.beard;
  const beard=style===1?'M57 92Q60 113 80 117Q100 113 103 92L99 98Q80 120 61 98Z':style===3?'M68 105Q80 109 92 105L90 121Q80 131 70 121Z':'M56 88L61 95L64 107Q80 119 96 107L99 95L104 88Q107 121 80 131Q53 121 56 88Z';
  extras+=`<path class="portrait-beard" d="${beard}"/><path class="portrait-beard" d="M68 95Q74 90 80 94Q86 90 92 95L92 98Q86 96 80 97Q74 96 68 98Z"/>`;
 }
 svg=svg.replace('</g><circle cx="80" cy="80" r="78.6"',extras+'</g><circle cx="80" cy="80" r="78.6"');
 if(age<3){
  const happy=(P.happiness??75)>35;
  svg=`<svg viewBox="0 0 160 160" role="img" aria-label="Baby character portrait, age ${age}" data-portrait-age="${age}" class="character-portrait skin-${l.skin} hair-color-${l.hairColor} eyes-${l.eyes} outfit-${l.outfit} ${P.className||''} ${cls}"><defs><clipPath id="baby-${++window.__immBabyId}"><circle cx="80" cy="80" r="78"/></clipPath></defs><g clip-path="url(#baby-${window.__immBabyId})"><circle cx="80" cy="80" r="80" class="portrait-backdrop"/><path d="M24 160Q28 123 64 121L96 121Q134 123 138 160" class="portrait-shirt"/><path d="M66 111L66 130Q80 144 94 130L94 111" class="portrait-skin"/><ellipse cx="47" cy="80" rx="7" ry="10" class="portrait-skin"/><ellipse cx="113" cy="80" rx="7" ry="10" class="portrait-skin"/><path d="M47 76Q44 34 80 32Q116 34 113 76Q116 115 80 122Q44 115 47 76" class="portrait-skin"/><path d="M66 37Q60 22 77 24Q92 25 87 38Q79 29 74 38" class="portrait-hair"/>${[64,96].map(x=>`<ellipse cx="${x}" cy="79" rx="8" ry="7" class="portrait-eye-white"/><circle cx="${x}" cy="79" r="5" class="portrait-iris"/><circle cx="${x}" cy="79" r="2.5" class="portrait-pupil"/><circle cx="${x+2}" cy="77" r="1.5" fill="var(--portrait-highlight)"/>`).join('')}<path d="M57 66q7-4 14 0M89 66q7-4 14 0" class="portrait-brows"/><path d="M78 86q-5 7 5 7" class="portrait-feature-line"/><ellipse cx="58" cy="98" rx="8" ry="5" fill="var(--portrait-blush)" opacity=".25"/><ellipse cx="102" cy="98" rx="8" ry="5" fill="var(--portrait-blush)" opacity=".25"/><path d="${happy?'M69 103Q80 114 91 103':'M71 109Q80 101 89 109'}" class="portrait-mouth"/>${l.freckles?'<circle cx="60" cy="95" r="1" class="portrait-freckles"/>':''}</g><circle cx="80" cy="80" r="78" class="portrait-ring"/></svg>`;
 }
 return svg;
};
window.__immBabyId=0;
window.__IMM_APPEARANCE=function(X){
 if(window.__IMM_APPEARANCE_COMPONENT)return window.__IMM_APPEARANCE_COMPONENT;
 const {S,R,b,yo,Zi,zf,Vf,Ef,Of,Uf,Rf,Gf,qf}=X,j=S.jsx,js=S.jsxs;
 function Editor({appearance,sex='Female',age=20,name='Your character',country='',onChange}){
  const [previewAge,setPreviewAge]=R.useState(age),[showFuture,setShowFuture]=R.useState(false);
  const a=Zi(appearance),set=(key,value)=>onChange({...a,[key]:value});
  const field=(label,key,options,swatch=false,hair=false)=>js('fieldset',{className:'appearance-field',children:[j('legend',{children:label}),j('div',{className:swatch?'color-options':`appearance-options ${hair?'hairstyle-grid':''}`,children:options.map((label,index)=>js(b,{type:'button',variant:'ghost',className:swatch?`color-swatch swatch-${key}-${index}`:'','aria-label':`${label}${swatch?' · '+key:''}`,title:label,'aria-pressed':a[key]===index,onClick:()=>set(key,index),children:hair?[j(yo,{appearance:{...a,hair:index},sex,age:25}),j('span',{children:label})]:swatch?null:label},label))})]});
  const ages=[['Baby',0],['Child',8],['Teen',16],['Adult',28],['Mature',52],['Elder',75]];
  return js('div',{className:'appearance-editor',children:[
   js('div',{className:'appearance-live','aria-live':'polite',children:[j(yo,{appearance:a,sex,age:showFuture?previewAge:age}),js('div',{children:[j('h2',{children:name||'Your character'}),j('p',{children:country||sex}),j('p',{children:`Age ${showFuture?previewAge:age} · ${ages.find((x,i)=> (showFuture?previewAge:age)<(ages[i+1]?.[1]??200))?.[0]||'Elder'}`})]})]}),
   js('div',{className:'age-preview-row',role:'group','aria-label':'Preview character aging',children:ages.map(([label,value])=>js(b,{type:'button',variant:'ghost','aria-label':`Preview ${label.toLowerCase()}`,'aria-pressed':showFuture&&previewAge===value,onClick:()=>{setPreviewAge(value);setShowFuture(true)},children:[j(yo,{appearance:a,sex,age:value}),j('span',{children:label})]},label))}),
   showFuture&&j(b,{type:'button',variant:'ghost',onClick:()=>setShowFuture(false),children:`Back to age ${age}`}),
   field('Hairstyle','hair',sex==='Male'?zf:Vf,false,true),field('Hair color','hairColor',Ef,true),field('Skin tone','skin',Of,true),
   field('Face shape','face',['Soft & round','Oval','Defined jaw']),field('Eye shape','eyeShape',Uf),field('Eye color','eyes',Rf,true),field('Nose','nose',['Classic','Button','Broad']),field('Lips','mouth',['Natural','Full','Delicate']),field('Freckles','freckles',['None','Freckles']),
   sex==='Male'&&field('Facial hair · grows in adulthood','beard',['Clean shaven','Stubble','Full beard','Goatee']),
   field('Outfit','clothing',Gf),field('Outfit color','outfit',qf,true)
  ]});
 }
 window.__IMM_APPEARANCE_COMPONENT=Editor;return Editor;
};
})();