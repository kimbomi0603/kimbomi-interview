const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();
p.on('pageerror',e=>console.log('ERR',e.stack.split('\n').slice(0,3).join(' | ')));
await p.goto('file:///home/claude/kimbomi0603/kimbomi-interview/dashboard.html#study');await p.waitForTimeout(500);
await p.goto('file:///home/claude/kimbomi0603/kimbomi-interview/dashboard.html#study/a1');await p.waitForTimeout(500);
await b.close()})();
