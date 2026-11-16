/* communaute.js — rubrique « Applis de la communauté » du portail Mes Apps EPS.
   Catalogue : communaute.json (alimenté automatiquement quand une proposition de la FabrikApplis EPS est validée).
   Dépend des fonctions du script principal : $, esc, tc, APPS, draw ; et de config.js : FABRIQUE. */
(function(){
const FAB=typeof FABRIQUE!=='undefined'?FABRIQUE:'https://vinztoc.github.io/Fabrique_Applis_EPS/';
let C=[];
const meme=u=>{try{return new URL(u,location.href).origin===location.origin}catch(e){return false}};
$('#cmF').href=FAB;
function tileC(a,i){return `<a class="tile"${tc(a)} href="#" data-cm="${i}" title="${esc(a.desc||'')}"><span class="ic">${a.icon?`<img src="${esc(a.icon)}" alt="" width=76 height=76 onerror="this.replaceWith(document.createTextNode('${esc(a.emoji||'🧩')}'))">`:esc(a.emoji||'🧩')}</span><b>${esc(a.nom)}</b>${a.desc?`<small>${esc(a.desc)}</small>`:''}${a.auteur?`<i class="au">par ${esc(a.auteur)}</i>`:''}</a>`}
function drawC(){const A=$('#cmA').value,K=$('#cmC').value;
 const L=C.map((a,i)=>[a,i]).filter(([a])=>(!A||a.activite===A)&&(!K||a.cible===K));
 $('#appsC').innerHTML=L.map(([a,i])=>tileC(a,i)).join('')||(C.length?'<p class="rgpd">Aucune appli pour ce filtre.</p>':`<p class="rgpd">Aucune appli partagée pour le moment. Créez la première avec la <a href="${esc(FAB)}" target="_blank" rel="noopener" style="color:var(--c1);font-weight:700">FabrikApplis EPS</a> et proposez-la depuis l'étape 5.</p>`)}
function ficheC(a){const b=a.besoin||{},d=a.date?a.date.split('-').reverse().join('/'):'';
 $('#fbody').innerHTML=`<div class="fh"><div class="av" style="font-size:1.8rem">${esc(a.emoji||'🧩')}</div><div><b>${esc(a.nom)}</b><br><span>${esc(a.desc||'')}</span></div></div>
 <div class="fa"><h3>🎯 Le besoin</h3><dl>
  ${b.pour?`<dt>Pour</dt><dd>${{eleve:'les élèves',prof:'l\'enseignant',deux:'l\'enseignant et les élèves'}[b.pour]||esc(b.pour)}</dd>`:''}
  ${(b.libelles||[]).length?`<dt>Besoins</dt><dd>${b.libelles.map(x=>`<span class="chip">${esc(x)}</span>`).join(' ')}</dd>`:''}
  ${b.probleme?`<dt>Situation</dt><dd>${esc(b.probleme)}</dd>`:''}
  ${b.reussite?`<dt>Réussite</dt><dd>${esc(b.reussite)}</dd>`:''}
  ${b.objectif?`<dt>Objectif</dt><dd>${esc(b.objectif)}</dd>`:''}</dl></div>
 <div class="fa"><h3>ℹ️ L'appli</h3><dl>
  <dt>Utilisée par</dt><dd>${a.cible==='eleve'?'🎒 les élèves':'🧑‍🏫 le professeur'}</dd>
  ${a.activite?`<dt>Activité</dt><dd>${esc(a.activite)}</dd>`:''}${a.niveau?`<dt>Niveau</dt><dd>${esc(a.niveau)}</dd>`:''}
  ${a.auteur?`<dt>Auteur</dt><dd>${esc(a.auteur)}${a.etablissement?' — '+esc(a.etablissement):''}${a.academie?' ('+esc(a.academie)+')':''}</dd>`:''}
  ${d?`<dt>Partagée le</dt><dd>${d}</dd>`:''}</dl></div>
 <p class="rgpd">${a.cible==='eleve'?'Appli élève : les élèves s\'identifient eux-mêmes et vous remettent leur fichier .xlsx, à importer sur l\'accueil.':(meme(a.url)?'Hébergée sur le même domaine que le portail : elle lit et complète directement votre liste d\'élèves sur cet appareil.':'Hébergée hors du portail : si la liste des élèves n\'apparaît pas dans l\'appli, utilisez son bouton « Charger la liste » avec le fichier compilé exporté depuis l\'onglet Élèves, puis importez son export .xlsx ici.')}</p>
 <div class="row"><a class="btn b" href="${esc(a.url)}" target="_blank" rel="noopener" style="text-decoration:none">↗ Ouvrir l'appli</a><a class="btn" href="${esc(FAB+'?inspire='+encodeURIComponent(a.id||a.url))}" target="_blank" rel="noopener" style="text-decoration:none">💡 S'en inspirer</a>${a.depot?`<a class="btn r" href="${esc(a.depot)}" target="_blank" rel="noopener" style="text-decoration:none">{ } Code</a>`:''}</div>`;
 $('#fiche').hidden=false}
$('#appsC').onclick=e=>{const t=e.target.closest('[data-cm]');if(!t)return;e.preventDefault();ficheC(C[+t.dataset.cm])};
$('#cmA').onchange=$('#cmC').onchange=drawC;
fetch('communaute.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(L=>{
 C=(Array.isArray(L)?L:[]).filter(a=>a&&a.nom&&/^https:\/\//.test(a.url||'')).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 const acts=[...new Set(C.map(a=>a.activite).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
 $('#cmA').innerHTML='<option value="">Toutes les APSA</option>'+acts.map(a=>`<option>${esc(a)}</option>`).join('');
 /* noms et emojis des applis de la communauté dans l'onglet Élèves */
 const add=C.filter(a=>a.id&&!APPS.some(x=>x.id===a.id));if(add.length){APPS=APPS.concat(add);draw()}
 drawC()}).catch(()=>{$('#appsC').innerHTML='<p class="rgpd">Catalogue de la communauté indisponible (hors connexion ou fichier communaute.json absent).</p>'});
})();
