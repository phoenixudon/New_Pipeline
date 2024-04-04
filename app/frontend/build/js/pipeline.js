!function(){"use strict";var e,t={4406:function(e,t,n){var a=jQuery,r=n.n(a);const o=document.querySelector("[name=csrfmiddlewaretoken]")?document.querySelector("[name=csrfmiddlewaretoken]").value:null,s=()=>new Date,i=()=>{const e=s();return[e.getFullYear(),e.getMonth()+1]},c=()=>s().getFullYear(),l=(e,t=30)=>{const n=Math.round(.5*t),a=(e=>{const t=e.match(/[\u3040-\u309F\u30A0-\u30FF\uFF01-\uFF5E\u4E00-\u9FAF\u3400-\u4DBF]/gu);return t?t.length:0})(e),r=e.length;return a>n?e.substring(0,n)+"...":a>=.66*t&&r>.5*t?e.substring(0,Math.round(.5*t))+"...":a>=.33*t&&r>.33*t?e.substring(0,.33*t)+"...":a>=.125*t&&r>.83*t?e.substring(0,Math.round(.83*t))+"...":r>t?e.substring(0,t)+"...":e},d=(e,t={})=>{const n=document.createElement(e);return t.classes&&("string"==typeof t.classes?n.classList.add(t.classes):n.classList.add(...t.classes)),t.attributes&&Object.keys(t.attributes).forEach((e=>{n.setAttribute(e,t.attributes[e])})),t.text&&(n.textContent=t.text),t.children&&t.children.forEach((e=>{n.appendChild(d(...e))})),t.id&&(n.id=t.id),t.data&&Object.keys(t.data).forEach((e=>{n.dataset[e]=t.data[e]})),n};var u=DataTable,m=n.n(u);let v="monthly",[p,h]=i();const b=e=>v=e,y=()=>v,g=()=>[p,h],f=([e,t])=>[p,h]=[e,t],_=()=>12!=h?[p,h+1]:[p+1,1],S=()=>1!=h?[p,h-1]:[p-1,12],j=()=>h==s().getMonth()+1&&p==c()||"all"===v,C=document.querySelector("input.unreceived"),w=document.querySelector("input.toggle-ongoing"),E=document.querySelector("input.only-ongoing"),L=document.querySelector("input.toggle-outstanding");let q=0;const x=e=>{q=e},I=()=>q,k=document.querySelector("#total-revenue-monthly-exp"),O=document.querySelector(".revenue-display-text.expected");function D(){O.textContent="monthly"!==y()||C.checked?"表示の案件　請求総額 (予定)":"表示の月　請求総額 (予定)"}document.querySelector(".revenue-display-text.actual");const T=document.querySelector("#add-job-spinner"),N=document.querySelector("#pipeline-month"),F=document.querySelector("#pipeline-year"),$=e=>d("option",{attributes:{value:e},text:`${e}年`});var R=n(8747);let A,M;const V=["ONGOING","READYTOINV"];let P=new Map;const H=()=>(M=document.querySelector("#job-table"),A=new(m())(M,{paging:!1,processing:!0,dom:"lfrtip",autoWidth:!0,order:[[9,"asc"],[7,"desc"],[3,"asc"]],orderClasses:!1,rowId:"id",language:{searchPlaceholder:"ジョブを探す",search:""},preDrawCallback:()=>x(0),drawCallback:()=>(D(),function(e,t){r().ajax({headers:{"X-CSRFToken":o},type:"GET",url:"/pipeline/revenue-data/"+e+"/"+t+"/",success:e=>{r()("#total-revenue-ytd").text(e.total_revenue_ytd),r()("#avg-revenue-ytd").text(e.avg_monthly_revenue_ytd),r()("#total-revenue-monthly-act").text(e.total_revenue_monthly_actual)},error:e=>console.warn(e)})}(...g()),void(k.textContent=`¥${I().toLocaleString()}`)),ajax:{url:`/pipeline/pipeline-data/${p}/${h}/`,dataSrc:e=>e.data},columns:[{data:null,render:(e,t,n)=>`<input type='checkbox' name='select' value=${n.id} class='form-check-input'>`},{data:"client_name",render:(e,t,n)=>`<a href="client-update/${n.client_id}">${e}</a>`},{data:"job_name",className:"job-label",render:(e,t,n)=>{const a=document.createElement("a");return a.setAttribute("href",`/pipeline/${n.id}/job-detail/`),V.includes(n.status)?a.textContent=l(e):a.textContent=`INV: ${l(n.invoice_name)}`,a}},{data:"job_code",className:"dt-center",render:(e,t,n)=>{const a=document.createElement("span");return a.classList.add("copyable","job-code"),a.textContent=e,V.includes(n.status)||(a.dataset.bsToggle="tooltip",a.dataset.bsPlacement="top",a.dataset.bsTitle=`${n.job_name}`,new R.m_(a)),a}},{data:"revenue",className:"revenue-amt",render:e=>`¥${e.toLocaleString()}`},{data:"total_cost",className:"px-4",render:{display:(e,t,n)=>`<a href="/pipeline/cost-add/${n.id}/">¥${e.toLocaleString()}</a>`,sort:e=>e}},{data:"profit_rate",className:"px-4",render:e=>`${e}%`},{data:"job_date",className:"invoice-period",render:{display:e=>{let t=new Date(e);return e?`${t.getFullYear()}年${t.getMonth()+1}月`:"---"},sort:e=>e}},{data:"job_type",name:"job_type"},{data:"status",type:"status",width:"120px",render:{display:(e,t,n)=>re(e,n)}},{data:"deposit_date",name:"deposit_date",className:"deposit-date",defaultContent:"---"},{data:"invoice_info_completed",name:"invoice_info_completed",visible:!1,render:(e,t,n)=>!!(n.invoice_name&&n.invoice_month&&n.invoice_year)},{data:"client_id",name:"client_id",visible:!1},{data:"all_invoices_paid",visible:!1}],columnDefs:[{target:0,className:"dt-center",searchable:!1},{targets:[4,5,6],className:"dt-right",createdCell:e=>r()(e).addClass("font-monospace")}],rowCallback:(e,t)=>le(e,t),createdRow:(e,t,n,a)=>{t.deposit_date||e.classList.add("payment-unreceived"),P.set(t.job_code,t.job_name),V.includes(t.status)?a.forEach((e=>e.classList.add("bg-primary-subtle","text-primary-emphasis"))):a.forEach((e=>e.classList.remove("bg-primary-subtle","text-primary-emphasis")))}}),function(){const e={ONGOING:1,READYTOINV:2,INVOICED1:3,INVOICED2:4,FINISHED:5,ARCHIVED:6};m().ext.type.order["status-pre"]=t=>e[t]||0}(),A),G=(()=>{let e,t,n;const a=()=>A||H();return{setCurrentRowID:t=>e=t,getCurrentRowID:()=>e,setCurrentSelectEl:e=>n=e,getCurrentSelectEl:()=>n,getClientID:()=>+A.cell(`#${e}`,"client_id:name").data(),keepTrackOfCurrentStatus:e=>{t=e},getStatus:()=>t,getOrInitTable:a,getTableEl:()=>a().table().container().querySelector("table"),refresh:()=>{A.ajax.reload()}}})();var K=n(414),X=n.p+"assets/images/check2-circle.svg",Y=(e,t,n={},a="")=>{const r=((e,t,n="")=>d("div",{id:n,classes:["toast","bg-success-subtle","border-0"],attributes:{role:"alert","aria-live":"assertive","aria-atomic":"true"},children:[["div",{classes:["toast-header"],children:[["img",{attributes:{src:X,alt:"success-icon"}}],["strong",{classes:["me-auto"],text:e}],["small",{classes:"text-muted",text:"Just now"}],["button",{classes:"btn-close",data:{bsDismiss:"toast"},attributes:{type:"button","aria-label":"Close"}}]]}],["div",{classes:["toast-body"],text:t}]]}))(e,t,a),o=document.querySelector(".toast-container");return o?o.appendChild(r):document.body.appendChild(r),new K.Toast(r,n)};document.querySelector("#new-client-modal");var J=n(9635),B=n.n(J);const Q=document.querySelector("#invoice-info-form"),U=()=>{Q.addEventListener("submit",(e=>{var t;(t=G.getStatus(),e=>{e.preventDefault();let{jobIDField:n,formData:a}=(e=>{const t=document.querySelector("#id_inv-invoice_recipient"),n=document.querySelector("#id_inv-invoice_name"),a=document.querySelector("#id_inv-job_id"),r=document.querySelector("#id_inv-invoice_year"),o=document.querySelector("#id_inv-invoice_month");let s={};return s["inv-invoice_recipient"]=t.value,s["inv-invoice_name"]=n.value,s["inv-job_id"]=a.value,s["inv-invoice_year"]=r.value,s["inv-invoice_month"]=o.value,s["inv-status"]=e,{jobIDField:a,formData:s}})(t);r().ajax({headers:{"X-CSRFToken":o},type:"POST",url:`/pipeline/set-client-invoice-info/${n.value}/`,data:a,dataType:"json",success:e=>{const t=e.data.job_name,n=e.data.invoice_name;W.modal.hide(),Y("Invoice details saved",`${t}\n        ${n}\n        `).show(),G.refresh(),Q.reset()},error:e=>se(e)})})(e),W.preventFromOpening()}))},W=(()=>{const[e,t]=((e,t=[])=>{const n=document.querySelector(e),a=new(B())(n);return t.forEach((e=>e())),[a,n]})("#set-job-invoice-info",[U]),n=document.querySelector("#set-invoice-modal-new-client-btn");let a=!1;const r=()=>{a=!0};return t.addEventListener("show.bs.modal",(()=>{r(),(()=>{const e=Q.querySelector("#id_inv-invoice_recipient"),t=Q.querySelector("#id_inv-job_id");e.value=G.getClientID(),t.value=G.getCurrentRowID()})()})),t.addEventListener("hide.bs.modal",(()=>{G.refresh(),Q.reset()})),n.addEventListener("click",(()=>r())),{modal:e,preventFromOpening:()=>{a=!1},letModalOpen:r,getOpenModal:()=>a,formRequiresCompletion:e=>{const t=["INVOICED1","INVOICED2","FINISHED","ARCHIVED"];return!((e=G.getOrInitTable(),t=G.getCurrentRowID())=>JSON.parse(e.cell("#"+t,"invoice_info_completed:name").node().textContent))()&&(e=>t.includes(e))(e)}}})();var z=W;let Z,ee,te=!1,ne=0;const ae=(e,t)=>t.row(`#${e.id}`).data(e).invalidate().draw(!1),re=(e,t)=>{const n=t.job_status_choices;let a=document.createElement("select");a.classList.add("form-control-plaintext","job-status-select"),a.setAttribute("name","job_status");for(const[t,r]of Object.entries(n)){let t=document.createElement("option");t.value=r[0],t.text=r[1],r[0]===e&&t.setAttribute("selected",""),a.appendChild(t)}return a.outerHTML},oe=e=>{"success"===e.status?ce(e.data):console.error(e.message)},se=e=>{ue(e.message)},ie=e=>{const t=e.target.value,n=G.getCurrentRowID();G.keepTrackOfCurrentStatus(t),z.formRequiresCompletion(t)?z.modal.show():((e,t)=>{r().ajax({headers:{"X-CSRFToken":o},type:"post",url:"/pipeline/pl-job-update/"+t+"/",data:{status:e},dataType:"json",success:e=>oe(e),error:e=>se(e)})})(t,n)},ce=e=>{e.job_date?e.job_date.split("-")&&(j()?ae(e,G.getOrInitTable()):G.refresh()):j()?ae(e,G.getOrInitTable()):G.refresh()},le=(e,t)=>{const n=["INVOICED1","INVOICED2","FINISHED"],a=e.querySelector(".job-status-select"),r=a.value,o=e.querySelector(".deposit-date");n.includes(t.status)?e.classList.add("job-invoiced"):e.classList.remove("job-invoiced"),n.includes(a.value)?o.classList.remove("text-body-tertiary"):o.classList.add("text-body-tertiary"),a.setAttribute("data-initial",r),"FINISHED"===r?e.classList.add("job-finished"):e.classList.remove("job-finished"),x(I()+parseInt(t.revenue))},de=(e,t)=>{var n="/pipeline/pipeline-data/";void 0!==e&&void 0!==t&&(n=n+e+"/"+t+"/"),G.getOrInitTable().ajax.url(n).load()},ue=e=>{G.refresh(),(e=>{console.error(e)})(e)},me=document.querySelector("#deposit-date-form"),ve=document.querySelector("#set-deposit-date"),pe=new(B())(ve),he=()=>{const e=G.getOrInitTable().row(`#${G.getCurrentRowID()}`).node().querySelector(".job-status-select").value;["INVOICED1","INVOICED2","FINISHED"].includes(e)&&pe.show()},be=document.querySelector("#new-client-modal"),ye=document.querySelector("#new-client-form"),ge=ye.querySelector('button[type="submit"]'),fe=ye.querySelector("#id_friendly_name"),_e=ye.querySelector('input[name="proper_name"]'),Se=ye.querySelector('input[name="proper_name_japanese"]'),je=document.querySelector("#add-client-spinner"),Ce=()=>{_e.value||Se.value?ge.removeAttribute("disabled"):ge.setAttribute("disabled","")},we=document.querySelector("#id_client"),Ee=document.querySelector("#id_inv-invoice_recipient"),Le=document.querySelector("#new-client-errors");var qe=()=>{ge.setAttribute("disabled",""),_e.addEventListener("input",(()=>Ce())),Se.addEventListener("input",(()=>Ce())),ye.addEventListener("submit",(e=>(e=>{e.preventDefault();const t={friendly_name:document.querySelector("#id_friendly_name").value,job_code_prefix:document.querySelector("#id_job_code_prefix").value,proper_name:document.querySelector("#id_proper_name").value,proper_name_japanese:document.querySelector("#id_proper_name_japanese").value,new_client:"new ajax client add"};r().ajax({headers:{"X-CSRFToken":o},type:"POST",url:"/pipeline/",data:t,beforeSend:()=>je.classList.remove("invisible"),success:e=>{(e=>{if("success"===e.status){je.classList.add("invisible");const t=()=>d("option",{attributes:{value:e.id,selected:""},text:`${e.client_friendly_name} - ${e.prefix}`});we.appendChild(t()),B().getOrCreateInstance("#new-client-modal").toggle(),Ee.appendChild(t()),ye.classList.remove("was-validated"),ye.reset(),Y("New client added",e.client_friendly_name).show(),Le.replaceChildren(),[fe].forEach((e=>e.classList.remove("is-valid","is-invalid")))}else(e=>{console.log(e);const t=e.friendly_name;t&&(fe.classList.add("is-invalid"),Le.appendChild(d("div",{text:t}))),je.classList.add("invisible")})(e.errors)})(e)},error:e=>{alert("form not submitted",e.statusText),ye.classList.add("was-validated"),je.classList.add("invisible")}})})(e))),be.addEventListener("hide.bs.modal",(()=>{z.getOpenModal()&&z.modal.show()}))};window.$=r(),document.querySelector("#revenue-unit").addEventListener("click",(e=>{const t=e.currentTarget,n=document.querySelector("#id_granular_revenue"),a=document.querySelector("#id_revenue");t.classList.contains("active")?(t.textContent="円",n.value="true",a.setAttribute("placeholder","例）420069")):(t.textContent="万円",n.value="false",a.setAttribute("placeholder","例）100"))})),document.querySelector("#pipeline-next").parentNode.addEventListener("click",(e=>{let t,n;switch(e.target.getAttribute("id")){case"pipeline-next":[t,n]=_();break;case"pipeline-prev":[t,n]=S();break;case"pipeline-current":[t,n]=i()}[F.value,N.value]=[t,n],f([+F.value,+N.value]),de(...g())})),document.querySelector(".toggle-view").addEventListener("click",(()=>{"monthly"===y()?(b("all"),r()(".monthly-item").slideUp("fast",(function(){r()("#pipeline-date-select .monthly-item").removeClass("d-flex")})),r()(".toggle-view").html("<b>月別で表示</b>"),de(void 0,void 0)):(b("monthly"),O.textContent="表示の案件　請求総額(予定)",r()("#pipeline-date-select .monthly-item").addClass("d-flex"),r()(".monthly-item").slideDown("fast"),r()(".toggle-view").html("<b>全案件を表示</b>"),de(...g())),D()})),document.querySelector("#deposit-date-form").addEventListener("submit",(e=>{e.preventDefault();const t=G.getCurrentRowID();r().ajax({headers:{"X-CSRFToken":o},type:"post",url:`/pipeline/set-deposit-date/${t}/`,data:{deposit_date:document.querySelector("#id_deposit_date").value,job_id:t},dataType:"json",success:e=>{oe(e),me.reset(),pe.hide()},error:e=>se(e)})})),document.querySelector("#job-form").addEventListener("submit",(e=>{((e=T)=>{e.classList.remove("invisible")})(),e.preventDefault();const t=document.querySelector("#job-form"),n={job_name:document.querySelector("#id_job_name").value,client:document.querySelector("#id_client").value,job_type:document.querySelector("#id_job_type").value,granular_revenue:document.querySelector("#id_granular_revenue").value,revenue:document.querySelector("#id_revenue").value,add_consumption_tax:document.querySelector("#id_add_consumption_tax").checked,personInCharge:document.querySelector("#id_personInCharge").value};r().ajax({headers:{"X-CSRFToken":o},method:"POST",url:"/pipeline/job-add",data:n,success:e=>{"success"===e.status?(t.classList.remove("was-validated"),G.refresh(),(e=>Y("Job created",e.data.job_name,{},"toast-successful-job-created"))(e).show(),t.reset()):(console.alert("Form processing failed. Perhaps bad data was sent?"),t.classList.add("was-validated"))},error:()=>{alert("Form submission failed")}}),((e=T)=>{e.classList.add("invisible")})()})),document.querySelector("#pipeline-new-client-btn").addEventListener("click",(()=>{z.preventFromOpening()}));let xe=document.querySelectorAll(".display-filter input");document.body.addEventListener("mousedown",(()=>{ne=1})),document.body.addEventListener("mouseup",(()=>{ne=0,te=!1})),(()=>{for(let e=2021;e<=c()+1;e++)F.appendChild($(e));[F.value,N.value]=i()})(),r()((function(){const e=G.getOrInitTable();xe.forEach((t=>t.addEventListener("change",(()=>e.draw())))),((e=G.getTableEl())=>{e.addEventListener("click",(e=>{(e.target.matches(".deposit-date")||e.target.matches(".job-status-select"))&&G.setCurrentRowID(e.target.closest("tr").getAttribute("id"))})),e.addEventListener("input",(e=>G.setCurrentSelectEl(e.target.closest("select")))),e.addEventListener("click",(e=>{e.target.matches("td.deposit-date")&&he()})),e.addEventListener("change",(e=>{e.target.matches(".job-status-select")&&ie(e)})),e.addEventListener("mousedown",(e=>{e.target.matches(".form-check-input")&&(e=>{te=!0,Z=e.target,ee=e.target.closest("tr"),ee.classList.toggle(".selected-row"),Z.checked=!Z.checked})(e)})),e.addEventListener("click",(e=>{e.target.matches(".form-check-input")&&(e=>{if(!ne){const t=e.target,n=t.closest("tr"),a=Z.checked;t.checked=!a,t.checked?n.classList.add("selected-row"):n.classList.remove("selected-row")}})(e)})),e.addEventListener("mouseenter",(e=>(e=>{if(ne&&te&&e.target.closest("tr")){const t=e.target.closest("tr"),n=t.querySelector(".form-check-input")||null,a=Z.checked;a?t.classList.add("selected-row"):t.classList.remove("selected-row"),n&&(n.checked=a)}})(e)),!0),e.addEventListener("mousemove",(e=>(e=>{ne&&te&&e.preventDefault()})(e))),e.addEventListener("click",(e=>{var t;(e.target.matches("td .job-code")&&e.metaKey||e.ctrlKey)&&(t=e.target.textContent,navigator.clipboard.writeText(`${t} ${P.get(t)}`))})),e.addEventListener("mousemove",(e=>{if(e.target.matches("td .job-code")){let t=e.target;e.metaKey||e.ctrlKey?t.classList.add("highlight"):t.classList.remove("highlight")}})),e.addEventListener("mouseout",(e=>{e.target.matches("td .job-code")&&e.target.classList.remove("highlight")})),document.addEventListener("keydown",(e=>{(e.metaKey||e.ctrlKey)&&document.querySelector(".job-code:hover")&&document.querySelector(".job-code:hover").classList.add("highlight")})),document.addEventListener("keyup",(()=>{document.querySelectorAll(".job-code.highlight").forEach((e=>e.classList.remove("highlight")))}))})(),m().ext.search.push((function(e,t){const n="---"===t[10],a=["ONGOING","READYTOINV"].includes(t[9]);return C.checked?w.checked?n||a:n&&!a:E.checked?a:!!w.checked||!a})),m().ext.search.push((function(e,t){const n="false"===t[13]&&+t[5]>0;return!L.checked||!!n})),function(){let e=r()("#csv-export-use-range");e.click((function(){e.is(":checked")?(r()("#thru-month").removeClass("invisible"),r()("#thru-year").removeClass("invisible")):(r()("#thru-month").addClass("invisible"),r()("#thru-year").addClass("invisible"),r()("#thru-month").val(r()("#from-month").val()).change(),r()("#thru-year").val(r()("#from-year").val()).change())})),r()("#from-month").change((function(){e.is(":not(:checked)")&&r()("#thru-month").val(r()("#from-month").val()).change()})),r()("#from-year").change((function(){e.is(":not(:checked)")&&r()("#thru-year").val(r()("#from-year").val()).change()}))}(),qe()}))}},n={};function a(e){var r=n[e];if(void 0!==r)return r.exports;var o=n[e]={exports:{}};return t[e].call(o.exports,o,o.exports,a),o.exports}a.m=t,e=[],a.O=function(t,n,r,o){if(!n){var s=1/0;for(d=0;d<e.length;d++){n=e[d][0],r=e[d][1],o=e[d][2];for(var i=!0,c=0;c<n.length;c++)(!1&o||s>=o)&&Object.keys(a.O).every((function(e){return a.O[e](n[c])}))?n.splice(c--,1):(i=!1,o<s&&(s=o));if(i){e.splice(d--,1);var l=r();void 0!==l&&(t=l)}}return t}o=o||0;for(var d=e.length;d>0&&e[d-1][2]>o;d--)e[d]=e[d-1];e[d]=[n,r,o]},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,{a:t}),t},a.d=function(e,t){for(var n in t)a.o(t,n)&&!a.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.p="/static/",function(){var e={793:0};a.O.j=function(t){return 0===e[t]};var t=function(t,n){var r,o,s=n[0],i=n[1],c=n[2],l=0;if(s.some((function(t){return 0!==e[t]}))){for(r in i)a.o(i,r)&&(a.m[r]=i[r]);if(c)var d=c(a)}for(t&&t(n);l<s.length;l++)o=s[l],a.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return a.O(d)},n=self.webpackChunknpt=self.webpackChunknpt||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var r=a.O(void 0,[547,204],(function(){return a(4406)}));r=a.O(r)}();
//# sourceMappingURL=pipeline.js.map