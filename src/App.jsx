import { useState, useMemo, useRef } from "react";

const LIGHT={bg:"#f0f4f8",surface:"#fff",card:"#fff",border:"#e2e8f0",border2:"#cbd5e1",text:"#1a202c",muted:"#718096",muted2:"#a0aec0",teal:"#0d9488",tealD:"#0f766e",tealL:"#ccfbf1",pink:"#ec4899",pinkL:"#fce7f3",green:"#10b981",greenL:"#d1fae5",red:"#ef4444",redL:"#fee2e2",gold:"#f59e0b",goldL:"#fef3c7",blue:"#3b82f6",blueL:"#dbeafe",purple:"#8b5cf6",purpleL:"#ede9fe",shadow:"0 1px 4px rgba(0,0,0,0.08)",shadowM:"0 4px 16px rgba(0,0,0,0.10)",shadowL:"0 8px 32px rgba(0,0,0,0.12)"};
const DARK={bg:"#0f172a",surface:"#1e293b",card:"#1e293b",border:"#334155",border2:"#475569",text:"#f1f5f9",muted:"#94a3b8",muted2:"#64748b",teal:"#2dd4bf",tealD:"#0f766e",tealL:"#134e4a",pink:"#f472b6",pinkL:"#831843",green:"#34d399",greenL:"#064e3b",red:"#f87171",redL:"#7f1d1d",gold:"#fbbf24",goldL:"#78350f",blue:"#60a5fa",blueL:"#1e3a5f",purple:"#a78bfa",purpleL:"#3b0764",shadow:"0 1px 4px rgba(0,0,0,0.3)",shadowM:"0 4px 16px rgba(0,0,0,0.4)",shadowL:"0 8px 32px rgba(0,0,0,0.5)"};

const INST_TYPES=["College","School","Computer Institute","Dance School"];
const TYPE_META={"College":{icon:"🎓"},"School":{icon:"🏫"},"Computer Institute":{icon:"💻"},"Dance School":{icon:"💃"}};
const DEPARTMENTS={"Arts & Science":["Tamil","English","Mathematics","Physics","Chemistry","Computer Science","Economics","Commerce"],"Engineering":["CSE","ECE","EEE","Mechanical","Civil","IT","AIDS","AIML","Cyber Security"],"Medical":["MBBS","BDS","Nursing","Pharmacy","Physiotherapy"],"Management":["BBA","MBA","Finance","Marketing","HR"],"Law":["BA LLB","BBA LLB","LLM"]};
const SCHOOL_CLASSES=["LKG","UKG",...Array.from({length:12},(_,i)=>`Class ${i+1}`)];
const SCHOOL_SECTIONS=["A","B","C","D","E","F"];
const COMP_COURSES=["Basic Computer","MS Office","Tally ERP","DTP","Web Design","Python","Java","Hardware & Networking","Data Entry"];
const DANCE_STYLES=["Bharatanatyam","Kuchipudi","Kathak","Odissi","Western Dance","Hip Hop","Ballet","Contemporary","Salsa","Bollywood","Folk Dance"];
const DANCE_LEVELS=["Beginner","Elementary","Intermediate","Advanced","Professional","Arangetram Prep"];
const DANCE_BATCHES=["Morning 7-9 AM","Morning 9-11 AM","Afternoon 12-2 PM","Evening 4-6 PM","Evening 6-8 PM","Weekend Special"];
const FEE_STATUS=["Paid","Partial","Pending","Waived"];
const HW_STATUS=["Pending","Submitted","Late","Incomplete"];
const ASSIGN_TYPES=["Written","Project","Practical","Presentation","Online","Research","Performance"];
const ASSIGN_STATUS=["Assigned","Submitted","Late","Not Submitted","Graded"];
const DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const PERIODS=["8:00-9:00","9:00-10:00","10:00-11:00","11:00-11:15 BREAK","11:15-12:15","12:15-1:15","1:15-2:00 BREAK","2:00-3:00","3:00-4:00"];
const SUB_COLORS=["#0d9488","#3b82f6","#8b5cf6","#f59e0b","#ef4444","#ec4899","#06b6d4","#f97316","#10b981","#84cc16"];
const INST_COLORS=["#0d9488","#3b82f6","#8b5cf6","#f59e0b","#ef4444","#ec4899","#06b6d4","#f97316","#10b981","#84cc16"];
const ALERT_TEMPLATES=[
  {id:"absent",label:"Absent Alert",icon:"📅",color:"red",body:"Dear Parent,\n\n{name} was marked ABSENT on {date} at {inst}.\nPlease contact {phone} if this is an error.\n\nRegards,\n{inst} - AllBee EduSphere"},
  {id:"lowatt",label:"Low Attendance",icon:"⚠️",color:"gold",body:"Dear Parent,\n\n{name}'s attendance at {inst} is {att}%.\nPlease ensure regular attendance.\n\nRegards,\n{inst} - AllBee EduSphere"},
  {id:"feedue",label:"Fee Due",icon:"💰",color:"pink",body:"Dear Parent,\n\nFee reminder for {name} at {inst}.\nMonth: {feemonth} | Due: Rs.{feedue}\nPlease pay at the earliest.\n\nRegards,\n{inst} - AllBee EduSphere"},
  {id:"hwpend",label:"Homework Due",icon:"📚",color:"purple",body:"Dear Parent,\n\n{name} has pending homework at {inst}.\nSubject: {hwsubject} | Due: {hwdue}\n\nRegards,\n{inst} - AllBee EduSphere"},
  {id:"result",label:"Exam Result",icon:"📝",color:"blue",body:"Dear Parent,\n\n{name}'s result at {inst}:\nExam: {exam} | Marks: {marks}/{maxmarks} | Grade: {grade}\n\nRegards,\n{inst} - AllBee EduSphere"},
  {id:"custom",label:"Custom Message",icon:"✏️",color:"teal",body:"Dear Parent,\n\n{custom}\n\nRegards,\n{inst} - AllBee EduSphere"},
];

const uid=()=>Math.random().toString(36).slice(2,10);
const today=()=>new Date().toISOString().slice(0,10);
const fmt=d=>d?d.split("-").reverse().join("/"):"--";
const attPct=a=>!a?.length?0:Math.round(a.filter(x=>x.status==="Present").length/a.length*100);
const lsGet=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};
const tc=(C,color)=>color==="teal"?C.teal:color==="red"?C.red:color==="gold"?C.gold:color==="purple"?C.purple:color==="pink"?C.pink:color==="blue"?C.blue:color==="green"?C.green:C.teal;
const tb=(C,color)=>color==="teal"?C.tealL:color==="red"?C.redL:color==="gold"?C.goldL:color==="purple"?C.purpleL:color==="pink"?C.pinkL:color==="blue"?C.blueL:color==="green"?C.greenL:C.tealL;

function seedData(){
  return {
    institutions:[
      {id:"i1",name:"Sri Venkateswara College",type:"College",city:"Salem",phone:"0427-2234567",email:"svce@edu.in",color:INST_COLORS[0],createdAt:today(),active:true},
      {id:"i2",name:"Green Valley School",type:"School",city:"Salem",phone:"0427-2345678",email:"gvs@edu.in",color:INST_COLORS[1],createdAt:today(),active:true},
      {id:"i3",name:"TechSkills Computer Institute",type:"Computer Institute",city:"Salem",phone:"9876543210",email:"tech@edu.in",color:INST_COLORS[2],createdAt:today(),active:true},
      {id:"i4",name:"Nataraj Dance Academy",type:"Dance School",city:"Salem",phone:"9988776655",email:"nataraj@dance.in",color:INST_COLORS[7],createdAt:today(),active:true},
    ],
    users:[
      {id:"u0",username:"superadmin",password:"super123",role:"superadmin",name:"Super Administrator",instId:null},
      {id:"u1",username:"svce_admin",password:"svce123",role:"admin",name:"SVCE Admin",instId:"i1"},
      {id:"u2",username:"gvs_admin",password:"gvs123",role:"admin",name:"GVS Admin",instId:"i2"},
      {id:"u3",username:"tech_admin",password:"tech123",role:"admin",name:"TechSkills Admin",instId:"i3"},
      {id:"u4",username:"dance_admin",password:"dance123",role:"admin",name:"Nataraj Admin",instId:"i4"},
    ],
    students:[],
  };
}

// shared UI helpers
function Inp({C,style:st={},...p}){return <input {...p} style={{width:"100%",padding:"10px 14px",border:`1px solid ${C.border}`,borderRadius:9,background:C.surface,color:C.text,fontSize:13,outline:"none",...st}}/>;}
function Sel({C,children,style:st={},...p}){return <select {...p} style={{width:"100%",padding:"10px 14px",border:`1px solid ${C.border}`,borderRadius:9,background:C.surface,color:C.text,fontSize:13,...st}}>{children}</select>;}
function Txt({C,style:st={},...p}){return <textarea {...p} style={{width:"100%",padding:"10px 14px",border:`1px solid ${C.border}`,borderRadius:9,background:C.surface,color:C.text,fontSize:13,resize:"vertical",...st}}/>;}
function Btn({children,color="teal",outline=false,size="md",onClick,disabled=false,C,style:st={}}){
  const pad=size==="sm"?"5px 12px":size==="lg"?"13px 28px":"9px 20px";
  const fs=size==="sm"?11:size==="lg"?15:13;
  const bg=outline?"transparent":tc(C,color);
  const cl=outline?tc(C,color):"#fff";
  return <button onClick={onClick} disabled={disabled} style={{padding:pad,fontSize:fs,fontWeight:600,border:`1px solid ${tc(C,color)}`,borderRadius:9,background:bg,color:cl,opacity:disabled?0.4:1,cursor:disabled?"not-allowed":"pointer",...st}}>{children}</button>;
}
function Badge({label,color="teal",C}){return <span style={{display:"inline-block",padding:"2px 10px",borderRadius:20,background:tb(C,color),color:tc(C,color),fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>{label}</span>;}
function LBL({children,C}){return <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>{children}</div>;}
function FG({label,err,span,children,C}){return <div style={span?{gridColumn:"1/-1"}:{}}><LBL C={C}>{label}</LBL>{children}{err&&<div style={{fontSize:11,color:C.red,marginTop:4}}>! {err}</div>}</div>;}
function G2({children}){return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>{children}</div>;}
function PH({title,sub,C}){return <div style={{marginBottom:20}}><div style={{fontSize:20,fontWeight:800,color:C.text}}>{title}</div>{sub&&<div style={{fontSize:13,color:C.muted,marginTop:2}}>{sub}</div>}</div>;}
function Sec({children,C}){return <div style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>{children}</div>;}
function Empty({msg,C}){return <div style={{padding:"40px 24px",textAlign:"center",color:C.muted}}><div style={{fontSize:28,marginBottom:8}}>📭</div><div style={{fontSize:13}}>{msg}</div></div>;}
function NoStu({C}){return <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:"50px",textAlign:"center",color:C.muted,boxShadow:C.shadow}}>Select a student</div>;}
function MiniBar({pct,color,C}){return <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:6,background:C.border,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:color,borderRadius:99}}/></div><span style={{fontSize:11,fontWeight:700,color,minWidth:32}}>{pct}%</span></div>;}

function StatCard({icon,label,value,color="teal",sub,C,onClick}){
  return <div onClick={onClick} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px",boxShadow:C.shadow,cursor:onClick?"pointer":"default",transition:"box-shadow 0.2s"}} onMouseOver={e=>onClick&&(e.currentTarget.style.boxShadow=C.shadowM)} onMouseOut={e=>onClick&&(e.currentTarget.style.boxShadow=C.shadow)}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
      <div style={{width:38,height:38,borderRadius:10,background:tb(C,color),display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{icon}</div>
      <div style={{fontSize:12,color:C.muted}}>{label}</div>
    </div>
    <div style={{fontSize:26,fontWeight:800,color:tc(C,color)}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:C.muted,marginTop:4}}>{sub}</div>}
  </div>;
}

