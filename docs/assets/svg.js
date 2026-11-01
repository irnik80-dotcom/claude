/* Közös, blokkos ábrasegéd */
window.SV = {
  svg:function(label, inner){ return '<svg viewBox="0 0 320 160" role="img" aria-label="'+label+'" font-family="Lexend,system-ui,sans-serif" font-weight="700">'+inner+'</svg>'; },
  r:function(x,y,w,h,f){ return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+f+'" stroke="#1b2618" stroke-width="3"/>'; },
  t:function(x,y,s,sz,a,f){ return '<text x="'+x+'" y="'+y+'" font-size="'+(sz||13)+'" text-anchor="'+(a||'middle')+'" fill="'+(f||'currentColor')+'">'+s+'</text>'; },
  arrow:function(x1,y,x2,col){ var d=x2>x1?-10:10; return '<line x1="'+x1+'" y1="'+y+'" x2="'+x2+'" y2="'+y+'" stroke="'+(col||'#d6403f')+'" stroke-width="6"/><polygon points="'+x2+','+y+' '+(x2+d)+','+(y-10)+' '+(x2+d)+','+(y+10)+'" fill="'+(col||'#d6403f')+'"/>'; },
  sun:function(x,y){ var o=''; [[-34,0],[34,0],[0,-34],[0,34],[-24,-24],[24,-24],[-24,24],[24,24]].forEach(function(d){ o+='<rect x="'+(x+d[0]-5)+'" y="'+(y+d[1]-5)+'" width="10" height="10" fill="#f2b705"/>'; }); return o+SV.r(x-20,y-20,40,40,'#ffd23f'); },
  fire:function(x,y){ return SV.r(x,y,10,10,'#ff9f1c')+SV.r(x+10,y-10,10,20,'#ff6b1c')+SV.r(x+20,y,10,10,'#ffd23f'); }
};
SV.graphST = function(lines){ /* lines: [{k:sebesség m/s,c:szín,n:név}] ; tengely: t 0-4 s, s 0-80 m */
  var o='', X=function(t){return 40+t*65}, Y=function(s){return 170-s*1.875}, i;
  for(i=0;i<=4;i++){ o+='<line x1="'+X(i)+'" y1="20" x2="'+X(i)+'" y2="170" stroke="#8b8f87" stroke-width="1"/>'+SV.t(X(i),188,i,12); }
  for(i=0;i<=80;i+=20){ o+='<line x1="40" y1="'+Y(i)+'" x2="300" y2="'+Y(i)+'" stroke="#8b8f87" stroke-width="1"/>'+SV.t(32,Y(i)+4,i,12,'end'); }
  o+='<line x1="40" y1="170" x2="300" y2="170" stroke="currentColor" stroke-width="3"/><line x1="40" y1="170" x2="40" y2="15" stroke="currentColor" stroke-width="3"/>'+SV.t(300,200,'t (s)',12,'end')+SV.t(44,12,'s (m)',12,'start');
  lines.forEach(function(l){ var t2=Math.min(4,80/l.k); o+='<line x1="'+X(0)+'" y1="'+Y(0)+'" x2="'+X(t2)+'" y2="'+Y(l.k*t2)+'" stroke="'+l.c+'" stroke-width="5"/>'+SV.t(X(t2)+6,Y(l.k*t2)+4,l.n,14,'start',l.c); });
  return '<svg viewBox="0 0 320 205" role="img" aria-label="Út–idő grafikon" font-family="Lexend,system-ui,sans-serif" font-weight="700">'+o+'</svg>'; };

/* képletháromszög: top = felül, l = bal alul, r = jobb alul */
SV.tri = function(label, top, l, r, cap){
  return SV.svg(label, SV.r(110,10,100,50,'#ffd23f')+SV.t(160,46,top,30,'middle','#1b2618')+
    SV.r(40,78,100,50,'#9fe07f')+SV.t(90,114,l,30,'middle','#1b2618')+SV.r(180,78,100,50,'#8fc2f5')+SV.t(230,114,r,30,'middle','#1b2618')+
    SV.t(160,150,cap||'',12)); };
/* folyamatábra: items = [[szöveg, szín], ...], labels = nyilak feliratai */
SV.flow = function(label, items, labels, cap){
  var n=items.length, w=Math.min(84, (300-(n-1)*34)/n), gap=(300-n*w)/(n-1||1), o='';
  items.forEach(function(it,i){ var x=10+i*(w+gap);
    o+=SV.r(x,50,w,44,it[1])+SV.t(x+w/2,77,it[0],w>70?13:11,'middle','#1b2618');
    if(i<n-1){ var ax=x+w+3, bx=x+w+gap-3; o+='<line x1="'+ax+'" y1="72" x2="'+(bx-8)+'" y2="72" stroke="#d6403f" stroke-width="4"/><polygon points="'+bx+',72 '+(bx-9)+',65 '+(bx-9)+',79" fill="#d6403f"/>';
      if(labels&&labels[i]) o+=SV.t((ax+bx)/2,44,labels[i],10,'middle'); } });
  return SV.svg(label, o+(cap?SV.t(160,135,cap,12):'')); };
/* hullám */
SV.wave = function(label, amp, periods, cap){
  var pts=[], N=120, i; for(i=0;i<=N;i++){ var x=20+i*(280/N); pts.push(x+','+(80-amp*Math.sin(i/N*periods*2*Math.PI))); }
  return SV.svg(label,'<line x1="20" y1="80" x2="300" y2="80" stroke="#8b8f87" stroke-width="2" stroke-dasharray="5 4"/><polyline points="'+pts.join(' ')+'" fill="none" stroke="#2f7fd1" stroke-width="5"/>'+(cap?SV.t(160,150,cap,12):'')); };
/* címkézett dobozok sorban */
SV.boxes = function(label, items, cap){
  var n=items.length, w=(300-(n-1)*8)/n, o='';
  items.forEach(function(it,i){ var x=10+i*(w+8); o+=SV.r(x,40,w,60,it[1])+SV.t(x+w/2,76,it[0],w>110?13:(w>60?11:(w>45?9:8)),'middle','#1b2618'); });
  return SV.svg(label,o+(cap?SV.t(160,130,cap,12):'')); };
