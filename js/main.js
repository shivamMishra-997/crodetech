/* Crode Tech — shared behaviour: smooth scroll, loader, page fades, reveals, menu, filter, contact form. No data is stored anywhere. */
(function(){
var d=document,h=d.documentElement,R=matchMedia('(prefers-reduced-motion:reduce)').matches,WA='919974417359',MAIL='crodetech@gmail.com';
var $=function(q,c){return(c||d).querySelector(q)},$$=function(q,c){return[].slice.call((c||d).querySelectorAll(q))};
h.classList.add('ok');
/* smooth scroll (Lenis from CDN; falls back to CSS smooth scroll) */
var L=null;try{if(window.Lenis&&!R){L=new Lenis({lerp:.1});requestAnimationFrame(function t(x){L.raf(x);requestAnimationFrame(t)})}}catch(e){L=null}
function go(t){if(L)L.scrollTo(t,{offset:t===0?0:-90,duration:1.2});else if(t===0)scrollTo({top:0,behavior:R?'auto':'smooth'});else t.scrollIntoView({behavior:R?'auto':'smooth'})}
/* loader + page fade-in */
var pt=$('.pt');if(pt)pt.style.animation='none';
function reveals(){var els=$$('.rv');els.forEach(function(e){var i=[].filter.call(e.parentNode.children,function(c){return c.classList.contains('rv')}).indexOf(e);e.style.setProperty('--d',Math.min(i,5)*.07+'s')});
if(R||!('IntersectionObserver'in window)){els.forEach(function(e){e.classList.add('in')});return}
var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -4% 0px'});els.forEach(function(e){o.observe(e)})}
function show(){if(pt)pt.classList.add('is-hidden');h.classList.add('ready');h.classList.remove('intro');reveals();
if(location.hash){var t=d.getElementById(location.hash.slice(1));if(t){if(L)L.scrollTo(t,{immediate:true,offset:-90});else t.scrollIntoView()}}}
var ld=new Promise(function(r){d.readyState==='complete'?r():addEventListener('load',r)}),cap=new Promise(function(r){setTimeout(r,2500)});
Promise.race([ld,cap]).then(function(){setTimeout(show,Math.max(0,(h.classList.contains('intro')?1100:120)-performance.now()))});
try{sessionStorage.setItem('ct-seen','1')}catch(e){}
/* page fade-out, then navigate */
function leave(u){if(R||!pt){location.href=u;return}pt.classList.remove('is-hidden');pt.classList.add('is-leaving');if(L)L.stop();setTimeout(function(){location.href=u},420);setTimeout(function(){pt.classList.remove('is-leaving');pt.classList.add('is-hidden');if(L)L.start()},3000)}
addEventListener('pageshow',function(e){if(e.persisted){h.classList.remove('open');if(pt){pt.classList.remove('is-leaving');pt.classList.add('is-hidden')}if(L)L.start()}});
/* menu */
var bg=$('#bg');function shut(){h.classList.remove('open');bg.setAttribute('aria-expanded','false');if(L)L.start()}
bg.onclick=function(){var o=!h.classList.contains('open');h.classList.toggle('open',o);bg.setAttribute('aria-expanded',o);if(L)o?L.stop():L.start()};
$('#sc').onclick=shut;$('.x').onclick=shut;addEventListener('keydown',function(e){if(e.key==='Escape')shut()});
/* links: same-page anchors glide, other pages fade */
d.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');
if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download'))return;
if(a.protocol!==location.protocol||a.host!==location.host)return;
if(a.pathname===location.pathname&&a.search===location.search){e.preventDefault();shut();var t=a.hash?d.getElementById(a.hash.slice(1)):0;go(t||0);if(t){if(t.id==='main'){t.tabIndex=-1;t.focus({preventScroll:true})}try{history.pushState(null,'',a.hash)}catch(x){}}return}
if(!/(\.html?|\/)$/.test(a.pathname))return;e.preventDefault();shut();leave(a.href)});
/* lazy images: fade in when loaded, keep the placeholder if a file is missing */
$$('.th img').forEach(function(i){if(i.complete)i.classList.add(i.naturalWidth?'is-loaded':'is-error')});
/* projects filter */
var fl=$('#fl');if(fl)fl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
$$('button',fl).forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});
var ps=$$('.pj');ps.forEach(function(p){p.classList.add('is-out')});
setTimeout(function(){ps.forEach(function(p){p.hidden=b.dataset.f!=='all'&&p.dataset.k!==b.dataset.f;p.classList.remove('is-out')})},R?0:250)});
/* contact form: validates, then opens WhatsApp with the message ready (email as fallback) */
var f=$('#enq');if(f){var q=new URLSearchParams(location.search),ms=$('#ms'),ty=$('#ty'),st=$('#fs');
if(q.get('plan'))ty.value=q.get('plan');if(q.get('project')&&!ms.value)ms.value='Hi Crode Tech, I would like a project similar to '+q.get('project')+'.';
f.addEventListener('submit',function(e){e.preventDefault();var ok=true,first=null;
[['nm',function(v){return v.trim().length>1},'Enter your name.'],['em',function(v){return/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim())},'Enter a valid email address.'],['ms',function(v){return v.trim().length>9},'Add a few details about your project (at least 10 characters).']].forEach(function(r){
var i=$('#'+r[0]),er=$('#'+r[0]+'e'),good=r[1](i.value);er.textContent=good?'':r[2];er.hidden=good;i.setAttribute('aria-invalid',!good);if(!good){ok=false;first=first||i}});
if(!ok){st.className='fs err';st.textContent='Some fields need attention. Fix them and send again.';first.focus();return}
var m='Hi Crode Tech,\nName: '+$('#nm').value.trim()+'\nEmail: '+$('#em').value.trim()+'\nNeed: '+ty.value+'\nBudget: '+($('#bd').value||'Not sure yet')+'\n\n'+ms.value.trim(),b=f.querySelector('[type=submit]');
b.disabled=true;b.textContent='Opening WhatsApp…';window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(m),'_blank','noopener');
setTimeout(function(){b.disabled=false;b.textContent='Send on WhatsApp'},1500);
st.className='fs ok';st.innerHTML='Your message is ready in WhatsApp. Press send there to reach us. Nothing is stored on this website. WhatsApp did not open? <a href="mailto:'+MAIL+'?subject='+encodeURIComponent('Project enquiry from '+$('#nm').value.trim())+'&body='+encodeURIComponent(m)+'">Send it by email instead</a>.'})}
$('.up').onclick=function(){go(0)};$('#yr').textContent=new Date().getFullYear();
})();