function Avatar({name,photo,color,size=36,style:st={}}){
  const ini=(name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  if(photo)return <div style={{width:size,height:size,borderRadius:"50%",border:`2px solid ${color}44`,overflow:"hidden",flexShrink:0,...st}}><img src={photo} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>;
  return <div style={{width:size,height:size,borderRadius:"50%",background:`${color}18`,border:`2px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.32,fontWeight:700,color,flexShrink:0,...st}}>{ini}</div>;
}

function PhotoUpload({photo,onChange,color,C,size=80}){
  const ref=useRef();
  function handle(e){const f=e.target.files?.[0];if(!f)return;if(f.size>3*1024*1024){alert("Max 3MB");return;}const r=new FileReader();r.onload=ev=>onChange(ev.target.result);r.readAsDataURL(f);}
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
    <div onClick={()=>ref.current.click()} style={{width:size,height:size,borderRadius:"50%",border:`2px dashed ${photo?color:C.border}`,cursor:"pointer",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg}} onMouseOver={e=>e.currentTarget.style.borderColor=color} onMouseOut={e=>e.currentTarget.style.borderColor=photo?color:C.border}>
      {photo?<img src={photo} alt="s" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{textAlign:"center",color:C.muted}}><div style={{fontSize:22}}>📷</div><div style={{fontSize:9,marginTop:2}}>Upload</div></div>}
    </div>
    <input ref={ref} type="file" accept="image/*" onChange={handle} style={{display:"none"}}/>
    {photo&&<button onClick={()=>onChange("")} style={{fontSize:10,color:C.red,background:"none",border:"none",cursor:"pointer",padding:0}}>Remove</button>}
  </div>;
}

function TopBar({C,dark,setDark,onLogout,user,right}){
  return <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 24px",height:56,display:"flex",alignItems:"center",gap:16,position:"sticky",top:0,zIndex:100,boxShadow:C.shadow}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:34,height:34,borderRadius:9,background:`linear-gradient(135deg,${C.teal},${C.tealD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#fff"}}>🐝</div>
      <div><div style={{fontWeight:800,fontSize:13,color:C.teal}}>AllBee EduSphere</div><div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Smart Student Management by AllBee</div></div>
    </div>
    {right&&<div style={{paddingLeft:16,borderLeft:`2px solid ${C.border}`,fontWeight:700,fontSize:14,color:C.text}}>{right}</div>}
    <div style={{flex:1}}/>
    <button onClick={()=>setDark(d=>!d)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",border:`1px solid ${C.border}`,borderRadius:20,background:C.surface,color:C.muted,fontSize:12,cursor:"pointer"}}>{dark?"☀ Light":"🌙 Dark"}</button>
    {user&&<div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{textAlign:"right"}}><div style={{fontWeight:700,fontSize:12,color:C.text}}>{user.name}</div><div style={{fontSize:9,padding:"1px 8px",borderRadius:20,background:C.tealL,color:C.teal,fontWeight:700,textTransform:"uppercase",display:"inline-block"}}>{user.role}</div></div>
      <button onClick={onLogout} style={{padding:"7px 14px",border:`1px solid ${C.border}`,borderRadius:8,background:C.surface,color:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>Sign Out</button>
    </div>}
  </div>;
}

function StuSidebar({students,sel,setSel,C,extra}){
  const [q,setQ]=useState("");
  const fs=students.filter(s=>[s.name,s.rollNo].some(v=>v?.toLowerCase().includes(q.toLowerCase())));
  return <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",boxShadow:C.shadow}}>
    <div style={{padding:"9px 11px",borderBottom:`1px solid ${C.border}`}}><Inp C={C} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." style={{padding:"7px 10px",fontSize:12}}/></div>
    <div style={{maxHeight:480,overflowY:"auto"}}>
      {fs.map(s=><div key={s.id} onClick={()=>setSel(sel===s.id?null:s.id)} style={{padding:"10px 13px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:sel===s.id?C.tealL:"transparent",display:"flex",gap:9,alignItems:"center",transition:"background 0.1s"}} onMouseOver={e=>{if(sel!==s.id)e.currentTarget.style.background=C.bg;}} onMouseOut={e=>{if(sel!==s.id)e.currentTarget.style.background="transparent";}}>
        <Avatar name={s.name} photo={s.photo} color={C.teal} size={30}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:600,fontSize:12,color:sel===s.id?C.teal:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</div>
          <div style={{fontSize:10,color:C.muted}}>{s.rollNo}</div>
          {extra&&<div style={{fontSize:10,color:C.teal,marginTop:1}}>{extra(s)}</div>}
        </div>
      </div>)}
      {!fs.length&&<Empty msg="No students" C={C}/>}
    </div>
  </div>;
}

// Root App
export default function App(){
  const [dark,setDark]=useState(false);
  const C=dark?DARK:LIGHT;
  const [db,setDb]=useState(()=>lsGet("allbee_db4",null)||seedData());
  const [user,setUser]=useState(null);
  const [toast,setToast]=useState(null);
  function saveDb(patch){const n={...db,...patch};lsSet("allbee_db4",n);setDb(n);}
  function notify(msg,type="success"){setToast({msg,type});setTimeout(()=>setToast(null),3000);}
  function login(u,p){const x=db.users.find(u2=>u2.username===u&&u2.password===p);if(!x)return"Invalid username or password";setUser(x);return null;}
  function logout(){setUser(null);}
  const myInst=user?.instId?db.institutions.find(i=>i.id===user.instId):null;
  const toastBg=toast?.type==="success"?C.teal:toast?.type==="error"?C.red:C.gold;
  return <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',Inter,system-ui,sans-serif",fontSize:14,transition:"background 0.2s,color 0.2s"}}>
    <style>{`*{box-sizing:border-box;}::placeholder{color:${C.muted2};}@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideIn{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}input:focus,select:focus,textarea:focus{outline:none;border-color:${C.teal}!important;box-shadow:0 0 0 3px ${C.teal}22!important;}button{cursor:pointer;transition:all 0.15s;font-family:inherit;}button:active{transform:scale(0.97);}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:${C.border2};border-radius:4px}`}</style>
    {toast&&<div style={{position:"fixed",top:18,right:18,zIndex:9999,padding:"12px 20px",borderRadius:10,fontWeight:600,fontSize:13,animation:"fadeIn 0.2s",boxShadow:C.shadowL,background:toastBg,color:"#fff"}}>{toast.type==="success"?"✓ ":toast.type==="error"?"✕ ":"⚠ "}{toast.msg}</div>}
    {!user&&<LoginPage onLogin={login} db={db} C={C} dark={dark} setDark={setDark}/>}
    {user?.role==="superadmin"&&<SuperAdmin db={db} saveDb={saveDb} onLogout={logout} notify={notify} user={user} C={C} dark={dark} setDark={setDark}/>}
    {(user?.role==="admin"||user?.role==="staff")&&myInst&&<InstDash db={db} saveDb={saveDb} onLogout={logout} notify={notify} user={user} inst={myInst} C={C} dark={dark} setDark={setDark}/>}
  </div>;
}

// Login Page
function LoginPage({onLogin,db,C,dark,setDark}){
  const [u,setU]=useState("");const [p,setP]=useState("");const [err,setErr]=useState("");const [show,setShow]=useState(false);
  function go(){const e=onLogin(u,p);if(e)setErr(e);}
  return <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}}>
    <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 24px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:C.shadow}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,borderRadius:8,background:`linear-gradient(135deg,${C.teal},${C.tealD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:"#fff"}}>🐝</div>
        <div><div style={{fontWeight:800,fontSize:13,color:C.teal}}>AllBee EduSphere</div><div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Smart Student Management by AllBee</div></div>
      </div>
      <button onClick={()=>setDark(d=>!d)} style={{padding:"6px 14px",border:`1px solid ${C.border}`,borderRadius:20,background:C.surface,color:C.muted,fontSize:12,cursor:"pointer"}}>{dark?"☀ Light":"🌙 Dark"}</button>
    </div>
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:420,animation:"fadeUp 0.5s ease"}}>
        <div style={{background:C.surface,borderRadius:16,border:`1px solid ${C.border}`,boxShadow:C.shadowL,padding:32}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{width:56,height:56,borderRadius:14,background:`linear-gradient(135deg,${C.teal},${C.tealD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 12px",color:"#fff"}}>🐝</div>
            <div style={{fontSize:22,fontWeight:800,color:C.text}}>Welcome back</div>
            <div style={{fontSize:13,color:C.muted,marginTop:4}}>Sign in to manage your institution</div>
          </div>
          <div style={{marginBottom:14}}><LBL C={C}>Username</LBL><Inp C={C} value={u} onChange={e=>setU(e.target.value)} placeholder="Enter username" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
          <div style={{marginBottom:18}}><LBL C={C}>Password</LBL><div style={{position:"relative"}}><Inp C={C} type={show?"text":"password"} value={p} onChange={e=>setP(e.target.value)} placeholder="Enter password" onKeyDown={e=>e.key==="Enter"&&go()} style={{paddingRight:42}}/><button onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.muted,fontSize:14,padding:4}}>{show?"🙈":"👁"}</button></div></div>
          {err&&<div style={{background:C.redL,border:`1px solid ${C.red}44`,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.red,marginBottom:14}}>⚠ {err}</div>}
          <button onClick={go} style={{width:"100%",padding:"12px",border:"none",borderRadius:10,background:`linear-gradient(135deg,${C.teal},${C.tealD})`,color:"#fff",fontSize:15,fontWeight:700,boxShadow:`0 4px 14px ${C.teal}44`,cursor:"pointer"}}>Sign In →</button>
          <div style={{marginTop:22,padding:16,background:C.bg,borderRadius:10,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Demo Accounts</div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {[{u:"superadmin",p:"super123",r:"Super Admin",c:C.purple},{u:"svce_admin",p:"svce123",r:"College",c:C.blue},{u:"gvs_admin",p:"gvs123",r:"School",c:C.green},{u:"tech_admin",p:"tech123",r:"Computer Inst.",c:C.teal},{u:"dance_admin",p:"dance123",r:"Dance School",c:C.pink}].map(d=><button key={d.u} onClick={()=>{setU(d.u);setP(d.p);}} style={{display:"flex",justifyContent:"space-between",padding:"7px 12px",border:`1px solid ${C.border}`,borderRadius:8,background:C.surface,color:C.text,fontSize:11,textAlign:"left",cursor:"pointer"}}><span style={{fontFamily:"monospace",color:d.c,fontWeight:700}}>{d.u}</span><span style={{color:C.muted}}>{d.r}</span></button>)}
            </div>
          </div>
        </div>
        <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:7}}>
          {db.institutions.map(inst=>{const m=TYPE_META[inst.type]||TYPE_META["College"];return<div key={inst.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",background:C.surface,borderRadius:10,border:`1px solid ${C.border}`,boxShadow:C.shadow}}><span style={{fontSize:16}}>{m.icon}</span><div style={{flex:1}}><div style={{fontWeight:600,fontSize:12,color:C.text}}>{inst.name}</div><div style={{fontSize:10,color:C.muted}}>{inst.type} - {inst.city}</div></div><div style={{width:7,height:7,borderRadius:"50%",background:inst.active?C.green:C.red}}/></div>;})}
        </div>
        <div style={{textAlign:"center",marginTop:14,fontSize:11,color:C.muted}}>🐝 Powered by AllBee Solutions</div>
      </div>
    </div>
  </div>;
}

// Super Admin
const SA_TABS=[{k:"overview",i:"📊",l:"Overview"},{k:"institutions",i:"🏛",l:"Institutions"},{k:"users",i:"👤",l:"Users"},{k:"students",i:"👥",l:"Students"},{k:"reports",i:"📋",l:"Reports"}];
function SuperAdmin({db,saveDb,onLogout,notify,user,C,dark,setDark}){
  const [tab,setTab]=useState("overview");
  function addInst(d){saveDb({institutions:[...db.institutions,{...d,id:uid(),createdAt:today(),active:true}]});notify("Institution added!");}
  function updInst(id,p){saveDb({institutions:db.institutions.map(i=>i.id===id?{...i,...p}:i)});notify("Updated");}
  function delInst(id){if(!window.confirm("Delete institution and all data?"))return;saveDb({institutions:db.institutions.filter(i=>i.id!==id),users:db.users.filter(u=>u.instId!==id),students:db.students.filter(s=>s.instId!==id)});notify("Deleted","error");}
  function addUser(d){if(db.users.find(u=>u.username===d.username)){notify("Username exists","error");return;}saveDb({users:[...db.users,{...d,id:uid()}]});notify("User created!");}
  function delUser(id){saveDb({users:db.users.filter(u=>u.id!==id)});notify("Deleted");}
  function updUser(id,p){saveDb({users:db.users.map(u=>u.id===id?{...u,...p}:u)});notify("Updated");}
  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    <TopBar C={C} dark={dark} setDark={setDark} onLogout={onLogout} user={user} right="Super Admin"/>
    <div style={{display:"flex",flex:1}}>
      <div style={{width:200,background:C.surface,borderRight:`1px solid ${C.border}`,padding:"14px 10px",position:"sticky",top:56,height:"calc(100vh - 56px)",overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>
        {SA_TABS.map(t=><button key={t.k} onClick={()=>setTab(t.k)} style={{width:"100%",textAlign:"left",padding:"9px 12px",border:"none",borderRadius:9,background:tab===t.k?C.tealL:"transparent",color:tab===t.k?C.teal:C.text,fontWeight:tab===t.k?700:500,fontSize:12,display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>{t.i} {t.l}</button>)}
        <div style={{flex:1}}/><div style={{padding:"9px 12px",background:C.bg,borderRadius:9}}><div style={{fontWeight:600,fontSize:11,color:C.text}}>{user.name}</div><div style={{fontSize:9,color:C.teal,fontWeight:700,textTransform:"uppercase"}}>Super Admin</div></div>
      </div>
      <div style={{flex:1,padding:24,overflowY:"auto"}}>
        {tab==="overview"&&<SAOverview db={db} C={C}/>}
        {tab==="institutions"&&<SAInst db={db} onAdd={addInst} onUpdate={updInst} onDelete={delInst} C={C}/>}
        {tab==="users"&&<SAUsers db={db} onAdd={addUser} onDelete={delUser} onUpdate={updUser} C={C}/>}
        {tab==="students"&&<SAStudents db={db} C={C}/>}
        {tab==="reports"&&<SAReports db={db} C={C}/>}
      </div>
    </div>
  </div>;
}
function SAOverview({db,C}){
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <PH title="Overview" sub="All institutions at a glance" C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
      <StatCard icon="🏛" label="Institutions" value={db.institutions.length} color="teal" C={C}/>
      <StatCard icon="✅" label="Active" value={db.institutions.filter(i=>i.active).length} color="green" C={C}/>
      <StatCard icon="👤" label="Users" value={db.users.filter(u=>u.role!=="superadmin").length} color="purple" C={C}/>
      <StatCard icon="👥" label="Students" value={db.students.length} color="blue" C={C}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:20,boxShadow:C.shadow}}>
        <Sec C={C}>Institutions</Sec>
        {db.institutions.map(inst=>{const m=TYPE_META[inst.type]||TYPE_META["College"];const sc=db.students.filter(s=>s.instId===inst.id).length;return<div key={inst.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}><div style={{width:10,height:10,borderRadius:3,background:inst.color,flexShrink:0}}/><span>{m.icon}</span><div style={{flex:1}}><div style={{fontWeight:600,fontSize:12,color:C.text}}>{inst.name}</div><div style={{fontSize:10,color:C.muted}}>{inst.type} - {inst.city}</div></div><span style={{fontWeight:700,fontSize:12,color:inst.color}}>{sc} stu.</span><div style={{width:7,height:7,borderRadius:"50%",background:inst.active?C.green:C.red}}/></div>;})}
        {!db.institutions.length&&<Empty msg="No institutions" C={C}/>}
      </div>
      <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:20,boxShadow:C.shadow}}>
        <Sec C={C}>Users</Sec>
        {db.users.filter(u=>u.role!=="superadmin").map(u=>{const inst=db.institutions.find(i=>i.id===u.instId);return<div key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}><Avatar name={u.name} color={u.role==="admin"?C.teal:C.green} size={30}/><div style={{flex:1}}><div style={{fontWeight:600,fontSize:12,color:C.text}}>{u.name}</div><div style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>{u.username}</div></div><div style={{textAlign:"right"}}><Badge label={u.role} color={u.role==="admin"?"teal":"green"} C={C}/><div style={{fontSize:9,color:C.muted,marginTop:2}}>{inst?.name?.slice(0,18)||"--"}</div></div></div>;})}
      </div>
    </div>
  </div>;
}
function SAInst({db,onAdd,onUpdate,onDelete,C}){
  const [showAdd,setShowAdd]=useState(false);
  const blank={name:"",type:"College",city:"",phone:"",email:"",color:INST_COLORS[0]};
  const [form,setForm]=useState(blank);
  function submit(){if(!form.name.trim())return;onAdd(form);setForm(blank);setShowAdd(false);}
  const TH={padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",borderBottom:`1px solid ${C.border}`,background:C.bg};
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><PH title="🏛 Institutions" sub={`${db.institutions.length} registered`} C={C}/><Btn onClick={()=>setShowAdd(s=>!s)} C={C} color="teal">+ Add Institution</Btn></div>
    {showAdd&&<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:20,marginBottom:18,boxShadow:C.shadow,animation:"fadeIn 0.3s ease"}}>
      <div style={{fontWeight:700,fontSize:14,marginBottom:14,color:C.text}}>New Institution</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
        <FG label="Name *" C={C}><Inp C={C} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Institution name"/></FG>
        <FG label="Type" C={C}><Sel C={C} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>{INST_TYPES.map(t=><option key={t}>{t}</option>)}</Sel></FG>
        <FG label="City" C={C}><Inp C={C} value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} placeholder="City"/></FG>
        <FG label="Phone" C={C}><Inp C={C} value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Phone"/></FG>
        <FG label="Email" C={C}><Inp C={C} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email"/></FG>
        <FG label="Color" C={C}><div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:4}}>{INST_COLORS.map(c=><button key={c} onClick={()=>setForm(f=>({...f,color:c}))} style={{width:26,height:26,borderRadius:7,background:c,border:form.color===c?"3px solid #333":"3px solid transparent",cursor:"pointer"}}/>) }</div></FG>
      </div>
      <div style={{display:"flex",gap:10}}><Btn onClick={submit} C={C} color="green">Create</Btn><Btn onClick={()=>setShowAdd(false)} C={C} color="red" outline>Cancel</Btn></div>
    </div>}
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {db.institutions.map(inst=>{const m=TYPE_META[inst.type]||TYPE_META["College"];const sc=db.students.filter(s=>s.instId===inst.id).length;const uc=db.users.filter(u=>u.instId===inst.id).length;return<div key={inst.id} style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:"15px 18px",display:"flex",alignItems:"center",gap:14,boxShadow:C.shadow,borderLeft:`4px solid ${inst.color}`}}><span style={{fontSize:26}}>{m.icon}</span><div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>{inst.name}</div><div style={{fontSize:11,color:C.muted}}>{inst.type} - {inst.city} - {inst.phone}</div></div><div style={{display:"flex",gap:10,alignItems:"center",flexShrink:0}}><div style={{textAlign:"center",padding:"5px 12px",background:C.bg,borderRadius:8}}><div style={{fontWeight:700,fontSize:14,color:inst.color}}>{sc}</div><div style={{fontSize:9,color:C.muted}}>Students</div></div><div style={{textAlign:"center",padding:"5px 12px",background:C.bg,borderRadius:8}}><div style={{fontWeight:700,fontSize:14,color:C.purple}}>{uc}</div><div style={{fontSize:9,color:C.muted}}>Users</div></div><Badge label={inst.active?"Active":"Inactive"} color={inst.active?"green":"red"} C={C}/><Btn onClick={()=>onUpdate(inst.id,{active:!inst.active})} C={C} color={inst.active?"gold":"green"} size="sm" outline>{inst.active?"Deactivate":"Activate"}</Btn><Btn onClick={()=>onDelete(inst.id)} C={C} color="red" size="sm" outline>Delete</Btn></div></div>;})}
      {!db.institutions.length&&<Empty msg="No institutions - add one above" C={C}/>}
    </div>
  </div>;
}
function SAUsers({db,onAdd,onDelete,onUpdate,C}){
  const [showAdd,setShowAdd]=useState(false);const blank={name:"",username:"",password:"",email:"",role:"admin",instId:""};const [form,setForm]=useState(blank);
  function submit(){if(!form.name||!form.username||!form.password)return;onAdd(form);setForm(blank);setShowAdd(false);}
  const TH={padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",borderBottom:`1px solid ${C.border}`,background:C.bg};
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><PH title="👤 Users" sub="Admin and staff accounts" C={C}/><Btn onClick={()=>setShowAdd(s=>!s)} C={C} color="purple">+ Create User</Btn></div>
    {showAdd&&<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:20,marginBottom:18,boxShadow:C.shadow,animation:"fadeIn 0.3s ease"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
        <FG label="Full Name *" C={C}><Inp C={C} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full name"/></FG>
        <FG label="Username *" C={C}><Inp C={C} value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} placeholder="Username"/></FG>
        <FG label="Password *" C={C}><Inp C={C} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Password"/></FG>
        <FG label="Email" C={C}><Inp C={C} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email"/></FG>
        <FG label="Role" C={C}><Sel C={C} value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}><option value="admin">Admin</option><option value="staff">Staff</option></Sel></FG>
        <FG label="Institution *" C={C}><Sel C={C} value={form.instId} onChange={e=>setForm(f=>({...f,instId:e.target.value}))}><option value="">-- Select --</option>{db.institutions.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</Sel></FG>
      </div>
      <div style={{display:"flex",gap:10}}><Btn onClick={submit} C={C} color="purple">Create</Btn><Btn onClick={()=>setShowAdd(false)} C={C} color="red" outline>Cancel</Btn></div>
    </div>}
    <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden",boxShadow:C.shadow}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["User","Username","Role","Institution","Actions"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
        <tbody>{db.users.filter(u=>u.role!=="superadmin").map(u=>{const inst=db.institutions.find(i=>i.id===u.instId);return<tr key={u.id} style={{borderBottom:`1px solid ${C.border}`}}><td style={{padding:"11px 16px"}}><div style={{display:"flex",alignItems:"center",gap:9}}><Avatar name={u.name} color={u.role==="admin"?C.teal:C.green} size={30}/><div><div style={{fontWeight:600,fontSize:12,color:C.text}}>{u.name}</div><div style={{fontSize:10,color:C.muted}}>{u.email}</div></div></div></td><td style={{padding:"11px 16px",fontFamily:"monospace",fontSize:12,color:C.teal}}>{u.username}</td><td style={{padding:"11px 16px"}}><Badge label={u.role} color={u.role==="admin"?"teal":"green"} C={C}/></td><td style={{padding:"11px 16px",fontSize:12,color:C.muted}}>{inst?.name?.slice(0,22)||"--"}</td><td style={{padding:"11px 16px"}}><div style={{display:"flex",gap:6}}><Btn onClick={()=>{const np=window.prompt("New password:",u.password);if(np)onUpdate(u.id,{password:np});}} C={C} color="gold" size="sm" outline>Reset Pwd</Btn><Btn onClick={()=>onDelete(u.id)} C={C} color="red" size="sm" outline>Delete</Btn></div></td></tr>;})}
        {!db.users.filter(u=>u.role!=="superadmin").length&&<tr><td colSpan={5}><Empty msg="No users" C={C}/></td></tr>}</tbody>
      </table>
    </div>
  </div>;
}
function SAStudents({db,C}){
  const [filter,setFilter]=useState("all");const [q,setQ]=useState("");
  const fs=db.students.filter(s=>(filter==="all"||s.instId===filter)&&[s.name,s.rollNo,s.phone].some(v=>v?.toLowerCase().includes(q.toLowerCase())));
  const TH={padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",borderBottom:`1px solid ${C.border}`,background:C.bg};
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <PH title="👥 All Students" sub={`${db.students.length} total`} C={C}/>
    <div style={{display:"flex",gap:12,marginBottom:14,flexWrap:"wrap"}}><Inp C={C} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." style={{flex:1,minWidth:160}}/><Sel C={C} value={filter} onChange={e=>setFilter(e.target.value)} style={{width:"auto"}}><option value="all">All Institutions</option>{db.institutions.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</Sel></div>
    <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden",boxShadow:C.shadow}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["Student","Roll","Institution","Class/Dept","Phone","Att%"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
        <tbody>{fs.map(s=>{const inst=db.institutions.find(i=>i.id===s.instId);const pct=attPct(s.attendance);const m=TYPE_META[inst?.type]||TYPE_META["College"];return<tr key={s.id} style={{borderBottom:`1px solid ${C.border}`}}><td style={{padding:"10px 16px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar name={s.name} photo={s.photo} color={inst?.color||C.teal} size={30}/><span style={{fontWeight:600,fontSize:12,color:C.text}}>{s.name}</span></div></td><td style={{padding:"10px 16px",fontFamily:"monospace",fontSize:11,color:C.teal}}>{s.rollNo||"--"}</td><td style={{padding:"10px 16px",fontSize:11,color:C.text}}>{m.icon} {inst?.name?.slice(0,18)||"--"}</td><td style={{padding:"10px 16px",fontSize:11,color:C.muted}}>{s.department||s.class||s.course||s.danceStyle||"--"}</td><td style={{padding:"10px 16px",fontSize:11,color:C.text}}>{s.phone||"--"}</td><td style={{padding:"10px 16px"}}><MiniBar pct={pct} color={pct>=75?C.green:C.red} C={C}/></td></tr>;})}
        {!fs.length&&<tr><td colSpan={6}><Empty msg="No students" C={C}/></td></tr>}</tbody>
      </table>
    </div>
  </div>;
}
function SAReports({db,C}){
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <PH title="📋 Reports" sub="Cross-institution analytics" C={C}/>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {db.institutions.map(inst=>{const m=TYPE_META[inst.type]||TYPE_META["College"];const stus=db.students.filter(s=>s.instId===inst.id);const tf=stus.flatMap(s=>s.fees||[]).reduce((a,f)=>a+Number(f.amount||0),0);const pf=stus.flatMap(s=>s.fees||[]).reduce((a,f)=>a+Number(f.paid||0),0);const aa=stus.length?Math.round(stus.reduce((a,s)=>a+attPct(s.attendance),0)/stus.length):0;return<div key={inst.id} style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:"16px 20px",boxShadow:C.shadow,borderLeft:`4px solid ${inst.color}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div><div style={{fontWeight:700,fontSize:14,color:C.text}}>{m.icon} {inst.name}</div><div style={{fontSize:11,color:C.muted}}>{inst.type} - {inst.city}</div></div><Badge label={inst.active?"Active":"Inactive"} color={inst.active?"green":"red"} C={C}/></div><div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>{[{l:"Students",v:stus.length,c:inst.color},{l:"Total Fee",v:`Rs.${tf.toLocaleString()}`,c:C.muted},{l:"Collected",v:`Rs.${pf.toLocaleString()}`,c:C.green},{l:"Due",v:`Rs.${(tf-pf).toLocaleString()}`,c:(tf-pf)>0?C.red:C.green},{l:"Avg Att",v:`${aa}%`,c:aa>=75?C.green:C.red}].map(r=><div key={r.l} style={{textAlign:"center",background:C.bg,borderRadius:8,padding:"10px",border:`1px solid ${C.border}`}}><div style={{fontSize:14,fontWeight:800,color:r.c}}>{r.v}</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>{r.l}</div></div>)}</div></div>;})}
    </div>
  </div>;
}

// Institution Dashboard Shell
const INST_TABS=[{k:"home",i:"🏠",l:"Home"},{k:"students",i:"👥",l:"Students"},{k:"register",i:"➕",l:"Register"},{k:"attend",i:"📅",l:"Attendance"},{k:"fees",i:"💰",l:"Fees"},{k:"homework",i:"📚",l:"Homework"},{k:"exams",i:"📝",l:"Exam Marks"},{k:"assign",i:"📋",l:"Assignments"},{k:"timetable",i:"🗓",l:"Timetable"},{k:"idcard",i:"🪪",l:"ID Cards"},{k:"receipt",i:"🧾",l:"Fee Receipt"},{k:"alerts",i:"📣",l:"Alerts"},{k:"reports",i:"📊",l:"Reports"}];

function InstDash({db,saveDb,onLogout,notify,user,inst,C,dark,setDark}){
  const [tab,setTab]=useState("home");
  const color=inst.color||C.teal;
  const m=TYPE_META[inst.type]||TYPE_META["College"];
  const myStudents=useMemo(()=>db.students.filter(s=>s.instId===inst.id),[db.students,inst.id]);
  const isAdmin=user.role==="admin";
  function addStudent(data){const s={...data,id:uid(),instId:inst.id,createdAt:today(),attendance:[],fees:[],homeworks:[],exams:[],assignments:[]};saveDb({students:[...db.students,s]});notify("Student registered!");setTab("students");}
  function updStudent(id,patch){saveDb({students:db.students.map(s=>s.id===id?{...s,...patch}:s)});}
  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    <TopBar C={C} dark={dark} setDark={setDark} onLogout={onLogout} user={user} right={`${m.icon} ${inst.name}`}/>
    <div style={{display:"flex",flex:1}}>
      <div style={{width:200,background:C.surface,borderRight:`1px solid ${C.border}`,padding:"12px 10px",position:"sticky",top:56,height:"calc(100vh - 56px)",overflowY:"auto",display:"flex",flexDirection:"column",gap:1}}>
        {INST_TABS.filter(t=>isAdmin||t.k!=="register").map(t=><button key={t.k} onClick={()=>setTab(t.k)} style={{width:"100%",textAlign:"left",padding:"8px 11px",border:"none",borderRadius:8,background:tab===t.k?C.tealL:"transparent",color:tab===t.k?C.teal:C.text,fontWeight:tab===t.k?700:500,fontSize:11.5,display:"flex",alignItems:"center",gap:7,marginBottom:1,cursor:"pointer"}}>{t.i} {t.l}</button>)}
        <div style={{flex:1}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,padding:"6px 0"}}>
          <div style={{padding:"7px",background:C.bg,borderRadius:8,textAlign:"center",border:`1px solid ${C.border}`}}><div style={{fontSize:16,fontWeight:800,color}}>{myStudents.length}</div><div style={{fontSize:8,color:C.muted}}>Students</div></div>
          <div style={{padding:"7px",background:C.bg,borderRadius:8,textAlign:"center",border:`1px solid ${C.border}`}}><div style={{fontSize:16,fontWeight:800,color:C.green}}>{myStudents.filter(s=>s.attendance?.find(a=>a.date===today())?.status==="Present").length}</div><div style={{fontSize:8,color:C.muted}}>Today</div></div>
        </div>
      </div>
      <div style={{flex:1,padding:24,overflowY:"auto"}}>
        {tab==="home"&&<InstHome inst={inst} students={myStudents} color={color} setTab={setTab} m={m} C={C}/>}
        {tab==="students"&&<InstStudents students={myStudents} inst={inst} color={color} onUpdate={updStudent} C={C}/>}
        {tab==="register"&&isAdmin&&<InstRegister inst={inst} onSave={addStudent} color={color} m={m} C={C}/>}
        {tab==="attend"&&<InstAttend students={myStudents} color={color} onUpdate={updStudent} notify={notify} C={C}/>}
        {tab==="fees"&&<InstFees students={myStudents} color={color} onUpdate={updStudent} notify={notify} C={C}/>}
        {tab==="homework"&&<InstHomework students={myStudents} color={color} onUpdate={updStudent} notify={notify} C={C}/>}
        {tab==="exams"&&<InstExams students={myStudents} color={color} onUpdate={updStudent} notify={notify} C={C}/>}
        {tab==="assign"&&<InstAssign students={myStudents} color={color} onUpdate={updStudent} notify={notify} C={C}/>}
        {tab==="timetable"&&<InstTimetable inst={inst} color={color} notify={notify} C={C}/>}
        {tab==="idcard"&&<InstIDCards students={myStudents} inst={inst} color={color} C={C}/>}
        {tab==="receipt"&&<InstReceipts students={myStudents} inst={inst} color={color} C={C}/>}
        {tab==="alerts"&&<InstAlerts students={myStudents} inst={inst} color={color} notify={notify} C={C}/>}
        {tab==="reports"&&<InstReports students={myStudents} inst={inst} color={color} C={C}/>}
      </div>
    </div>
  </div>;
}

function InstHome({inst,students,color,setTab,m,C}){
  const present=students.filter(s=>s.attendance?.find(a=>a.date===today())?.status==="Present").length;
  const feePending=students.filter(s=>s.fees?.some(f=>f.status==="Pending"||f.status==="Partial")).length;
  const hwPending=students.filter(s=>s.homeworks?.some(h=>h.status==="Pending")).length;
  const tf=students.flatMap(s=>s.fees||[]).reduce((a,f)=>a+Number(f.amount||0),0);
  const pf=students.flatMap(s=>s.fees||[]).reduce((a,f)=>a+Number(f.paid||0),0);
  const feePct=tf>0?Math.round(pf/tf*100):0;
  const avgAtt=students.length?Math.round(students.reduce((a,s)=>a+attPct(s.attendance),0)/students.length):0;
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <div style={{marginBottom:22}}><div style={{fontSize:22,fontWeight:800,color:C.text}}>{m.icon} {inst.name}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{inst.type} - {inst.city}</div></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
      <StatCard icon="👥" label="Total Students" value={students.length} color="teal" C={C} onClick={()=>setTab("students")}/>
      <StatCard icon="✅" label="Present Today" value={present} color="green" C={C} onClick={()=>setTab("attend")}/>
      <StatCard icon="💰" label="Fee Pending" value={feePending} color="pink" C={C} onClick={()=>setTab("fees")} sub={`Rs.${(tf-pf).toLocaleString()} due`}/>
      <StatCard icon="📚" label="HW Pending" value={hwPending} color="purple" C={C} onClick={()=>setTab("homework")}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
      <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:18,boxShadow:C.shadow}}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:14,color:C.text}}>💰 Fee Collection</div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:C.muted,fontSize:13}}>Rs.{pf.toLocaleString()} collected</span><span style={{fontWeight:700,color,fontSize:13}}>{feePct}%</span></div>
        <div style={{height:10,background:C.bg,borderRadius:99,overflow:"hidden",marginBottom:7,border:`1px solid ${C.border}`}}><div style={{height:"100%",width:`${feePct}%`,background:`linear-gradient(90deg,${color},${color}cc)`,borderRadius:99,transition:"width 0.5s"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:C.muted}}>Total: Rs.{tf.toLocaleString()}</span><span style={{color:C.red,fontWeight:600}}>Due: Rs.{(tf-pf).toLocaleString()}</span></div>
      </div>
      <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:18,boxShadow:C.shadow}}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:14,color:C.text}}>📅 Attendance</div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:68,height:68,borderRadius:"50%",background:`conic-gradient(${avgAtt>=75?C.green:C.red} ${avgAtt*3.6}deg,${C.bg} 0deg)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`2px solid ${C.border}`}}>
            <div style={{width:50,height:50,borderRadius:"50%",background:C.surface,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:avgAtt>=75?C.green:C.red}}>{avgAtt}%</div>
          </div>
          <div><div style={{fontSize:12,color:C.muted}}>Average attendance</div><div style={{fontSize:12,color:avgAtt>=75?C.green:C.red,fontWeight:700,marginTop:5}}>{avgAtt>=75?"Good standing":"Below 75%"}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{students.filter(s=>attPct(s.attendance)<75).length} below threshold</div></div>
        </div>
      </div>
    </div>
    {students.length>0&&<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:18,boxShadow:C.shadow}}><Sec C={C}>Recently Registered</Sec><div style={{display:"flex",flexDirection:"column",gap:7}}>{students.slice(-4).reverse().map(s=><div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:C.bg,borderRadius:9,border:`1px solid ${C.border}`}}><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={s.name} photo={s.photo} color={color} size={32}/><div><div style={{fontWeight:600,fontSize:12,color:C.text}}>{s.name}</div><div style={{fontSize:10,color:C.muted}}>{s.rollNo} - {s.department||s.class||s.course||s.danceStyle}</div></div></div><div style={{fontSize:11,color:C.muted}}>{fmt(s.createdAt)}</div></div>)}</div></div>}
  </div>;
}

function InstStudents({students,inst,color,onUpdate,C}){
  const [q,setQ]=useState("");const [sel,setSel]=useState(null);const [photoFor,setPhotoFor]=useState(null);
  const fs=students.filter(s=>[s.name,s.rollNo,s.phone,s.department,s.class,s.course,s.danceStyle].some(v=>v?.toLowerCase().includes(q.toLowerCase())));
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <PH title="👥 Students" sub={`${students.length} enrolled`} C={C}/>
    <Inp C={C} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name, roll, phone..." style={{marginBottom:14}}/>
    <div style={{display:"grid",gridTemplateColumns:sel?"1fr 360px":"1fr",gap:18,alignItems:"start"}}>
      <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden",boxShadow:C.shadow}}>
        {!fs.length&&<Empty msg="No students" C={C}/>}
        {fs.map(s=>{const pct=attPct(s.attendance);return<div key={s.id} onClick={()=>setSel(sel?.id===s.id?null:s)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:sel?.id===s.id?C.tealL:"transparent",transition:"background 0.1s"}} onMouseOver={e=>{if(sel?.id!==s.id)e.currentTarget.style.background=C.bg;}} onMouseOut={e=>{if(sel?.id!==s.id)e.currentTarget.style.background="transparent";}}>
          <div style={{display:"flex",alignItems:"center",gap:11}}><Avatar name={s.name} photo={s.photo} color={color} size={38}/><div><div style={{fontWeight:600,fontSize:13,color:C.text}}>{s.name}</div><div style={{fontSize:11,color:C.muted}}>{s.rollNo} - {s.department||s.class||s.course||s.danceStyle} {s.section?`- ${s.section}`:""}</div></div></div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}><MiniBar pct={pct} color={pct>=75?C.green:C.red} C={C}/>{s.fees?.some(f=>f.status==="Pending"||f.status==="Partial")&&<Badge label="Fee Due" color="pink" C={C}/>}<button onClick={e=>{e.stopPropagation();setPhotoFor(s.id);}} style={{fontSize:15,background:"none",border:"none",color:C.muted,padding:4,cursor:"pointer"}} title="Upload Photo">📷</button></div>
        </div>;})}
      </div>
      {sel&&<StuProfileCard s={students.find(x=>x.id===sel.id)||sel} color={color} onClose={()=>setSel(null)} onPhoto={()=>setPhotoFor(sel.id)} C={C}/>}
    </div>
    {photoFor&&<PhotoModal sid={photoFor} student={students.find(s=>s.id===photoFor)} color={color} onSave={(sid,photo)=>{onUpdate(sid,{photo});setPhotoFor(null);}} onClose={()=>setPhotoFor(null)} C={C}/>}
  </div>;
}
function PhotoModal({sid,student,color,onSave,onClose,C}){
  const [photo,setPhoto]=useState(student?.photo||"");
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:C.surface,borderRadius:14,border:`1px solid ${C.border}`,padding:28,width:300,textAlign:"center",boxShadow:C.shadowL,animation:"fadeUp 0.3s ease"}}>
      <div style={{fontWeight:700,fontSize:14,marginBottom:18,color:C.text}}>📷 {student?.name}</div>
      <PhotoUpload photo={photo} onChange={setPhoto} color={color} C={C} size={100}/>
      <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:18}}><Btn onClick={()=>onSave(sid,photo)} C={C} color="green">Save Photo</Btn><Btn onClick={onClose} C={C} color="red" outline>Cancel</Btn></div>
    </div>
  </div>;
}
function StuProfileCard({s,color,onClose,onPhoto,C}){
  const pct=attPct(s.attendance);const tf=s.fees?.reduce((a,f)=>a+Number(f.amount||0),0)||0;const pf=s.fees?.reduce((a,f)=>a+Number(f.paid||0),0)||0;const exams=s.exams||[];const avgM=exams.length?Math.round(exams.reduce((a,e)=>a+Number(e.percentage||0),0)/exams.length):null;const hwDone=s.homeworks?.filter(h=>h.status==="Submitted").length||0;
  return <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:20,position:"sticky",top:24,boxShadow:C.shadow,animation:"slideIn 0.3s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
      <div style={{flex:1,textAlign:"center"}}>
        <div style={{position:"relative",display:"inline-block",marginBottom:10}}><Avatar name={s.name} photo={s.photo} color={color} size={60}/><button onClick={onPhoto} style={{position:"absolute",bottom:0,right:0,width:22,height:22,borderRadius:"50%",background:color,border:"none",fontSize:10,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>📷</button></div>
        <div style={{fontWeight:800,fontSize:15,color:C.text}}>{s.name}</div>
        <div style={{fontSize:11,color:C.muted}}>{s.rollNo}</div>
        <div style={{fontSize:12,color,fontWeight:600,marginTop:2}}>{s.department||s.class||s.course||s.danceStyle}</div>
      </div>
      <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:22,lineHeight:1,cursor:"pointer"}}>×</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
      {[{l:"Attendance",v:`${pct}%`,c:pct>=75?C.green:C.red},{l:"Avg Marks",v:avgM!=null?`${avgM}%`:"--",c:C.teal},{l:"Fee Paid",v:`Rs.${pf.toLocaleString()}`,c:C.green},{l:"HW Done",v:`${hwDone}/${s.homeworks?.length||0}`,c:C.purple}].map(r=><div key={r.l} style={{background:C.bg,borderRadius:9,padding:"10px",textAlign:"center",border:`1px solid ${C.border}`}}><div style={{fontSize:14,fontWeight:800,color:r.c}}>{r.v}</div><div style={{fontSize:9,color:C.muted,marginTop:2}}>{r.l}</div></div>)}
    </div>
    {[{l:"Phone",v:s.phone},{l:"Email",v:s.email},{l:"Parent",v:s.parent},{l:"Parent Ph",v:s.parentPhone},{l:"DOB",v:fmt(s.dob)},{l:"Gender",v:s.gender},{l:"Blood",v:s.blood},{l:"Admitted",v:fmt(s.admissionDate)}].filter(r=>r.v&&r.v!=="--").map(r=><div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`,fontSize:12}}><span style={{color:C.muted}}>{r.l}</span><span style={{fontWeight:600,color:C.text}}>{r.v}</span></div>)}
    {s.attendance?.length>0&&<div style={{marginTop:12}}><Sec C={C}>Last 7 Days</Sec><div style={{display:"flex",gap:3}}>{s.attendance.slice(-7).map((a,i)=><div key={i} title={`${fmt(a.date)}: ${a.status}`} style={{flex:1,height:24,borderRadius:5,background:a.status==="Present"?C.green:a.status==="Absent"?C.red:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",fontWeight:700}}>{a.status[0]}</div>)}</div></div>}
  </div>;
}

function InstRegister({inst,onSave,color,m,C}){
  const [step,setStep]=useState(0);
  const blank={name:"",rollNo:"",dob:"",gender:"Male",phone:"",email:"",address:"",aadhaar:"",religion:"",parent:"",parentPhone:"",admissionDate:today(),deptGroup:"Arts & Science",department:"",year:"1st Year",section:"A",class:"Class 1",medium:"English Medium",group:"N/A",hostel:"Day Scholar",bus:"",scholarship:"None",course:"Basic Computer",duration:"3 Months",batch:"Morning",timing:"",qualification:"Graduate",blood:"--",occupation:"",income:"",danceStyle:"Bharatanatyam",danceLevel:"Beginner",danceBatch:"Evening 4-6 PM",danceGoal:"",photo:""};
  const [f,setF]=useState(blank);const [err,setErr]=useState({});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  function validate(){const e={};if(!f.name.trim())e.name="Required";if(!f.phone.match(/^\d{10}$/))e.phone="10 digits needed";if(!f.dob)e.dob="Required";if(inst.type==="College"&&!f.department)e.department="Required";setErr(e);return!Object.keys(e).length;}
  function submit(){if(validate()){onSave({...f,institution:inst.type});setF(blank);setStep(0);}}
  const steps=inst.type==="College"?[["🏫 Academic",<CollegeF f={f} set={set} err={err} C={C}/>],["👤 Personal",<PersonalF f={f} set={set} err={err} color={color} C={C}/>],["📞 Contact",<ContactF f={f} set={set} err={err} C={C}/>]]:inst.type==="School"?[["🏫 Class",<SchoolF f={f} set={set} C={C}/>],["👤 Personal",<PersonalF f={f} set={set} err={err} color={color} C={C}/>],["📞 Contact",<ContactF f={f} set={set} err={err} C={C}/>]]:inst.type==="Computer Institute"?[["💻 Course",<CompF f={f} set={set} C={C}/>],["👤 Personal",<PersonalF f={f} set={set} err={err} color={color} C={C}/>],["📞 Contact",<ContactF f={f} set={set} err={err} C={C}/>]]:[["💃 Dance",<DanceF f={f} set={set} C={C}/>],["👤 Personal",<PersonalF f={f} set={set} err={err} color={color} C={C}/>],["📞 Contact",<ContactF f={f} set={set} err={err} C={C}/>]];
  return <div style={{maxWidth:700,animation:"fadeUp 0.4s ease"}}>
    <PH title={`${m.icon} Register Student`} sub={`Enrolling into ${inst.name}`} C={C}/>
    <div style={{display:"flex",alignItems:"center",marginBottom:22}}>
      {steps.map(([l],i)=><div key={i} style={{display:"flex",alignItems:"center",flex:i<steps.length-1?1:"none"}}><div onClick={()=>setStep(i)} style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",flexShrink:0}}><div style={{width:28,height:28,borderRadius:"50%",background:i===step?C.teal:i<step?C.green:C.bg,border:`2px solid ${i===step?C.teal:i<step?C.green:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:i<=step?"#fff":C.muted,transition:"all 0.2s"}}>{i<step?"✓":i+1}</div><span style={{fontSize:12,fontWeight:i===step?700:500,color:i===step?C.teal:C.muted,whiteSpace:"nowrap"}}>{l}</span></div>{i<steps.length-1&&<div style={{flex:1,height:2,background:i<step?C.green:C.border,margin:"0 8px",transition:"background 0.3s"}}/>}</div>)}
    </div>
    <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:24,marginBottom:14,boxShadow:C.shadow}}>{steps[step][1]}</div>
    <div style={{display:"flex",justifyContent:"space-between"}}>
      <Btn onClick={()=>setStep(s=>Math.max(0,s-1))} C={C} color="gold" outline disabled={step===0}>Back</Btn>
      {step<steps.length-1?<Btn onClick={()=>setStep(s=>s+1)} C={C} color="teal">Next</Btn>:<Btn onClick={submit} C={C} color="green">Register Student</Btn>}
    </div>
  </div>;
}
function DanceF({f,set,C}){return<G2><FG label="Dance Style" C={C}><Sel C={C} value={f.danceStyle} onChange={e=>set("danceStyle",e.target.value)}>{DANCE_STYLES.map(d=><option key={d}>{d}</option>)}</Sel></FG><FG label="Level" C={C}><Sel C={C} value={f.danceLevel} onChange={e=>set("danceLevel",e.target.value)}>{DANCE_LEVELS.map(d=><option key={d}>{d}</option>)}</Sel></FG><FG label="Batch" C={C}><Sel C={C} value={f.danceBatch} onChange={e=>set("danceBatch",e.target.value)}>{DANCE_BATCHES.map(b=><option key={b}>{b}</option>)}</Sel></FG><FG label="Enrollment No" C={C}><Inp C={C} value={f.rollNo} onChange={e=>set("rollNo",e.target.value)} placeholder="DNA2025001"/></FG><FG label="Admission Date" C={C}><Inp C={C} type="date" value={f.admissionDate} onChange={e=>set("admissionDate",e.target.value)}/></FG><FG label="Goal" C={C}><Inp C={C} value={f.danceGoal} onChange={e=>set("danceGoal",e.target.value)} placeholder="e.g. Arangetram 2026"/></FG></G2>;}
function CollegeF({f,set,err,C}){return<G2><FG label="Dept Group" C={C}><Sel C={C} value={f.deptGroup} onChange={e=>{set("deptGroup",e.target.value);set("department","");}}>{Object.keys(DEPARTMENTS).map(d=><option key={d}>{d}</option>)}</Sel></FG><FG label="Department *" err={err.department} C={C}><Sel C={C} value={f.department} onChange={e=>set("department",e.target.value)}><option value="">-- Select --</option>{DEPARTMENTS[f.deptGroup].map(d=><option key={d}>{d}</option>)}</Sel></FG><FG label="Year" C={C}><Sel C={C} value={f.year} onChange={e=>set("year",e.target.value)}>{["1st Year","2nd Year","3rd Year","4th Year","PG 1st Year","PG 2nd Year"].map(y=><option key={y}>{y}</option>)}</Sel></FG><FG label="Section" C={C}><Sel C={C} value={f.section} onChange={e=>set("section",e.target.value)}>{["A","B","C","D"].map(s=><option key={s}>{s}</option>)}</Sel></FG><FG label="Roll Number" C={C}><Inp C={C} value={f.rollNo} onChange={e=>set("rollNo",e.target.value)} placeholder="22CS001"/></FG><FG label="Admission Date" C={C}><Inp C={C} type="date" value={f.admissionDate} onChange={e=>set("admissionDate",e.target.value)}/></FG><FG label="Hostel" C={C}><Sel C={C} value={f.hostel} onChange={e=>set("hostel",e.target.value)}>{["Day Scholar","Hosteller"].map(h=><option key={h}>{h}</option>)}</Sel></FG><FG label="Scholarship" C={C}><Sel C={C} value={f.scholarship} onChange={e=>set("scholarship",e.target.value)}>{["None","BC/MBC","SC/ST","Merit","Sports"].map(s=><option key={s}>{s}</option>)}</Sel></FG></G2>;}
function SchoolF({f,set,C}){return<G2><FG label="Class" C={C}><Sel C={C} value={f.class} onChange={e=>set("class",e.target.value)}>{SCHOOL_CLASSES.map(c=><option key={c}>{c}</option>)}</Sel></FG><FG label="Section" C={C}><Sel C={C} value={f.section} onChange={e=>set("section",e.target.value)}>{SCHOOL_SECTIONS.map(s=><option key={s}>{s}</option>)}</Sel></FG><FG label="Roll No" C={C}><Inp C={C} value={f.rollNo} onChange={e=>set("rollNo",e.target.value)} placeholder="01"/></FG><FG label="Medium" C={C}><Sel C={C} value={f.medium} onChange={e=>set("medium",e.target.value)}>{["Tamil Medium","English Medium"].map(m=><option key={m}>{m}</option>)}</Sel></FG><FG label="Group" C={C}><Sel C={C} value={f.group} onChange={e=>set("group",e.target.value)}>{["N/A","Maths-Biology","Maths-CS","Commerce","Arts"].map(g=><option key={g}>{g}</option>)}</Sel></FG><FG label="Admission Date" C={C}><Inp C={C} type="date" value={f.admissionDate} onChange={e=>set("admissionDate",e.target.value)}/></FG></G2>;}
function CompF({f,set,C}){return<G2><FG label="Course" C={C}><Sel C={C} value={f.course} onChange={e=>set("course",e.target.value)}>{COMP_COURSES.map(c=><option key={c}>{c}</option>)}</Sel></FG><FG label="Duration" C={C}><Sel C={C} value={f.duration} onChange={e=>set("duration",e.target.value)}>{["1 Month","3 Months","6 Months","1 Year"].map(d=><option key={d}>{d}</option>)}</Sel></FG><FG label="Batch" C={C}><Sel C={C} value={f.batch} onChange={e=>set("batch",e.target.value)}>{["Morning","Afternoon","Evening","Weekend"].map(b=><option key={b}>{b}</option>)}</Sel></FG><FG label="Timing" C={C}><Inp C={C} value={f.timing} onChange={e=>set("timing",e.target.value)} placeholder="9AM-11AM"/></FG><FG label="Enrollment No" C={C}><Inp C={C} value={f.rollNo} onChange={e=>set("rollNo",e.target.value)} placeholder="CI2025001"/></FG><FG label="Admission Date" C={C}><Inp C={C} type="date" value={f.admissionDate} onChange={e=>set("admissionDate",e.target.value)}/></FG></G2>;}
function PersonalF({f,set,err,color,C}){return<div><div style={{display:"flex",justifyContent:"center",marginBottom:16}}><div><LBL C={C}>Student Photo</LBL><PhotoUpload photo={f.photo} onChange={v=>set("photo",v)} color={color} C={C} size={80}/></div></div><G2><FG label="Full Name *" err={err?.name} C={C}><Inp C={C} value={f.name} onChange={e=>set("name",e.target.value)} placeholder="Full name"/></FG><FG label="Date of Birth *" err={err?.dob} C={C}><Inp C={C} type="date" value={f.dob} onChange={e=>set("dob",e.target.value)}/></FG><FG label="Gender" C={C}><Sel C={C} value={f.gender} onChange={e=>set("gender",e.target.value)}>{["Male","Female","Other"].map(g=><option key={g}>{g}</option>)}</Sel></FG><FG label="Blood Group" C={C}><Sel C={C} value={f.blood||"--"} onChange={e=>set("blood",e.target.value)}>{["--","A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b=><option key={b}>{b}</option>)}</Sel></FG><FG label="Aadhaar" C={C}><Inp C={C} value={f.aadhaar} onChange={e=>set("aadhaar",e.target.value)} placeholder="12-digit" maxLength={12}/></FG><FG label="Religion" C={C}><Inp C={C} value={f.religion} onChange={e=>set("religion",e.target.value)} placeholder="e.g. Hindu"/></FG><FG label="Address" span C={C}><Txt C={C} value={f.address} onChange={e=>set("address",e.target.value)} rows={2} placeholder="Full address"/></FG></G2></div>;}
function ContactF({f,set,err,C}){return<G2><FG label="Phone *" err={err?.phone} C={C}><Inp C={C} value={f.phone} onChange={e=>set("phone",e.target.value)} placeholder="10-digit" maxLength={10}/></FG><FG label="Email" C={C}><Inp C={C} value={f.email} onChange={e=>set("email",e.target.value)} placeholder="email@example.com"/></FG><FG label="Parent/Guardian" C={C}><Inp C={C} value={f.parent} onChange={e=>set("parent",e.target.value)} placeholder="Parent name"/></FG><FG label="Parent Phone" C={C}><Inp C={C} value={f.parentPhone} onChange={e=>set("parentPhone",e.target.value)} placeholder="Parent mobile" maxLength={10}/></FG><FG label="Occupation" C={C}><Inp C={C} value={f.occupation} onChange={e=>set("occupation",e.target.value)} placeholder="e.g. Farmer"/></FG><FG label="Annual Income" C={C}><Inp C={C} value={f.income} onChange={e=>set("income",e.target.value)} placeholder="e.g. 1,50,000"/></FG></G2>;}

function InstAttend({students,color,onUpdate,notify,C}){
  const [date,setDate]=useState(today());const [q,setQ]=useState("");
  const fs=students.filter(s=>[s.name,s.rollNo].some(v=>v?.toLowerCase().includes(q.toLowerCase())));
  function mark(sid,status){const s=students.find(x=>x.id===sid);const att=(s.attendance||[]).filter(a=>a.date!==date);onUpdate(sid,{attendance:[...att,{date,status}]});}
  function markAll(status){students.forEach(s=>mark(s.id,status));notify(`All marked ${status}`);}
  const present=students.filter(s=>s.attendance?.find(a=>a.date===date)?.status==="Present").length;
  const absent=students.filter(s=>s.attendance?.find(a=>a.date===date)?.status==="Absent").length;
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <PH title="📅 Attendance" sub={`Marking for ${fmt(date)}`} C={C}/>
    <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
      <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{padding:"9px 14px",border:`1px solid ${C.border}`,borderRadius:9,background:C.surface,color:C.text,fontSize:13,cursor:"pointer"}}/>
      <Inp C={C} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." style={{flex:1,minWidth:140}}/>
      <Btn onClick={()=>markAll("Present")} C={C} color="green">✓ All Present</Btn>
      <Btn onClick={()=>markAll("Absent")} C={C} color="red">✗ All Absent</Btn>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
      <StatCard icon="👥" label="Total" value={students.length} color="teal" C={C}/>
      <StatCard icon="✅" label="Present" value={present} color="green" C={C}/>
      <StatCard icon="✗" label="Absent" value={absent} color="red" C={C}/>
      <StatCard icon="—" label="Unmarked" value={students.length-present-absent} color="gold" C={C}/>
    </div>
    <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden",boxShadow:C.shadow}}>
      {fs.map(s=>{const att=s.attendance?.find(a=>a.date===date);const pct=attPct(s.attendance);return<div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 16px",borderBottom:`1px solid ${C.border}`,background:att?.status==="Present"?C.greenL:att?.status==="Absent"?C.redL:"transparent",transition:"background 0.1s"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={s.name} photo={s.photo} color={color} size={34}/><div><div style={{fontWeight:600,fontSize:12,color:C.text}}>{s.name}</div><div style={{fontSize:10,color:C.muted}}>{s.rollNo} · <span style={{color:pct>=75?C.green:C.red,fontWeight:700}}>{pct}%</span></div></div></div>
        <div style={{display:"flex",gap:7,alignItems:"center"}}>{att&&<Badge label={att.status} color={att.status==="Present"?"green":att.status==="Absent"?"red":"gold"} C={C}/>}{["Present","Absent","Leave"].map(st=><button key={st} onClick={()=>mark(s.id,st)} style={{padding:"5px 13px",border:`1px solid ${st==="Present"?C.green:st==="Absent"?C.red:C.gold}`,borderRadius:7,background:att?.status===st?(st==="Present"?C.green:st==="Absent"?C.red:C.gold):"transparent",color:att?.status===st?"#fff":(st==="Present"?C.green:st==="Absent"?C.red:C.gold),fontSize:11,fontWeight:700,cursor:"pointer"}}>{st==="Present"?"P":st==="Absent"?"A":"L"}</button>)}</div>
      </div>;})}
      {!fs.length&&<Empty msg="No students" C={C}/>}
    </div>
  </div>;
}

function InstFees({students,color,onUpdate,notify,C}){
  const [sel,setSel]=useState(null);const [showAdd,setShowAdd]=useState(false);
  const now=new Date();const MN=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const [form,setForm]=useState({month:`${MN[now.getMonth()]} ${now.getFullYear()}`,amount:"",paid:"",status:"Paid",mode:"Cash",date:today()});
  const s=students.find(x=>x.id===sel);
  function addFee(){if(!form.amount){notify("Enter amount","error");return;}onUpdate(sel,{fees:[...(s.fees||[]),{...form,id:uid()}]});notify("Fee added!");setShowAdd(false);setForm(f=>({...f,amount:"",paid:""}));}
  const tc2=students.flatMap(s=>s.fees||[]).reduce((a,f)=>a+Number(f.paid||0),0);
  const td=students.flatMap(s=>s.fees||[]).reduce((a,f)=>a+Number(f.amount||0)-Number(f.paid||0),0);
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <PH title="💰 Fees" sub="Track and record fees" C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
      <StatCard icon="✅" label="Collected" value={`Rs.${tc2.toLocaleString()}`} color="green" C={C}/>
      <StatCard icon="❗" label="Due" value={`Rs.${td.toLocaleString()}`} color="red" C={C}/>
      <StatCard icon="⏳" label="Pending Students" value={students.filter(s=>s.fees?.some(f=>f.status!=="Paid"&&f.status!=="Waived")).length} color="gold" C={C}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16,alignItems:"start"}}>
      <StuSidebar students={students} sel={sel} setSel={id=>{setSel(id);setShowAdd(false);}} C={C} extra={s=>{const p=s.fees?.reduce((a,f)=>a+Number(f.paid||0),0)||0;const t=s.fees?.reduce((a,f)=>a+Number(f.amount||0),0)||0;return t>0?`Rs.${p.toLocaleString()} / Rs.${t.toLocaleString()}`:"No records";}}/>
      <div>{s?<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:18,boxShadow:C.shadow}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:9}}><Avatar name={s.name} photo={s.photo} color={color} size={36}/><div style={{fontWeight:700,fontSize:14,color:C.text}}>{s.name}</div></div><Btn onClick={()=>setShowAdd(x=>!x)} C={C} color="teal">+ Add Fee</Btn></div>
        {showAdd&&<div style={{background:C.bg,borderRadius:10,padding:16,marginBottom:14,border:`1px solid ${C.border}`}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}><FG label="Month" C={C}><Inp C={C} value={form.month} onChange={e=>setForm(f=>({...f,month:e.target.value}))}/></FG><FG label="Total (Rs.)" C={C}><Inp C={C} type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="0"/></FG><FG label="Paid (Rs.)" C={C}><Inp C={C} type="number" value={form.paid} onChange={e=>setForm(f=>({...f,paid:e.target.value}))} placeholder="0"/></FG><FG label="Status" C={C}><Sel C={C} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{FEE_STATUS.map(x=><option key={x}>{x}</option>)}</Sel></FG><FG label="Mode" C={C}><Inp C={C} value={form.mode} onChange={e=>setForm(f=>({...f,mode:e.target.value}))} placeholder="Cash/UPI"/></FG><FG label="Date" C={C}><Inp C={C} type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></FG></div><Btn onClick={addFee} C={C} color="green">Save</Btn></div>}
        {!(s.fees||[]).length&&<Empty msg="No fee records yet" C={C}/>}
        {(s.fees||[]).map(fee=><div key={fee.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:C.bg,borderRadius:9,marginBottom:6,border:`1px solid ${C.border}`}}><div><div style={{fontWeight:600,fontSize:13,color:C.text}}>{fee.month}</div><div style={{fontSize:11,color:C.muted}}>{fee.mode} · {fmt(fee.date)}</div></div><div style={{textAlign:"right"}}><div style={{fontWeight:700,fontSize:13,color:C.text}}>Rs.{Number(fee.paid||0).toLocaleString()}<span style={{color:C.muted,fontWeight:400,fontSize:11}}>/Rs.{Number(fee.amount||0).toLocaleString()}</span></div><Badge label={fee.status} color={fee.status==="Paid"?"green":fee.status==="Partial"?"gold":fee.status==="Waived"?"teal":"red"} C={C}/></div></div>)}
      </div>:<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:"50px",textAlign:"center",color:C.muted,boxShadow:C.shadow}}>Select a student to manage fees</div>}</div>
    </div>
  </div>;
}

