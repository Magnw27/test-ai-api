const $=s=>document.querySelector(s);
const chat=$("#chat"),welcome=$("#welcome"),form=$("#composer"),prompt=$("#prompt"),send=$("#sendBtn"),status=$("#status");
let messages=[];
const API_PATH="/v1/chat/completions";

const setStatus=(kind,text)=>{status.className="status "+kind;status.querySelector("span").textContent=text};

const normalizeEndpoint=value=>{
  const raw=value.trim().replace(/\/+$/,"");
  if(!raw)return "";
  if(!/^https?:\/\//i.test(raw))return raw;
  try{
    const u=new URL(raw),path=u.pathname.replace(/\/+$/,"");
    if(!path)u.pathname=API_PATH;
    else if(path==="/v1"||path==="/api")u.pathname=path+"/chat/completions";
    return u.toString();
  }catch{return raw}
};

const addMessage=(role,text)=>{
  if(welcome)welcome.remove();
  const el=document.createElement("article");
  el.className="message "+role;
  el.innerHTML='<div class="avatar">'+(role==="user"?"":"✦")+'</div><div><div class="bubble"></div><div class="meta">'+(role==="user"?"You":"AI")+"</div></div>";
  el.querySelector(".bubble").textContent=text;
  chat.appendChild(el);chat.scrollTop=chat.scrollHeight;
  if(role==="user")messages.push({role,content:text});
  return el;
};

const readConfig=()=>({
  url:normalizeEndpoint($("#endpoint").value),
  model:$("#model").value.trim(),
  key:$("#apiKey").value.trim(),
  temperature:Math.max(0,Math.min(2,Number($("#temperature").value)||0)),
  max_tokens:Math.max(1,Math.min(32768,Number($("#maxTokens").value)||1024))
});

async function callAPI(testOnly=false){
  const c=readConfig();
  if(!c.url)return setStatus("error","API URL is required");
  if(!/^https?:\/\//i.test(c.url))return setStatus("error","URL must start with http:// or https://");
  setStatus("","Connecting…");
  const body={messages:testOnly?[{role:"user",content:"Reply with exactly: endpoint-ok"}]:messages.slice(-20),temperature:c.temperature,max_tokens:c.max_tokens};
  if(c.model)body.model=c.model;
  const headers={"Content-Type":"application/json","Accept":"application/json"};
  if(c.key)headers["X-API-Key"]=c.key;
  try{
    const started=performance.now();
    const res=await fetch(c.url,{method:"POST",headers,body:JSON.stringify(body)});
    const raw=await res.text();
    let data;try{data=JSON.parse(raw)}catch{data={raw}};
    if(!res.ok){
      const message=data?.error?.message||data?.message||data?.error||raw||("HTTP "+res.status);
      throw new Error(("HTTP "+res.status+": "+message).slice(0,700));
    }
    setStatus("ok","Connected · "+Math.round(performance.now()-started)+"ms");
    if(testOnly)return addMessage("assistant","✓ Endpoint responded successfully.\n\n"+JSON.stringify(data,null,2));
    const content=data?.choices?.[0]?.message?.content??data?.choices?.[0]?.text??data?.response??data?.output_text??data?.text;
    addMessage("assistant",content==null?(typeof data==="string"?data:JSON.stringify(data,null,2)):(typeof content==="string"?content:JSON.stringify(content,null,2)));
  }catch(err){
    setStatus("error","Request failed");
    addMessage("assistant",(testOnly?"Endpoint test failed:\n":"Request failed:\n")+(err?.message||String(err))+"\n\nIf this is a browser CORS error, make sure your API allows this website origin.");
  }
}

form.addEventListener("submit",async e=>{
  e.preventDefault();const text=prompt.value.trim();if(!text||send.disabled)return;
  prompt.value="";prompt.style.height="auto";addMessage("user",text);send.disabled=true;
  await callAPI(false);send.disabled=false;prompt.focus();
});
prompt.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();form.requestSubmit()}});
prompt.addEventListener("input",()=>{prompt.style.height="auto";prompt.style.height=Math.min(prompt.scrollHeight,150)+"px"});
$("#newChat").addEventListener("click",()=>{chat.innerHTML="";messages=[];chat.appendChild(Object.assign(document.createElement("div"),{id:"welcome",className:"welcome",innerHTML:'<div class="welcome-icon">✦</div><h1>Test your AI endpoint.</h1><p>Connect an OpenAI-compatible endpoint and inspect its response.</p>'}));setStatus("","Ready")});
$("#clearBtn").addEventListener("click",()=>{messages=[];document.querySelectorAll(".message").forEach(x=>x.remove());setStatus("","Ready")});
$("#copyBtn").addEventListener("click",async()=>{const xs=[...document.querySelectorAll(".assistant .bubble")],last=xs.at(-1);if(last){try{await navigator.clipboard.writeText(last.textContent);setStatus("ok","Copied")}catch{setStatus("error","Clipboard unavailable")}}});
$("#testConnection").addEventListener("click",()=>callAPI(true));
document.querySelectorAll(".preset").forEach(b=>b.addEventListener("click",()=>{$("#endpoint").value=b.dataset.url;$("#model").value=b.dataset.model;setStatus("","Preset loaded")}));
document.querySelectorAll(".chips button").forEach(b=>b.addEventListener("click",()=>{prompt.value=b.dataset.prompt;prompt.focus()}));
$("#menuBtn").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
