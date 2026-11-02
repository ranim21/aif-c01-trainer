/* Test de bout en bout dans le navigateur (développement uniquement, non déployé).
   Usage : copier index.html en __smoke.html en ajoutant <script src="scripts/browser-smoke.js"></script> après js/app.js,
   servir le dossier (python -m http.server) et ouvrir __smoke.html : le rapport s affiche en bas de page. */
(function(){
  var log=[], A=window.App, $=function(s){return document.querySelector(s)}; A.go=function(r){ history.replaceState(null,"","#/"+r); A.render(); };
  function step(name, fn){ try{ fn(); log.push("ok "+name); }catch(e){ log.push("FAIL "+name+": "+e.message); } }
  function solve(){ var s=A.session, q=s.questions[s.idx], qs=s.qs;
    if(q.type==="ordering") qs.order=q.correct.slice(); else if(q.type==="matching") qs.match=q.correct.slice(); else qs.sel=q.correct.slice();
    Screens.play(); $("#validate").click(); }
  function playAll(wrongFirst){ var guard=0; while(A.session && !A.session.finished && guard++<40){ if(wrongFirst-->0){ var s=A.session,q=s.questions[s.idx]; if(q.type==="single"){s.qs.sel=[(q.correct[0]+1)%4]; Screens.play(); $("#validate").click();} else solve(); } else solve(); $("#next").click(); } }
  step("onboarding", function(){ $("#pseudo").value="Testeur"; $("#go").click(); });
  step("map", function(){ A.go("map"); A.render(); if(!document.querySelectorAll(".node").length) throw Error("no nodes"); });
  step("level sheet", function(){ Screens.levelSheet("w1-1.1"); $("#lvPlay").click(); });
  step("joker fifty+hint", function(){ var b=document.querySelector('[data-j="hint"]'); b.click(); });
  step("play level 1.1", function(){ playAll(1); if(!/Niveau réussi/.test($("#main").textContent)) throw Error("result: "+$("#main").textContent.slice(0,120)); });
  step("unlock 1.2", function(){ if(!Engine.isUnlocked(A.state,A.levels,"w1-1.2")) throw Error("locked"); });
  ["w1-1.2","w1-1.3","w1-mix","w1-boss"].forEach(function(id){ step("play "+id, function(){ Screens.startLevel(id); A.render(); playAll(0); if(!A.state.levels[id].passed) throw Error("not passed"); }); });
  step("boss badge", function(){ if(!A.state.badges.boss1) throw Error("no boss1 badge"); });
  step("stats", function(){ A.go("stats"); A.render(); if(!$(".radar")) throw Error("no radar"); });
  step("shop buy", function(){ A.state.coins+=500; A.go("shop"); A.render(); $('[data-buy="th_ocean"]').click(); $('[data-equip="th_ocean"]').click(); if(document.documentElement.dataset.color!=="ocean") throw Error("theme"); });
  step("profile", function(){ A.go("profile"); A.render(); $("#pExport").click(); if(!/aif-c01-quest/.test($("#exTxt").value)) throw Error("export"); });
  step("course", function(){ A.go("course/1"); A.render(); if(document.querySelectorAll("details.section").length<10) throw Error("sections"); if(!document.querySelector(".diagram svg")) throw Error("diagram"); });
  step("labs", function(){ A.go("labs/1"); A.render(); document.querySelector("[data-reveal]").click(); });
  step("flash", function(){ A.go("flash/1"); A.render(); $("#card").click(); $("#nxt").click(); });
  step("modes free", function(){ A.go("modes"); A.render(); $("#fGo").click(); playAll(2); });
  step("dungeon", function(){ A.go("modes"); A.render(); $("#dGo").click(); playAll(0); });
  step("hardcore", function(){ A.go("modes"); A.render(); $("#hGo").click(); playAll(0); });
  step("ordering+matching widget", function(){ var q=A.allQuestions.filter(function(x){return x.type==="ordering"||x.type==="matching"}); A.session=Engine.createSession({mode:"free",questions:q}); A.go("play"); A.render();
      var s=A.session; if(s.questions[0].type==="ordering"){ document.querySelector("[data-order]").click(); } else { var sel=document.querySelector("select[data-match]"); sel.value=sel.options[1].value; sel.dispatchEvent(new Event("change",{bubbles:true})); } playAll(0); });
  step("exam", function(){ A.go("modes"); A.render(); $("#eGo").click(); $("#xGo").click(); A.render();
     var ex=A.state.examInProgress; ex.ids.forEach(function(id,k){ var q=A.qById[id]; if(k<10) ex.resp[k]=q.correct.slice(); }); ex.flags[2]=true; A.save(); A.render(); $("#xGrid").click(); $("#xSubmit").click(); document.querySelector('[data-x="yes"]').click();
     if(!/\/ 1000/.test($("#main").textContent)) throw Error("no exam result"); });
  step("exam badge", function(){ if(!A.state.badges.exam_done) throw Error("no exam badge"); });
  step("reset", function(){ A.go("profile"); A.render(); $("#pReset").click(); document.querySelector('[data-x="yes"]').click(); if(A.state.xp!==0) throw Error("not reset"); });
  var pre=document.createElement("pre"); pre.id="smokeout"; pre.textContent="SMOKE\n"+log.join("\n")+"\nERRS:"+JSON.stringify(window.__errs); document.body.appendChild(pre);
})();