function InstHomework({students,color,onUpdate,notify,C}){
  const [sel,setSel]=useState(null);const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({title:"",subject:"",dueDate:"",description:"",status:"Pending"});
  const s=students.find(x=>x.id===sel);
  function add(){if(!form.title){notify("Title required","error");return;}onUpdate(sel,{homeworks:[...(s.homeworks||[]),{...form,id:uid(),assignedDate:today()}]});notify("Assigned!");setShowAdd(false);setForm({title:"",subject:"",dueDate:"",description:"",status:"Pending"});}
  function upd(hid,status){onUpdate(sel,{homeworks:(s.homeworks||[]).map(h=>h.id===hid?{...h,status}:h)});}
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <PH title="📚 Homework" sub="Assign and track homework" C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16,alignItems:"start"}}>
      <StuSidebar students={students} sel={sel} setSel={id=>{setSel(id);setShowAdd(false);}} C={C} extra={s=>`${(s.homeworks||[]).filter(h=>h.status==="Submitted").length}/${(s.homeworks||[]).length} submitted`}/>
      <div>{s?<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:18,boxShadow:C.shadow}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:9}}><Avatar name={s.name} photo={s.photo} color={color} size={34}/><div style={{fontWeight:700,fontSize:13,color:C.text}}>{s.name}</div></div><Btn onClick={()=>setShowAdd(x=>!x)} C={C} color="gold">+ Assign</Btn></div>
        {showAdd&&<div style={{background:C.bg,borderRadius:10,padding:14,marginBottom:14,border:`1px solid ${C.border}`}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}><FG label="Title *" C={C}><Inp C={C} value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Homework title"/></FG><FG label="Subject" C={C}><Inp C={C} value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} placeholder="Subject"/></FG><FG label="Due Date" C={C}><Inp C={C} type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))}/></FG><FG label="Status" C={C}><Sel C={C} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{HW_STATUS.map(x=><option key={x}>{x}</option>)}</Sel></FG><FG label="Description" span C={C}><Txt C={C} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2} placeholder="Details..."/></FG></div><Btn onClick={add} C={C} color="gold">Assign</Btn></div>}
        {!(s.homeworks||[]).length&&<Empty msg="No homework yet" C={C}/>}
        {(s.homeworks||[]).slice().reverse().map(hw=><div key={hw.id} style={{background:C.bg,borderRadius:9,padding:"11px 14px",marginBottom:6,border:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontWeight:600,fontSize:12,color:C.text}}>{hw.title}</div><div style={{fontSize:10,color:C.muted}}>{hw.subject} · Due: {fmt(hw.dueDate)}</div>{hw.description&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>{hw.description}</div>}</div><div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0,marginLeft:8}}><Badge label={hw.status} color={hw.status==="Submitted"?"green":hw.status==="Late"?"red":hw.status==="Incomplete"?"gold":"teal"} C={C}/><Sel C={C} value={hw.status} onChange={e=>upd(hw.id,e.target.value)} style={{width:"auto",padding:"3px 8px",fontSize:11}}>{HW_STATUS.map(x=><option key={x}>{x}</option>)}</Sel></div></div></div>)}
      </div>:<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:"50px",textAlign:"center",color:C.muted,boxShadow:C.shadow}}>Select a student</div>}</div>
    </div>
  </div>;
}

