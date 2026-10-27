const fs=require('fs');const D=require('docx');
const {Document,Packer,Paragraph,TextRun,HeadingLevel,AlignmentType,PageBreak,Table,TableRow,TableCell,WidthType,BorderStyle,ShadingType}=D;
const data=JSON.parse(fs.readFileSync('script_data.json','utf8'));
const F='Batang', FS='Malgun Gothic';
const P=(runs,o={})=>new Paragraph({spacing:{after:o.after??200,line:o.line??360},alignment:o.align,children:runs,...(o.extra||{})});
const T=(t,o={})=>new TextRun({text:t,font:o.font||F,size:o.size||28,bold:o.bold,color:o.color,italics:o.italics});
const kids=[];
kids.push(new Paragraph({children:[T('연세대 정치외교학과 여야정책토론회 · 발언 원고',{font:FS,size:36,bold:true})],spacing:{after:120}}));
kids.push(P([T('2026.10.27(화) 19:00~21:00 · 연희관 401호 · 18:40 도착  |  의제 ① 청년 주거 ② 청년 일자리  |  토론자 김보미 · 김성열(전 개혁신당 최고위원) · 박태훈(진보당 전국대학생준비위원장)',{font:FS,size:20,color:'555555'})],{after:120}));
kids.push(P([T('굵은 글씨 = 꼭 할 말.  회색 괄호 = 시간 없으면 생략.  숫자는 전부 출처 확인됨(준비노트 근거표 3202).',{font:FS,size:20,color:'555555'})],{after:300}));
// 차례
kids.push(new Paragraph({children:[T('차례',{font:FS,size:26,bold:true})],spacing:{after:80}}));
data.secs.forEach(s=>kids.push(P([T(s.title+'  ',{font:FS,size:22}),T(s.sub,{font:FS,size:20,color:'777777'})],{after:40,line:300})));
kids.push(P([T('7. 받아치기 한 줄 (상대가 칠 말 → 답)  ',{font:FS,size:22}),T(data.asks.length+'개',{font:FS,size:20,color:'777777'})],{after:40,line:300}));
kids.push(P([T('8. 당일 체크·금지어',{font:FS,size:22})],{after:40,line:300}));
kids.push(new Paragraph({children:[new PageBreak()]}));
data.secs.forEach((s,i)=>{
  kids.push(new Paragraph({children:[T(s.title,{font:FS,size:30,bold:true})],spacing:{before:i?360:0,after:60},keepNext:true}));
  kids.push(P([T(s.sub,{font:FS,size:20,color:'777777'})],{after:200}));
  s.lines.forEach((l,j)=>{
    const must=l.startsWith('★'); const t=l.replace(/^★\s*/,''); const opt=/^\(/.test(t); const c=(s.cite||[])[j];
    kids.push(P([T(t,{bold:must,color:opt?'8A8A8A':undefined,size:opt?26:28})],{after:c?40:220,line:400}));
    if(c) kids.push(P([T('출처 · '+c,{font:FS,size:16,color:'8A93A3'})],{after:200,line:260}));
  });
  if(s.warn) kids.push(P([T('⚠ '+s.warn,{font:FS,size:20,color:'9A5A00'})],{after:200}));
  if(s.src&&s.src.length){kids.push(P([T('출처',{font:FS,size:18,bold:true,color:'555555'})],{after:40}));s.src.forEach(x=>kids.push(P([T('· '+x,{font:FS,size:17,color:'666666'})],{after:20,line:260})));}
  if(i<data.secs.length-1 && s.brk) kids.push(new Paragraph({children:[new PageBreak()]}));
});
kids.push(new Paragraph({children:[new PageBreak()]}));
kids.push(new Paragraph({children:[T('7. 받아치기 한 줄',{font:FS,size:30,bold:true})],spacing:{after:60}}));
kids.push(P([T('상대가 칠 말 → 먼저 인정 → 받아치기. 전문은 준비노트 「학습」.',{font:FS,size:20,color:'777777'})],{after:200}));
const cw=[1500,2600,5600];
const cell=(t,w,o={})=>new TableCell({width:{size:w,type:WidthType.DXA},shading:o.sh?{type:ShadingType.CLEAR,fill:o.sh,color:'auto'}:undefined,margins:{top:80,bottom:80,left:100,right:100},children:(Array.isArray(t)?t:[t]).map(x=>new Paragraph({spacing:{after:0,line:280},children:[T(x,{font:FS,size:19,bold:o.bold})]}))});
const rows=[new TableRow({tableHeader:true,children:[cell('의제·누가',cw[0],{sh:'E8EDF5',bold:true}),cell('상대가 칠 말',cw[1],{sh:'E8EDF5',bold:true}),cell('인정할 것 → 받아치기',cw[2],{sh:'E8EDF5',bold:true})]})];
data.asks.forEach(a=>rows.push(new TableRow({children:[cell([a[0],a[1]],cw[0]),cell(a[2],cw[1]),cell(['✔ '+a[3],'🗣 '+a[4]],cw[2])]})));
kids.push(new Table({width:{size:9700,type:WidthType.DXA},columnWidths:cw,rows}));
kids.push(new Paragraph({children:[T('8. 당일 체크·금지어',{font:FS,size:30,bold:true})],spacing:{before:400,after:120}}));
data.warn.forEach(w=>kids.push(P([T(w.replace(/^★\s*/,''),{font:FS,size:22,bold:w.startsWith('★')})],{after:120,line:320})));
const doc=new Document({styles:{default:{document:{run:{font:F,size:28}}}},sections:[{properties:{page:{margin:{top:1300,bottom:1200,left:1300,right:1300}}},children:kids}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync('김보미_연세대토론회_발언원고_1027.docx',b);console.log('ok',b.length)});
