const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

// Mobile nav
$('#navToggle').addEventListener('click',()=>$('#mainNav').classList.toggle('show'));
$$('.nav-link').forEach(a=>a.addEventListener('click',()=>$('#mainNav').classList.remove('show')));

// Theme
$('#themeToggle').addEventListener('click',()=>{
 document.body.classList.toggle('dark');
 $('#themeToggle i').className=document.body.classList.contains('dark')?'bi bi-sun':'bi bi-moon-stars';
 localStorage.setItem('ajajTheme',document.body.classList.contains('dark')?'dark':'light');
});
if(localStorage.getItem('ajajTheme')==='dark'){document.body.classList.add('dark');$('#themeToggle i').className='bi bi-sun'}

// Typing
const words=['responsive websites.','Laravel applications.','Django solutions.','MySQL databases.','modern digital experiences.'];
let wi=0,ci=0,del=false;
function type(){let w=words[wi];$('#typing').textContent=w.slice(0,ci);if(!del&&ci<w.length){ci++;setTimeout(type,70)}else if(!del){del=true;setTimeout(type,1100)}else if(ci>0){ci--;setTimeout(type,35)}else{del=false;wi=(wi+1)%words.length;setTimeout(type,300)}} type();

// Scroll progress + top
window.addEventListener('scroll',()=>{
 const h=document.documentElement.scrollHeight-innerHeight;
 $('#scrollProgress').style.width=(scrollY/h*100)+'%';
});
$('#topBtn').onclick=()=>scrollTo({top:0,behavior:'smooth'});

// Counters
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
 if(e.isIntersecting){document.querySelectorAll('.counter').forEach(el=>{let t=+el.dataset.target,n=0,step=Math.max(1,Math.ceil(t/40));const go=()=>{n=Math.min(t,n+step);el.textContent=n+(t===100?'%':t===24?'':'');if(n<t)requestAnimationFrame(go)};go()});observer.disconnect()}
}),{threshold:.3});observer.observe($('#counters'));

// Project filter
$$('.filter').forEach(btn=>btn.onclick=()=>{
 $$('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
 const f=btn.dataset.filter;
 $$('.project-item').forEach(p=>p.style.display=(f==='all'||p.dataset.cat===f)?'block':'none');
});

// Particles
for(let i=0;i<45;i++){const p=document.createElement('span');p.className='particle';p.style.left=Math.random()*100+'%';p.style.top=Math.random()*100+'%';p.style.opacity=(.15+Math.random()*.4);p.style.animation=`float ${4+Math.random()*8}s ease-in-out infinite`;$('#particles').appendChild(p)}
const st=document.createElement('style');st.textContent='@keyframes float{50%{transform:translateY(-25px) translateX(15px)}}';document.head.appendChild(st);

// Gallery upload + local persistence
const gallery=$('#galleryGrid'), upload=$('#photoUpload');
function addGalleryImage(src,name){
 const card=document.createElement('div');card.className='gallery-card';
 card.innerHTML=`<img src="${src}" alt="${name}"><div class="gallery-caption"><b>${name}</b><span>Personal Photo</span><div><button class="like"><i class="bi bi-heart"></i></button><button class="share"><i class="bi bi-share"></i></button></div></div>`;
 gallery.prepend(card);
 card.querySelector('img').onclick=()=>openLightbox(src,name);
 card.querySelector('.like').onclick=()=>card.querySelector('.like i').classList.toggle('bi-heart-fill');
 card.querySelector('.share').onclick=async()=>{try{await navigator.share({title:name,url:location.href})}catch(e){navigator.clipboard?.writeText(location.href);alert('Page link copied.')}};
}
upload.addEventListener('change',e=>{
 [...e.target.files].forEach(file=>{const r=new FileReader();r.onload=ev=>{addGalleryImage(ev.target.result,file.name);savePhoto(ev.target.result,file.name)};r.readAsDataURL(file)});
});
function savePhoto(src,name){let a=JSON.parse(localStorage.getItem('ajajGallery')||'[]');a.push({src,name});if(a.length>20)a=a.slice(-20);localStorage.setItem('ajajGallery',JSON.stringify(a))}
function loadPhotos(){try{JSON.parse(localStorage.getItem('ajajGallery')||'[]').forEach(x=>addGalleryImage(x.src,x.name))}catch(e){}}
loadPhotos();
$('#clearGallery').onclick=()=>{if(confirm('Clear uploaded demo photos?')){localStorage.removeItem('ajajGallery');location.reload()}};

// Featured profile image: first uploaded image can be used as featured
upload.addEventListener('change',e=>{if(e.target.files[0]){const r=new FileReader();r.onload=ev=>$('#featuredPhoto').innerHTML=`<img src="${ev.target.result}" alt="Ajaj Ahmad">`;r.readAsDataURL(e.target.files[0])}});

// Lightbox
function openLightbox(src,caption){$('#lbImg').src=src;$('#lbCaption').textContent=caption;$('#lightbox').classList.add('show')}
$('#lbClose').onclick=()=>$('#lightbox').classList.remove('show');
$('#lightbox').onclick=e=>{if(e.target.id==='lightbox')$('#lightbox').classList.remove('show')};

// Existing placeholder cards
$$('.gallery-card').forEach(card=>{const like=card.querySelector('.like');if(like)like.onclick=()=>like.querySelector('i').classList.toggle('bi-heart-fill')});

// Slideshow: rotate uploaded image cards in lightbox
$('#slideshowBtn').onclick=()=>{
 const imgs=[...gallery.querySelectorAll('img')]; if(!imgs.length){alert('Upload some photos first.');return}
 let i=0;openLightbox(imgs[0].src,imgs[0].alt);
 const int=setInterval(()=>{i++;if(i>=imgs.length){clearInterval(int);return}$('#lbImg').src=imgs[i].src;$('#lbCaption').textContent=imgs[i].alt},2200);
};

// AI demo widget
$('#aiBtn').onclick=()=>$('#aiWidget').classList.toggle('show');
$('#aiClose').onclick=()=>$('#aiWidget').classList.remove('show');
function aiReply(q){q=q.toLowerCase();if(q.includes('skill'))return'Ajaj works with PHP, Laravel, Python, Django, MySQL, HTML, CSS, JavaScript and Bootstrap.';if(q.includes('project'))return'Projects include School Management, Employee Management, E-commerce, Django CRUD, College Website and Developer Portfolio.';if(q.includes('contact')||q.includes('whatsapp'))return'WhatsApp: +91 99193 84366. Email: ajajahmad0info@gmail.com';return'I can tell you about Ajaj’s skills, projects and contact details.'}
function sendAI(){const inp=$('#aiInput'),q=inp.value.trim();if(!q)return;$('#aiMessages').insertAdjacentHTML('beforeend',`<div class="ai-msg"><b>You:</b> ${q}</div><div class="ai-msg">${aiReply(q)}</div>`);inp.value='';$('#aiMessages').scrollTop=99999}
$('#aiSend').onclick=sendAI;$('#aiInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendAI()});

// Contact -> WhatsApp
$('#contactForm').addEventListener('submit',e=>{e.preventDefault();const n=$('#cName').value,p=$('#cPhone').value,em=$('#cEmail').value,m=$('#cMessage').value;const txt=`Hello Ajaj Ahmad,%0AName: ${encodeURIComponent(n)}%0AMobile: ${encodeURIComponent(p)}%0AEmail: ${encodeURIComponent(em)}%0AProject: ${encodeURIComponent(m)}`;open(`https://wa.me/919919384366?text=${txt}`,'_blank')});