function InstExams({students,color,onUpdate,notify,C}){
  const [sel,setSel]=useState(null);const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({examName:"",subject:"",date:"",marks:"",maxMarks:"100",grade:"",remarks:""});
  const s=students.find(x=>x.id===sel);
  function add(){if(!form.examName||!form.marks){notify("Fill exam name and marks","error");return;}const pct=Math.round((Number(form.marks)/Number(form.maxMarks))*100);const ag=pct>=90?"A+":pct>=80?"A":pct>=70?"B+":pct>=60?"B":pct>=50?"C":"F";onUpdate(sel,{exams:[...(s.exams||[]),{...form,id:uid(),percentage:pct,grade:form.grade||ag}]});notify("Marks recorded!");setShowAdd(false);setForm({examName:"",subject:"",date:"",marks:"",maxMarks:"100",grade:"",remarks:""});}
  const avg=s&&(s.exams||[]).length?Math.round((s.exams||[]).reduce((a,e)=>a+Number(e.percentage||0),0)/(s.exams||[]).length):null;
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <PH title="📝 Exam Marks" sub="Record and track results" C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16,alignItems:"start"}}>
      <StuSidebar students={students} sel={sel} setSel={id=>{setSel(id);setShowAdd(false);}} C={C} extra={s=>{const e=s.exams||[];if(!e.length)return"No exams";return`Avg: ${Math.round(e.reduce((a,x)=>a+Number(x.percentage||0),0)/e.length)}%`;}}/>
      <div>{s?<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:18,boxShadow:C.shadow}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:9}}><Avatar name={s.name} photo={s.photo} color={color} size={34}/><div><div style={{fontWeight:700,fontSize:13,color:C.text}}>{s.name}</div>{avg!=null&&<div style={{fontSize:11,color:C.teal}}>Avg: {avg}%</div>}</div></div><Btn onClick={()=>setShowAdd(x=>!x)} C={C} color="blue">+ Add Marks</Btn></div>
        {showAdd&&<div style={{background:C.bg,borderRadius:10,padding:14,marginBottom:14,border:`1px solid ${C.border}`}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}><FG label="Exam Name *" C={C}><Inp C={C} value={form.examName} onChange={e=>setForm(f=>({...f,examName:e.target.value}))} placeholder="Unit Test 1"/></FG><FG label="Subject" C={C}><Inp C={C} value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} placeholder="Maths"/></FG><FG label="Date" C={C}><Inp C={C} type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></FG><FG label="Marks *" C={C}><Inp C={C} type="number" value={form.marks} onChange={e=>setForm(f=>({...f,marks:e.target.value}))} placeholder="85"/></FG><FG label="Max Marks" C={C}><Inp C={C} type="number" value={form.maxMarks} onChange={e=>setForm(f=>({...f,maxMarks:e.target.value}))}/></FG><FG label="Grade (auto)" C={C}><Inp C={C} value={form.grade} onChange={e=>setForm(f=>({...f,grade:e.target.value}))} placeholder="A/B..."/></FG><FG label="Remarks" span C={C}><Inp C={C} value={form.remarks} onChange={e=>setForm(f=>({...f,remarks:e.target.value}))} placeholder="Feedback"/></FG></div><Btn onClick={add} C={C} color="blue">Save</Btn></div>}
        {!(s.exams||[]).length&&<Empty msg="No exam records yet" C={C}/>}
        {(s.exams||[]).slice().reverse().map(ex=>{const pct=Number(ex.percentage||0);const bc=pct>=75?C.green:pct>=50?C.gold:C.red;return<div key={ex.id} style={{background:C.bg,borderRadius:9,padding:"11px 14px",marginBottom:6,border:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><div><div style={{fontWeight:600,fontSize:12,color:C.text}}>{ex.examName} {ex.subject&&<span style={{color:C.muted,fontWeight:400}}>· {ex.subject}</span>}</div><div style={{fontSize:10,color:C.muted}}>{fmt(ex.date)}{ex.remarks&&` · ${ex.remarks}`}</div></div><div style={{textAlign:"right"}}><div style={{fontWeight:800,fontSize:18,color:bc}}>{ex.marks}<span style={{fontSize:11,color:C.muted,fontWeight:400}}>/{ex.maxMarks}</span></div><Badge label={ex.grade} color={pct>=75?"green":pct>=50?"gold":"red"} C={C}/></div></div><div style={{height:6,background:C.border,borderRadius:99}}><div style={{height:"100%",width:`${pct}%`,background:bc,borderRadius:99}}/></div><div style={{fontSize:10,color:C.muted,marginTop:4}}>{pct}%</div></div>;})}
      </div>:<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:"50px",textAlign:"center",color:C.muted,boxShadow:C.shadow}}>Select a student</div>}</div>
    </div>
  </div>;
}

