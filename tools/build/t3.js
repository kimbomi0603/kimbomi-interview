const { chromium } = require('playwright');
(async()=>{
 const b=await chromium.launch();const errs=[];
 const base='file:///home/claude/kimbomi0603/kimbomi-interview/dashboard.html';
 async function shot(hash,name,wait,w){const p=await b.newPage({viewport:{width:w||1280,height:900}});p.on('pageerror',e=>errs.push(hash+': '+e.message));
   await p.goto(base+hash);await p.waitForTimeout(wait||1200);await p.screenshot({path:name,fullPage:false});
   const info=await p.evaluate(()=>[location.hash,document.querySelectorAll('#main .row').length,document.querySelector('#main h1')?.textContent]);console.log(name,JSON.stringify(info));return p}
 await shot('','h_home.png');
 let p=await shot('#event/rival','h_rival.png');
 await p.click('#main .row .rh');await p.waitForTimeout(300);await p.screenshot({path:'h_rival_open.png'});
 await shot('#event/keynote','h_key.png');
 await shot('#yonsei/3208','h_y3208.png');
 await shot('#archive','h_arch.png');
 await shot('#media/'+encodeURIComponent('전격시사(8.12)'),'h_media.png');
 await shot('#topics','h_topics.png');
 await shot('#topic/'+encodeURIComponent('기탁금'),'h_topic.png');
 await shot('#search/'+encodeURIComponent('폐버스'),'h_search.png');
 await shot('#msg','h_msg.png');
 await shot('#card/2707','h_card.png');
 await shot('#signal','h_signal.png');
 await shot('#gov','h_gov.png',16000);
 p=await shot('#gov','h_gov2.png',14000);
 await p.click('[data-gt="youth"]');await p.waitForTimeout(6000);await p.screenshot({path:'h_gov_youth.png'});
 await shot('','h_home_m.png',1200,390);
 await shot('#event/keynote','h_key_m.png',1200,390);
 console.log('errors',JSON.stringify(errs.filter(e=>!/auto-points/.test(e)).slice(0,8)));
 await b.close();
})();