function InstAssign({students,color,onUpdate,notify,C}){
  const [sel,setSel]=useState(null);const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({title:"",subject:"",assignedDate:today(),dueDate:"",maxMarks:"",marksObtained:"",status:"Assigned",type:"Written",remarks:""});
  const s=students.find(x=>x.id===sel);
  function add(){if(!form.title){notify("Title required","error");return;}onUpdate(sel,{assignments:[...(s.assignments||[]),{...form,id:uid()}]});notify("Added!");setShowAdd(false);setForm({title:"",subject:"",assignedDate:today(),dueDate:"",maxMarks:"",marksObtained:"",status:"Assigned",type:"Written",remarks:""});}
  function upd(aid,status){onUpdate(sel,{assignments:(s.assignments||[]).map(a=>a.id===aid?{...a,status}:a)});}
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <PH title="📋 Assignments" sub="Manage and grade assignments" C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16,alignItems:"start"}}>
      <StuSidebar students={students} sel={sel} setSel={id=>{setSel(id);setShowAdd(false);}} C={C} extra={s=>`${(s.assignments||[]).filter(a=>a.status==="Submitted"||a.status==="Graded").length}/${(s.assignments||[]).length} done`}/>
      <div>{s?<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:18,boxShadow:C.shadow}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:9}}><Avatar name={s.name} photo={s.photo} color={color} size={34}/><div style={{fontWeight:700,fontSize:13,color:C.text}}>{s.name}</div></div><Btn onClick={()=>setShowAdd(x=>!x)} C={C} color="purple">+ Add</Btn></div>
        {showAdd&&<div style={{background:C.bg,borderRadius:10,padding:14,marginBottom:14,border:`1px solid ${C.border}`}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}><FG label="Title *" C={C}><Inp C={C} value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Assignment title"/></FG><FG label="Subject" C={C}><Inp C={C} value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} placeholder="Subject"/></FG><FG label="Type" C={C}><Sel C={C} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>{ASSIGN_TYPES.map(t=><option key={t}>{t}</option>)}</Sel></FG><FG label="Due Date" C={C}><Inp C={C} type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))}/></FG><FG label="Max Marks" C={C}><Inp C={C} type="number" value={form.maxMarks} onChange={e=>setForm(f=>({...f,maxMarks:e.target.value}))} placeholder="20"/></FG><FG label="Status" C={C}><Sel C={C} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{ASSIGN_STATUS.map(x=><option key={x}>{x}</option>)}</Sel></FG><FG label="Marks Obtained" C={C}><Inp C={C} type="number" value={form.marksObtained} onChange={e=>setForm(f=>({...f,marksObtained:e.target.value}))} placeholder="After grading"/></FG><FG label="Remarks" C={C}><Inp C={C} value={form.remarks} onChange={e=>setForm(f=>({...f,remarks:e.target.value}))} placeholder="Feedback"/></FG></div><Btn onClick={add} C={C} color="purple">Save</Btn></div>}
        {!(s.assignments||[]).length&&<Empty msg="No assignments yet" C={C}/>}
        {(s.assignments||[]).slice().reverse().map(a=>{const sc=a.status==="Graded"||a.status==="Submitted"?"green":a.status==="Late"||a.status==="Not Submitted"?"red":"gold";const scC=tc(C,sc);const scL=tb(C,sc);return<div key={a.id} style={{background:C.bg,borderRadius:9,padding:"11px 14px",marginBottom:6,border:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}><div><div style={{fontWeight:600,fontSize:12,color:C.text}}>{a.title}</div><div style={{fontSize:10,color:C.muted}}>{a.subject} · {a.type} · Due: {fmt(a.dueDate)}</div>{a.remarks&&<div style={{fontSize:10,color:C.muted,marginTop:1}}>💬 {a.remarks}</div>}</div><div style={{textAlign:"right",flexShrink:0,marginLeft:8}}>{a.marksObtained&&a.maxMarks&&<div style={{fontWeight:700,color:C.teal,fontSize:12}}>{a.marksObtained}/{a.maxMarks}</div>}<Badge label={a.status} color={sc} C={C}/></div></div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{["Submitted","Graded","Late","Not Submitted"].map(st=><button key={st} onClick={()=>upd(a.id,st)} style={{padding:"3px 9px",border:`1px solid ${a.status===st?scC:C.border}`,borderRadius:5,background:a.status===st?scL:"transparent",color:a.status===st?scC:C.muted,fontSize:10,fontWeight:600,cursor:"pointer"}}>{st}</button>)}</div></div>;})}
      </div>:<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:"50px",textAlign:"center",color:C.muted,boxShadow:C.shadow}}>Select a student</div>}</div>
    </div>
  </div>;
}

function InstTimetable({inst,color,notify,C}){
  const KEY=`allbee_tt5_${inst.id}`;
  const [classes,setClasses]=useState(()=>lsGet(KEY,[]));const [selCls,setSelCls]=useState(null);const [showAdd,setShowAdd]=useState(false);const [newCls,setNewCls]=useState({name:"",section:"",teacher:""});const [editing,setEditing]=useState(null);const [cellForm,setCellForm]=useState({subject:"",teacher:"",room:""});
  function saveCls(c){setClasses(c);lsSet(KEY,c);}
  function addClass(){if(!newCls.name.trim()){notify("Class name required","error");return;}const c=[...classes,{id:uid(),...newCls,timetable:{}}];saveCls(c);setSelCls(c[c.length-1].id);setNewCls({name:"",section:"",teacher:""});setShowAdd(false);notify("Class created!");}
  function delClass(id){if(!window.confirm("Delete?"))return;saveCls(classes.filter(c=>c.id!==id));if(selCls===id)setSelCls(null);}
  const cls=classes.find(c=>c.id===selCls);
  function setCell(day,period,data){saveCls(classes.map(c=>c.id!==selCls?c:{...c,timetable:{...c.timetable,[`${day}|${period}`]:data}}));}
  function clearCell(day,period){saveCls(classes.map(c=>{if(c.id!==selCls)return c;const tt={...c.timetable};delete tt[`${day}|${period}`];return{...c,timetable:tt};}));}
  const subColors={};if(cls){const subs=[...new Set(Object.values(cls.timetable||{}).map(v=>v.subject).filter(Boolean))];subs.forEach((s,i)=>{subColors[s]=SUB_COLORS[i%SUB_COLORS.length];});}
  function printTT(){if(!cls)return;const w=window.open("","_blank");w.document.write(`<html><head><title>Timetable</title><style>body{font-family:'Segoe UI',Arial,sans-serif;padding:20px;font-size:11px;background:#fff;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #e2e8f0;padding:7px 9px;text-align:center;}th{background:#f0fdf4;font-weight:700;color:#0d9488;}.brk{background:#fef3c7;color:#92400e;}.per{font-weight:600;color:#374151;text-align:left;white-space:nowrap;}h2,h3{text-align:center;color:#0d9488;}</style></head><body><h2>${inst.name}</h2><h3>Timetable - ${cls.name}${cls.section?` Sec ${cls.section}`:""}</h3>${cls.teacher?`<p style="text-align:center;color:#718096">Class Teacher: ${cls.teacher}</p>`:""}<table><tr><th>Period</th>${DAYS.map(d=>`<th>${d}</th>`).join("")}</tr>${PERIODS.map(p=>{const isB=p.includes("BREAK");return`<tr>${isB?`<td class="brk per">${p}</td>${DAYS.map(()=>`<td class="brk">-</td>`).join("")}`:`<td class="per">${p}</td>${DAYS.map(d=>{const c=cls.timetable?.[`${d}|${p}`];return c?.subject?`<td><b>${c.subject}</b>${c.teacher?`<br/><small style="color:#718096">${c.teacher}</small>`:""}</td>`:`<td style="color:#d1d5db">-</td>`;}).join("")}`}</tr>`;}).join("")}</table></body></html>`);w.document.close();setTimeout(()=>w.print(),400);}
  const TH={padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.bg,whiteSpace:"nowrap"};
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><PH title="🗓 Timetable" sub="Manage class schedules" C={C}/><div style={{display:"flex",gap:8}}>{cls&&<Btn onClick={printTT} C={C} color="teal" outline>🖨 Print</Btn>}<Btn onClick={()=>setShowAdd(s=>!s)} C={C} color="teal">+ Add Class</Btn></div></div>
    {showAdd&&<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:18,marginBottom:14,boxShadow:C.shadow,animation:"fadeIn 0.3s ease"}}><div style={{fontWeight:700,marginBottom:12,color:C.text}}>New Class</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}><FG label="Class *" C={C}><Inp C={C} value={newCls.name} onChange={e=>setNewCls(f=>({...f,name:e.target.value}))} placeholder="e.g. Class 10"/></FG><FG label="Section" C={C}><Inp C={C} value={newCls.section} onChange={e=>setNewCls(f=>({...f,section:e.target.value}))} placeholder="A"/></FG><FG label="Class Teacher" C={C}><Inp C={C} value={newCls.teacher} onChange={e=>setNewCls(f=>({...f,teacher:e.target.value}))} placeholder="Teacher name"/></FG></div><div style={{display:"flex",gap:8}}><Btn onClick={addClass} C={C} color="green">Create</Btn><Btn onClick={()=>setShowAdd(false)} C={C} color="red" outline>Cancel</Btn></div></div>}
    <div style={{display:"grid",gridTemplateColumns:"190px 1fr",gap:16}}>
      <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden",boxShadow:C.shadow}}>
        <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Classes</div>
        {!classes.length&&<Empty msg="No classes yet" C={C}/>}
        {classes.map(c=><div key={c.id} onClick={()=>setSelCls(c.id)} style={{padding:"11px 14px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:selCls===c.id?C.tealL:"transparent",transition:"background 0.1s"}} onMouseOver={e=>{if(selCls!==c.id)e.currentTarget.style.background=C.bg;}} onMouseOut={e=>{if(selCls!==c.id)e.currentTarget.style.background="transparent";}}><div style={{fontWeight:600,fontSize:12,color:selCls===c.id?C.teal:C.text}}>{c.name} {c.section&&`- ${c.section}`}</div>{c.teacher&&<div style={{fontSize:10,color:C.muted}}>{c.teacher}</div>}<div style={{fontSize:9,color:C.muted,marginTop:2}}>{Object.keys(c.timetable||{}).length} slots filled</div><button onClick={e=>{e.stopPropagation();delClass(c.id);}} style={{fontSize:9,color:C.red,background:"none",border:"none",padding:0,marginTop:3,cursor:"pointer"}}>Delete</button></div>)}
      </div>
      <div>{cls?<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,overflow:"auto",boxShadow:C.shadow}}>
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:13,color:C.text}}>{cls.name} {cls.section&&`- Sec ${cls.section}`}</div>{cls.teacher&&<div style={{fontSize:11,color:C.muted}}>Teacher: {cls.teacher}</div>}</div>
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",minWidth:640}}>
          <thead><tr style={{background:C.bg}}><th style={{...TH,minWidth:110}}>Period</th>{DAYS.map(d=><th key={d} style={{...TH,textAlign:"center",color,minWidth:100}}>{d.slice(0,3).toUpperCase()}</th>)}</tr></thead>
          <tbody>{PERIODS.map(period=>{const isB=period.includes("BREAK");return<tr key={period} style={{background:isB?C.goldL:"transparent"}}>
            <td style={{padding:"7px 12px",borderBottom:`1px solid ${C.border}`,fontSize:10,fontWeight:600,color:isB?C.gold:C.muted,whiteSpace:"nowrap"}}>{period}</td>
            {DAYS.map(day=>{const key=`${day}|${period}`;const cell=cls.timetable?.[key];const bg=cell?.subject?subColors[cell.subject]||color:null;const isEdit=editing?.day===day&&editing?.period===period;return<td key={day} style={{padding:"3px",borderBottom:`1px solid ${C.border}`,verticalAlign:"top"}}>
              {isB?<div style={{padding:"7px",textAlign:"center",color:C.gold,fontSize:10,fontWeight:600}}>-</div>
              :isEdit?<div style={{background:C.bg,borderRadius:7,padding:7,minWidth:90,border:`1px solid ${C.border}`}}>
                <Inp C={C} value={cellForm.subject} onChange={e=>setCellForm(f=>({...f,subject:e.target.value}))} placeholder="Subject" style={{padding:"4px 8px",fontSize:11,marginBottom:4}}/>
                <Inp C={C} value={cellForm.teacher} onChange={e=>setCellForm(f=>({...f,teacher:e.target.value}))} placeholder="Teacher" style={{padding:"4px 8px",fontSize:11,marginBottom:4}}/>
                <Inp C={C} value={cellForm.room} onChange={e=>setCellForm(f=>({...f,room:e.target.value}))} placeholder="Room" style={{padding:"4px 8px",fontSize:11,marginBottom:6}}/>
                <div style={{display:"flex",gap:3}}><button onClick={()=>{setCell(day,period,cellForm);setEditing(null);notify("Saved!");}} style={{flex:1,padding:"4px",border:"none",borderRadius:5,background:C.teal,color:"#fff",fontSize:9,fontWeight:700,cursor:"pointer"}}>✓</button><button onClick={()=>setEditing(null)} style={{flex:1,padding:"4px",border:`1px solid ${C.border}`,borderRadius:5,background:"transparent",color:C.muted,fontSize:9,cursor:"pointer"}}>✕</button>{cell&&<button onClick={()=>{clearCell(day,period);setEditing(null);}} style={{flex:1,padding:"4px",border:`1px solid ${C.red}`,borderRadius:5,background:"transparent",color:C.red,fontSize:9,cursor:"pointer"}}>🗑</button>}</div>
              </div>
              :<div onClick={()=>{setEditing({day,period});setCellForm(cell||{subject:"",teacher:"",room:""}); }} style={{minHeight:54,borderRadius:7,background:bg?`${bg}15`:"transparent",border:`1px dashed ${bg||C.border}`,padding:"5px 7px",cursor:"pointer",transition:"all 0.15s"}} onMouseOver={e=>e.currentTarget.style.background=bg?`${bg}25`:C.bg} onMouseOut={e=>e.currentTarget.style.background=bg?`${bg}15`:"transparent"}>
                {cell?.subject?<><div style={{fontSize:11,fontWeight:700,color:bg,lineHeight:1.2}}>{cell.subject}</div>{cell.teacher&&<div style={{fontSize:9,color:C.muted,marginTop:2}}>{cell.teacher}</div>}{cell.room&&<div style={{fontSize:8,color:C.muted}}>Rm:{cell.room}</div>}</>:<div style={{fontSize:16,color:C.muted2,textAlign:"center",paddingTop:10}}>+</div>}
              </div>}
            </td>;})}
          </tr>;})}
          </tbody>
        </table></div>
        {Object.keys(subColors).length>0&&<div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`,display:"flex",gap:10,flexWrap:"wrap",background:C.bg}}>{Object.entries(subColors).map(([s2,c])=><div key={s2} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.text}}><div style={{width:10,height:10,borderRadius:3,background:c}}/>{s2}</div>)}</div>}
      </div>:<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:"50px",textAlign:"center",color:C.muted,boxShadow:C.shadow}}>Select or create a class</div>}</div>
    </div>
  </div>;
}

function InstIDCards({students,inst,color,C}){
  const [sel,setSel]=useState([]);const [q,setQ]=useState("");
  const fs=students.filter(s=>[s.name,s.rollNo,s.class,s.department,s.danceStyle,s.course].some(v=>v?.toLowerCase().includes(q.toLowerCase())));
  function printCards(){const toPrint=sel.length>0?students.filter(s=>sel.includes(s.id)):students;const w=window.open("","_blank");const cards=toPrint.map(s=>idCardHTML(s,inst,color)).join("");w.document.write(`<html><head><title>ID Cards</title><style>*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;}body{background:#f0f4f8;padding:20px;}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;max-width:900px;margin:0 auto;}.card{border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;background:#fff;break-inside:avoid;}@media print{body{padding:0;background:#fff}.grid{gap:8px}}</style></head><body><div class="grid">${cards}</div></body></html>`);w.document.close();setTimeout(()=>w.print(),500);}
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><PH title="🪪 ID Cards" sub="Generate and print student ID cards" C={C}/><Btn onClick={printCards} C={C} color="teal">🖨 Print Cards</Btn></div>
    <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}><Inp C={C} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." style={{flex:1,minWidth:160}}/><Btn onClick={()=>setSel(fs.map(s=>s.id))} C={C} color="teal" outline size="sm">Select All</Btn>{sel.length>0&&<Btn onClick={()=>setSel([])} C={C} color="red" outline size="sm">Clear ({sel.length})</Btn>}<span style={{fontSize:12,color:C.muted}}>{sel.length>0?`${sel.length} selected`:`${students.length} students`}</span></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
      {fs.map(s=><div key={s.id} style={{cursor:"pointer",position:"relative"}} onClick={()=>setSel(p=>p.includes(s.id)?p.filter(x=>x!==s.id):[...p,s.id])}>
        <div style={{position:"absolute",top:8,right:8,zIndex:10,width:20,height:20,borderRadius:"50%",background:sel.includes(s.id)?color:C.surface,border:`2px solid ${sel.includes(s.id)?color:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",boxShadow:C.shadow}}>{sel.includes(s.id)?"✓":""}</div>
        <IDCardUI s={s} inst={inst} color={color}/>
      </div>)}
      {!fs.length&&<div style={{gridColumn:"1/-1"}}><Empty msg="No students" C={C}/></div>}
    </div>
  </div>;
}
function IDCardUI({s,inst,color}){
  const cl=s.department||s.class||s.course||s.danceStyle||"--";
  return <div style={{borderRadius:12,overflow:"hidden",border:"1px solid #e2e8f0",boxShadow:"0 1px 4px rgba(0,0,0,0.08)",fontFamily:"'Segoe UI',Arial,sans-serif",background:"#fff"}}>
    <div style={{background:`linear-gradient(135deg,${color},${color}cc)`,padding:"9px 12px",display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:20,height:20,borderRadius:6,background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>🐝</div>
      <div><div style={{fontWeight:800,fontSize:8,color:"#fff",lineHeight:1.2}}>{inst.name.slice(0,28)}</div><div style={{fontSize:6,color:"rgba(255,255,255,0.85)"}}>{inst.type} - {inst.city}</div></div>
    </div>
    <div style={{padding:"10px",display:"flex",gap:8,alignItems:"center",background:"#fff"}}>
      <div style={{width:44,height:44,borderRadius:8,border:`2px solid ${color}`,overflow:"hidden",flexShrink:0,background:`${color}18`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {s.photo?<img src={s.photo} alt={s.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:16,color}}>{(s.name||"?")[0]?.toUpperCase()}</span>}
      </div>
      <div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:11,color:"#1a202c",lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</div><div style={{fontSize:9,color,fontWeight:700,marginTop:2}}>{cl}</div>{s.rollNo&&<div style={{fontSize:8,color:"#718096",marginTop:2}}>ID: {s.rollNo}</div>}</div>
    </div>
    <div style={{background:color,padding:"6px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{fontSize:8,fontWeight:700,color:"#fff"}}>{s.phone||inst.phone||""}</div>
      <div style={{fontSize:7,color:"rgba(255,255,255,0.85)"}}>Valid 2024-25</div>
    </div>
  </div>;
}
function idCardHTML(s,inst,color){const cl=s.department||s.class||s.course||s.danceStyle||"--";const ph=s.photo?`<img src="${s.photo}" style="width:100%;height:100%;object-fit:cover;"/>`:`<div style="font-size:24px;color:${color};">${(s.name||"?")[0]?.toUpperCase()}</div>`;return`<div class="card"><div style="background:linear-gradient(135deg,${color},${color}cc);padding:9px 12px;display:flex;align-items:center;gap:8px;"><div style="font-size:13px;">🐝</div><div><div style="font-weight:800;font-size:9px;color:#fff;">${inst.name.slice(0,28)}</div><div style="font-size:7px;color:rgba(255,255,255,0.85);">${inst.type} - ${inst.city}</div></div></div><div style="padding:10px;display:flex;gap:8px;align-items:center;"><div style="width:48px;height:48px;border-radius:8px;border:2px solid ${color};overflow:hidden;flex-shrink:0;background:${color}18;display:flex;align-items:center;justify-content:center;">${ph}</div><div><div style="font-weight:800;font-size:12px;color:#1a202c;">${s.name}</div><div style="font-size:10px;color:${color};font-weight:700;margin-top:2px;">${cl}</div>${s.rollNo?`<div style="font-size:9px;color:#718096;margin-top:2px;">ID: ${s.rollNo}</div>`:""}</div></div><div style="background:${color};padding:6px 10px;display:flex;justify-content:space-between;"><span style="font-size:8px;font-weight:700;color:#fff;">${s.phone||""}</span><span style="font-size:7px;color:rgba(255,255,255,0.85);">Valid 2024-25</span></div></div>`;}

function InstReceipts({students,inst,color,C}){
  const RN_KEY=`allbee_rn5_${inst.id}`;
  const [sel,setSel]=useState(null);const [selFee,setSelFee]=useState(null);const [q,setQ]=useState("");
  const [rn,setRn]=useState(()=>lsGet(RN_KEY,1001));
  const fs=students.filter(s=>[s.name,s.rollNo].some(v=>v?.toLowerCase().includes(q.toLowerCase())));
  const s=students.find(x=>x.id===sel);const fee=s?.fees?.find(f=>f.id===selFee);
  function printReceipt(){if(!s||!fee)return;const w=window.open("","_blank");w.document.write(buildReceiptHTML(s,fee,inst,color,rn));w.document.close();setTimeout(()=>{w.print();const nr=rn+1;setRn(nr);lsSet(RN_KEY,nr);},500);}
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><PH title="🧾 Fee Receipts" sub="Generate and print receipts" C={C}/><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:12,color:C.muted}}>Next #: <b style={{color}}>{rn}</b></span>{fee&&<Btn onClick={printReceipt} C={C} color="teal">🖨 Print Receipt</Btn>}</div></div>
    <div style={{display:"grid",gridTemplateColumns:"210px 1fr",gap:16}}>
      <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden",boxShadow:C.shadow}}>
        <div style={{padding:"9px 11px",borderBottom:`1px solid ${C.border}`}}><Inp C={C} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." style={{padding:"7px 10px",fontSize:12}}/></div>
        {fs.map(st=>{const p=st.fees?.reduce((a,f)=>a+Number(f.paid||0),0)||0;const t=st.fees?.reduce((a,f)=>a+Number(f.amount||0),0)||0;return<div key={st.id} onClick={()=>{setSel(st.id);setSelFee(null);}} style={{padding:"10px 12px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:sel===st.id?C.tealL:"transparent",transition:"background 0.1s"}} onMouseOver={e=>{if(sel!==st.id)e.currentTarget.style.background=C.bg;}} onMouseOut={e=>{if(sel!==st.id)e.currentTarget.style.background="transparent";}}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar name={st.name} photo={st.photo} color={color} size={28}/><div><div style={{fontWeight:600,fontSize:12,color:C.text}}>{st.name}</div><div style={{fontSize:10,color:C.muted}}>{st.rollNo}</div></div></div><div style={{fontSize:10,color:C.green,marginTop:3}}>Rs.{p.toLocaleString()} / Rs.{t.toLocaleString()}</div></div>;})}
        {!fs.length&&<Empty msg="No students" C={C}/>}
      </div>
      <div>{s?<><div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:18,marginBottom:14,boxShadow:C.shadow}}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:12,color:C.text}}>Fee Records - {s.name}</div>
        {!(s.fees||[]).length&&<Empty msg="No fee records" C={C}/>}
        {(s.fees||[]).map(f=><div key={f.id} onClick={()=>setSelFee(f.id)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 13px",background:selFee===f.id?C.tealL:C.bg,borderRadius:9,cursor:"pointer",border:`1px solid ${selFee===f.id?C.teal:C.border}`,marginBottom:5,transition:"all 0.1s"}}><div><div style={{fontWeight:600,fontSize:12,color:C.text}}>{f.month}</div><div style={{fontSize:10,color:C.muted}}>{f.mode} - {fmt(f.date)}</div></div><div style={{textAlign:"right"}}><div style={{fontWeight:700,fontSize:12,color:C.text}}>Rs.{Number(f.paid||0).toLocaleString()}</div><Badge label={f.status} color={f.status==="Paid"?"green":f.status==="Partial"?"gold":"red"} C={C}/></div></div>)}
      </div>
      {fee&&<div style={{background:C.surface,borderRadius:12,border:`2px solid ${color}44`,padding:20,boxShadow:C.shadow}}><div style={{fontWeight:700,fontSize:13,marginBottom:14,color}}>🧾 Receipt Preview - #{rn}</div><ReceiptPreview s={s} fee={fee} inst={inst} color={color} rn={rn} C={C}/></div>}</>
      :<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:"50px",textAlign:"center",color:C.muted,boxShadow:C.shadow}}>Select a student</div>}</div>
    </div>
  </div>;
}

function ReceiptPreview({s,fee,inst,color,rn,C}){
  const due=Number(fee.amount||0)-Number(fee.paid||0);
  return <div style={{background:"#fff",borderRadius:10,padding:22,color:"#111",fontFamily:"'Segoe UI',Arial,sans-serif",fontSize:12,border:"1px solid #e2e8f0"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,paddingBottom:12,borderBottom:"2px solid #e2e8f0"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:38,height:38,borderRadius:10,background:color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>🐝</div><div><div style={{fontWeight:800,fontSize:14}}>{inst.name}</div><div style={{fontSize:10,color:"#6b7280"}}>{inst.type} - {inst.city} - {inst.phone}</div></div></div><div style={{textAlign:"right"}}><div style={{fontWeight:800,fontSize:14,color}}>FEE RECEIPT</div><div style={{fontSize:11,color:"#6b7280"}}>No: <b>#{rn}</b></div><div style={{fontSize:10,color:"#6b7280"}}>{fmt(fee.date||today())}</div></div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}><div><div style={{fontSize:9,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Student</div><div style={{fontWeight:700,fontSize:13}}>{s.name}</div><div style={{fontSize:11,color:"#374151"}}>{s.department||s.class||s.course||s.danceStyle||""} {s.section?`- Sec ${s.section}`:""}</div>{s.rollNo&&<div style={{fontSize:10,color:"#6b7280"}}>Roll: {s.rollNo}</div>}{s.parent&&<div style={{fontSize:10,color:"#6b7280"}}>Parent: {s.parent}</div>}</div><div style={{background:"#f0fdf4",borderRadius:8,padding:10}}><div style={{fontSize:9,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:7}}>Payment</div>{[["Period",fee.month],["Total","Rs."+Number(fee.amount||0).toLocaleString()],["Paid","Rs."+Number(fee.paid||0).toLocaleString()],["Balance","Rs."+due.toLocaleString()],["Mode",fee.mode||"--"],["Status",fee.status]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span style={{color:"#6b7280"}}>{k}</span><span style={{fontWeight:700,color:k==="Balance"&&due>0?"#ef4444":k==="Status"&&fee.status==="Paid"?"#10b981":"#111"}}>{v}</span></div>)}</div></div>
    <div style={{background:color,borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontWeight:800,fontSize:13,color:"#fff"}}>Amount Paid</div><div style={{fontWeight:900,fontSize:20,color:"#fff"}}>Rs.{Number(fee.paid||0).toLocaleString()}</div></div>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#9ca3af",paddingTop:10,borderTop:"1px solid #e2e8f0"}}><span>🐝 Powered by AllBee EduSphere</span><div style={{width:80,borderTop:"1px solid #9ca3af",paddingTop:3,textAlign:"center"}}>Authorised Sign</div></div>
  </div>;
}

function buildReceiptHTML(s,fee,inst,color,rn){const due=Number(fee.amount||0)-Number(fee.paid||0);return`<!DOCTYPE html><html><head><title>Receipt #${rn}</title><style>*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;}body{padding:32px;max-width:580px;margin:0 auto;font-size:12px;color:#111;background:#fff;}.hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:2px solid #e2e8f0;margin-bottom:16px;}.logo{width:40px;height:40px;border-radius:10px;background:${color};display:flex;align-items:center;justify-content:center;font-size:18px;}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;}.box{background:#f0fdf4;border-radius:8px;padding:10px;}.lbl{font-size:9px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;}.row{display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;}.total{background:${color};border-radius:8px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}.ftr{display:flex;justify-content:space-between;font-size:9px;color:#9ca3af;padding-top:10px;border-top:1px solid #e2e8f0;}.sign{width:80px;border-top:1px solid #9ca3af;padding-top:3px;text-align:center;font-size:9px;color:#9ca3af;}</style></head><body><div class="hdr"><div style="display:flex;gap:10px;align-items:center;"><div class="logo">🐝</div><div><div style="font-weight:800;font-size:14px;">${inst.name}</div><div style="font-size:10px;color:#6b7280;">${inst.type} - ${inst.city} - ${inst.phone||""}</div></div></div><div style="text-align:right;"><div style="font-weight:800;font-size:14px;color:${color};">FEE RECEIPT</div><div style="font-size:11px;color:#6b7280;">No: <b>#${rn}</b></div><div style="font-size:10px;color:#6b7280;">${fmt(fee.date||today())}</div></div></div><div class="grid"><div><div class="lbl">Student</div><div style="font-weight:700;font-size:13px;">${s.name}</div><div style="font-size:11px;color:#374151;">${s.department||s.class||s.course||s.danceStyle||""} ${s.section?`- Sec ${s.section}`:""}</div>${s.rollNo?`<div style="font-size:10px;color:#6b7280;">Roll: ${s.rollNo}</div>`:""}<div style="font-size:10px;color:#6b7280;">${s.phone||""}</div>${s.parent?`<div style="font-size:10px;color:#6b7280;">Parent: ${s.parent}</div>`:""}</div><div class="box"><div class="lbl">Payment Details</div>${[["Period",fee.month],["Total Fee","Rs."+Number(fee.amount||0).toLocaleString()],["Amount Paid","Rs."+Number(fee.paid||0).toLocaleString()],["Balance Due","Rs."+due.toLocaleString()],["Mode",fee.mode||"--"],["Status",fee.status]].map(([k,v])=>`<div class="row"><span style="color:#6b7280">${k}</span><span style="font-weight:700">${v}</span></div>`).join("")}</div></div><div class="total"><span style="font-weight:800;font-size:13px;color:#fff;">Amount Paid</span><span style="font-weight:900;font-size:20px;color:#fff;">Rs.${Number(fee.paid||0).toLocaleString()}</span></div><div class="ftr"><span>🐝 Powered by AllBee EduSphere - ${inst.name}</span><div class="sign">Authorised Sign</div></div></body></html>`;}

function InstAlerts({students,inst,color,notify,C}){
  const LOG_KEY=`allbee_log5_${inst.id}`;
  const [tmpl,setTmpl]=useState(ALERT_TEMPLATES[0]);
  const [channel,setChannel]=useState("whatsapp");
  const [filterType,setFilterType]=useState("all");
  const [selStudents,setSelStudents]=useState([]);
  const [q,setQ]=useState("");
  const [customMsg,setCustomMsg]=useState("");
  const [preview,setPreview]=useState(null);
  const [log,setLog]=useState(()=>lsGet(LOG_KEY,[]));
  const attOf=s=>attPct(s.attendance);
  const filtered=useMemo(()=>{
    let b=students.filter(s=>[s.name,s.rollNo].some(v=>v?.toLowerCase().includes(q.toLowerCase())));
    if(filterType==="absent_today")b=b.filter(s=>s.attendance?.find(a=>a.date===today())?.status==="Absent");
    if(filterType==="low_att")b=b.filter(s=>attOf(s)<75);
    if(filterType==="fee_due")b=b.filter(s=>s.fees?.some(f=>f.status==="Pending"||f.status==="Partial"));
    if(filterType==="hw_pending")b=b.filter(s=>s.homeworks?.some(h=>h.status==="Pending"));
    return b;
  },[students,q,filterType]);
  function fillMsg(s){
    const pf=s.fees?.find(f=>f.status==="Pending"||f.status==="Partial");
    const hw=s.homeworks?.find(h=>h.status==="Pending");
    const ex=s.exams?.[s.exams.length-1];
    return(tmpl.body||"").replace(/{name}/g,s.name||"").replace(/{inst}/g,inst.name||"").replace(/{phone}/g,inst.phone||"").replace(/{date}/g,fmt(today())).replace(/{att}/g,attOf(s)+"").replace(/{feemonth}/g,pf?.month||"").replace(/{feedue}/g,pf?(Number(pf.amount||0)-Number(pf.paid||0)).toLocaleString():"0").replace(/{hwsubject}/g,hw?.subject||"").replace(/{hwdue}/g,fmt(hw?.dueDate||"")).replace(/{exam}/g,ex?.examName||"").replace(/{marks}/g,ex?.marks||"").replace(/{maxmarks}/g,ex?.maxMarks||"100").replace(/{grade}/g,ex?.grade||"").replace(/{custom}/g,customMsg||"");
  }
  function send(s,msg){
    const ph=(s.parentPhone||s.phone||"").replace(/\D/g,"");
    if(channel==="whatsapp")window.open(`https://wa.me/91${ph}?text=${encodeURIComponent(msg)}`,"_blank");
    else if(channel==="sms")window.open(`sms:+91${ph}?body=${encodeURIComponent(msg)}`,"_blank");
    else window.open(`mailto:${s.email||""}?subject=Message from ${inst.name}&body=${encodeURIComponent(msg)}`,"_blank");
    const l=[{id:uid(),name:s.name,channel,template:tmpl.label,date:today()},...log.slice(0,49)];
    setLog(l);lsSet(LOG_KEY,l);
    notify(`${channel==="whatsapp"?"WhatsApp":channel==="sms"?"SMS":"Email"} opened for ${s.name}!`);
    setPreview(null);
  }
  function sendBulk(){
    const targets=selStudents.length>0?students.filter(s=>selStudents.includes(s.id)):filtered;
    targets.forEach((s,i)=>setTimeout(()=>send(s,fillMsg(s)),i*300));
    notify(`Sending to ${targets.length} students...`);
  }
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <PH title="📣 Alerts & Notifications" sub="WhatsApp, SMS & Email alerts to parents" C={C}/>
    {/* Template */}
    <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:18,marginBottom:14,boxShadow:C.shadow}}>
      <Sec C={C}>1. Select Alert Type</Sec>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:tmpl.id==="custom"?12:0}}>
        {ALERT_TEMPLATES.map(t=>{const tCol=tc(C,t.color);const tBg=tb(C,t.color);return<button key={t.id} onClick={()=>setTmpl(t)} style={{padding:"10px 12px",border:`2px solid ${tmpl.id===t.id?tCol:C.border}`,borderRadius:10,background:tmpl.id===t.id?tBg:C.surface,color:tmpl.id===t.id?tCol:C.text,textAlign:"left",fontWeight:tmpl.id===t.id?700:500,cursor:"pointer"}}><div style={{fontSize:18,marginBottom:4}}>{t.icon}</div><div style={{fontSize:12}}>{t.label}</div></button>;})}
      </div>
      {tmpl.id==="custom"&&<Txt C={C} value={customMsg} onChange={e=>setCustomMsg(e.target.value)} placeholder="Type your message here..." rows={3} style={{marginTop:10}}/>}
      <div style={{marginTop:12,background:C.bg,borderRadius:9,padding:11,border:`1px solid ${C.border}`}}>
        <Sec C={C}>Preview</Sec>
        <div style={{fontSize:12,color:C.text,lineHeight:1.7,whiteSpace:"pre-wrap",maxHeight:90,overflowY:"auto"}}>{filtered[0]?fillMsg(filtered[0]):"Select students to preview..."}</div>
      </div>
    </div>
    {/* Channel */}
    <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:18,marginBottom:14,boxShadow:C.shadow}}>
      <Sec C={C}>2. Choose Channel</Sec>
      <div style={{display:"flex",gap:10}}>
        {[{k:"whatsapp",l:"WhatsApp",i:"💬",c:"#25d366"},{k:"sms",l:"SMS",i:"📱",c:C.blue},{k:"email",l:"Email",i:"📧",c:C.purple}].map(ch=><button key={ch.k} onClick={()=>setChannel(ch.k)} style={{flex:1,padding:"12px",border:`2px solid ${channel===ch.k?ch.c:C.border}`,borderRadius:10,background:channel===ch.k?`${ch.c}15`:C.surface,color:channel===ch.k?ch.c:C.muted,fontWeight:700,fontSize:13,cursor:"pointer"}}><div style={{fontSize:22,marginBottom:4}}>{ch.i}</div>{ch.l}</button>)}
      </div>
    </div>
    {/* Students */}
    <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:18,marginBottom:14,boxShadow:C.shadow}}>
      <Sec C={C}>3. Select Students</Sec>
      <div style={{display:"flex",gap:7,marginBottom:10,flexWrap:"wrap"}}>
        {[{k:"all",l:"All"},{k:"absent_today",l:"Absent Today"},{k:"low_att",l:"Low Att."},{k:"fee_due",l:"Fee Due"},{k:"hw_pending",l:"HW Pending"}].map(f=><button key={f.k} onClick={()=>setFilterType(f.k)} style={{padding:"5px 12px",border:`1px solid ${filterType===f.k?C.teal:C.border}`,borderRadius:7,background:filterType===f.k?C.tealL:C.surface,color:filterType===f.k?C.teal:C.muted,fontSize:11,fontWeight:filterType===f.k?700:500,cursor:"pointer"}}>{f.l}</button>)}
      </div>
      <div style={{display:"flex",gap:10,marginBottom:10,alignItems:"center"}}>
        <Inp C={C} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." style={{flex:1}}/>
        <Btn onClick={()=>setSelStudents(filtered.map(s=>s.id))} C={C} color="teal" outline size="sm">All</Btn>
        {selStudents.length>0&&<Btn onClick={()=>setSelStudents([])} C={C} color="red" outline size="sm">Clear</Btn>}
        <span style={{fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>{selStudents.length>0?`${selStudents.length} sel.`:`${filtered.length} shown`}</span>
      </div>
      <div style={{maxHeight:280,overflowY:"auto",display:"flex",flexDirection:"column",gap:5}}>
        {filtered.map(s=>{const pct=attOf(s);const hp=s.fees?.some(f=>f.status==="Pending"||f.status==="Partial");return<div key={s.id} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 12px",background:selStudents.includes(s.id)?C.tealL:C.bg,borderRadius:9,border:`1px solid ${selStudents.includes(s.id)?C.teal:C.border}`,cursor:"pointer",transition:"all 0.1s"}} onClick={()=>setSelStudents(p=>p.includes(s.id)?p.filter(x=>x!==s.id):[...p,s.id])}>
          <div style={{width:18,height:18,borderRadius:"50%",background:selStudents.includes(s.id)?C.teal:"transparent",border:`2px solid ${selStudents.includes(s.id)?C.teal:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",flexShrink:0}}>{selStudents.includes(s.id)?"✓":""}</div>
          <Avatar name={s.name} photo={s.photo} color={color} size={28}/>
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:12,color:C.text}}>{s.name}</div><div style={{fontSize:10,color:C.muted}}>{s.rollNo} - {s.department||s.class||s.course||s.danceStyle}</div></div>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            {pct<75&&<Badge label={`${pct}%`} color="red" C={C}/>}
            {hp&&<Badge label="Fee" color="gold" C={C}/>}
            <button onClick={e=>{e.stopPropagation();setPreview({s,msg:fillMsg(s)});}} style={{padding:"4px 10px",border:`1px solid ${C.teal}`,borderRadius:6,background:"transparent",color:C.teal,fontSize:11,fontWeight:600,cursor:"pointer"}}>{channel==="whatsapp"?"💬":channel==="sms"?"📱":"📧"}</button>
          </div>
        </div>;})}
        {!filtered.length&&<Empty msg="No students match" C={C}/>}
      </div>
    </div>
    {/* Bulk send */}
    <div style={{background:C.surface,borderRadius:12,border:`2px solid ${C.teal}44`,padding:18,marginBottom:14,boxShadow:C.shadow,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontWeight:700,fontSize:13,color:C.text}}>Bulk Send</div><div style={{fontSize:12,color:C.muted}}>{selStudents.length>0?`${selStudents.length} selected`:`All ${filtered.length} shown`}</div></div>
      <Btn onClick={sendBulk} C={C} color="teal" size="lg">{channel==="whatsapp"?"💬 WhatsApp":channel==="sms"?"📱 SMS":"📧 Email"} All</Btn>
    </div>
    {/* Log */}
    {log.length>0&&<div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,padding:18,boxShadow:C.shadow}}>
      <Sec C={C}>Recent Alerts ({log.length})</Sec>
      <div style={{maxHeight:160,overflowY:"auto",display:"flex",flexDirection:"column",gap:5}}>
        {log.map(l=><div key={l.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 11px",background:C.bg,borderRadius:8,fontSize:11,border:`1px solid ${C.border}`}}><span style={{color:C.text}}><b>{l.name}</b> <span style={{color:C.muted}}>- {l.template}</span></span><span style={{color:C.muted}}>{l.channel} - {l.date}</span></div>)}
      </div>
      <button onClick={()=>{setLog([]);lsSet(LOG_KEY,[]);}} style={{marginTop:8,fontSize:11,color:C.red,background:"none",border:"none",cursor:"pointer"}}>Clear log</button>
    </div>}
    {/* Preview modal */}
    {preview&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&setPreview(null)}>
      <div style={{background:C.surface,borderRadius:14,border:`1px solid ${C.border}`,padding:24,width:"100%",maxWidth:480,boxShadow:C.shadowL,animation:"fadeUp 0.3s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Preview - {preview.s.name}</div><button onClick={()=>setPreview(null)} style={{background:"none",border:"none",color:C.muted,fontSize:22,lineHeight:1,cursor:"pointer"}}>×</button></div>
        <div style={{background:C.bg,borderRadius:8,padding:"8px 12px",marginBottom:8,fontSize:11,color:C.muted,border:`1px solid ${C.border}`}}><b>To:</b> {preview.s.parentPhone||preview.s.phone||preview.s.email||"No contact"}</div>
        <div style={{background:C.bg,borderRadius:8,padding:12,marginBottom:14,maxHeight:180,overflowY:"auto",border:`1px solid ${C.border}`}}><pre style={{fontSize:12,lineHeight:1.7,color:C.text,whiteSpace:"pre-wrap",fontFamily:"inherit"}}>{preview.msg}</pre></div>
        <div style={{display:"flex",gap:10}}><button onClick={()=>send(preview.s,preview.msg)} style={{flex:1,padding:"11px",border:"none",borderRadius:9,background:channel==="whatsapp"?"#25d366":channel==="sms"?C.blue:C.purple,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>{channel==="whatsapp"?"💬 Open WhatsApp":channel==="sms"?"📱 Open SMS":"📧 Open Email"}</button><Btn onClick={()=>setPreview(null)} C={C} color="red" outline>Cancel</Btn></div>
      </div>
    </div>}
  </div>;
}

function InstReports({students,inst,color,C}){
  const [type,setType]=useState("attendance");
  const tf=students.flatMap(s=>s.fees||[]).reduce((a,f)=>a+Number(f.amount||0),0);
  const pf=students.flatMap(s=>s.fees||[]).reduce((a,f)=>a+Number(f.paid||0),0);
  function exportCSV(){
    const rows=type==="attendance"?[["Name","Roll","Class/Style","Present","Absent","Leave","Total","Att%"],...students.map(s=>{const a=s.attendance||[];const pr=a.filter(x=>x.status==="Present").length,ab=a.filter(x=>x.status==="Absent").length,lv=a.filter(x=>x.status==="Leave").length;return[s.name,s.rollNo,s.department||s.class||s.course||s.danceStyle||"",pr,ab,lv,a.length,attPct(a)+"%"];})]:[["Name","Roll","Total","Paid","Due","Status"],...students.map(s=>{const t=s.fees?.reduce((a,f)=>a+Number(f.amount||0),0)||0,p=s.fees?.reduce((a,f)=>a+Number(f.paid||0),0)||0;return[s.name,s.rollNo,t,p,t-p,t===p?"Clear":"Pending"]})];
    const csv=rows.map(r=>r.join(",")).join("\n");
    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download=`${type}_report.csv`;a.click();
  }
  const TH={padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",borderBottom:`1px solid ${C.border}`,background:C.bg};
  const TD={padding:"10px 14px",borderBottom:`1px solid ${C.border}`};
  return <div style={{animation:"fadeUp 0.4s ease"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><PH title="📊 Reports" sub={inst.name} C={C}/><Btn onClick={exportCSV} C={C} color="green">⬇ Export CSV</Btn></div>
    <div style={{display:"flex",gap:7,marginBottom:16}}>
      {["attendance","fees","exams"].map(t=><button key={t} onClick={()=>setType(t)} style={{padding:"8px 18px",border:`1px solid ${type===t?C.teal:C.border}`,borderRadius:8,background:type===t?C.tealL:C.surface,color:type===t?C.teal:C.text,fontWeight:type===t?700:500,fontSize:12,cursor:"pointer"}}>{t==="attendance"?"📅 Attendance":t==="fees"?"💰 Fees":"📝 Exams"}</button>)}
    </div>
    <div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden",boxShadow:C.shadow}}>
      {type==="attendance"&&<table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["Student","Class","Present","Absent","Leave","Total","Attendance"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead><tbody>{students.map(s=>{const a=s.attendance||[],pr=a.filter(x=>x.status==="Present").length,ab=a.filter(x=>x.status==="Absent").length,lv=a.filter(x=>x.status==="Leave").length,pct=attPct(a);return<tr key={s.id} style={{borderBottom:`1px solid ${C.border}`}}><td style={TD}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar name={s.name} photo={s.photo} color={color} size={26}/><span style={{fontWeight:600,fontSize:12,color:C.text}}>{s.name}</span></div></td><td style={{...TD,fontSize:11,color:C.muted}}>{s.department||s.class||s.course||s.danceStyle||"--"}</td><td style={{...TD,fontWeight:700,color:C.green}}>{pr}</td><td style={{...TD,fontWeight:700,color:C.red}}>{ab}</td><td style={{...TD,fontWeight:700,color:C.gold}}>{lv}</td><td style={{...TD,fontSize:12,color:C.text}}>{a.length}</td><td style={TD}><MiniBar pct={pct} color={pct>=75?C.green:C.red} C={C}/></td></tr>;})} {!students.length&&<tr><td colSpan={7}><Empty msg="No students" C={C}/></td></tr>}</tbody></table>}
      {type==="fees"&&<><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["Student","Roll","Total","Paid","Due","Status"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead><tbody>{students.map(s=>{const t=s.fees?.reduce((a,f)=>a+Number(f.amount||0),0)||0,p=s.fees?.reduce((a,f)=>a+Number(f.paid||0),0)||0,d=t-p;return<tr key={s.id} style={{borderBottom:`1px solid ${C.border}`}}><td style={TD}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar name={s.name} photo={s.photo} color={color} size={26}/><span style={{fontWeight:600,fontSize:12,color:C.text}}>{s.name}</span></div></td><td style={{...TD,fontFamily:"monospace",fontSize:11,color:C.teal}}>{s.rollNo||"--"}</td><td style={{...TD,fontSize:12,color:C.text}}>Rs.{t.toLocaleString()}</td><td style={{...TD,fontWeight:700,color:C.green}}>Rs.{p.toLocaleString()}</td><td style={{...TD,fontWeight:700,color:d>0?C.red:C.green}}>Rs.{d.toLocaleString()}</td><td style={TD}><Badge label={d===0&&t>0?"Clear":"Pending"} color={d===0&&t>0?"green":"red"} C={C}/></td></tr>;})}{!students.length&&<tr><td colSpan={6}><Empty msg="No students" C={C}/></td></tr>}</tbody></table><div style={{padding:"11px 14px",background:C.bg,borderTop:`1px solid ${C.border}`,display:"flex",gap:18,fontSize:12}}><span style={{color:C.muted}}>Total: <b style={{color:C.text}}>Rs.{tf.toLocaleString()}</b></span><span style={{color:C.muted}}>Collected: <b style={{color:C.green}}>Rs.{pf.toLocaleString()}</b></span><span style={{color:C.muted}}>Due: <b style={{color:C.red}}>Rs.{(tf-pf).toLocaleString()}</b></span></div></>}
      {type==="exams"&&<table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["Student","Roll","Exams","Avg","Best","Lowest"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead><tbody>{students.map(s=>{const e=s.exams||[];if(!e.length)return<tr key={s.id} style={{borderBottom:`1px solid ${C.border}`}}><td style={TD}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar name={s.name} photo={s.photo} color={color} size={26}/><span style={{fontWeight:600,fontSize:12,color:C.text}}>{s.name}</span></div></td><td colSpan={5} style={{...TD,fontSize:11,color:C.muted}}>No exams recorded</td></tr>;const av=Math.round(e.reduce((a,x)=>a+Number(x.percentage||0),0)/e.length),best=Math.max(...e.map(x=>Number(x.percentage||0))),low=Math.min(...e.map(x=>Number(x.percentage||0)));return<tr key={s.id} style={{borderBottom:`1px solid ${C.border}`}}><td style={TD}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar name={s.name} photo={s.photo} color={color} size={26}/><span style={{fontWeight:600,fontSize:12,color:C.text}}>{s.name}</span></div></td><td style={{...TD,fontFamily:"monospace",fontSize:11,color:C.teal}}>{s.rollNo||"--"}</td><td style={{...TD,fontWeight:700,fontSize:12,color:C.text}}>{e.length}</td><td style={TD}><MiniBar pct={av} color={av>=75?C.green:av>=50?C.gold:C.red} C={C}/></td><td style={{...TD,fontWeight:700,color:C.green}}>{best}%</td><td style={{...TD,fontWeight:700,color:low<50?C.red:C.gold}}>{low}%</td></tr>;})} {!students.length&&<tr><td colSpan={6}><Empty msg="No students" C={C}/></td></tr>}</tbody></table>}
    </div>
  </div>;
}
