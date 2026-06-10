import { useState, useCallback, useRef, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ComposedChart
} from "recharts";

// ═══════════════════════════════════════════════════════════════
//  ALLBEE EDUSPHERE v2.0  ·  Enterprise Student Management SaaS
//  AllBee Solutions © 2025  ·  ai.alimsahib.in integrated
// ═══════════════════════════════════════════════════════════════

const AI_URL = "https://ai.alimsahib.in/";

// ─── DESIGN TOKENS ────────────────────────────────────────────
const L = {
  bg:"#f0f5f4",surface:"#ffffff",card:"#ffffff",
  border:"#e0eae8",border2:"#c4d8d4",
  text:"#0a1628",muted:"#3d5a78",muted2:"#8299b0",
  teal:"#007a70",tealD:"#005c54",tealL:"#ddf2ee",tealM:"#00a896",
  pink:"#c62a47",pinkL:"#ffe4ec",
  green:"#059669",greenL:"#d1fae5",
  red:"#dc2626",redL:"#fee2e2",
  gold:"#d97706",goldL:"#fef3c7",
  blue:"#2563eb",blueL:"#dbeafe",
  purple:"#7c3aed",purpleL:"#ede9fe",
  orange:"#ea580c",orangeL:"#ffedd5",
  cyan:"#0891b2",cyanL:"#cffafe",
  indigo:"#4f46e5",indigoL:"#e0e7ff",
  shadow:"0 1px 3px rgba(0,0,0,0.07)",
  shadowM:"0 4px 16px rgba(0,0,0,0.09)",
  shadowL:"0 16px 40px rgba(0,0,0,0.12)",
  nav:"#0a1628",navT:"#5a7a9a",navA:"#00a896",navABg:"rgba(0,168,150,0.12)",
  topBar:"#ffffff",inputBg:"#f8fbfa",
  grad1:"linear-gradient(135deg,#007a70 0%,#0891b2 100%)",
  grad2:"linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%)",
  grad3:"linear-gradient(135deg,#d97706 0%,#ea580c 100%)",
};
const D = {
  bg:"#07101e",surface:"#0f1c2e",card:"#0f1c2e",
  border:"#1a2d45",border2:"#243c5a",
  text:"#e8f2f8",muted:"#7a9cbf",muted2:"#4a6a8a",
  teal:"#2dd4bf",tealD:"#5eead4",tealL:"#0c2d2a",tealM:"#14b8a6",
  pink:"#fb7185",pinkL:"#1e0515",
  green:"#34d399",greenL:"#052e16",
  red:"#f87171",redL:"#1c0202",
  gold:"#fbbf24",goldL:"#1c1000",
  blue:"#60a5fa",blueL:"#071640",
  purple:"#a78bfa",purpleL:"#160d30",
  orange:"#fb923c",orangeL:"#1a0800",
  cyan:"#22d3ee",cyanL:"#011d26",
  indigo:"#818cf8",indigoL:"#0f0b30",
  shadow:"0 1px 3px rgba(0,0,0,0.5)",
  shadowM:"0 4px 16px rgba(0,0,0,0.6)",
  shadowL:"0 16px 40px rgba(0,0,0,0.7)",
  nav:"#040c18",navT:"#3a5a7a",navA:"#2dd4bf",navABg:"rgba(45,212,191,0.1)",
  topBar:"#0f1c2e",inputBg:"#07101e",
  grad1:"linear-gradient(135deg,#007a70 0%,#0891b2 100%)",
  grad2:"linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%)",
  grad3:"linear-gradient(135deg,#d97706 0%,#ea580c 100%)",
};

// ─── ROLES ─────────────────────────────────────────────────────
const ROLES=[
  {id:"super_admin",label:"Super Admin",icon:"👑",color:"#f59e0b",desc:"Full SaaS control · 128+ institutions"},
  {id:"inst_admin",label:"Institution Admin",icon:"🏫",color:"#3b82f6",desc:"Manage your institution"},
  {id:"staff",label:"Staff / Teacher",icon:"👩‍🏫",color:"#10b981",desc:"Class & student management"},
  {id:"trainer",label:"Trainer",icon:"🎯",color:"#8b5cf6",desc:"Training & assessment"},
  {id:"accountant",label:"Accountant",icon:"💼",color:"#f97316",desc:"Finance & fee collection"},
  {id:"parent",label:"Parent",icon:"👪",color:"#06b6d4",desc:"Monitor your child"},
  {id:"student",label:"Student",icon:"🎓",color:"#6366f1",desc:"Learn & grow"},
  {id:"placement",label:"Placement Officer",icon:"🤝",color:"#ec4899",desc:"Career placement"},
];

// ─── NAVIGATION ─────────────────────────────────────────────────
const NAVS={
  super_admin:[
    {id:"saas",icon:"🌐",label:"SaaS Dashboard",group:"Overview"},
    {id:"institutions",icon:"🏫",label:"Institutions",group:"Management"},
    {id:"billing",icon:"💳",label:"Billing & Plans",group:"Finance"},
    {id:"analytics",icon:"📊",label:"Global Analytics",group:"Insights"},
    {id:"settings",icon:"⚙️",label:"System",group:"Config"},
  ],
  inst_admin:[
    {id:"dashboard",icon:"🏠",label:"Dashboard",group:"Home"},
    {id:"admissions",icon:"🎯",label:"Admissions CRM",group:"Enrollment"},
    {id:"students",icon:"🎓",label:"Students",group:"Enrollment"},
    {id:"attendance",icon:"📊",label:"Attendance",group:"Academic"},
    {id:"timetable",icon:"📅",label:"Timetable",group:"Academic"},
    {id:"fees",icon:"💰",label:"Fee Management",group:"Finance"},
    {id:"exams",icon:"📝",label:"Examinations",group:"Academic"},
    {id:"assignments",icon:"📋",label:"Assignments",group:"Academic"},
    {id:"library",icon:"📚",label:"Library",group:"Academic"},
    {id:"live_class",icon:"🎥",label:"Live Classes",group:"Academic"},
    {id:"gamification",icon:"🏆",label:"Leaderboard",group:"Academic"},
    {id:"whatsapp",icon:"💬",label:"WhatsApp Center",group:"Communication"},
    {id:"sms",icon:"📲",label:"SMS & Alerts",group:"Communication"},
    {id:"certificates",icon:"🎖️",label:"Certificates",group:"Documents"},
    {id:"placement",icon:"💼",label:"Placement Portal",group:"Career"},
    {id:"ai",icon:"🤖",label:"AI Center",group:"AI"},
    {id:"hr",icon:"👩‍💼",label:"HR & Payroll",group:"HR"},
    {id:"analytics",icon:"📈",label:"Analytics",group:"Insights"},
    {id:"branches",icon:"🏢",label:"Branches",group:"Management"},
    {id:"alumni",icon:"🤝",label:"Alumni",group:"Community"},
    {id:"documents",icon:"📁",label:"Documents",group:"Management"},
    {id:"settings",icon:"⚙️",label:"Settings",group:"Config"},
  ],
  accountant:[
    {id:"fees",icon:"💰",label:"Fee Management",group:"Finance"},
    {id:"hr",icon:"💼",label:"HR & Payroll",group:"HR"},
    {id:"analytics",icon:"📈",label:"Analytics",group:"Insights"},
  ],
  staff:[
    {id:"dashboard",icon:"🏠",label:"Dashboard",group:"Home"},
    {id:"students",icon:"🎓",label:"My Students",group:"Academic"},
    {id:"attendance",icon:"📊",label:"Attendance",group:"Academic"},
    {id:"assignments",icon:"📋",label:"Assignments",group:"Academic"},
    {id:"exams",icon:"📝",label:"Exams",group:"Academic"},
    {id:"ai",icon:"🤖",label:"AI Tools",group:"AI"},
  ],
  trainer:[
    {id:"dashboard",icon:"🏠",label:"Dashboard",group:"Home"},
    {id:"students",icon:"🎓",label:"My Students",group:"Training"},
    {id:"attendance",icon:"📊",label:"Attendance",group:"Training"},
    {id:"exams",icon:"📝",label:"Assessments",group:"Training"},
    {id:"ai",icon:"🤖",label:"AI Tools",group:"AI"},
  ],
  parent:[
    {id:"parent_home",icon:"🏠",label:"Overview",group:"Home"},
    {id:"attendance",icon:"📊",label:"Attendance",group:"Academic"},
    {id:"fees",icon:"💰",label:"Fee Status",group:"Finance"},
    {id:"exams",icon:"📝",label:"Results",group:"Academic"},
    {id:"ai",icon:"🤖",label:"AI Help",group:"AI"},
  ],
  student:[
    {id:"student_home",icon:"🏠",label:"My Dashboard",group:"Home"},
    {id:"timetable",icon:"📅",label:"My Timetable",group:"Academic"},
    {id:"attendance",icon:"📊",label:"My Attendance",group:"Academic"},
    {id:"fees",icon:"💰",label:"My Fees",group:"Finance"},
    {id:"exams",icon:"📝",label:"My Exams",group:"Academic"},
    {id:"assignments",icon:"📋",label:"My Tasks",group:"Academic"},
    {id:"library",icon:"📚",label:"Library",group:"Academic"},
    {id:"gamification",icon:"🏆",label:"Leaderboard",group:"Academic"},
    {id:"placement",icon:"💼",label:"Career Portal",group:"Career"},
    {id:"ai",icon:"🤖",label:"AI Doubt Help",group:"AI"},
    {id:"certificates",icon:"🎖️",label:"My Certs",group:"Documents"},
  ],
  placement:[
    {id:"placement",icon:"💼",label:"Placement Portal",group:"Career"},
    {id:"students",icon:"🎓",label:"Students",group:"Management"},
    {id:"analytics",icon:"📈",label:"Analytics",group:"Insights"},
  ],
};

// ─── MOCK DATA ──────────────────────────────────────────────────
const MOCK_INSTITUTIONS=[
  {id:"i1",name:"Bright Future College",type:"College",plan:"Enterprise",students:2847,staff:124,branches:3,mrr:48500,status:"Active",city:"Chennai",state:"TN",joined:"2023-01-15"},
  {id:"i2",name:"TechSkills Institute",type:"Computer Institute",plan:"Professional",students:892,staff:28,branches:2,mrr:18200,status:"Active",city:"Bangalore",state:"KA",joined:"2023-03-20"},
  {id:"i3",name:"Sunrise School",type:"School",plan:"Standard",students:1420,staff:67,branches:1,mrr:12800,status:"Active",city:"Pune",state:"MH",joined:"2023-06-10"},
  {id:"i4",name:"Excellence Coaching",type:"Coaching Center",plan:"Professional",students:654,staff:22,branches:2,mrr:15600,status:"Active",city:"Hyderabad",state:"TS",joined:"2023-08-05"},
  {id:"i5",name:"CodeCraft Academy",type:"Training Institute",plan:"Starter",students:234,staff:12,branches:1,mrr:6200,status:"Trial",city:"Kochi",state:"KL",joined:"2024-01-20"},
];
const MOCK_STUDENTS=[
  {id:"s1",name:"Priya Sharma",rollNo:"24CS001",course:"B.Tech CSE",batch:"2024-28",semester:"2nd",phone:"9876543210",email:"priya@email.com",attendance:94,fees:"Paid",cgpa:8.9,status:"Studying",dob:"2005-03-15",gender:"Female",parentName:"Rajesh Sharma",parentPhone:"9876543211",address:"Anna Nagar, Chennai",blood:"O+",admDate:"2024-07-15",badges:["perfect_att","top_scorer"],skills:["Python","React","SQL"],docs:4},
  {id:"s2",name:"Arjun Patel",rollNo:"24CS002",course:"B.Tech CSE",batch:"2024-28",semester:"2nd",phone:"9876543220",email:"arjun@email.com",attendance:78,fees:"Partial",cgpa:7.4,status:"Studying",dob:"2005-07-22",gender:"Male",parentName:"Suresh Patel",parentPhone:"9876543221",address:"Vadapalani, Chennai",blood:"A+",admDate:"2024-07-15",badges:[],skills:["Java","C++"],docs:3},
  {id:"s3",name:"Sneha Reddy",rollNo:"24CS003",course:"B.Tech CSE",batch:"2024-28",semester:"2nd",phone:"9876543230",email:"sneha@email.com",attendance:98,fees:"Paid",cgpa:9.3,status:"Studying",dob:"2005-11-08",gender:"Female",parentName:"Krishna Reddy",parentPhone:"9876543231",address:"T Nagar, Chennai",blood:"B+",admDate:"2024-07-15",badges:["perfect_att","top_scorer","hw_champion"],skills:["Python","ML","Data Science"],docs:5},
  {id:"s4",name:"Rahul Kumar",rollNo:"24ME001",course:"B.Tech Mech",batch:"2024-28",semester:"2nd",phone:"9876543240",email:"rahul@email.com",attendance:65,fees:"Pending",cgpa:6.1,status:"Studying",dob:"2005-05-12",gender:"Male",parentName:"Vijay Kumar",parentPhone:"9876543241",address:"Perambur, Chennai",blood:"AB+",admDate:"2024-07-15",badges:[],skills:["AutoCAD","SolidWorks"],docs:2},
  {id:"s5",name:"Meera Krishnan",rollNo:"23CS010",course:"B.Tech CSE",batch:"2023-27",semester:"4th",phone:"9876543250",email:"meera@email.com",attendance:89,fees:"Paid",cgpa:8.5,status:"Studying",dob:"2004-09-30",gender:"Female",parentName:"Anand Krishnan",parentPhone:"9876543251",address:"Mylapore, Chennai",blood:"O-",admDate:"2023-07-20",badges:["scholar"],skills:["Python","Django","AWS"],docs:6},
  {id:"s6",name:"Deepak Nair",rollNo:"22CS005",course:"B.Tech CSE",batch:"2022-26",semester:"6th",phone:"9876543260",email:"deepak@email.com",attendance:91,fees:"Paid",cgpa:8.1,status:"Studying",dob:"2003-12-18",gender:"Male",parentName:"Mohan Nair",parentPhone:"9876543261",address:"Tambaram, Chennai",blood:"A-",admDate:"2022-07-18",badges:["scholar","fast_learner"],skills:["React","Node.js","MongoDB"],docs:7},
];
const MOCK_LEADS=[
  {id:"l1",name:"Kavitha S",phone:"9876501001",email:"kavitha@gmail.com",course:"B.Tech CSE",source:"Website",status:"New",assignedTo:"staff1",followUp:"2025-01-28",notes:"Interested in data science",score:85,created:"2025-01-20"},
  {id:"l2",name:"Aditya R",phone:"9876501002",email:"aditya@gmail.com",course:"B.Tech ECE",source:"Walk-in",status:"Contacted",assignedTo:"staff1",followUp:"2025-01-29",notes:"Visited campus, wants scholarship info",score:72,created:"2025-01-21"},
  {id:"l3",name:"Preethi M",phone:"9876501003",email:"preethi@gmail.com",course:"MBA",source:"Referral",status:"Interested",assignedTo:"staff2",followUp:"2025-01-30",notes:"Friend studied here",score:90,created:"2025-01-19"},
  {id:"l4",name:"Sanjay V",phone:"9876501004",email:"sanjay@gmail.com",course:"B.Tech IT",source:"Social Media",status:"Documents Pending",assignedTo:"staff2",followUp:"2025-01-28",notes:"All rounds cleared, awaiting docs",score:95,created:"2025-01-18"},
  {id:"l5",name:"Anitha K",phone:"9876501005",email:"anitha@gmail.com",course:"BCA",source:"Website",status:"Enrolled",assignedTo:"staff1",followUp:null,notes:"Enrolled successfully",score:88,created:"2025-01-15"},
  {id:"l6",name:"Bharath L",phone:"9876501006",email:"bharath@gmail.com",course:"B.Tech CSE",source:"Walk-in",status:"Not Interested",assignedTo:null,followUp:null,notes:"Going to another college",score:40,created:"2025-01-22"},
  {id:"l7",name:"Dharani N",phone:"9876501007",email:"dharani@gmail.com",course:"B.Tech CSE",source:"Website",status:"New",assignedTo:null,followUp:"2025-01-29",notes:"Online inquiry",score:70,created:"2025-01-23"},
  {id:"l8",name:"Elan V",phone:"9876501008",email:"elan@gmail.com",course:"M.Tech",source:"LinkedIn",status:"Contacted",assignedTo:"staff2",followUp:"2025-01-30",notes:"Working professional, wants part-time",score:82,created:"2025-01-21"},
];
const MOCK_FEES=[
  {id:"f1",studentId:"s1",studentName:"Priya Sharma",rollNo:"24CS001",amount:85000,paid:85000,pending:0,status:"Paid",month:"December",dueDate:"2024-12-31",paidDate:"2024-12-15",method:"UPI",receipt:"REC2024001"},
  {id:"f2",studentId:"s2",studentName:"Arjun Patel",rollNo:"24CS002",amount:85000,paid:40000,pending:45000,status:"Partial",month:"December",dueDate:"2024-12-31",paidDate:"2024-12-20",method:"Cash",receipt:"REC2024002"},
  {id:"f3",studentId:"s3",studentName:"Sneha Reddy",rollNo:"24CS003",amount:85000,paid:85000,pending:0,status:"Paid",month:"December",dueDate:"2024-12-31",paidDate:"2024-12-10",method:"NEFT",receipt:"REC2024003"},
  {id:"f4",studentId:"s4",studentName:"Rahul Kumar",rollNo:"24ME001",amount:78000,paid:0,pending:78000,status:"Pending",month:"December",dueDate:"2024-12-31",paidDate:null,method:null,receipt:null},
  {id:"f5",studentId:"s5",studentName:"Meera Krishnan",rollNo:"23CS010",amount:85000,paid:85000,pending:0,status:"Paid",month:"December",dueDate:"2024-12-31",paidDate:"2024-12-05",method:"UPI",receipt:"REC2024005"},
  {id:"f6",studentId:"s6",studentName:"Deepak Nair",rollNo:"22CS005",amount:85000,paid:85000,pending:0,status:"Paid",month:"December",dueDate:"2024-12-31",paidDate:"2024-12-08",method:"Cheque",receipt:"REC2024006"},
];
const MOCK_STAFF=[
  {id:"st1",name:"Dr. Ramesh Kumar",role:"HOD - CSE",dept:"CSE",phone:"9876600001",email:"ramesh@college.edu",salary:85000,joined:"2018-06-01",status:"Active",attendance:95,leaves:2},
  {id:"st2",name:"Mrs. Priya Devi",role:"Associate Professor",dept:"CSE",phone:"9876600002",email:"priya.d@college.edu",salary:65000,joined:"2019-08-15",status:"Active",attendance:92,leaves:3},
  {id:"st3",name:"Mr. Suresh Babu",role:"Assistant Professor",dept:"ECE",phone:"9876600003",email:"suresh@college.edu",salary:52000,joined:"2021-07-01",status:"Active",attendance:88,leaves:5},
  {id:"st4",name:"Ms. Kavitha R",role:"Lab Instructor",dept:"IT",phone:"9876600004",email:"kavitha@college.edu",salary:38000,joined:"2022-01-10",status:"Active",attendance:97,leaves:1},
  {id:"st5",name:"Mr. Arun S",role:"Admin Staff",dept:"Admin",phone:"9876600005",email:"arun@college.edu",salary:25000,joined:"2020-03-01",status:"Active",attendance:90,leaves:4},
];
const MOCK_JOBS=[
  {id:"j1",company:"TCS",role:"Software Engineer",package:"7.5 LPA",location:"Chennai",type:"Full-time",skills:["Java","SQL","Spring"],deadline:"2025-01-15",applicants:45,selected:12,status:"Active"},
  {id:"j2",company:"Infosys",role:"Systems Engineer",package:"6.8 LPA",location:"Bangalore",type:"Full-time",skills:["Python","Linux","AWS"],deadline:"2025-01-20",applicants:38,selected:8,status:"Active"},
  {id:"j3",company:"Wipro",role:"Project Engineer",package:"7.2 LPA",location:"Hyderabad",type:"Full-time",skills:["React","Node.js","MongoDB"],deadline:"2025-01-10",applicants:29,selected:6,status:"Active"},
  {id:"j4",company:"Zoho",role:"Member Technical Staff",package:"12 LPA",location:"Chennai",type:"Full-time",skills:["Java","DSA","Algorithms"],deadline:"2025-02-01",applicants:62,selected:5,status:"Active"},
  {id:"j5",company:"Freshworks",role:"Software Developer",package:"14 LPA",location:"Chennai",type:"Full-time",skills:["Ruby","Rails","JavaScript"],deadline:"2025-01-25",applicants:31,selected:4,status:"Active"},
];
const MOCK_BRANCHES=[
  {id:"b1",name:"Main Campus",location:"Anna Nagar, Chennai",students:1847,staff:68,revenue:28500000,status:"Active",established:"2010"},
  {id:"b2",name:"OMR Campus",location:"Sholinganallur, Chennai",students:642,staff:32,revenue:9800000,status:"Active",established:"2018"},
  {id:"b3",name:"Tambaram Center",location:"Tambaram, Chennai",students:358,staff:24,revenue:5200000,status:"Active",established:"2021"},
];
const MOCK_ALUMNI=[
  {id:"a1",name:"Karthik S",batch:"2019-23",company:"Google",role:"SDE II",package:"32 LPA",location:"Bangalore",contact:true},
  {id:"a2",name:"Divya M",batch:"2019-23",company:"Microsoft",role:"Software Engineer",package:"28 LPA",location:"Hyderabad",contact:true},
  {id:"a3",name:"Vijay R",batch:"2018-22",company:"Amazon",role:"SDE",package:"24 LPA",location:"Chennai",contact:true},
  {id:"a4",name:"Pooja N",batch:"2020-24",company:"Zoho",role:"MTS",package:"14 LPA",location:"Chennai",contact:true},
  {id:"a5",name:"Arjun B",batch:"2018-22",company:"Startup (Founder)",role:"CEO",package:"—",location:"Chennai",contact:false},
];

// ─── CHART DATA ────────────────────────────────────────────────
const MRR_DATA=[
  {month:"Jan",mrr:82000,inst:31,students:12400},{month:"Feb",mrr:96000,inst:38,students:15200},
  {month:"Mar",mrr:118000,inst:45,students:18600},{month:"Apr",mrr:134000,inst:53,students:22100},
  {month:"May",mrr:157000,inst:61,students:27300},{month:"Jun",mrr:184000,inst:72,students:33800},
  {month:"Jul",mrr:198000,inst:78,students:38200},{month:"Aug",mrr:221000,inst:85,students:44600},
  {month:"Sep",mrr:247000,inst:94,students:52100},{month:"Oct",mrr:268000,inst:102,students:58900},
  {month:"Nov",mrr:294000,inst:116,students:67400},{month:"Dec",mrr:318000,inst:128,students:74800},
];
const REV_DATA=[
  {month:"Jul",revenue:4200000,target:4500000},{month:"Aug",revenue:4800000,target:4500000},
  {month:"Sep",revenue:4600000,target:4800000},{month:"Oct",revenue:5100000,target:4800000},
  {month:"Nov",revenue:5400000,target:5000000},{month:"Dec",revenue:5800000,target:5200000},
];
const ATT_TREND=[
  {week:"W1",present:94,absent:6},{week:"W2",present:91,absent:9},
  {week:"W3",present:88,absent:12},{week:"W4",present:93,absent:7},
  {week:"W5",present:95,absent:5},{week:"W6",present:92,absent:8},
];
const FEE_COLL=[
  {month:"Jul",collected:3200000,pending:400000},{month:"Aug",collected:4100000,pending:320000},
  {month:"Sep",collected:3800000,pending:480000},{month:"Oct",collected:4600000,pending:280000},
  {month:"Nov",collected:5100000,pending:350000},{month:"Dec",collected:5600000,pending:220000},
];
const PLACE_DATA=[
  {year:"2020",placed:180,total:240,pkg:6.2},{year:"2021",placed:210,total:265,pkg:7.1},
  {year:"2022",placed:248,total:280,pkg:8.4},{year:"2023",placed:267,total:295,pkg:9.2},
  {year:"2024",placed:198,total:220,pkg:10.8},
];
const DEPT_PERF=[
  {dept:"CSE",strength:95,satisfaction:88,placement:92},{dept:"ECE",strength:82,satisfaction:79,placement:84},
  {dept:"EEE",strength:74,satisfaction:75,placement:72},{dept:"Mech",strength:68,satisfaction:72,placement:65},
  {dept:"IT",strength:91,satisfaction:86,placement:89},
];
const FUNNEL=[
  {stage:"Inquiries",count:1240},{stage:"Contacted",count:847},
  {stage:"Interested",count:524},{stage:"Documents",count:312},{stage:"Enrolled",count:234},
];
const PLANS_DIST=[
  {name:"Enterprise",value:28,color:"#007a70"},{name:"Professional",value:45,color:"#2563eb"},
  {name:"Standard",value:38,color:"#7c3aed"},{name:"Starter",value:17,color:"#d97706"},
];

// ─── UTILS ─────────────────────────────────────────────────────
const fmt=n=>n?.toLocaleString("en-IN")||"0";
const fmtAmt=n=>"₹"+(n>=100000?(n/100000).toFixed(1)+"L":n>=1000?(n/1000).toFixed(0)+"K":n);
const fmtBig=n=>n>=10000000?(n/10000000).toFixed(1)+" Cr":n>=100000?"₹"+(n/100000).toFixed(1)+" L":"₹"+n?.toLocaleString("en-IN");
const pct=(a,b)=>b>0?Math.round(a/b*100):0;
const dateStr=d=>d?new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—";

// ─── SHARED COMPONENTS ─────────────────────────────────────────
function Av({name="",size=36,C}){
  const colors=[C.teal,C.blue,C.purple,C.pink,C.orange,C.cyan,C.indigo];
  const bg=colors[name.charCodeAt(0)%colors.length];
  const ini=name.split(" ").slice(0,2).map(w=>w[0]||"").join("").toUpperCase();
  return <div style={{width:size,height:size,borderRadius:"50%",background:bg,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:size*0.38,flexShrink:0}}>{ini}</div>;
}
function Chip({children,color="teal",C}){
  return <span style={{background:C[color+"L"]||C[color],color:C[color],padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,display:"inline-block",lineHeight:"1.5"}}>{children}</span>;
}
const SC={Paid:"green",Partial:"gold",Pending:"red",Waived:"purple",Active:"green",Trial:"gold",Suspended:"red",Studying:"blue",Completed:"green",Dropout:"red",New:"teal",Contacted:"blue",Interested:"gold","Documents Pending":"orange",Enrolled:"green","Not Interested":"red",Upcoming:"gold",Scheduled:"blue",Cancelled:"red"};
function SBadge({status,C}){const col=SC[status]||"muted"; return <Chip color={col} C={C}>{status}</Chip>;}
function StatCard({icon,label,value,sub,color="teal",trend,C}){
  return <div style={{background:C.card,borderRadius:14,padding:"18px 20px",border:`1px solid ${C.border}`,boxShadow:C.shadowM,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:-20,right:-20,width:70,height:70,borderRadius:"50%",background:C[color+"L"]||C[color],opacity:0.4}}/>
    <div style={{fontSize:26,marginBottom:6}}>{icon}</div>
    <div style={{fontSize:26,fontWeight:900,color:C.text,lineHeight:1}}>{value}</div>
    <div style={{fontSize:12,color:C.muted,marginTop:4}}>{label}</div>
    {(sub||trend!==undefined)&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}>
      {trend!==undefined&&<span style={{fontSize:11,fontWeight:700,color:trend>=0?C.green:C.red}}>{trend>=0?"↑":"↓"} {Math.abs(trend)}%</span>}
      {sub&&<span style={{fontSize:11,color:C.muted2}}>{sub}</span>}
    </div>}
  </div>;
}
function PH({title,subtitle,action,C}){
  return <div style={{marginBottom:22,display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
    <div>
      <h1 style={{margin:0,fontSize:20,fontWeight:900,color:C.text,letterSpacing:"-0.3px"}}>{title}</h1>
      {subtitle&&<p style={{margin:"3px 0 0",fontSize:12,color:C.muted}}>{subtitle}</p>}
    </div>
    {action&&<div>{action}</div>}
  </div>;
}
function Btn({children,onClick,color="teal",variant="solid",size="md",disabled,C,style:ex}){
  const bg=variant==="solid"?C[color]||C.teal:variant==="outline"?"transparent":C[(color||"teal")+"L"]||C.tealL;
  const textColor=variant==="solid"?"#fff":C[color]||C.teal;
  const border=variant==="outline"?`1px solid ${C[color]||C.teal}`:"none";
  const p=size==="sm"?"6px 14px":size==="lg"?"12px 28px":"9px 20px";
  const fs=size==="sm"?12:size==="lg"?15:13;
  return <button onClick={onClick} disabled={disabled} style={{background:bg,color:textColor,border,padding:p,borderRadius:9,fontSize:fs,fontWeight:600,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.6:1,transition:"all 0.15s",display:"inline-flex",alignItems:"center",gap:6,...ex}}>{children}</button>;
}
function Inp({value,onChange,placeholder,type="text",C,style:ex}){
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,color:C.text,width:"100%",outline:"none",boxSizing:"border-box",...ex}}/>;
}
function Sel({value,onChange,children,C,style:ex}){
  return <select value={value} onChange={onChange} style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,color:C.text,outline:"none",cursor:"pointer",...ex}}>{children}</select>;
}

// ─── LOGIN ─────────────────────────────────────────────────────
function LoginScreen({onLogin,dark,toggleDark}){
  const C=dark?D:L;
  const [sel,setSel]=useState(null);
  return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter','Segoe UI',sans-serif",padding:16,position:"relative",overflow:"hidden"}}>
    <div style={{position:"fixed",top:-120,right:-120,width:500,height:500,borderRadius:"50%",background:C.grad1,opacity:0.06,pointerEvents:"none"}}/>
    <div style={{position:"fixed",bottom:-120,left:-120,width:600,height:600,borderRadius:"50%",background:C.grad2,opacity:0.05,pointerEvents:"none"}}/>
    <div style={{maxWidth:960,width:"100%",position:"relative"}}>
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:76,height:76,borderRadius:22,background:C.grad1,boxShadow:"0 8px 32px rgba(0,122,112,0.35)",marginBottom:16,fontSize:38}}>🎓</div>
        <h1 style={{margin:0,fontSize:34,fontWeight:900,color:C.text,letterSpacing:"-1px"}}>AllBee <span style={{color:C.teal}}>EduSphere</span></h1>
        <p style={{color:C.muted,margin:"6px 0 0",fontSize:14}}>Enterprise Student Management SaaS · v2.0 · 10,000+ Institutions Ready</p>
      </div>
      <div style={{background:C.surface,borderRadius:20,border:`1px solid ${C.border}`,padding:32,boxShadow:C.shadowL}}>
        <h3 style={{margin:"0 0 18px",fontSize:14,fontWeight:700,color:C.text,textAlign:"center"}}>Demo Login — Select Your Role</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10}}>
          {ROLES.map(r=><button key={r.id} onClick={()=>{setSel(r.id);setTimeout(()=>onLogin(r.id),180);}} style={{background:sel===r.id?r.color+"22":C.bg,border:`2px solid ${sel===r.id?r.color:C.border}`,borderRadius:12,padding:"14px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",transform:sel===r.id?"scale(0.98)":"scale(1)"}}>
            <div style={{fontSize:26,marginBottom:6}}>{r.icon}</div>
            <div style={{fontWeight:700,fontSize:13,color:C.text}}>{r.label}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:2}}>{r.desc}</div>
          </button>)}
        </div>
        <div style={{marginTop:20,padding:"10px 14px",background:C.tealL,borderRadius:10,fontSize:12,color:C.teal,textAlign:"center"}}>🔒 Demo mode · No authentication required · Click any role to explore all features</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:18}}>
        {[["🏫","Multi-Tenant SaaS","10K+ institutions"],["🤖","AI-Powered","Doubt + Career AI"],["📱","PWA Ready","Works offline"],["🔒","Enterprise Security","SOC2 ready"]].map(([ic,lb,sb])=><div key={lb} style={{background:C.surface,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.border}`,textAlign:"center"}}>
          <div style={{fontSize:20,marginBottom:4}}>{ic}</div>
          <div style={{fontSize:11,fontWeight:700,color:C.text}}>{lb}</div>
          <div style={{fontSize:10,color:C.muted,marginTop:2}}>{sb}</div>
        </div>)}
      </div>
      <div style={{textAlign:"center",marginTop:16}}>
        <button onClick={toggleDark} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,padding:"7px 18px",cursor:"pointer",fontSize:12,color:C.muted}}>{dark?"☀️ Light Mode":"🌙 Dark Mode"}</button>
      </div>
    </div>
  </div>;
}

// ─── SIDEBAR ───────────────────────────────────────────────────
function Sidebar({role,active,onNav,dark,toggleDark,onLogout,C}){
  const nav=NAVS[role]||NAVS.inst_admin;
  const roleInfo=ROLES.find(r=>r.id===role)||ROLES[1];
  const groups=[...new Set(nav.map(n=>n.group))];
  return <div style={{width:224,height:"100vh",background:C.nav,flexShrink:0,display:"flex",flexDirection:"column",overflowY:"auto",scrollbarWidth:"none",borderRight:`1px solid ${C.border}20`}}>
    <div style={{padding:"18px 14px 14px",borderBottom:`1px solid ${C.border}20`}}>
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:34,height:34,borderRadius:10,background:C.grad1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🎓</div>
        <div><div style={{fontWeight:900,fontSize:13,color:"#fff",letterSpacing:"-0.3px"}}>AllBee</div><div style={{fontWeight:400,fontSize:10,color:C.navT}}>EduSphere v2.0</div></div>
      </div>
    </div>
    <div style={{padding:"10px 12px",borderBottom:`1px solid ${C.border}20`}}>
      <div style={{display:"flex",alignItems:"center",gap:8,background:C.navABg,borderRadius:9,padding:"7px 9px"}}>
        <span style={{fontSize:16}}>{roleInfo.icon}</span>
        <div><div style={{fontSize:11,fontWeight:700,color:"#fff"}}>{roleInfo.label}</div><div style={{fontSize:10,color:C.navT}}>Demo Account</div></div>
      </div>
    </div>
    <div style={{flex:1,padding:"6px 6px",overflowY:"auto",scrollbarWidth:"none"}}>
      {groups.map(group=>{
        const items=nav.filter(n=>n.group===group);
        return <div key={group} style={{marginBottom:6}}>
          <div style={{fontSize:9,fontWeight:700,color:C.navT,padding:"5px 8px 3px",letterSpacing:"0.8px",textTransform:"uppercase"}}>{group}</div>
          {items.map(item=><button key={item.id} onClick={()=>onNav(item.id)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"7px 9px",borderRadius:8,border:"none",background:active===item.id?C.navABg:"transparent",color:active===item.id?C.navA:C.navT,cursor:"pointer",fontSize:12,fontWeight:active===item.id?600:400,transition:"all 0.12s",textAlign:"left",marginBottom:1}}>
            <span style={{fontSize:15,flexShrink:0}}>{item.icon}</span>
            <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.label}</span>
            {active===item.id&&<div style={{width:4,height:4,borderRadius:"50%",background:C.navA,flexShrink:0}}/>}
          </button>)}
        </div>;
      })}
    </div>
    <div style={{padding:"6px 6px 14px",borderTop:`1px solid ${C.border}20`}}>
      {[{icon:dark?"☀️":"🌙",label:dark?"Light Mode":"Dark Mode",fn:toggleDark},{icon:"🚪",label:"Logout",fn:onLogout}].map(({icon,label,fn})=><button key={label} onClick={fn} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"7px 9px",borderRadius:8,border:"none",background:"transparent",color:C.navT,cursor:"pointer",fontSize:12,marginBottom:2}}><span>{icon}</span><span>{label}</span></button>)}
    </div>
  </div>;
}

// ─── TOPBAR ────────────────────────────────────────────────────
function TopBar({title,C}){
  const [notif,setNotif]=useState(true);
  return <div style={{height:58,background:C.topBar,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 18px",gap:14,flexShrink:0}}>
    <div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,color:C.text}}>{title}</div></div>
    <div style={{display:"flex",alignItems:"center",gap:7,background:C.inputBg,borderRadius:8,padding:"7px 11px",border:`1px solid ${C.border}`,width:200}}>
      <span style={{fontSize:12,color:C.muted2}}>🔍</span>
      <input placeholder="Search anything..." style={{background:"transparent",border:"none",outline:"none",fontSize:12,color:C.text,width:"100%"}}/>
    </div>
    <button style={{position:"relative",background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}} onClick={()=>setNotif(false)}>
      🔔{notif&&<div style={{position:"absolute",top:4,right:4,width:7,height:7,borderRadius:"50%",background:C.red,border:`2px solid ${C.topBar}`}}/>}
    </button>
    <div style={{display:"flex",alignItems:"center",gap:5,background:C.tealL,borderRadius:8,padding:"5px 10px"}}>
      <span style={{fontSize:11}}>📱</span>
      <span style={{fontSize:10,color:C.teal,fontWeight:600}}>PWA Ready</span>
    </div>
  </div>;
}

// ─── SAAS DASHBOARD ────────────────────────────────────────────
function SaasDashboard({C}){
  const last=MRR_DATA[MRR_DATA.length-1];
  return <div style={{padding:22,overflowY:"auto",height:"calc(100vh-58px)"}}>
    <PH title="SaaS Dashboard" subtitle="Global platform overview · 128 institutions · 74,800 students" C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12,marginBottom:20}}>
      <StatCard icon="💰" label="MRR" value={fmtAmt(last.mrr)} sub="ARR: ₹38.2L" trend={12} color="green" C={C}/>
      <StatCard icon="🏫" label="Institutions" value={last.inst} sub="28 Enterprise" trend={8} color="teal" C={C}/>
      <StatCard icon="🎓" label="Total Students" value={fmt(last.students)} sub="Across all orgs" trend={15} color="blue" C={C}/>
      <StatCard icon="📈" label="Growth Rate" value="23%" sub="MoM Revenue" trend={3} color="purple" C={C}/>
      <StatCard icon="🔄" label="Churn Rate" value="2.1%" sub="Monthly" trend={-0.4} color="gold" C={C}/>
      <StatCard icon="⭐" label="NPS Score" value="72" sub="Net Promoter" trend={5} color="cyan" C={C}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📈 MRR Growth 2024</div>
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={MRR_DATA}><defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.teal} stopOpacity={0.3}/><stop offset="95%" stopColor={C.teal} stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="month" tick={{fill:C.muted,fontSize:10}}/><YAxis tick={{fill:C.muted,fontSize:10}} tickFormatter={v=>"₹"+(v/1000).toFixed(0)+"K"}/>
            <Tooltip formatter={v=>["₹"+v.toLocaleString("en-IN"),"MRR"]} contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
            <Area type="monotone" dataKey="mrr" stroke={C.teal} fill="url(#g1)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📦 Plans Distribution</div>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart><Pie data={PLANS_DIST} dataKey="value" cx="50%" cy="50%" outerRadius={68} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
            {PLANS_DIST.map((d,i)=><Cell key={i} fill={d.color}/>)}
          </Pie><Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/></PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
      <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>🏫 Top Institutions</div>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["Institution","Type","Plan","Students","MRR","Status"].map(h=><th key={h} style={{padding:"7px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.5px"}}>{h}</th>)}</tr></thead>
        <tbody>{MOCK_INSTITUTIONS.map(inst=><tr key={inst.id} style={{borderTop:`1px solid ${C.border}`}}>
          <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={inst.name} size={26} C={C}/><div><div style={{fontSize:13,fontWeight:600,color:C.text}}>{inst.name}</div><div style={{fontSize:10,color:C.muted}}>{inst.city}, {inst.state}</div></div></div></td>
          <td style={{padding:"10px 12px",fontSize:12,color:C.muted}}>{inst.type}</td>
          <td style={{padding:"10px 12px"}}><SBadge status={inst.plan} C={C}/></td>
          <td style={{padding:"10px 12px",fontSize:13,fontWeight:700,color:C.text}}>{fmt(inst.students)}</td>
          <td style={{padding:"10px 12px",fontSize:13,fontWeight:700,color:C.green}}>₹{fmt(inst.mrr)}</td>
          <td style={{padding:"10px 12px"}}><SBadge status={inst.status} C={C}/></td>
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}

// ─── INSTITUTION DASHBOARD ─────────────────────────────────────
function InstDashboard({C}){
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Dashboard" subtitle={"Bright Future College · "+new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})} C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:20}}>
      <StatCard icon="🎓" label="Total Students" value="2,847" sub="128 new this month" trend={5} color="teal" C={C}/>
      <StatCard icon="📊" label="Today's Attendance" value="94.2%" sub="2,682 present" trend={2} color="green" C={C}/>
      <StatCard icon="💰" label="Fee Collected" value="₹54L" sub="This month" trend={8} color="blue" C={C}/>
      <StatCard icon="⏳" label="Fee Pending" value="₹8.2L" sub="127 students" trend={-5} color="red" C={C}/>
      <StatCard icon="🎯" label="New Leads" value="47" sub="This week" trend={12} color="purple" C={C}/>
      <StatCard icon="💼" label="Placement Rate" value="89%" sub="This year" trend={3} color="gold" C={C}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
      {[{title:"💰 Revenue Trend",data:REV_DATA,key:"revenue",color:C.teal,fmt:v=>fmtBig(v)},
        {title:"📊 Attendance",data:ATT_TREND,key:"present",color:C.green,fmt:v=>v+"%"},
        {title:"💰 Fee Collection",data:FEE_COLL,key:"collected",color:C.blue,fmt:v=>fmtBig(v)}
      ].map(({title,data,key,color,fmt:fmtV})=><div key={title} style={{background:C.card,borderRadius:14,padding:16,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:12}}>{title}</div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={data}><defs><linearGradient id={key} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.25}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey={Object.keys(data[0])[0]} tick={{fill:C.muted,fontSize:9}}/><YAxis tick={{fill:C.muted,fontSize:9}} tickFormatter={fmtV}/>
            <Tooltip formatter={fmtV} contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:10}}/>
            <Area type="monotone" dataKey={key} stroke={color} fill={`url(#${key})`} strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>🎯 Admission Funnel</div>
        {FUNNEL.map((s,i)=>{const colors=[C.teal,C.blue,C.purple,C.gold,C.green];const p=pct(s.count,FUNNEL[0].count);return <div key={s.stage} style={{marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:600,color:C.text}}>{s.stage}</span><span style={{fontSize:12,fontWeight:700,color:colors[i]}}>{s.count}</span></div>
          <div style={{background:C.border,borderRadius:4,height:5}}><div style={{width:p+"%",background:colors[i],height:"100%",borderRadius:4,transition:"width 0.4s ease"}}/></div>
        </div>;})}
        <div style={{marginTop:10,fontSize:12,color:C.teal,padding:"8px 10px",background:C.tealL,borderRadius:8}}>📈 Conversion: <strong>18.9%</strong> (234/1240 enrolled)</div>
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:12}}>⚡ Quick Actions</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
          {[["📊","Mark Attendance","teal"],["💰","Collect Fee","green"],["💬","Send WhatsApp","blue"],["🎖️","Generate Cert","purple"],["📝","Create Exam","gold"],["🎯","Add Lead","pink"],["📋","Assign Task","orange"],["📈","View Analytics","cyan"]].map(([ic,lb,col])=><button key={lb} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 10px",background:C[col+"L"]||C.tealL,border:"none",borderRadius:9,cursor:"pointer",fontSize:11,fontWeight:600,color:C[col]||C.teal}}><span style={{fontSize:14}}>{ic}</span>{lb}</button>)}
        </div>
      </div>
    </div>
  </div>;
}

// ─── ADMISSIONS CRM ────────────────────────────────────────────
function AdmissionsCRM({C}){
  const [view,setView]=useState("kanban");
  const [leads,setLeads]=useState(MOCK_LEADS);
  const [search,setSearch]=useState("");
  const STATUSES=["New","Contacted","Interested","Documents Pending","Enrolled","Not Interested"];
  const SCOL={New:C.teal,Contacted:C.blue,Interested:C.gold,"Documents Pending":C.orange,Enrolled:C.green,"Not Interested":C.red};
  const byS=s=>leads.filter(l=>l.status===s&&l.name.toLowerCase().includes(search.toLowerCase()));
  const move=(id,ns)=>setLeads(p=>p.map(l=>l.id===id?{...l,status:ns}:l));
  return <div style={{padding:22,overflowY:"auto",height:"calc(100vh-58px)"}}>
    <PH title="Admissions CRM" subtitle="Lead pipeline · follow-ups · conversion analytics" C={C} action={<div style={{display:"flex",gap:8}}>
      <Btn onClick={()=>setView(v=>v==="kanban"?"list":"kanban")} color="teal" variant="outline" size="sm" C={C}>{view==="kanban"?"📋 List":"🗂️ Kanban"}</Btn>
      <Btn color="teal" size="sm" C={C}>+ Add Lead</Btn>
    </div>}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:16}}>
      {STATUSES.map(s=><div key={s} style={{background:C.card,borderRadius:10,padding:"10px 12px",border:`1px solid ${C.border}`,textAlign:"center"}}>
        <div style={{fontSize:20,fontWeight:900,color:SCOL[s]}}>{leads.filter(l=>l.status===s).length}</div>
        <div style={{fontSize:9,color:C.muted,marginTop:1}}>{s}</div>
      </div>)}
    </div>
    <div style={{maxWidth:280,marginBottom:14}}><Inp value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search leads..." C={C}/></div>
    {view==="kanban"?
    <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:14,alignItems:"flex-start"}}>
      {STATUSES.map(status=>{const cols=byS(status);return <div key={status} style={{minWidth:230,width:230,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 10px",background:SCOL[status]+"22",border:`1px solid ${SCOL[status]}44`,borderRadius:"10px 10px 0 0"}}>
          <span style={{fontSize:11,fontWeight:700,color:SCOL[status]}}>{status}</span>
          <div style={{width:20,height:20,borderRadius:"50%",background:SCOL[status],color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{cols.length}</div>
        </div>
        <div style={{background:C.bg,border:`1px solid ${SCOL[status]}22`,borderTop:"none",borderRadius:"0 0 10px 10px",minHeight:180,padding:7,display:"flex",flexDirection:"column",gap:7}}>
          {cols.map(l=><div key={l.id} style={{background:C.card,borderRadius:9,padding:11,border:`1px solid ${C.border}`,boxShadow:C.shadow}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
              <div style={{fontWeight:700,fontSize:12,color:C.text}}>{l.name}</div>
              <div style={{fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:20,background:l.score>=80?C.greenL:l.score>=60?C.goldL:C.redL,color:l.score>=80?C.green:l.score>=60?C.gold:C.red}}>{l.score}%</div>
            </div>
            <div style={{fontSize:10,color:C.muted,marginBottom:3}}>📚 {l.course}</div>
            <div style={{fontSize:10,color:C.muted,marginBottom:3}}>📞 {l.phone}</div>
            <div style={{fontSize:10,color:C.muted,marginBottom:7}}>🔗 {l.source}</div>
            {l.notes&&<div style={{fontSize:9,color:C.muted2,fontStyle:"italic",marginBottom:6,padding:"3px 7px",background:C.bg,borderRadius:5,borderLeft:`2px solid ${SCOL[status]}`}}>"{l.notes}"</div>}
            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
              {STATUSES.filter(s=>s!==status).slice(0,2).map(s=><button key={s} onClick={()=>move(l.id,s)} style={{fontSize:8,padding:"2px 6px",borderRadius:20,cursor:"pointer",border:`1px solid ${SCOL[s]}44`,background:SCOL[s]+"11",color:SCOL[s],fontWeight:600}}>→{s.split(" ")[0]}</button>)}
            </div>
          </div>)}
          {!cols.length&&<div style={{textAlign:"center",padding:"20px 0",fontSize:11,color:C.muted2}}>No leads</div>}
        </div>
      </div>;})}
    </div>:
    <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,boxShadow:C.shadowM,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead style={{background:C.bg}}><tr>{["Name","Course","Phone","Source","Score","Status","Follow-up","Actions"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>{leads.filter(l=>l.name.toLowerCase().includes(search.toLowerCase())).map(l=><tr key={l.id} style={{borderTop:`1px solid ${C.border}`}}>
          <td style={{padding:"11px 12px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={l.name} size={28} C={C}/><div><div style={{fontSize:12,fontWeight:600,color:C.text}}>{l.name}</div><div style={{fontSize:10,color:C.muted}}>{l.email}</div></div></div></td>
          <td style={{padding:"11px 12px",fontSize:11,color:C.muted}}>{l.course}</td>
          <td style={{padding:"11px 12px",fontSize:12,color:C.text}}>{l.phone}</td>
          <td style={{padding:"11px 12px",fontSize:11,color:C.muted}}>{l.source}</td>
          <td style={{padding:"11px 12px"}}><span style={{fontSize:12,fontWeight:700,color:l.score>=80?C.green:l.score>=60?C.gold:C.red}}>{l.score}%</span></td>
          <td style={{padding:"11px 12px"}}><SBadge status={l.status} C={C}/></td>
          <td style={{padding:"11px 12px",fontSize:11,color:C.muted}}>{dateStr(l.followUp)}</td>
          <td style={{padding:"11px 12px"}}><div style={{display:"flex",gap:5}}>
            <button style={{background:C.tealL,color:C.teal,border:"none",borderRadius:6,padding:"4px 9px",fontSize:10,cursor:"pointer",fontWeight:600}}>📞 Call</button>
            <button style={{background:C.blueL,color:C.blue,border:"none",borderRadius:6,padding:"4px 9px",fontSize:10,cursor:"pointer",fontWeight:600}}>💬 WA</button>
          </div></td>
        </tr>)}</tbody>
      </table>
    </div>}
  </div>;
}

// ─── STUDENTS ──────────────────────────────────────────────────
function StudentsModule({C}){
  const [sel,setSel]=useState(null);
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("All");
  const filtered=MOCK_STUDENTS.filter(s=>(filter==="All"||s.status===filter||s.course.includes(filter))&&(s.name.toLowerCase().includes(search.toLowerCase())||s.rollNo.includes(search)));
  if(sel) return <StudentProfile student={sel} onBack={()=>setSel(null)} C={C}/>;
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Students" subtitle={`${MOCK_STUDENTS.length} registered students`} C={C} action={<Btn color="teal" C={C}>+ Add Student</Btn>}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
      <StatCard icon="🎓" label="Total" value="2,847" trend={5} color="teal" C={C}/>
      <StatCard icon="✅" label="Active" value="2,612" trend={3} color="green" C={C}/>
      <StatCard icon="🏫" label="Completed" value="189" trend={8} color="blue" C={C}/>
      <StatCard icon="❌" label="Dropout" value="46" trend={-2} color="red" C={C}/>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      <Inp value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search by name or roll no..." C={C} style={{width:250}}/>
      {["All","Studying","Completed","Dropout","CSE","Mechanical"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 13px",borderRadius:20,border:`1px solid ${filter===f?C.teal:C.border}`,background:filter===f?C.teal:"transparent",color:filter===f?"#fff":C.muted,fontSize:11,cursor:"pointer",fontWeight:filter===f?600:400}}>{f}</button>)}
    </div>
    <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,boxShadow:C.shadowM,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead style={{background:C.bg}}><tr>{["Student","Roll No","Course","Attendance","CGPA","Fee","Badges","Actions"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>{filtered.map(s=><tr key={s.id} style={{borderTop:`1px solid ${C.border}`,cursor:"pointer"}} onClick={()=>setSel(s)}>
          <td style={{padding:"11px 12px"}}><div style={{display:"flex",alignItems:"center",gap:9}}><Av name={s.name} size={32} C={C}/><div><div style={{fontSize:12,fontWeight:600,color:C.text}}>{s.name}</div><div style={{fontSize:10,color:C.muted}}>{s.email}</div></div></div></td>
          <td style={{padding:"11px 12px",fontSize:11,fontWeight:600,color:C.teal}}>{s.rollNo}</td>
          <td style={{padding:"11px 12px"}}><div style={{fontSize:11,fontWeight:600,color:C.text}}>{s.course}</div><div style={{fontSize:9,color:C.muted}}>{s.batch}</div></td>
          <td style={{padding:"11px 12px"}}><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{flex:1,background:C.border,borderRadius:4,height:5,minWidth:60}}><div style={{width:s.attendance+"%",background:s.attendance>=90?C.green:s.attendance>=75?C.gold:C.red,height:"100%",borderRadius:4}}/></div><span style={{fontSize:11,fontWeight:700,color:s.attendance>=90?C.green:s.attendance>=75?C.gold:C.red,minWidth:32}}>{s.attendance}%</span></div></td>
          <td style={{padding:"11px 12px",fontSize:14,fontWeight:900,color:s.cgpa>=8.5?C.green:s.cgpa>=7?C.gold:C.text}}>{s.cgpa}</td>
          <td style={{padding:"11px 12px"}}><SBadge status={s.fees} C={C}/></td>
          <td style={{padding:"11px 12px"}}><div style={{display:"flex",gap:2}}>{s.badges.map(b=><span key={b} title={b} style={{fontSize:14}}>{b==="perfect_att"?"🌟":b==="top_scorer"?"🏆":b==="hw_champion"?"📚":b==="scholar"?"🎓":"⚡"}</span>)}</div></td>
          <td style={{padding:"11px 12px"}}><button style={{background:C.tealL,color:C.teal,border:"none",borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer",fontWeight:600}}>View</button></td>
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}
function StudentProfile({student:s,onBack,C}){
  const [tab,setTab]=useState("overview");
  const TABS=["overview","attendance","exams","fees","documents"];
  return <div style={{padding:22,overflowY:"auto"}}>
    <button onClick={onBack} style={{background:C.tealL,color:C.teal,border:"none",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:600,marginBottom:18}}>← Back to Students</button>
    <div style={{background:`linear-gradient(135deg,${C.tealL} 0%,${C.card} 60%)`,borderRadius:16,border:`1px solid ${C.border}`,boxShadow:C.shadowM,padding:22,marginBottom:18}}>
      <div style={{display:"flex",gap:18,alignItems:"flex-start",flexWrap:"wrap"}}>
        <Av name={s.name} size={68} C={C}/>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:5}}>
            <h2 style={{margin:0,fontSize:20,fontWeight:900,color:C.text}}>{s.name}</h2>
            <Chip color="teal" C={C}>{s.rollNo}</Chip>
            <SBadge status={s.status} C={C}/>
          </div>
          <div style={{fontSize:12,color:C.muted,marginBottom:10}}>{s.course} · {s.batch} · {s.semester} Semester</div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>{[["📞",s.phone],["📧",s.email],["🎂",dateStr(s.dob)],["🩸",s.blood]].map(([ic,v])=><div key={ic} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.muted}}><span>{ic}</span><span>{v}</span></div>)}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[["📊","Attendance",s.attendance+"%",s.attendance>=90?"green":s.attendance>=75?"gold":"red"],["⭐","CGPA",s.cgpa,s.cgpa>=8.5?"green":s.cgpa>=7?"gold":"text"],["💰","Fee",s.fees,s.fees==="Paid"?"green":s.fees==="Partial"?"gold":"red"],["📁","Docs",s.docs+" files","blue"]].map(([ic,lb,v,col])=><div key={lb} style={{background:C.card,borderRadius:9,padding:"9px 10px",border:`1px solid ${C.border}`,textAlign:"center"}}>
            <div style={{fontSize:17,marginBottom:3}}>{ic}</div>
            <div style={{fontSize:14,fontWeight:900,color:C[col]||C.text}}>{v}</div>
            <div style={{fontSize:9,color:C.muted}}>{lb}</div>
          </div>)}
        </div>
      </div>
    </div>
    <div style={{display:"flex",gap:4,marginBottom:18,background:C.bg,borderRadius:10,padding:4,width:"fit-content"}}>
      {TABS.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"6px 14px",borderRadius:7,border:"none",cursor:"pointer",background:tab===t?C.teal:"transparent",color:tab===t?"#fff":C.muted,fontSize:11,fontWeight:tab===t?700:400,textTransform:"capitalize",transition:"all 0.12s"}}>{t}</button>)}
    </div>
    {tab==="overview"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:C.card,borderRadius:12,padding:16,border:`1px solid ${C.border}`}}>
        <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:10}}>👨‍👩‍👦 Parent Info</div>
        {[["Name",s.parentName],["Phone",s.parentPhone],["Address",s.address]].map(([lb,v])=><div key={lb} style={{fontSize:12,color:C.muted,marginBottom:5}}><strong style={{color:C.text}}>{lb}:</strong> {v}</div>)}
      </div>
      <div style={{background:C.card,borderRadius:12,padding:16,border:`1px solid ${C.border}`}}>
        <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:10}}>🛠️ Skills</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{s.skills.map(sk=><Chip key={sk} color="teal" C={C}>{sk}</Chip>)}</div>
        <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:8}}>🏅 Badges</div>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{s.badges.map(b=><span key={b} style={{fontSize:22}} title={b}>{b==="perfect_att"?"🌟":b==="top_scorer"?"🏆":b==="hw_champion"?"📚":b==="scholar"?"🎓":"⚡"}</span>)}
        {!s.badges.length&&<span style={{fontSize:11,color:C.muted2}}>No badges yet</span>}</div>
      </div>
    </div>}
    {tab==="attendance"&&<div style={{background:C.card,borderRadius:12,padding:16,border:`1px solid ${C.border}`}}>
      <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:14}}>📊 Attendance Record</div>
      <div style={{display:"flex",gap:10,marginBottom:18}}>
        {[["Overall",s.attendance+"%","teal"],["Present","96 days","green"],["Absent","6 days","red"]].map(([lb,v,col])=><div key={lb} style={{background:C[col+"L"],borderRadius:9,padding:"11px 18px",textAlign:"center"}}>
          <div style={{fontSize:22,fontWeight:900,color:C[col]}}>{v}</div>
          <div style={{fontSize:10,color:C.muted}}>{lb}</div>
        </div>)}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={ATT_TREND}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="week" tick={{fill:C.muted,fontSize:10}}/><YAxis tick={{fill:C.muted,fontSize:10}}/>
          <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
          <Bar dataKey="present" fill={C.green} radius={[4,4,0,0]} name="Present %"/>
        </BarChart>
      </ResponsiveContainer>
    </div>}
    {tab==="fees"&&<div style={{background:C.card,borderRadius:12,padding:16,border:`1px solid ${C.border}`}}>
      <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:14}}>💰 Fee Details</div>
      <div style={{display:"flex",gap:10,marginBottom:18}}>
        {[["Total","₹85,000","text"],["Paid","₹85,000","green"],["Balance","₹0","muted"],["Status",s.fees,s.fees==="Paid"?"green":"red"]].map(([lb,v,col])=><div key={lb} style={{background:C.bg,borderRadius:9,padding:"10px 14px",flex:1}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:3}}>{lb}</div>
          <div style={{fontSize:15,fontWeight:700,color:C[col]||C.text}}>{v}</div>
        </div>)}
      </div>
      <div style={{fontSize:12,color:C.teal,padding:"9px 12px",background:C.tealL,borderRadius:8}}>✅ All fees cleared. Next due: April 2025</div>
    </div>}
  </div>;
}

// ─── ATTENDANCE ─────────────────────────────────────────────────
function AttendanceModule({C}){
  const [tab,setTab]=useState("manual");
  const [att,setAtt]=useState(()=>{const m={};MOCK_STUDENTS.forEach(s=>{m[s.id]="Present";});return m;});
  const present=Object.values(att).filter(v=>v==="Present").length;
  const absent=Object.values(att).filter(v=>v==="Absent").length;
  const markAll=s=>{const m={};MOCK_STUDENTS.forEach(st=>{m[st.id]=s;});setAtt(m);};
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Attendance" subtitle="Manual · QR Code · GPS · Face Recognition" C={C}/>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      {[{id:"manual",icon:"✍️",label:"Manual"},{id:"qr",icon:"📱",label:"QR Code"},{id:"gps",icon:"📍",label:"GPS"},{id:"analytics",icon:"📊",label:"Analytics"}].map(m=><button key={m.id} onClick={()=>setTab(m.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 16px",borderRadius:9,border:`1px solid ${tab===m.id?C.teal:C.border}`,background:tab===m.id?C.teal:C.surface,color:tab===m.id?"#fff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}><span>{m.icon}</span>{m.label}</button>)}
    </div>
    {tab==="manual"&&<div>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        {[["✅ Present",present,C.green,C.greenL],["❌ Absent",absent,C.red,C.redL],["📊 Attendance",Math.round(present/MOCK_STUDENTS.length*100)+"%",C.blue,C.blueL]].map(([lb,v,col,bg])=><div key={lb} style={{flex:1,background:bg,borderRadius:9,padding:"11px 12px",border:`1px solid ${col}33`}}>
          <div style={{fontSize:20,fontWeight:900,color:col}}>{v}</div><div style={{fontSize:10,color:C.muted}}>{lb}</div>
        </div>)}
      </div>
      <div style={{display:"flex",gap:7,marginBottom:14,alignItems:"center"}}>
        <span style={{fontSize:12,color:C.muted}}>Mark all:</span>
        {["Present","Absent","Late","Holiday"].map(s=><button key={s} onClick={()=>markAll(s)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.muted,cursor:"pointer",fontSize:11,fontWeight:600}}>{s}</button>)}
        <div style={{flex:1}}/>
        <button style={{padding:"8px 18px",background:C.teal,color:"#fff",border:"none",borderRadius:9,cursor:"pointer",fontSize:12,fontWeight:700}}>💾 Save Attendance</button>
      </div>
      <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,boxShadow:C.shadowM,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead style={{background:C.bg}}><tr>{["#","Student","Roll No","Status","Mark"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{MOCK_STUDENTS.map((s,i)=><tr key={s.id} style={{borderTop:`1px solid ${C.border}`}}>
            <td style={{padding:"9px 12px",fontSize:11,color:C.muted2}}>{i+1}</td>
            <td style={{padding:"9px 12px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={s.name} size={26} C={C}/><span style={{fontSize:12,fontWeight:600,color:C.text}}>{s.name}</span></div></td>
            <td style={{padding:"9px 12px",fontSize:11,color:C.teal,fontWeight:600}}>{s.rollNo}</td>
            <td style={{padding:"9px 12px"}}><span style={{fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:20,background:att[s.id]==="Present"?C.greenL:att[s.id]==="Absent"?C.redL:C.goldL,color:att[s.id]==="Present"?C.green:att[s.id]==="Absent"?C.red:C.gold}}>{att[s.id]}</span></td>
            <td style={{padding:"9px 12px"}}><div style={{display:"flex",gap:5}}>
              {["Present","Absent","Late"].map(st=><button key={st} onClick={()=>setAtt(p=>({...p,[s.id]:st}))} style={{padding:"3px 9px",borderRadius:6,border:`1px solid ${att[s.id]===st?(st==="Present"?C.green:st==="Absent"?C.red:C.gold):C.border}`,background:att[s.id]===st?(st==="Present"?C.green:st==="Absent"?C.red:C.gold):"transparent",color:att[s.id]===st?"#fff":C.muted,fontSize:10,cursor:"pointer",fontWeight:600}}>{st[0]}</button>)}
            </div></td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>}
    {tab==="qr"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"30px 0"}}>
      <div style={{background:C.card,borderRadius:20,padding:30,border:`1px solid ${C.border}`,boxShadow:C.shadowL,maxWidth:380,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:26,marginBottom:12}}>📱 QR Code Attendance</div>
        <div style={{width:180,height:180,background:C.bg,borderRadius:12,margin:"0 auto 18px",display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${C.teal}`,fontSize:12,color:C.muted,flexDirection:"column",gap:4}}>
          <div style={{fontFamily:"monospace",fontSize:11}}>████████████</div>
          <div style={{fontFamily:"monospace",fontSize:11}}>█ ██████  █</div>
          <div style={{fontFamily:"monospace",fontSize:11}}>████████████</div>
          <div style={{marginTop:6,fontWeight:700,color:C.teal}}>QR CODE</div>
          <div style={{fontSize:10,color:C.muted}}>brightfuture.edu</div>
        </div>
        <div style={{background:C.tealL,borderRadius:9,padding:"9px 14px",fontSize:11,color:C.teal,marginBottom:14}}>Session: B.Tech CSE · {new Date().toLocaleDateString("en-IN")} · 9:00 AM</div>
        <div style={{display:"flex",gap:8,justifyContent:"center"}}>
          <button style={{background:C.teal,color:"#fff",border:"none",borderRadius:9,padding:"9px 18px",fontSize:12,cursor:"pointer",fontWeight:700}}>📥 Download QR</button>
          <button style={{background:C.blueL,color:C.blue,border:"none",borderRadius:9,padding:"9px 18px",fontSize:12,cursor:"pointer",fontWeight:700}}>💬 Share via WA</button>
        </div>
      </div>
    </div>}
    {tab==="analytics"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:14}}>📈 Weekly Trend</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={ATT_TREND}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="week" tick={{fill:C.muted,fontSize:10}}/><YAxis tick={{fill:C.muted,fontSize:10}}/>
            <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
            <Line type="monotone" dataKey="present" stroke={C.green} strokeWidth={2} dot={{fill:C.green,r:4}} name="Present %"/>
            <Line type="monotone" dataKey="absent" stroke={C.red} strokeWidth={2} dot={{fill:C.red,r:4}} name="Absent %"/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:12}}>⚠️ Low Attendance (&lt;75%)</div>
        {MOCK_STUDENTS.filter(s=>s.attendance<80).map(s=><div key={s.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9,padding:"8px 10px",background:C.redL,borderRadius:9}}>
          <Av name={s.name} size={26} C={C}/><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.text}}>{s.name}</div><div style={{fontSize:10,color:C.muted}}>{s.rollNo}</div></div>
          <span style={{fontSize:16,fontWeight:900,color:C.red}}>{s.attendance}%</span>
          <button style={{background:C.red,color:"#fff",border:"none",borderRadius:6,padding:"3px 8px",fontSize:9,cursor:"pointer"}}>📢 Notify</button>
        </div>)}
        {!MOCK_STUDENTS.filter(s=>s.attendance<80).length&&<div style={{textAlign:"center",color:C.green,fontSize:13}}>✅ All above 75%</div>}
      </div>
    </div>}
  </div>;
}

// ─── FEE MANAGEMENT ────────────────────────────────────────────
function FeeModule({C}){
  const [tab,setTab]=useState("dashboard");
  const [showR,setShowR]=useState(null);
  const tot=MOCK_FEES.reduce((s,f)=>s+f.amount,0);
  const paid=MOCK_FEES.reduce((s,f)=>s+f.paid,0);
  const pending=MOCK_FEES.reduce((s,f)=>s+f.pending,0);
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Fee Management" subtitle="Collection · Receipts · UPI · Analytics" C={C}/>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      {[{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"collection",icon:"💰",label:"Collection"},{id:"upi",icon:"📱",label:"UPI Payment"},{id:"receipts",icon:"🧾",label:"Receipts"}].map(m=><button key={m.id} onClick={()=>setTab(m.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 16px",borderRadius:9,border:`1px solid ${tab===m.id?C.teal:C.border}`,background:tab===m.id?C.teal:C.surface,color:tab===m.id?"#fff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}><span>{m.icon}</span>{m.label}</button>)}
    </div>
    {tab==="dashboard"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
        <StatCard icon="💰" label="Total Fees Billed" value={fmtBig(tot)} color="teal" C={C}/>
        <StatCard icon="✅" label="Collected" value={fmtBig(paid)} trend={8} color="green" C={C}/>
        <StatCard icon="⏳" label="Pending" value={fmtBig(pending)} trend={-3} color="red" C={C}/>
        <StatCard icon="📊" label="Collection Rate" value={pct(paid,tot)+"%"} trend={5} color="blue" C={C}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
        <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
          <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📈 Monthly Fee Collection</div>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={FEE_COLL}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="month" tick={{fill:C.muted,fontSize:10}}/><YAxis tick={{fill:C.muted,fontSize:10}} tickFormatter={v=>(v/100000).toFixed(0)+"L"}/>
              <Tooltip formatter={v=>["₹"+(v/100000).toFixed(1)+"L"]} contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
              <Bar dataKey="collected" fill={C.teal} radius={[4,4,0,0]} name="Collected"/><Bar dataKey="pending" fill={C.gold} radius={[4,4,0,0]} name="Pending"/>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
          <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>💳 Payment Methods</div>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart><Pie data={[{name:"UPI",value:45,color:C.teal},{name:"NEFT",value:28,color:C.blue},{name:"Cash",value:18,color:C.gold},{name:"Cheque",value:9,color:C.purple}]} dataKey="value" cx="50%" cy="50%" outerRadius={62} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
              {[C.teal,C.blue,C.gold,C.purple].map((col,i)=><Cell key={i} fill={col}/>)}
            </Pie><Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>}
    {tab==="collection"&&<div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,boxShadow:C.shadowM,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead style={{background:C.bg}}><tr>{["Student","Amount","Paid","Pending","Status","Method","Date","Receipt"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>{MOCK_FEES.map(f=><tr key={f.id} style={{borderTop:`1px solid ${C.border}`}}>
          <td style={{padding:"11px 12px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={f.studentName} size={26} C={C}/><div><div style={{fontSize:12,fontWeight:600,color:C.text}}>{f.studentName}</div><div style={{fontSize:10,color:C.muted}}>{f.rollNo}</div></div></div></td>
          <td style={{padding:"11px 12px",fontSize:12,fontWeight:700,color:C.text}}>₹{fmt(f.amount)}</td>
          <td style={{padding:"11px 12px",fontSize:12,fontWeight:700,color:C.green}}>₹{fmt(f.paid)}</td>
          <td style={{padding:"11px 12px",fontSize:12,fontWeight:700,color:f.pending>0?C.red:C.muted}}>₹{fmt(f.pending)}</td>
          <td style={{padding:"11px 12px"}}><SBadge status={f.status} C={C}/></td>
          <td style={{padding:"11px 12px",fontSize:11,color:C.muted}}>{f.method||"—"}</td>
          <td style={{padding:"11px 12px",fontSize:11,color:C.muted}}>{dateStr(f.paidDate)}</td>
          <td style={{padding:"11px 12px"}}>{f.receipt?<button onClick={()=>setShowR(f)} style={{background:C.blueL,color:C.blue,border:"none",borderRadius:6,padding:"4px 9px",fontSize:10,cursor:"pointer",fontWeight:600}}>🧾 View</button>:<button style={{background:C.teal,color:"#fff",border:"none",borderRadius:6,padding:"4px 9px",fontSize:10,cursor:"pointer",fontWeight:600}}>+ Collect</button>}</td>
        </tr>)}</tbody>
      </table>
    </div>}
    {tab==="upi"&&<div style={{display:"flex",justifyContent:"center",padding:"20px 0"}}>
      <div style={{background:C.card,borderRadius:20,padding:30,border:`1px solid ${C.border}`,boxShadow:C.shadowL,maxWidth:360,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:24,marginBottom:8}}>📱 UPI Payment</div>
        <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Instant payment with auto receipt generation</div>
        <div style={{width:180,height:180,margin:"0 auto 18px",background:"white",borderRadius:12,border:`3px solid ${C.teal}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:2,padding:8}}>
          {["██████████","█ ████ █","█ █  █ █","████████","█  ██  █","██████████"].map((row,i)=><div key={i} style={{fontFamily:"monospace",fontSize:10,color:"#333",letterSpacing:2}}>{row}</div>)}
          <div style={{fontSize:10,fontWeight:700,color:C.teal,marginTop:4}}>UPI QR CODE</div>
        </div>
        <div style={{fontWeight:900,fontSize:15,color:C.text,marginBottom:3}}>brightfuture@upi</div>
        <div style={{fontSize:11,color:C.muted,marginBottom:18}}>Bright Future College · HDFC Bank</div>
        <div style={{background:C.tealL,borderRadius:9,padding:"9px 12px",fontSize:11,color:C.teal,marginBottom:14}}>💡 Auto-generates receipt & updates student record after payment</div>
        <div style={{display:"flex",gap:8,justifyContent:"center"}}>
          <button style={{background:C.teal,color:"#fff",border:"none",borderRadius:9,padding:"10px 18px",fontSize:12,cursor:"pointer",fontWeight:700}}>📥 Download</button>
          <button style={{background:C.blueL,color:C.blue,border:"none",borderRadius:9,padding:"10px 18px",fontSize:12,cursor:"pointer",fontWeight:700}}>📤 Share</button>
        </div>
      </div>
    </div>}
    {tab==="receipts"&&<div style={{display:"flex",flexDirection:"column",gap:9}}>
      {MOCK_FEES.filter(f=>f.receipt).map(f=><div key={f.id} style={{background:C.card,borderRadius:11,padding:14,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:14,boxShadow:C.shadow}}>
        <div style={{width:38,height:38,background:C.tealL,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🧾</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{f.receipt}</div><div style={{fontSize:11,color:C.muted}}>{f.studentName} · ₹{fmt(f.paid)} · {dateStr(f.paidDate)}</div></div>
        <SBadge status={f.status} C={C}/>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setShowR(f)} style={{background:C.blueL,color:C.blue,border:"none",borderRadius:6,padding:"5px 11px",fontSize:11,cursor:"pointer",fontWeight:600}}>👁️ View</button>
          <button style={{background:C.tealL,color:C.teal,border:"none",borderRadius:6,padding:"5px 11px",fontSize:11,cursor:"pointer",fontWeight:600}}>📥 PDF</button>
          <button style={{background:C.greenL,color:C.green,border:"none",borderRadius:6,padding:"5px 11px",fontSize:11,cursor:"pointer",fontWeight:600}}>💬 WA</button>
        </div>
      </div>)}
    </div>}
    {showR&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowR(null)}>
      <div style={{background:C.surface,borderRadius:16,padding:30,maxWidth:400,width:"100%",border:`1px solid ${C.border}`,boxShadow:C.shadowL,position:"relative"}} onClick={e=>e.stopPropagation()}>
        <div style={{textAlign:"center",marginBottom:18}}><div style={{fontSize:28}}>🧾</div><div style={{fontSize:16,fontWeight:900,color:C.text}}>{showR.receipt}</div><div style={{fontSize:12,color:C.teal,fontWeight:700}}>Fee Receipt</div></div>
        <div style={{borderTop:`1px dashed ${C.border}`,padding:"14px 0"}}>
          {[["Student",showR.studentName],["Roll No",showR.rollNo],["Month",showR.month],["Amount","₹"+fmt(showR.paid)],["Method",showR.method],["Date",dateStr(showR.paidDate)],["Status",showR.status]].map(([lb,v])=><div key={lb} style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:11,color:C.muted}}>{lb}</span><span style={{fontSize:11,fontWeight:600,color:C.text}}>{v}</span></div>)}
        </div>
        <div style={{borderTop:`1px dashed ${C.border}`,paddingTop:14,display:"flex",gap:8,justifyContent:"center"}}>
          <button style={{background:C.teal,color:"#fff",border:"none",borderRadius:9,padding:"9px 18px",fontSize:12,cursor:"pointer",fontWeight:700}}>📥 Download PDF</button>
          <button style={{background:C.greenL,color:C.green,border:"none",borderRadius:9,padding:"9px 18px",fontSize:12,cursor:"pointer",fontWeight:700}}>💬 Send WA</button>
        </div>
        <button onClick={()=>setShowR(null)} style={{position:"absolute",top:12,right:14,background:"none",border:"none",cursor:"pointer",fontSize:18,color:C.muted}}>✕</button>
      </div>
    </div>}
  </div>;
}

// ─── WHATSAPP CENTER ───────────────────────────────────────────
function WhatsAppModule({C}){
  const [tab,setTab]=useState("templates");
  const TMPLS=[
    {id:"fee",label:"Fee Reminder",icon:"💰",category:"Finance",sent:1247},
    {id:"absent",label:"Absent Alert",icon:"📅",category:"Attendance",sent:834},
    {id:"result",label:"Exam Results",icon:"📝",category:"Academic",sent:562},
    {id:"bday",label:"Birthday Wish",icon:"🎂",category:"Personal",sent:289},
    {id:"admit",label:"Admission Confirmation",icon:"🎓",category:"Enrollment",sent:124},
    {id:"event",label:"Event Announcement",icon:"📣",category:"Events",sent:347},
  ];
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="WhatsApp Center" subtitle="Automated messaging · campaigns · analytics · scheduling" C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
      <StatCard icon="📤" label="Messages Sent" value="12,847" trend={18} color="teal" C={C}/>
      <StatCard icon="✅" label="Delivered" value="12,601" sub="98.1%" trend={2} color="green" C={C}/>
      <StatCard icon="👁️" label="Read Rate" value="80.1%" trend={5} color="blue" C={C}/>
      <StatCard icon="📞" label="Responses" value="3,847" sub="29.9%" trend={8} color="purple" C={C}/>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      {[{id:"templates",icon:"📋",label:"Templates"},{id:"campaign",icon:"📢",label:"Send Campaign"},{id:"schedule",icon:"⏰",label:"Automation"},{id:"analytics",icon:"📊",label:"Analytics"}].map(m=><button key={m.id} onClick={()=>setTab(m.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 16px",borderRadius:9,border:`1px solid ${tab===m.id?C.teal:C.border}`,background:tab===m.id?C.teal:C.surface,color:tab===m.id?"#fff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}><span>{m.icon}</span>{m.label}</button>)}
    </div>
    {tab==="templates"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
      {TMPLS.map(t=><div key={t.id} style={{background:C.card,borderRadius:12,padding:16,border:`1px solid ${C.border}`,boxShadow:C.shadow}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <span style={{fontSize:26}}>{t.icon}</span><Chip color="teal" C={C}>{t.category}</Chip>
        </div>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:3}}>{t.label}</div>
        <div style={{fontSize:11,color:C.muted,marginBottom:12}}>Sent {fmt(t.sent)} times</div>
        <div style={{display:"flex",gap:6}}>
          <button style={{flex:1,background:C.teal,color:"#fff",border:"none",borderRadius:7,padding:"7px 0",fontSize:11,cursor:"pointer",fontWeight:600}}>📤 Use Template</button>
          <button style={{background:C.bg,color:C.muted,border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 10px",fontSize:11,cursor:"pointer"}}>✏️</button>
        </div>
      </div>)}
    </div>}
    {tab==="campaign"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📝 Compose Message</div>
        <div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:600,color:C.muted,display:"block",marginBottom:5}}>Recipients</label>
          <Sel value="" onChange={()=>{}} C={C} style={{width:"100%"}}><option>All Students (2,847)</option><option>All Parents (2,847)</option><option>B.Tech CSE Batch 2024</option><option>Low Attendance Students</option><option>Fee Defaulters</option></Sel>
        </div>
        <div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:600,color:C.muted,display:"block",marginBottom:5}}>Template</label>
          <Sel value="" onChange={()=>{}} C={C} style={{width:"100%"}}>{TMPLS.map(t=><option key={t.id}>{t.label}</option>)}</Sel>
        </div>
        <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:C.muted,display:"block",marginBottom:5}}>Message</label>
          <textarea rows={5} defaultValue="Dear Parent,\n\nFee reminder for December 2024.\nAmount: ₹85,000 · Due: 31st Dec\nPay via UPI: brightfuture@upi\n\nRegards,\nBright Future College" style={{width:"100%",background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 10px",fontSize:12,color:C.text,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,background:C.teal,color:"#fff",border:"none",borderRadius:9,padding:"10px 0",fontSize:12,cursor:"pointer",fontWeight:700}}>📤 Send Now (2,847)</button>
          <button style={{background:C.goldL,color:C.gold,border:"none",borderRadius:9,padding:"10px 14px",fontSize:12,cursor:"pointer",fontWeight:600}}>⏰ Schedule</button>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"center",alignItems:"flex-start"}}>
        <div style={{background:"#128C7E",borderRadius:20,padding:0,width:260,boxShadow:C.shadowL,overflow:"hidden"}}>
          <div style={{background:"#075E54",padding:"12px 14px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🎓</div>
            <div><div style={{color:"#fff",fontSize:12,fontWeight:700}}>Bright Future College</div><div style={{color:"rgba(255,255,255,0.6)",fontSize:9}}>Official Channel</div></div>
          </div>
          <div style={{background:"#e5ddd5",padding:12,minHeight:200}}>
            <div style={{background:"#fff",borderRadius:"0 12px 12px 12px",padding:"10px 12px",fontSize:11,lineHeight:1.6,boxShadow:"0 1px 2px rgba(0,0,0,0.1)",maxWidth:"90%"}}>
              Dear Parent,<br/>Fee reminder for December 2024.<br/>Amount: ₹85,000 · Due: 31st Dec<br/>Pay via UPI: brightfuture@upi<br/><br/>Regards,<br/>Bright Future College
              <div style={{textAlign:"right",fontSize:9,color:"#666",marginTop:4}}>12:34 PM ✓✓</div>
            </div>
          </div>
        </div>
      </div>
    </div>}
    {tab==="schedule"&&<div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
      <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>🤖 Automation Status</div>
      {[["Fee Reminders","Active","Every 5th of month","green"],["Absent Alerts","Active","Real-time","green"],["Birthday Wishes","Active","9:00 AM daily","green"],["Result Notifications","Paused","After exam results","gold"],["Admission Follow-up","Active","After 3 days","green"]].map(([lb,status,sched,col])=><div key={lb} style={{display:"flex",alignItems:"center",gap:12,marginBottom:9,padding:"9px 12px",background:C.bg,borderRadius:9,border:`1px solid ${C.border}`}}>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:C.text}}>{lb}</div><div style={{fontSize:10,color:C.muted}}>{sched}</div></div>
        <Chip color={col} C={C}>{status}</Chip>
        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:15}}>⚙️</button>
      </div>)}
    </div>}
    {tab==="analytics"&&<div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
      <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📊 Message Performance</div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={TMPLS.map(t=>({name:t.label.split(" ")[0],sent:t.sent,read:Math.floor(t.sent*0.8)}))}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="name" tick={{fill:C.muted,fontSize:10}}/><YAxis tick={{fill:C.muted,fontSize:10}}/>
          <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
          <Bar dataKey="sent" fill={C.teal} name="Sent"/><Bar dataKey="read" fill={C.green} name="Read"/>
        </BarChart>
      </ResponsiveContainer>
    </div>}
  </div>;
}

// ─── EXAMINATIONS ──────────────────────────────────────────────
function ExamsModule({C}){
  const [tab,setTab]=useState("list");
  const [creating,setCreating]=useState(false);
  const [questions,setQuestions]=useState([{id:1,type:"mcq",q:"What is the time complexity of binary search?",opts:["O(n)","O(log n)","O(n²)","O(1)"],ans:1,marks:2},{id:2,type:"mcq",q:"Which data structure uses LIFO?",opts:["Queue","Stack","Linked List","Tree"],ans:1,marks:2},{id:3,type:"short",q:"Explain the concept of recursion with an example.",marks:5},{id:4,type:"tf",q:"A binary tree can have at most 2 children per node.",ans:true,marks:1}]);
  const [newQ,setNewQ]=useState({type:"mcq",q:"",opts:["","","",""],ans:0,marks:2});
  const EXAMS=[
    {id:"e1",title:"Mid Semester - CS301",subject:"Data Structures",date:"2024-12-20",duration:180,totalMarks:100,type:"Theory",status:"Completed",avgScore:74,topScore:98,students:56,submitted:54},
    {id:"e2",title:"Unit Test - CS302",subject:"Algorithms",date:"2024-12-22",duration:90,totalMarks:50,type:"Theory",status:"Completed",avgScore:38,topScore:49,students:56,submitted:56},
    {id:"e3",title:"Lab Exam - CS Lab",subject:"Programming Lab",date:"2025-01-26",duration:180,totalMarks:100,type:"Practical",status:"Upcoming",avgScore:null,topScore:null,students:56,submitted:0},
    {id:"e4",title:"End Semester - CS301",subject:"Data Structures",date:"2025-02-15",duration:180,totalMarks:100,type:"Theory",status:"Scheduled",avgScore:null,topScore:null,students:56,submitted:0},
  ];
  const addQ=()=>{setQuestions(p=>[...p,{...newQ,id:Date.now()}]);setNewQ({type:"mcq",q:"",opts:["","","",""],ans:0,marks:2});};
  const SCORE_DIST=[{range:"90-100",count:8,color:"#059669"},{range:"80-89",count:14,color:"#2563eb"},{range:"70-79",count:18,color:"#7c3aed"},{range:"60-69",count:10,color:"#d97706"},{range:"<60",count:6,color:"#dc2626"}];
  return <div style={{padding:22,overflowY:"auto",height:"calc(100vh-58px)"}}>
    <PH title="Examinations" subtitle="Online exams · Question builder · Results · Analytics" C={C} action={<div style={{display:"flex",gap:8}}>
      <Btn onClick={()=>setTab("builder")} color="purple" variant="outline" size="sm" C={C}>🔧 Question Bank</Btn>
      <Btn onClick={()=>setCreating(true)} color="teal" size="sm" C={C}>+ Create Exam</Btn>
    </div>}/>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      {[{id:"list",icon:"📋",label:"All Exams"},{id:"builder",icon:"🔧",label:"Question Builder"},{id:"results",icon:"📊",label:"Results"},{id:"analytics",icon:"📈",label:"Analytics"}].map(m=><button key={m.id} onClick={()=>setTab(m.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 16px",borderRadius:9,border:`1px solid ${tab===m.id?C.teal:C.border}`,background:tab===m.id?C.teal:C.surface,color:tab===m.id?"#fff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}><span>{m.icon}</span>{m.label}</button>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
      <StatCard icon="📝" label="Total Exams" value="24" trend={5} color="teal" C={C}/>
      <StatCard icon="✅" label="Completed" value="18" color="green" C={C}/>
      <StatCard icon="📅" label="Upcoming" value="4" color="gold" C={C}/>
      <StatCard icon="📊" label="Avg Score" value="74.2%" trend={3} color="blue" C={C}/>
    </div>
    {tab==="list"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
      {EXAMS.map(ex=><div key={ex.id} style={{background:C.card,borderRadius:13,padding:16,border:`1px solid ${C.border}`,boxShadow:C.shadow,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <div style={{width:46,height:46,background:C.tealL,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{ex.type==="Practical"?"🔬":"📝"}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
            <div style={{fontWeight:800,fontSize:14,color:C.text}}>{ex.title}</div>
            <Chip color="teal" C={C}>{ex.type}</Chip><SBadge status={ex.status} C={C}/>
          </div>
          <div style={{display:"flex",gap:14,fontSize:11,color:C.muted,flexWrap:"wrap"}}>
            <span>📚 {ex.subject}</span><span>📅 {dateStr(ex.date)}</span><span>⏱ {ex.duration} min</span><span>📊 {ex.totalMarks} marks</span>
            <span>👥 {ex.submitted}/{ex.students} submitted</span>
          </div>
        </div>
        {ex.avgScore!=null&&<div style={{textAlign:"center",padding:"6px 12px",background:C.tealL,borderRadius:8}}>
          <div style={{fontSize:20,fontWeight:900,color:C.teal}}>{ex.avgScore}%</div>
          <div style={{fontSize:9,color:C.muted}}>Avg Score</div>
        </div>}
        {ex.topScore&&<div style={{textAlign:"center",padding:"6px 12px",background:C.greenL,borderRadius:8}}>
          <div style={{fontSize:20,fontWeight:900,color:C.green}}>{ex.topScore}</div>
          <div style={{fontSize:9,color:C.muted}}>Top Score</div>
        </div>}
        <div style={{display:"flex",gap:6}}>
          <button style={{background:C.teal,color:"#fff",border:"none",borderRadius:7,padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600}}>Manage</button>
          {ex.status==="Completed"&&<button onClick={()=>setTab("results")} style={{background:C.blueL,color:C.blue,border:"none",borderRadius:7,padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600}}>Results</button>}
          {ex.status==="Upcoming"&&<button style={{background:C.teal,color:"#fff",border:"none",borderRadius:7,padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600}}>🔴 Start Now</button>}
        </div>
      </div>)}
    </div>}
    {tab==="builder"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>➕ Add Question</div>
        <div style={{marginBottom:10}}><label style={{fontSize:11,fontWeight:600,color:C.muted,display:"block",marginBottom:4}}>Question Type</label>
          <div style={{display:"flex",gap:6}}>{[{id:"mcq",icon:"🔘",lb:"MCQ"},{id:"short",icon:"📝",lb:"Short Answer"},{id:"tf",icon:"✅",lb:"True/False"},{id:"essay",icon:"📄",lb:"Essay"}].map(t=><button key={t.id} onClick={()=>setNewQ(p=>({...p,type:t.id}))} style={{flex:1,padding:"6px 4px",borderRadius:7,border:`1px solid ${newQ.type===t.id?C.teal:C.border}`,background:newQ.type===t.id?C.tealL:"transparent",color:newQ.type===t.id?C.teal:C.muted,fontSize:10,cursor:"pointer",fontWeight:newQ.type===t.id?700:400}}>{t.icon} {t.lb}</button>)}
          </div>
        </div>
        <div style={{marginBottom:10}}><label style={{fontSize:11,fontWeight:600,color:C.muted,display:"block",marginBottom:4}}>Question</label>
          <textarea value={newQ.q} onChange={e=>setNewQ(p=>({...p,q:e.target.value}))} rows={3} placeholder="Enter your question here..." style={{width:"100%",background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px",fontSize:12,color:C.text,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
        </div>
        {newQ.type==="mcq"&&<div style={{marginBottom:10}}><label style={{fontSize:11,fontWeight:600,color:C.muted,display:"block",marginBottom:4}}>Options</label>
          {newQ.opts.map((opt,i)=><div key={i} style={{display:"flex",gap:7,marginBottom:6,alignItems:"center"}}>
            <button onClick={()=>setNewQ(p=>({...p,ans:i}))} style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${newQ.ans===i?C.teal:C.border}`,background:newQ.ans===i?C.teal:"transparent",cursor:"pointer",flexShrink:0}}/>
            <input value={opt} onChange={e=>{const o=[...newQ.opts];o[i]=e.target.value;setNewQ(p=>({...p,opts:o}));}} placeholder={`Option ${String.fromCharCode(65+i)}`} style={{flex:1,background:C.inputBg,border:`1px solid ${newQ.ans===i?C.teal:C.border}`,borderRadius:6,padding:"5px 9px",fontSize:11,color:C.text,outline:"none"}}/>
          </div>)}
        </div>}
        {newQ.type==="tf"&&<div style={{marginBottom:10}}><label style={{fontSize:11,fontWeight:600,color:C.muted,display:"block",marginBottom:4}}>Correct Answer</label>
          <div style={{display:"flex",gap:8}}>{[true,false].map(v=><button key={String(v)} onClick={()=>setNewQ(p=>({...p,ans:v}))} style={{flex:1,padding:"8px 0",borderRadius:8,border:`1px solid ${newQ.ans===v?C.teal:C.border}`,background:newQ.ans===v?C.teal:"transparent",color:newQ.ans===v?"#fff":C.muted,fontSize:12,cursor:"pointer",fontWeight:600}}>{v?"✅ True":"❌ False"}</button>)}
          </div>
        </div>}
        <div style={{display:"flex",gap:9,marginBottom:14,alignItems:"center"}}>
          <label style={{fontSize:11,fontWeight:600,color:C.muted,whiteSpace:"nowrap"}}>Marks:</label>
          <input type="number" min={1} max={20} value={newQ.marks} onChange={e=>setNewQ(p=>({...p,marks:+e.target.value}))} style={{width:60,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 8px",fontSize:12,color:C.text,outline:"none"}}/>
        </div>
        <button onClick={addQ} style={{width:"100%",background:C.teal,color:"#fff",border:"none",borderRadius:9,padding:"10px 0",fontSize:12,cursor:"pointer",fontWeight:700}}>➕ Add to Question Bank</button>
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM,overflowY:"auto",maxHeight:500}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:C.text}}>📋 Question Bank ({questions.length})</div>
          <div style={{fontSize:11,color:C.teal,fontWeight:600}}>Total: {questions.reduce((s,q)=>s+q.marks,0)} marks</div>
        </div>
        {questions.map((q,i)=><div key={q.id} style={{marginBottom:10,padding:"10px 12px",background:C.bg,borderRadius:10,border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:9,fontWeight:700,color:C.teal,textTransform:"uppercase"}}>{q.type==="mcq"?"Multiple Choice":q.type==="short"?"Short Answer":q.type==="tf"?"True/False":"Essay"}</span>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <span style={{fontSize:10,fontWeight:700,color:C.gold}}>{q.marks} mk</span>
              <button onClick={()=>setQuestions(p=>p.filter(x=>x.id!==q.id))} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.muted}}>✕</button>
            </div>
          </div>
          <div style={{fontSize:12,color:C.text,marginBottom:q.opts?6:0,fontWeight:500}}><span style={{color:C.muted,fontWeight:700}}>Q{i+1}. </span>{q.q||"(Empty question)"}</div>
          {q.opts&&<div style={{display:"flex",flexDirection:"column",gap:3}}>
            {q.opts.map((o,oi)=><div key={oi} style={{display:"flex",gap:6,fontSize:10,color:q.ans===oi?C.green:C.muted}}>
              <span>{q.ans===oi?"✅":"○"}</span><span>{String.fromCharCode(65+oi)}. {o||"—"}</span>
            </div>)}
          </div>}
          {q.type==="tf"&&<div style={{fontSize:10,color:C.green}}>✅ Answer: {q.ans?"True":"False"}</div>}
        </div>)}
      </div>
    </div>}
    {tab==="results"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📊 Score Distribution — Mid Semester CS301</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={SCORE_DIST}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="range" tick={{fill:C.muted,fontSize:10}}/><YAxis tick={{fill:C.muted,fontSize:10}}/>
            <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
            <Bar dataKey="count" name="Students" radius={[5,5,0,0]}>{SCORE_DIST.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          {[["Avg","74%","teal"],["Highest","98","green"],["Lowest","42","red"],["Passed","50/56","blue"]].map(([lb,v,col])=><div key={lb} style={{flex:1,background:C[col+"L"],borderRadius:8,padding:"7px 8px",textAlign:"center"}}>
            <div style={{fontSize:14,fontWeight:900,color:C[col]}}>{v}</div><div style={{fontSize:9,color:C.muted}}>{lb}</div>
          </div>)}
        </div>
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM,overflowY:"auto",maxHeight:400}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:12}}>📋 Student Results</div>
        {MOCK_STUDENTS.map((s,i)=>{const score=[74,61,91,48,82,78][i]||Math.floor(Math.random()*50+50);return <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:7,padding:"8px 10px",background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}}>
          <Av name={s.name} size={26} C={C}/>
          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:C.text}}>{s.name}</div><div style={{fontSize:9,color:C.muted}}>{s.rollNo}</div></div>
          <div style={{background:C.border,borderRadius:4,height:5,width:60}}><div style={{width:score+"%",background:score>=75?C.green:score>=50?C.gold:C.red,height:"100%",borderRadius:4}}/></div>
          <span style={{fontSize:13,fontWeight:900,color:score>=75?C.green:score>=50?C.gold:C.red,minWidth:30}}>{score}</span>
        </div>;})}
      </div>
    </div>}
    {tab==="analytics"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📈 Subject-wise Performance</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={[{sub:"DS",avg:74,pass:89},{sub:"Algo",avg:68,pass:82},{sub:"OS",avg:72,pass:86},{sub:"DB",avg:81,pass:94},{sub:"Net",avg:77,pass:91}]}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="sub" tick={{fill:C.muted,fontSize:10}}/><YAxis tick={{fill:C.muted,fontSize:10}}/>
            <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
            <Bar dataKey="avg" fill={C.teal} radius={[4,4,0,0]} name="Avg Score"/><Bar dataKey="pass" fill={C.green} radius={[4,4,0,0]} name="Pass%"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:12}}>💡 AI Exam Insights</div>
        {[["📊","Average marks across all subjects: 74.2%","teal"],["📈","Pass percentage improved 4.3% vs last semester","green"],["⚠️","Data Structures has lowest scores — needs attention","gold"],["🎯","6 students at risk of failing — personal coaching advised","red"],["🏆","15 students scored above 90% — merit list ready","blue"]].map(([ic,text,col],i)=><div key={i} style={{display:"flex",gap:9,padding:"9px 11px",background:C.bg,borderRadius:8,border:`1px solid ${C[col]}33`,marginBottom:8}}>
          <span style={{fontSize:15,flexShrink:0}}>{ic}</span><span style={{fontSize:11,color:C.text,lineHeight:1.5}}>{text}</span>
        </div>)}
      </div>
    </div>}
  </div>;
}

// ─── PLACEMENT PORTAL ──────────────────────────────────────────
function PlacementPortal({C}){
  const [tab,setTab]=useState("jobs");
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Placement Portal" subtitle="Job tracking · AI Resume Builder · Placement analytics" C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:18}}>
      <StatCard icon="💼" label="Active Jobs" value="24" trend={5} color="teal" C={C}/>
      <StatCard icon="🎓" label="Placed 2024" value="198" trend={8} color="green" C={C}/>
      <StatCard icon="📊" label="Placement Rate" value="89.5%" trend={3} color="blue" C={C}/>
      <StatCard icon="💰" label="Avg Package" value="₹10.8L" trend={15} color="gold" C={C}/>
      <StatCard icon="🏢" label="Companies" value="142" trend={12} color="purple" C={C}/>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      {[{id:"jobs",icon:"💼",label:"Job Board"},{id:"students",icon:"🎓",label:"Students"},{id:"analytics",icon:"📊",label:"Analytics"},{id:"resume_ai",icon:"🤖",label:"AI Resume Builder"}].map(m=><button key={m.id} onClick={()=>setTab(m.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 16px",borderRadius:9,border:`1px solid ${tab===m.id?C.teal:C.border}`,background:tab===m.id?C.teal:C.surface,color:tab===m.id?"#fff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}><span>{m.icon}</span>{m.label}</button>)}
    </div>
    {tab==="jobs"&&<div style={{display:"flex",flexDirection:"column",gap:11}}>
      {MOCK_JOBS.map(j=><div key={j.id} style={{background:C.card,borderRadius:13,padding:16,border:`1px solid ${C.border}`,boxShadow:C.shadow,display:"flex",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>
        <div style={{width:46,height:46,background:C.tealL,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🏢</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
            <div style={{fontWeight:800,fontSize:15,color:C.text}}>{j.role}</div>
            <Chip color="teal" C={C}>{j.type}</Chip>
            <SBadge status={j.status} C={C}/>
          </div>
          <div style={{fontSize:13,fontWeight:700,color:C.teal,marginBottom:5}}>{j.company}</div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",fontSize:11,color:C.muted,marginBottom:7}}>
            <span>📍 {j.location}</span><span style={{color:C.green,fontWeight:700}}>💰 {j.package}</span><span>📅 Due: {dateStr(j.deadline)}</span>
          </div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{j.skills.map(s=><Chip key={s} color="blue" C={C}>{s}</Chip>)}</div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontSize:22,fontWeight:900,color:C.text}}>{j.applicants}</div>
          <div style={{fontSize:9,color:C.muted}}>Applied</div>
          <div style={{fontSize:16,fontWeight:700,color:C.green,marginTop:3}}>{j.selected}</div>
          <div style={{fontSize:9,color:C.muted}}>Selected</div>
          <div style={{display:"flex",gap:5,marginTop:8}}>
            <button style={{background:C.teal,color:"#fff",border:"none",borderRadius:7,padding:"5px 11px",fontSize:11,cursor:"pointer",fontWeight:600}}>Manage</button>
            <button style={{background:C.blueL,color:C.blue,border:"none",borderRadius:7,padding:"5px 11px",fontSize:11,cursor:"pointer",fontWeight:600}}>Notify</button>
          </div>
        </div>
      </div>)}
    </div>}
    {tab==="analytics"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📈 Placement Trend (5 Years)</div>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={PLACE_DATA}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="year" tick={{fill:C.muted,fontSize:10}}/><YAxis yAxisId="l" tick={{fill:C.muted,fontSize:10}}/><YAxis yAxisId="r" orientation="right" tick={{fill:C.muted,fontSize:10}}/>
            <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
            <Bar yAxisId="l" dataKey="placed" fill={C.teal} radius={[4,4,0,0]} name="Placed"/>
            <Line yAxisId="r" type="monotone" dataKey="pkg" stroke={C.gold} strokeWidth={2} name="Avg Pkg (LPA)" dot={{fill:C.gold,r:4}}/>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:12}}>🏆 Top Alumni</div>
        {MOCK_ALUMNI.slice(0,4).map(a=><div key={a.id} style={{display:"flex",gap:10,marginBottom:9,padding:"7px 10px",background:C.bg,borderRadius:9,border:`1px solid ${C.border}`}}>
          <Av name={a.name} size={30} C={C}/>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:C.text}}>{a.name}</div><div style={{fontSize:10,color:C.muted}}>{a.role} @ {a.company}</div></div>
          <div style={{fontSize:12,fontWeight:700,color:C.green}}>{a.package}</div>
        </div>)}
      </div>
    </div>}
    {tab==="resume_ai"&&<div style={{background:C.card,borderRadius:14,padding:22,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
      <div style={{display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:260}}>
          <h3 style={{margin:"0 0 14px",fontSize:16,fontWeight:900,color:C.text}}>🤖 AI Resume Builder</h3>
          <p style={{fontSize:12,color:C.muted,marginBottom:18}}>Generate ATS-optimized resumes in seconds. Tailored for your target role and company.</p>
          {[{icon:"👤",label:"Student Profile",sub:"Priya Sharma · 24CS001"},{icon:"🎯",label:"Target Role",sub:"Software Engineer at TCS"},{icon:"📋",label:"Resume Style",sub:"Modern Professional"},{icon:"🔑",label:"Key Skills",sub:"Python, React, SQL, AWS"}].map(({icon,label,sub})=><div key={icon} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"9px 12px",background:C.bg,borderRadius:9,border:`1px solid ${C.border}`}}>
            <span style={{fontSize:18}}>{icon}</span>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.text}}>{label}</div><div style={{fontSize:10,color:C.muted}}>{sub}</div></div>
            <button style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 7px",fontSize:10,cursor:"pointer",color:C.muted}}>Edit</button>
          </div>)}
          <button style={{width:"100%",background:C.teal,color:"#fff",border:"none",borderRadius:10,padding:"11px 0",fontSize:13,cursor:"pointer",fontWeight:700,marginTop:6}}>🤖 Generate AI Resume</button>
        </div>
        <div style={{flex:1,minWidth:260,background:C.bg,borderRadius:12,padding:18,border:`1px solid ${C.border}`,fontFamily:"Georgia,serif"}}>
          <div style={{textAlign:"center",marginBottom:14,borderBottom:`2px solid ${C.teal}`,paddingBottom:10}}>
            <div style={{fontSize:17,fontWeight:900,color:C.text}}>PRIYA SHARMA</div>
            <div style={{fontSize:11,color:C.muted}}>B.Tech CSE · CGPA: 8.9</div>
            <div style={{fontSize:10,color:C.teal}}>📧 priya@email.com | 📞 9876543210</div>
          </div>
          {[{s:"OBJECTIVE",c:"Passionate software engineer with strong foundations in Python and React, seeking SDE role at TCS..."},
            {s:"EDUCATION",c:"B.Tech Computer Science\nBright Future College · 2024-2028 · CGPA: 8.9/10"},
            {s:"SKILLS",c:"Python, React.js, SQL, AWS, Git, Docker, REST APIs, Agile"},
            {s:"PROJECTS",c:"1. Student Management System — React + Firebase\n2. ML Crop Disease Detection — Python, TensorFlow"}].map(({s,c})=><div key={s} style={{marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:900,color:C.teal,borderBottom:`1px solid ${C.border}`,paddingBottom:2,marginBottom:4,letterSpacing:"1px"}}>{s}</div>
            <div style={{fontSize:10,color:C.text,whiteSpace:"pre-line",lineHeight:1.5}}>{c}</div>
          </div>)}
        </div>
      </div>
    </div>}
  </div>;
}

// ─── AI CENTER ─────────────────────────────────────────────────
function AICenter({C}){
  const [tab,setTab]=useState("doubt");
  const [chat,setChat]=useState([{role:"assistant",content:"Hello! I'm your AI study assistant powered by AlimsAhib AI. Ask me anything — Math, Science, Programming, or any subject! 🎓"}]);
  const [input,setInput]=useState("");
  const [career,setCareer]=useState([{role:"assistant",content:"Hi! I'm your AI Career Counselor. Tell me about your skills, interests, and goals — I'll guide you toward the best career path! 🚀"}]);
  const [ci,setCi]=useState("");
  const sendMsg=()=>{if(!input.trim())return;setChat(p=>[...p,{role:"user",content:input},{role:"assistant",content:`Great question about "${input}"!\n\nHere's a detailed explanation:\n\n1. **Core Concept**: This is a fundamental topic in computer science\n2. **Key Principles**: Understanding the basics helps build strong foundations\n3. **Practical Application**: You can apply this in real projects\n4. **Practice Problems**: Try implementing a simple example to solidify understanding\n\nWould you like me to explain any specific aspect in more detail? 🎓`}]);setInput("");};
  const sendCareer=()=>{if(!ci.trim())return;setCareer(p=>[...p,{role:"user",content:ci},{role:"assistant",content:`Based on your profile, here are my personalized recommendations:\n\n🎯 **Top Career Paths:**\n1. Software Engineer (High demand, ₹8-25 LPA)\n2. Data Scientist (Growing field, ₹10-30 LPA)\n3. Cloud Architect (Niche, ₹15-40 LPA)\n\n📚 **Skills to Build:**\n• AWS/GCP Certification\n• Machine Learning fundamentals\n• System Design concepts\n\n💡 **Next Steps:**\n1. Build GitHub portfolio\n2. Apply for product company internships\n3. Practice DSA on LeetCode (target 200+ problems)`}]);setCi("");};
  return <div style={{padding:22,overflowY:"auto",height:"calc(100vh-58px)"}}>
    <PH title="AI Center" subtitle="AI-powered learning · career guidance · doubt assistant · integrated with ai.alimsahib.in" C={C}/>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      {[{id:"doubt",icon:"🤔",label:"AI Doubt Assistant"},{id:"career",icon:"🚀",label:"AI Career Guidance"},{id:"embedded",icon:"🌐",label:"AlimsAhib AI Platform"}].map(m=><button key={m.id} onClick={()=>setTab(m.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 16px",borderRadius:9,border:`1px solid ${tab===m.id?C.teal:C.border}`,background:tab===m.id?C.teal:C.surface,color:tab===m.id?"#fff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}><span>{m.icon}</span>{m.label}</button>)}
    </div>
    {tab==="doubt"&&<div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:14,height:"calc(100vh-230px)"}}>
      <div style={{background:C.card,borderRadius:14,padding:14,border:`1px solid ${C.border}`,overflowY:"auto"}}>
        <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:10}}>📚 Quick Topics</div>
        {[["Math",["Algebra","Calculus","Statistics","Matrices"]],["CS",["Data Structures","Algorithms","OS","DBMS"]],["Programming",["Python","Java","C++","React","SQL"]],["Physics",["Mechanics","Optics","Thermodynamics"]]].map(([subj,topics])=><div key={subj} style={{marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:700,color:C.teal,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.5px"}}>{subj}</div>
          {topics.map(t=><button key={t} onClick={()=>setInput("Explain "+t+" with examples and practice problems")} style={{display:"block",width:"100%",textAlign:"left",padding:"5px 8px",borderRadius:6,border:"none",background:"transparent",color:C.muted,cursor:"pointer",fontSize:11,marginBottom:1}}>{t}</button>)}
        </div>)}
      </div>
      <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${C.border}`,background:C.tealL,display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:34,height:34,background:C.teal,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🤖</div>
          <div><div style={{fontSize:12,fontWeight:700,color:C.text}}>AlimsAhib Doubt AI</div><div style={{fontSize:10,color:C.teal}}>Powered by ai.alimsahib.in · Online</div></div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:11}}>
          {chat.map((msg,i)=><div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",gap:7}}>
            {msg.role==="assistant"&&<div style={{width:26,height:26,background:C.teal,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>🤖</div>}
            <div style={{maxWidth:"75%",padding:"9px 12px",borderRadius:msg.role==="user"?"12px 12px 0 12px":"12px 12px 12px 0",background:msg.role==="user"?C.teal:C.bg,color:msg.role==="user"?"#fff":C.text,fontSize:12,lineHeight:1.6,border:msg.role==="assistant"?`1px solid ${C.border}`:"none",whiteSpace:"pre-line"}}>{msg.content}</div>
          </div>)}
        </div>
        <div style={{padding:"11px 14px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Ask any doubt — Math, Science, Programming..." style={{flex:1,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 12px",fontSize:12,color:C.text,outline:"none"}}/>
          <button onClick={sendMsg} style={{background:C.teal,color:"#fff",border:"none",borderRadius:9,padding:"9px 16px",cursor:"pointer",fontSize:12,fontWeight:700}}>Send ↗</button>
        </div>
      </div>
    </div>}
    {tab==="career"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,height:"calc(100vh-230px)"}}>
      <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${C.border}`,background:C.purpleL,display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:34,height:34,background:C.purple,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🚀</div>
          <div><div style={{fontSize:12,fontWeight:700,color:C.text}}>AI Career Counselor</div><div style={{fontSize:10,color:C.purple}}>Personalized guidance · Online</div></div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:11}}>
          {career.map((msg,i)=><div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",gap:7}}>
            {msg.role==="assistant"&&<div style={{width:26,height:26,background:C.purple,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>🚀</div>}
            <div style={{maxWidth:"80%",padding:"9px 12px",borderRadius:msg.role==="user"?"12px 12px 0 12px":"12px 12px 12px 0",background:msg.role==="user"?C.purple:C.bg,color:msg.role==="user"?"#fff":C.text,fontSize:12,lineHeight:1.6,border:msg.role==="assistant"?`1px solid ${C.border}`:"none",whiteSpace:"pre-line"}}>{msg.content}</div>
          </div>)}
        </div>
        <div style={{padding:"11px 14px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}>
          <input value={ci} onChange={e=>setCi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendCareer()} placeholder="Tell me your skills, interests and goals..." style={{flex:1,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 12px",fontSize:12,color:C.text,outline:"none"}}/>
          <button onClick={sendCareer} style={{background:C.purple,color:"#fff",border:"none",borderRadius:9,padding:"9px 16px",cursor:"pointer",fontSize:12,fontWeight:700}}>Ask ↗</button>
        </div>
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,overflowY:"auto"}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>🗺️ Career Roadmaps</div>
        {[{title:"Full Stack Developer",icon:"💻",demand:"Very High",pkg:"₹8-25 LPA",time:"6 months"},{title:"Data Scientist",icon:"📊",demand:"High",pkg:"₹10-30 LPA",time:"9 months"},{title:"Cloud Engineer",icon:"☁️",demand:"Very High",pkg:"₹12-35 LPA",time:"6 months"},{title:"UI/UX Designer",icon:"🎨",demand:"Medium",pkg:"₹6-18 LPA",time:"4 months"},{title:"Cybersecurity",icon:"🔒",demand:"High",pkg:"₹8-28 LPA",time:"8 months"}].map(c=><div key={c.title} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10,padding:"10px 12px",background:C.bg,borderRadius:10,border:`1px solid ${C.border}`,cursor:"pointer"}}>
          <span style={{fontSize:26}}>{c.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:700,color:C.text}}>{c.title}</div>
            <div style={{display:"flex",gap:9,marginTop:3}}>
              <span style={{fontSize:10,color:C.green,fontWeight:600}}>{c.pkg}</span>
              <span style={{fontSize:10,color:C.muted}}>Demand: {c.demand}</span>
              <span style={{fontSize:10,color:C.blue}}>⏱ {c.time}</span>
            </div>
          </div>
          <button style={{background:C.teal,color:"#fff",border:"none",borderRadius:7,padding:"5px 11px",fontSize:10,cursor:"pointer",fontWeight:600}}>Explore</button>
        </div>)}
      </div>
    </div>}
    {tab==="embedded"&&<div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden",height:"calc(100vh-230px)"}}>
      <div style={{padding:"9px 14px",background:C.tealL,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:C.green}}/>
        <span style={{fontSize:11,color:C.teal,fontWeight:600}}>🌐 ai.alimsahib.in — AllBee Computer Skills AI Platform · Integrated</span>
        <a href={AI_URL} target="_blank" rel="noopener noreferrer" style={{marginLeft:"auto",fontSize:10,color:C.teal,fontWeight:600,textDecoration:"none"}}>Open in new tab ↗</a>
      </div>
      <iframe src={AI_URL} style={{width:"100%",height:"calc(100% - 38px)",border:"none"}} title="AlimsAhib AI Platform" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"/>
    </div>}
  </div>;
}

// ─── HR & PAYROLL ──────────────────────────────────────────────
function HRModule({C}){
  const [tab,setTab]=useState("staff");
  const [showPayslip,setShowPayslip]=useState(null);
  const [leaves,setLeaves]=useState([
    {id:"l1",staff:"Dr. Ramesh Kumar",type:"Medical Leave",from:"2025-01-28",to:"2025-01-30",days:3,reason:"Knee surgery recovery",status:"Pending"},
    {id:"l2",staff:"Mrs. Priya Devi",type:"Casual Leave",from:"2025-01-25",to:"2025-01-25",days:1,reason:"Personal work",status:"Approved"},
    {id:"l3",staff:"Mr. Suresh Babu",type:"Earned Leave",from:"2025-02-05",to:"2025-02-07",days:3,reason:"Family function",status:"Pending"},
    {id:"l4",staff:"Ms. Kavitha R",type:"Sick Leave",from:"2025-01-22",to:"2025-01-22",days:1,reason:"Fever",status:"Approved"},
  ]);
  const approveLeave=(id,status)=>setLeaves(p=>p.map(l=>l.id===id?{...l,status}:l));
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="HR & Payroll" subtitle="Staff management · Payroll slips · Leave workflow · Performance" C={C} action={<Btn color="teal" C={C}>+ Add Staff</Btn>}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
      <StatCard icon="👥" label="Total Staff" value="124" trend={5} color="teal" C={C}/>
      <StatCard icon="💰" label="Monthly Payroll" value="₹42L" trend={3} color="green" C={C}/>
      <StatCard icon="🏖️" label="Pending Leaves" value={leaves.filter(l=>l.status==="Pending").length} color="gold" C={C}/>
      <StatCard icon="📊" label="Avg Performance" value="87%" trend={4} color="blue" C={C}/>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      {[{id:"staff",label:"👥 Staff List"},{id:"payroll",label:"💰 Payroll"},{id:"leaves",label:"🏖️ Leave Management"},{id:"performance",label:"📊 Performance"}].map(m=><button key={m.id} onClick={()=>setTab(m.id)} style={{padding:"7px 14px",borderRadius:9,border:`1px solid ${tab===m.id?C.teal:C.border}`,background:tab===m.id?C.teal:C.surface,color:tab===m.id?"#fff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>{m.label}</button>)}
    </div>
    {(tab==="staff"||tab==="payroll")&&<div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,boxShadow:C.shadowM,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead style={{background:C.bg}}><tr>{["Staff","Role","Dept","Salary","Attendance","Status","Actions"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>{MOCK_STAFF.map(s=>{
          const gross=s.salary;const basic=Math.round(gross*0.5);const hra=Math.round(gross*0.2);const pf=Math.round(basic*0.12);const pt=200;const net=gross-pf-pt;
          return <tr key={s.id} style={{borderTop:`1px solid ${C.border}`}}>
            <td style={{padding:"11px 12px"}}><div style={{display:"flex",alignItems:"center",gap:9}}><Av name={s.name} size={30} C={C}/><div><div style={{fontSize:12,fontWeight:600,color:C.text}}>{s.name}</div><div style={{fontSize:10,color:C.muted}}>{s.email}</div></div></div></td>
            <td style={{padding:"11px 12px",fontSize:12,color:C.text}}>{s.role}</td>
            <td style={{padding:"11px 12px"}}><Chip color="teal" C={C}>{s.dept}</Chip></td>
            <td style={{padding:"11px 12px"}}><div style={{fontSize:13,fontWeight:700,color:C.green}}>₹{fmt(gross)}</div>{tab==="payroll"&&<div style={{fontSize:9,color:C.muted}}>Net: ₹{fmt(net)}</div>}</td>
            <td style={{padding:"11px 12px"}}><span style={{fontSize:12,fontWeight:700,color:s.attendance>=95?C.green:s.attendance>=85?C.gold:C.red}}>{s.attendance}%</span></td>
            <td style={{padding:"11px 12px"}}><SBadge status={s.status} C={C}/></td>
            <td style={{padding:"11px 12px"}}><div style={{display:"flex",gap:5}}>
              <button style={{background:C.tealL,color:C.teal,border:"none",borderRadius:6,padding:"4px 9px",fontSize:10,cursor:"pointer",fontWeight:600}}>Profile</button>
              <button onClick={()=>setShowPayslip({...s,gross,basic,hra,pf,pt,net})} style={{background:C.blueL,color:C.blue,border:"none",borderRadius:6,padding:"4px 9px",fontSize:10,cursor:"pointer",fontWeight:600}}>💰 Payslip</button>
            </div></td>
          </tr>;
        })}</tbody>
      </table>
    </div>}
    {tab==="leaves"&&<div>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        {[["Pending",leaves.filter(l=>l.status==="Pending").length,"gold"],["Approved",leaves.filter(l=>l.status==="Approved").length,"green"],["Rejected",leaves.filter(l=>l.status==="Rejected").length,"red"]].map(([lb,v,col])=><div key={lb} style={{background:C[col+"L"],borderRadius:9,padding:"11px 18px",border:`1px solid ${C[col]}33`}}>
          <div style={{fontSize:22,fontWeight:900,color:C[col]}}>{v}</div><div style={{fontSize:10,color:C.muted}}>{lb}</div>
        </div>)}
      </div>
      <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,boxShadow:C.shadowM,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead style={{background:C.bg}}><tr>{["Staff","Type","Duration","Reason","Status","Actions"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{leaves.map(l=><tr key={l.id} style={{borderTop:`1px solid ${C.border}`}}>
            <td style={{padding:"11px 12px",fontSize:12,fontWeight:600,color:C.text}}>{l.staff}</td>
            <td style={{padding:"11px 12px"}}><Chip color="teal" C={C}>{l.type}</Chip></td>
            <td style={{padding:"11px 12px"}}><div style={{fontSize:11,color:C.text}}>{dateStr(l.from)}{l.to!==l.from?` → ${dateStr(l.to)}`:""}</div><div style={{fontSize:10,color:C.muted}}>{l.days} day{l.days>1?"s":""}</div></td>
            <td style={{padding:"11px 12px",fontSize:11,color:C.muted,maxWidth:180}}>{l.reason}</td>
            <td style={{padding:"11px 12px"}}><SBadge status={l.status} C={C}/></td>
            <td style={{padding:"11px 12px"}}>{l.status==="Pending"?<div style={{display:"flex",gap:5}}>
              <button onClick={()=>approveLeave(l.id,"Approved")} style={{background:C.green,color:"#fff",border:"none",borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer",fontWeight:700}}>✅ Approve</button>
              <button onClick={()=>approveLeave(l.id,"Rejected")} style={{background:C.red,color:"#fff",border:"none",borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer",fontWeight:700}}>❌ Reject</button>
            </div>:<button style={{background:C.bg,color:C.muted,border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer"}}>View</button>}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>}
    {tab==="performance"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📊 Staff Performance Radar</div>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={MOCK_STAFF.slice(0,5).map(s=>({name:s.name.split(" ")[1]||s.name,att:s.attendance,score:88+Math.floor(Math.random()*10),teach:85+Math.floor(Math.random()*12)}))}><PolarGrid stroke={C.border}/><PolarAngleAxis dataKey="name" tick={{fill:C.muted,fontSize:9}}/>
            <Radar name="Attendance" dataKey="att" stroke={C.teal} fill={C.teal} fillOpacity={0.2}/>
            <Radar name="Score" dataKey="score" stroke={C.blue} fill={C.blue} fillOpacity={0.2}/>
            <Legend/><Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:10}}/>
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM,overflowY:"auto",maxHeight:350}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:12}}>🏆 Performance Rankings</div>
        {MOCK_STAFF.map((s,i)=><div key={s.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9,padding:"9px 10px",background:C.bg,borderRadius:9,border:`1px solid ${C.border}`}}>
          <div style={{width:26,height:26,borderRadius:"50%",background:i===0?C.gold:i===1?C.muted:i===2?C.orange:C.tealL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:i<3?"#fff":C.teal,flexShrink:0}}>{i+1}</div>
          <Av name={s.name} size={28} C={C}/>
          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:C.text}}>{s.name}</div><div style={{fontSize:9,color:C.muted}}>{s.dept}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:700,color:C.teal}}>{87+i}%</div><div style={{fontSize:9,color:C.muted}}>score</div></div>
        </div>)}
      </div>
    </div>}
    {showPayslip&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowPayslip(null)}>
      <div style={{background:C.surface,borderRadius:16,padding:30,maxWidth:460,width:"100%",border:`1px solid ${C.border}`,boxShadow:C.shadowL}} onClick={e=>e.stopPropagation()}>
        <div style={{textAlign:"center",marginBottom:20,borderBottom:`1px dashed ${C.border}`,paddingBottom:16}}>
          <div style={{fontSize:24,marginBottom:4}}>🏫</div>
          <div style={{fontWeight:900,fontSize:15,color:C.text}}>Bright Future College</div>
          <div style={{fontSize:11,color:C.muted}}>Salary Slip — January 2025</div>
        </div>
        <div style={{display:"flex",gap:12,marginBottom:16}}>
          <Av name={showPayslip.name} size={40} C={C}/>
          <div><div style={{fontWeight:700,fontSize:14,color:C.text}}>{showPayslip.name}</div><div style={{fontSize:11,color:C.muted}}>{showPayslip.role} · {showPayslip.dept}</div></div>
        </div>
        <div style={{background:C.bg,borderRadius:10,padding:14,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:8}}>💰 Earnings</div>
          {[["Basic Salary",showPayslip.basic],["HRA (House Rent)",showPayslip.hra],["DA (Dearness Allowance)",Math.round(showPayslip.basic*0.17)],["TA (Travel Allowance)",1500],["Special Allowance",showPayslip.gross-showPayslip.basic-showPayslip.hra-Math.round(showPayslip.basic*0.17)-1500]].map(([lb,v])=><div key={lb} style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:5}}><span style={{color:C.muted}}>{lb}</span><span style={{color:C.text,fontWeight:600}}>₹{fmt(v)}</span></div>)}
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:6,display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:13}}><span style={{color:C.text}}>Gross Salary</span><span style={{color:C.green}}>₹{fmt(showPayslip.gross)}</span></div>
        </div>
        <div style={{background:C.redL,borderRadius:10,padding:14,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:12,color:C.red,marginBottom:8}}>🔻 Deductions</div>
          {[["PF (Provident Fund)",showPayslip.pf],["Professional Tax",showPayslip.pt],["ESI",0],["Income Tax TDS",0]].map(([lb,v])=><div key={lb} style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:5}}><span style={{color:C.muted}}>{lb}</span><span style={{color:C.red,fontWeight:600}}>₹{fmt(v)}</span></div>)}
          <div style={{borderTop:`1px solid ${C.red}44`,paddingTop:6,display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:12}}><span style={{color:C.text}}>Total Deductions</span><span style={{color:C.red}}>₹{fmt(showPayslip.pf+showPayslip.pt)}</span></div>
        </div>
        <div style={{background:C.tealL,borderRadius:10,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontWeight:900,fontSize:14,color:C.text}}>NET SALARY</span>
          <span style={{fontWeight:900,fontSize:20,color:C.teal}}>₹{fmt(showPayslip.net)}</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,background:C.teal,color:"#fff",border:"none",borderRadius:9,padding:"10px 0",fontSize:12,cursor:"pointer",fontWeight:700}}>📥 Download PDF</button>
          <button style={{flex:1,background:C.greenL,color:C.green,border:"none",borderRadius:9,padding:"10px 0",fontSize:12,cursor:"pointer",fontWeight:700}}>💬 Send via WA</button>
        </div>
        
        <button onClick={()=>setShowPayslip(null)} style={{position:"absolute",top:12,right:14,background:"none",border:"none",cursor:"pointer",fontSize:18,color:C.muted,zIndex:10}}>✕</button>
      </div>
    </div>}
  </div>;
}

// ─── ANALYTICS ─────────────────────────────────────────────────
function AnalyticsModule({C}){
  const [db,setDb]=useState("revenue");
  const DBS=[{id:"revenue",icon:"💰",label:"Revenue"},{id:"admissions",icon:"🎯",label:"Admissions"},{id:"students",icon:"📈",label:"Student Growth"},{id:"fees",icon:"💳",label:"Fee Collection"},{id:"placement",icon:"💼",label:"Placement"},{id:"trainer",icon:"👩‍🏫",label:"Trainer Perf."},{id:"branch",icon:"🏢",label:"Branch Perf."}];
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Analytics" subtitle="7 comprehensive dashboards · Real-time insights" C={C}/>
    <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
      {DBS.map(d=><button key={d.id} onClick={()=>setDb(d.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 14px",borderRadius:20,border:`1px solid ${db===d.id?C.teal:C.border}`,background:db===d.id?C.teal:C.surface,color:db===d.id?"#fff":C.muted,fontSize:11,fontWeight:600,cursor:"pointer"}}><span>{d.icon}</span>{d.label}</button>)}
    </div>
    {db==="revenue"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
        <StatCard icon="💰" label="Total Revenue (YTD)" value="₹3.28 Cr" trend={18} color="teal" C={C}/>
        <StatCard icon="📈" label="Revenue Growth" value="18.4%" trend={3} color="green" C={C}/>
        <StatCard icon="🎯" label="Target Achievement" value="96.2%" trend={2} color="blue" C={C}/>
        <StatCard icon="💎" label="Revenue/Student" value="₹85,000" trend={5} color="gold" C={C}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
        <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
          <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📈 Monthly Revenue vs Target</div>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={REV_DATA}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="month" tick={{fill:C.muted,fontSize:10}}/><YAxis tick={{fill:C.muted,fontSize:10}} tickFormatter={v=>(v/100000).toFixed(0)+"L"}/>
              <Tooltip formatter={v=>["₹"+(v/100000).toFixed(1)+"L"]} contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
              <Bar dataKey="revenue" fill={C.teal} radius={[4,4,0,0]} name="Revenue"/>
              <Line type="monotone" dataKey="target" stroke={C.red} strokeWidth={2} strokeDasharray="5 5" name="Target" dot={false}/>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
          <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📦 Revenue by Source</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={[{name:"Tuition",value:72},{name:"Hostel",value:14},{name:"Transport",value:8},{name:"Exams",value:4},{name:"Other",value:2}]} dataKey="value" cx="50%" cy="50%" outerRadius={68} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
              {[C.teal,C.blue,C.purple,C.gold,C.orange].map((c,i)=><Cell key={i} fill={c}/>)}
            </Pie><Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>}
    {db==="branch"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
        {MOCK_BRANCHES.map(b=><div key={b.id} style={{background:C.card,borderRadius:13,padding:16,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
          <div style={{fontWeight:900,fontSize:14,color:C.text,marginBottom:3}}>{b.name}</div>
          <div style={{fontSize:11,color:C.muted,marginBottom:12}}>📍 {b.location}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            {[["Students",fmt(b.students),"teal"],["Staff",b.staff,"blue"],["Revenue",fmtBig(b.revenue),"green"],["Est.",b.established,"muted"]].map(([lb,v,col])=><div key={lb} style={{background:C.bg,borderRadius:8,padding:"7px 9px"}}>
              <div style={{fontSize:14,fontWeight:700,color:C[col]||C.text}}>{v}</div>
              <div style={{fontSize:9,color:C.muted}}>{lb}</div>
            </div>)}
          </div>
        </div>)}
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📊 Department Performance Radar</div>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={DEPT_PERF}><PolarGrid stroke={C.border}/><PolarAngleAxis dataKey="dept" tick={{fill:C.muted,fontSize:11}}/>
            <Radar name="Strength" dataKey="strength" stroke={C.teal} fill={C.teal} fillOpacity={0.2}/>
            <Radar name="Satisfaction" dataKey="satisfaction" stroke={C.blue} fill={C.blue} fillOpacity={0.2}/>
            <Radar name="Placement" dataKey="placement" stroke={C.green} fill={C.green} fillOpacity={0.2}/>
            <Legend/><Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>}
    {(db==="fees"||db==="placement"||db==="admissions"||db==="students"||db==="trainer")&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>
          {db==="fees"?"💰 Fee Collection":db==="placement"?"💼 Placement Trend":db==="admissions"?"🎯 Admission Funnel":db==="students"?"📈 Student Growth":"👩‍🏫 Trainer Performance"}
        </div>
        <ResponsiveContainer width="100%" height={240}>
          {db==="fees"?<AreaChart data={FEE_COLL}><defs><linearGradient id="fc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.teal} stopOpacity={0.3}/><stop offset="95%" stopColor={C.teal} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="month" tick={{fill:C.muted,fontSize:10}}/><YAxis tick={{fill:C.muted,fontSize:10}} tickFormatter={v=>(v/100000).toFixed(0)+"L"}/>
            <Tooltip formatter={v=>["₹"+(v/100000).toFixed(1)+"L"]} contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
            <Area type="monotone" dataKey="collected" stroke={C.teal} fill="url(#fc)" strokeWidth={2} name="Collected"/>
          </AreaChart>:
          db==="placement"?<ComposedChart data={PLACE_DATA}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="year" tick={{fill:C.muted,fontSize:10}}/><YAxis yAxisId="l" tick={{fill:C.muted,fontSize:10}}/><YAxis yAxisId="r" orientation="right" tick={{fill:C.muted,fontSize:10}}/>
            <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
            <Bar yAxisId="l" dataKey="placed" fill={C.teal} radius={[4,4,0,0]} name="Placed"/><Line yAxisId="r" type="monotone" dataKey="pkg" stroke={C.gold} strokeWidth={2} name="Avg Pkg" dot={{fill:C.gold,r:4}}/>
          </ComposedChart>:
          db==="admissions"?<BarChart data={FUNNEL} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis type="number" tick={{fill:C.muted,fontSize:10}}/><YAxis type="category" dataKey="stage" tick={{fill:C.muted,fontSize:10}} width="100"/>
            <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
            <Bar dataKey="count" fill={C.teal} radius={[0,4,4,0]}/>
          </BarChart>:
          <BarChart data={MOCK_STAFF.slice(0,5).map(s=>({name:s.name.split(" ")[1]||s.name,att:s.attendance,score:88+Math.floor(Math.random()*10)}))}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="name" tick={{fill:C.muted,fontSize:9}}/><YAxis tick={{fill:C.muted,fontSize:9}}/><Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/><Bar dataKey="att" fill={C.teal} name="Attendance%"/><Bar dataKey="score" fill={C.blue} name="Performance"/></BarChart>}
        </ResponsiveContainer>
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>💡 Key Insights</div>
        {[["🎯","Conversion rate improved to 18.9%",C.teal],["📈","Website leads up 23% this month",C.green],["⚠️","34 leads need follow-up today",C.gold],["💡","AI recommendation: Focus on social media leads",C.blue]].map(([ic,text,col],i)=><div key={i} style={{display:"flex",gap:10,padding:"10px 12px",background:C.bg,borderRadius:9,border:`1px solid ${col}33`,marginBottom:9}}>
          <span style={{fontSize:16,flexShrink:0}}>{ic}</span>
          <span style={{fontSize:12,color:C.text,lineHeight:1.5}}>{text}</span>
        </div>)}
      </div>
    </div>}
  </div>;
}

// ─── CERTIFICATE GENERATOR ─────────────────────────────────────
function CertificateModule({C}){
  const [student,setStudent]=useState(MOCK_STUDENTS[0]);
  const [certType,setCertType]=useState("completion");
  const CTYPES=[{id:"completion",label:"Course Completion",icon:"🎓"},{id:"merit",label:"Merit/Excellence",icon:"🏆"},{id:"participation",label:"Participation",icon:"🏅"},{id:"internship",label:"Internship",icon:"💼"},{id:"placement",label:"Placement",icon:"🤝"}];
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Certificate Generator" subtitle="QR-verified certificates · Multiple templates · Bulk generation" C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      <div>
        <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📋 Certificate Details</div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,fontWeight:600,color:C.muted,display:"block",marginBottom:5}}>Certificate Type</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
              {CTYPES.map(ct=><button key={ct.id} onClick={()=>setCertType(ct.id)} style={{padding:"8px 10px",borderRadius:8,border:`1px solid ${certType===ct.id?C.teal:C.border}`,background:certType===ct.id?C.tealL:C.bg,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:600,color:certType===ct.id?C.teal:C.muted}}><span>{ct.icon}</span>{ct.label}</button>)}
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:11,fontWeight:600,color:C.muted,display:"block",marginBottom:5}}>Student</label>
            <Sel value={student.id} onChange={e=>setStudent(MOCK_STUDENTS.find(s=>s.id===e.target.value)||MOCK_STUDENTS[0])} C={C} style={{width:"100%"}}>{MOCK_STUDENTS.map(s=><option key={s.id} value={s.id}>{s.name} · {s.rollNo}</option>)}</Sel>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,fontWeight:600,color:C.muted,display:"block",marginBottom:5}}>Course Completed</label>
            <Inp value={student.course} onChange={()=>{}} C={C}/>
          </div>
          <button style={{width:"100%",background:C.teal,color:"#fff",border:"none",borderRadius:10,padding:"11px 0",fontSize:13,cursor:"pointer",fontWeight:700}}>🎖️ Generate Certificate</button>
        </div>
        <div style={{background:C.card,borderRadius:14,padding:16,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
          <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:10}}>🔍 QR Verification</div>
          <div style={{background:C.greenL,borderRadius:9,padding:"10px 12px",display:"flex",gap:9}}>
            <span style={{fontSize:18}}>✅</span>
            <div><div style={{fontSize:12,fontWeight:700,color:C.green}}>Blockchain-Verified</div><div style={{fontSize:10,color:C.muted}}>Tamper-proof & globally verifiable</div></div>
          </div>
        </div>
      </div>
      <div style={{background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",borderRadius:16,padding:26,border:`2px solid ${C.teal}`,boxShadow:"0 8px 32px rgba(0,212,180,0.2)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:8,left:8,right:8,bottom:8,border:"2px solid rgba(255,255,255,0.1)",borderRadius:10}}/>
        <div style={{position:"relative",textAlign:"center"}}>
          <div style={{fontSize:30,marginBottom:6}}>{CTYPES.find(c=>c.id===certType)?.icon||"🎖️"}</div>
          <div style={{fontSize:10,letterSpacing:"3px",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",marginBottom:6}}>AllBee EduSphere · Bright Future College</div>
          <div style={{fontSize:13,color:"#ffd700",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:6}}>Certificate of {certType==="completion"?"Completion":certType==="merit"?"Excellence":certType==="participation"?"Participation":certType==="internship"?"Internship":"Placement"}</div>
          <div style={{width:50,height:2,background:"#ffd700",margin:"8px auto 12px"}}/>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",marginBottom:4}}>This is to certify that</div>
          <div style={{fontSize:20,fontWeight:900,color:"#fff",fontFamily:"Georgia,serif",marginBottom:4}}>{student.name}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:10}}>{student.rollNo}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginBottom:4}}>has successfully completed</div>
          <div style={{fontSize:14,fontWeight:700,color:"#4fc3f7",marginBottom:10}}>{student.course}</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",marginBottom:18}}>with distinction | Academic Year 2024-25</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div style={{textAlign:"center"}}><div style={{width:50,height:1,background:"rgba(255,255,255,0.4)",marginBottom:3}}/><div style={{fontSize:8,color:"rgba(255,255,255,0.4)"}}>Principal</div></div>
            <div style={{width:36,height:36,background:"rgba(255,255,255,0.1)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:"rgba(255,255,255,0.4)",fontFamily:"monospace"}}>QR</div>
            <div style={{textAlign:"center"}}><div style={{width:50,height:1,background:"rgba(255,255,255,0.4)",marginBottom:3}}/><div style={{fontSize:8,color:"rgba(255,255,255,0.4)"}}>HOD</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

// ─── ALUMNI ────────────────────────────────────────────────────
function AlumniModule({C}){
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Alumni Management" subtitle="Stay connected · Success stories · Mentorship" C={C} action={<Btn color="teal" C={C}>+ Add Alumni</Btn>}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
      <StatCard icon="🤝" label="Total Alumni" value="4,280" trend={12} color="teal" C={C}/>
      <StatCard icon="💼" label="Employed" value="3,847" sub="89.9%" trend={3} color="green" C={C}/>
      <StatCard icon="🎓" label="Higher Studies" value="312" trend={8} color="blue" C={C}/>
      <StatCard icon="🚀" label="Entrepreneurs" value="89" trend={20} color="purple" C={C}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
      {MOCK_ALUMNI.map(a=><div key={a.id} style={{background:C.card,borderRadius:13,padding:16,border:`1px solid ${C.border}`,boxShadow:C.shadow,display:"flex",gap:14,alignItems:"flex-start"}}>
        <Av name={a.name} size={44} C={C}/>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text}}>{a.name}</div>
          <div style={{fontSize:13,fontWeight:600,color:C.teal,marginBottom:4}}>{a.role} @ {a.company}</div>
          <div style={{display:"flex",gap:10,fontSize:11,color:C.muted,marginBottom:8}}>
            <span>📅 {a.batch}</span><span>📍 {a.location}</span><span style={{color:C.green,fontWeight:700}}>💰 {a.package}</span>
          </div>
          <div style={{display:"flex",gap:6}}>
            {a.contact&&<button style={{background:C.tealL,color:C.teal,border:"none",borderRadius:7,padding:"5px 10px",fontSize:10,cursor:"pointer",fontWeight:600}}>💬 Connect</button>}
            <button style={{background:C.blueL,color:C.blue,border:"none",borderRadius:7,padding:"5px 10px",fontSize:10,cursor:"pointer",fontWeight:600}}>👤 Profile</button>
          </div>
        </div>
      </div>)}
    </div>
  </div>;
}

// ─── DOCUMENTS ────────────────────────────────────────────────
function DocumentsModule({C}){
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Document Management" subtitle="Student documents · Verification · Bulk upload · Templates" C={C} action={<Btn color="teal" C={C}>+ Upload Documents</Btn>}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
      <StatCard icon="📁" label="Total Documents" value="12,847" trend={8} color="teal" C={C}/>
      <StatCard icon="✅" label="Verified" value="10,234" sub="79.7%" trend={5} color="green" C={C}/>
      <StatCard icon="⏳" label="Pending" value="2,613" trend={-3} color="gold" C={C}/>
      <StatCard icon="❌" label="Rejected" value="124" trend={-8} color="red" C={C}/>
    </div>
    <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
      <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📋 Recent Documents</div>
      {[["Priya Sharma","Aadhar Card","2025-01-15","✅ Verified","1.2 MB"],["Arjun Patel","10th Marksheet","2025-01-14","⏳ Pending","0.8 MB"],["Sneha Reddy","12th Marksheet","2025-01-13","✅ Verified","0.9 MB"],["Rahul Kumar","Transfer Certificate","2025-01-12","⏳ Pending","0.6 MB"],["Meera Krishnan","Community Certificate","2025-01-11","✅ Verified","0.7 MB"]].map(([name,doc,date,status,size])=><div key={name+doc} style={{display:"flex",alignItems:"center",gap:12,marginBottom:9,padding:"10px 12px",background:C.bg,borderRadius:9,border:`1px solid ${C.border}`}}>
        <span style={{fontSize:22}}>📄</span>
        <div style={{flex:1}}>
          <div style={{fontSize:12,fontWeight:700,color:C.text}}>{doc}</div>
          <div style={{fontSize:10,color:C.muted}}>{name} · {size} · {date}</div>
        </div>
        <span style={{fontSize:11,color:status.includes("✅")?C.green:C.gold,fontWeight:600}}>{status}</span>
        <button style={{background:C.tealL,color:C.teal,border:"none",borderRadius:6,padding:"4px 9px",fontSize:10,cursor:"pointer",fontWeight:600}}>Download</button>
      </div>)}
    </div>
  </div>;
}

// ─── BRANCHES ─────────────────────────────────────────────────
function BranchesModule({C}){
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Multi-Branch Management" subtitle="Manage all branches from one dashboard" C={C} action={<Btn color="teal" C={C}>+ Add Branch</Btn>}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
      {MOCK_BRANCHES.map(b=><div key={b.id} style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div><div style={{fontWeight:900,fontSize:15,color:C.text}}>{b.name}</div><div style={{fontSize:11,color:C.muted}}>📍 {b.location}</div></div>
          <SBadge status={b.status} C={C}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          {[["Students",fmt(b.students),"teal"],["Staff",b.staff,"blue"],["Revenue",fmtBig(b.revenue),"green"],["Est.",b.established,"muted"]].map(([lb,v,col])=><div key={lb} style={{background:C.bg,borderRadius:8,padding:"8px 10px"}}>
            <div style={{fontSize:15,fontWeight:900,color:C[col]||C.text}}>{v}</div>
            <div style={{fontSize:9,color:C.muted}}>{lb}</div>
          </div>)}
        </div>
        <div style={{display:"flex",gap:6}}>
          <button style={{flex:1,background:C.teal,color:"#fff",border:"none",borderRadius:8,padding:"8px 0",fontSize:11,cursor:"pointer",fontWeight:600}}>📊 Dashboard</button>
          <button style={{background:C.bg,color:C.muted,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",fontSize:11,cursor:"pointer"}}>⚙️</button>
        </div>
      </div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>💰 Revenue by Branch</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={MOCK_BRANCHES.map(b=>({name:b.name.replace(" Campus","").replace(" Center",""),revenue:b.revenue/100000}))}><CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="name" tick={{fill:C.muted,fontSize:10}}/><YAxis tick={{fill:C.muted,fontSize:10}} tickFormatter={v=>v+"L"}/>
            <Tooltip formatter={v=>["₹"+v+"L","Revenue"]} contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
            <Bar dataKey="revenue" fill={C.teal} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>🎓 Students by Branch</div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart><Pie data={MOCK_BRANCHES.map(b=>({name:b.name.replace(" Campus","").replace(" Center",""),value:b.students}))} dataKey="value" cx="50%" cy="50%" outerRadius={70} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
            {[C.teal,C.blue,C.purple].map((c,i)=><Cell key={i} fill={c}/>)}
          </Pie><Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/></PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>;
}

// ─── BILLING (Super Admin) ─────────────────────────────────────
function BillingModule({C}){
  const PLANS=[{name:"Starter",price:2999,features:["Up to 200 students","2 staff accounts","Basic reports","Email support"],color:"teal"},{name:"Standard",price:5999,features:["Up to 500 students","5 staff accounts","Analytics","Priority support","WhatsApp"],color:"blue"},{name:"Professional",price:11999,features:["Up to 2000 students","20 staff","Advanced analytics","Placement portal","Multi-branch","AI features"],color:"purple"},{name:"Enterprise",price:"Custom",features:["Unlimited students","Unlimited staff","White-label","Custom integrations","Dedicated support","On-premise option"],color:"gold"}];
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Billing & Plans" subtitle="SaaS subscription management · Plan upgrades · Invoice generation" C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
      <StatCard icon="💰" label="MRR" value="₹3.18L" trend={8} color="green" C={C}/>
      <StatCard icon="📊" label="ARR" value="₹38.2L" trend={8} color="teal" C={C}/>
      <StatCard icon="🔄" label="Churn Rate" value="2.1%" trend={-0.4} color="gold" C={C}/>
      <StatCard icon="⏳" label="Avg LTV" value="₹4.2L" trend={12} color="blue" C={C}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
      {PLANS.map(p=><div key={p.name} style={{background:C.card,borderRadius:14,padding:18,border:`2px solid ${p.name==="Professional"?C[p.color]:C.border}`,boxShadow:p.name==="Professional"?C.shadowM:C.shadow,position:"relative"}}>
        {p.name==="Professional"&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:C.purple,color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20}}>Most Popular</div>}
        <div style={{fontWeight:900,fontSize:16,color:C.text,marginBottom:4}}>{p.name}</div>
        <div style={{fontSize:22,fontWeight:900,color:C[p.color],marginBottom:14}}>{typeof p.price==="number"?"₹"+p.price+"/mo":p.price}</div>
        {p.features.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:7,marginBottom:7,fontSize:11,color:C.muted}}><span style={{color:C.green}}>✓</span>{f}</div>)}
        <button style={{width:"100%",background:p.name==="Professional"?C[p.color]:"transparent",color:p.name==="Professional"?"#fff":C[p.color],border:`1px solid ${C[p.color]}`,borderRadius:9,padding:"9px 0",fontSize:12,cursor:"pointer",fontWeight:700,marginTop:12}}>Get Started</button>
      </div>)}
    </div>
  </div>;
}

// ─── SETTINGS ─────────────────────────────────────────────────
function SettingsModule({C}){
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Settings & Configuration" subtitle="Institution settings · Customization · Integration · Security" C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      {[{title:"🏫 Institution Profile",items:["Institution Name","Logo & Branding","Address & Contact","Academic Year Settings","Holiday Calendar"]},{title:"👥 User Management",items:["Role Permissions","Staff Accounts","Student Portals","Parent Access","Admin Controls"]},{title:"🔗 Integrations",items:["WhatsApp API (WATI/Twilio)","Payment Gateway (Razorpay/PayTM)","SMS Gateway","Email (SMTP)","Zoom/Google Meet"]},{title:"🔒 Security",items:["Two-Factor Authentication","Password Policy","Session Management","Audit Logs","Data Backup & Export"]},{title:"📊 Reports",items:["Custom Report Builder","Scheduled Reports","Export Formats","Dashboard Customization","Data Analytics"]},{title:"🎨 Appearance",items:["Theme & Colors","Dark/Light Mode","Institution Logo","Landing Page","Custom Domain"]}].map(({title,items})=><div key={title} style={{background:C.card,borderRadius:13,padding:16,border:`1px solid ${C.border}`,boxShadow:C.shadow}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:10}}>{title}</div>
        {items.map(item=><div key={item} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:12,color:C.text}}>{item}</span>
          <button style={{background:C.tealL,color:C.teal,border:"none",borderRadius:6,padding:"3px 9px",fontSize:10,cursor:"pointer",fontWeight:600}}>Configure</button>
        </div>)}
      </div>)}
    </div>
  </div>;
}

// ─── PARENT PORTAL ────────────────────────────────────────────
function ParentPortal({C}){
  const s=MOCK_STUDENTS[0];
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Parent Dashboard" subtitle={`Monitoring: ${s.name} · ${s.rollNo}`} C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
      <StatCard icon="📊" label="Attendance" value={s.attendance+"%"} trend={2} color={s.attendance>=90?"green":"gold"} C={C}/>
      <StatCard icon="⭐" label="CGPA" value={s.cgpa} trend={1} color="blue" C={C}/>
      <StatCard icon="💰" label="Fee Status" value={s.fees} color={s.fees==="Paid"?"green":"red"} C={C}/>
      <StatCard icon="🏅" label="Badges" value={s.badges.length} trend={1} color="purple" C={C}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📅 Recent Notifications</div>
        {[{icon:"📊",text:"Attendance this week: 95%",time:"Today",col:"green"},{icon:"📝",text:"Mid-semester exam results published",time:"Yesterday",col:"blue"},{icon:"💰",text:"Fee for December cleared ✅",time:"2 days ago",col:"teal"},{icon:"⚠️",text:"Unit test on Monday",time:"3 days ago",col:"gold"}].map((n,i)=><div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:18}}>{n.icon}</span>
          <div style={{flex:1}}><div style={{fontSize:12,color:C.text}}>{n.text}</div><div style={{fontSize:10,color:C.muted}}>{n.time}</div></div>
        </div>)}
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📈 Performance Overview</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={[{sub:"Math",score:88},{sub:"DS",score:92},{sub:"OS",score:78},{sub:"DB",score:85},{sub:"Net",score:90}]}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/><XAxis dataKey="sub" tick={{fill:C.muted,fontSize:10}}/><YAxis tick={{fill:C.muted,fontSize:10}} domain={[60,100]}/>
            <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:11}}/>
            <Line type="monotone" dataKey="score" stroke={C.teal} strokeWidth={2} dot={{fill:C.teal,r:5}} name="Score"/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>;
}

// ─── STUDENT HOME ─────────────────────────────────────────────
function StudentHome({C}){
  const s=MOCK_STUDENTS[0];
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="My Dashboard" subtitle={`Welcome back, ${s.name}! 👋`} C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
      <StatCard icon="📊" label="Attendance" value={s.attendance+"%"} trend={2} color={s.attendance>=90?"green":"gold"} C={C}/>
      <StatCard icon="⭐" label="CGPA" value={s.cgpa} trend={1} color="blue" C={C}/>
      <StatCard icon="📋" label="Pending Tasks" value="3" color="gold" C={C}/>
      <StatCard icon="🏅" label="My Badges" value={s.badges.length} color="purple" C={C}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📚 Today's Schedule</div>
        {[{time:"9:00 AM",sub:"Data Structures",room:"CS-301",type:"Theory"},{time:"11:00 AM",sub:"Algorithms Lab",room:"Lab-2",type:"Practical"},{time:"2:00 PM",sub:"Operating Systems",room:"CS-205",type:"Theory"},{time:"4:00 PM",sub:"Project Meeting",room:"CSE Dept.",type:"Meeting"}].map((cl,i)=><div key={i} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.teal,minWidth:60}}>{cl.time}</div>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.text}}>{cl.sub}</div><div style={{fontSize:10,color:C.muted}}>{cl.room}</div></div>
          <Chip color={cl.type==="Practical"?"blue":"teal"} C={C}>{cl.type}</Chip>
        </div>)}
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>🏅 My Achievements</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
          {s.badges.map(b=><div key={b} style={{background:C.goldL,borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
            <div style={{fontSize:28}}>{b==="perfect_att"?"🌟":b==="top_scorer"?"🏆":"📚"}</div>
            <div style={{fontSize:9,color:C.gold,fontWeight:700,marginTop:3}}>{b==="perfect_att"?"Perfect Attendance":b==="top_scorer"?"Top Scorer":"HW Champion"}</div>
          </div>)}
        </div>
        <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:8}}>🛠️ My Skills</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{s.skills.map(sk=><Chip key={sk} color="teal" C={C}>{sk}</Chip>)}</div>
      </div>
    </div>
  </div>;
}

// ─── INSTITUTIONS LIST (Super Admin) ─────────────────────────
function InstitutionsModule({C}){
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Institutions" subtitle="128 institutions across India · 74,800+ students" C={C} action={<Btn color="teal" C={C}>+ Onboard Institution</Btn>}/>
    <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,boxShadow:C.shadowM,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead style={{background:C.bg}}><tr>{["Institution","Type","Plan","Students","Staff","MRR","Status","Actions"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>{MOCK_INSTITUTIONS.map(inst=><tr key={inst.id} style={{borderTop:`1px solid ${C.border}`}}>
          <td style={{padding:"11px 12px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={inst.name} size={30} C={C}/><div><div style={{fontSize:12,fontWeight:600,color:C.text}}>{inst.name}</div><div style={{fontSize:10,color:C.muted}}>{inst.city}, {inst.state}</div></div></div></td>
          <td style={{padding:"11px 12px",fontSize:11,color:C.muted}}>{inst.type}</td>
          <td style={{padding:"11px 12px"}}><SBadge status={inst.plan} C={C}/></td>
          <td style={{padding:"11px 12px",fontSize:13,fontWeight:700,color:C.text}}>{fmt(inst.students)}</td>
          <td style={{padding:"11px 12px",fontSize:12,color:C.muted}}>{inst.staff}</td>
          <td style={{padding:"11px 12px",fontSize:13,fontWeight:700,color:C.green}}>₹{fmt(inst.mrr)}</td>
          <td style={{padding:"11px 12px"}}><SBadge status={inst.status} C={C}/></td>
          <td style={{padding:"11px 12px"}}><div style={{display:"flex",gap:5}}>
            <button style={{background:C.tealL,color:C.teal,border:"none",borderRadius:6,padding:"4px 9px",fontSize:10,cursor:"pointer",fontWeight:600}}>View</button>
            <button style={{background:C.blueL,color:C.blue,border:"none",borderRadius:6,padding:"4px 9px",fontSize:10,cursor:"pointer",fontWeight:600}}>Support</button>
          </div></td>
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}

// ─── ASSIGNMENTS ───────────────────────────────────────────────
function AssignmentsModule({C}){
  const ASSGNS=[
    {id:"a1",title:"Lab Assignment: Binary Search Trees",subject:"Data Structures",course:"B.Tech CSE",dueDate:"2025-01-28",type:"Practical",submitted:42,total:56,status:"Active"},
    {id:"a2",title:"Essay: Algorithm Complexity",subject:"Algorithms",course:"B.Tech CSE",dueDate:"2025-01-25",type:"Written",submitted:28,total:56,status:"Active"},
    {id:"a3",title:"Project: DBMS Implementation",subject:"Database Systems",course:"B.Tech CSE",dueDate:"2025-02-10",type:"Project",submitted:12,total:56,status:"Active"},
  ];
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Assignments & Tasks" subtitle="Create · Assign · Track submissions · Grade" C={C} action={<Btn color="teal" C={C}>+ Create Assignment</Btn>}/>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {ASSGNS.map(a=><div key={a.id} style={{background:C.card,borderRadius:13,padding:16,border:`1px solid ${C.border}`,boxShadow:C.shadow}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
              <div style={{fontWeight:800,fontSize:14,color:C.text}}>{a.title}</div>
              <Chip color="teal" C={C}>{a.type}</Chip>
              <SBadge status={a.status} C={C}/>
            </div>
            <div style={{display:"flex",gap:12,fontSize:11,color:C.muted}}>
              <span>📚 {a.subject}</span><span>👨‍🎓 {a.course}</span><span>📅 Due: {dateStr(a.dueDate)}</span>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:20,fontWeight:900,color:C.text}}>{a.submitted}/{a.total}</div>
            <div style={{fontSize:9,color:C.muted}}>Submitted</div>
            <div style={{background:C.border,borderRadius:4,height:5,width:80,margin:"4px 0 0 auto"}}><div style={{width:pct(a.submitted,a.total)+"%",background:pct(a.submitted,a.total)>=80?C.green:pct(a.submitted,a.total)>=50?C.gold:C.red,height:"100%",borderRadius:4}}/></div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginTop:10}}>
          <button style={{background:C.teal,color:"#fff",border:"none",borderRadius:7,padding:"6px 14px",fontSize:11,cursor:"pointer",fontWeight:600}}>View Submissions</button>
          <button style={{background:C.blueL,color:C.blue,border:"none",borderRadius:7,padding:"6px 14px",fontSize:11,cursor:"pointer",fontWeight:600}}>📢 Remind</button>
        </div>
      </div>)}
    </div>
  </div>;
}


// ─── TIMETABLE ────────────────────────────────────────────────
function TimetableModule({C}){
  const DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const TIMES=["9:00","10:00","11:00","12:00","1:00","2:00","3:00","4:00"];
  const SCHED={
    "Monday":   [{t:"9:00",sub:"Data Structures",room:"CS-301",staff:"Dr. Ramesh",col:"teal"},{t:"11:00",sub:"Algorithms",room:"CS-201",staff:"Mrs. Priya",col:"blue"},{t:"2:00",sub:"OS Lab",room:"Lab-1",staff:"Mr. Suresh",col:"purple"}],
    "Tuesday":  [{t:"9:00",sub:"Database Systems",room:"CS-302",staff:"Mrs. Priya",col:"indigo"},{t:"11:00",sub:"Computer Networks",room:"CS-101",staff:"Dr. Ramesh",col:"cyan"},{t:"3:00",sub:"Project Work",room:"Project Lab",staff:"Guide",col:"orange"}],
    "Wednesday":[{t:"10:00",sub:"Data Structures",room:"CS-301",staff:"Dr. Ramesh",col:"teal"},{t:"2:00",sub:"Programming Lab",room:"Lab-2",staff:"Ms. Kavitha",col:"green"}],
    "Thursday": [{t:"9:00",sub:"Algorithms",room:"CS-201",staff:"Mrs. Priya",col:"blue"},{t:"11:00",sub:"OS",room:"CS-401",staff:"Mr. Suresh",col:"purple"},{t:"2:00",sub:"Database Lab",room:"Lab-3",staff:"Ms. Kavitha",col:"indigo"}],
    "Friday":   [{t:"9:00",sub:"Computer Networks",room:"CS-101",staff:"Dr. Ramesh",col:"cyan"},{t:"11:00",sub:"Seminar/Guest Lecture",room:"Auditorium",staff:"Various",col:"gold"},{t:"2:00",sub:"Sports/Activities",room:"Ground",staff:"PE Dept",col:"orange"}],
    "Saturday": [{t:"9:00",sub:"Extra Class / Revision",room:"CS-301",staff:"Dr. Ramesh",col:"red"}],
  };
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Timetable" subtitle="Weekly class schedule · Room allocation · Staff assignment" C={C} action={<Btn color="teal" C={C}>+ Add Class</Btn>}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
      <StatCard icon="📅" label="Classes/Week" value="18" color="teal" C={C}/>
      <StatCard icon="⏱" label="Hours/Week" value="36 hrs" color="blue" C={C}/>
      <StatCard icon="🏫" label="Rooms Used" value="8" color="purple" C={C}/>
      <StatCard icon="👩‍🏫" label="Staff Active" value="5" color="green" C={C}/>
    </div>
    <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,boxShadow:C.shadowM,overflow:"auto"}}>
      <div style={{minWidth:700}}>
        <div style={{display:"grid",gridTemplateColumns:"100px repeat(8,1fr)",background:C.bg,borderBottom:`1px solid ${C.border}`}}>
          <div style={{padding:"10px 12px",fontSize:11,fontWeight:700,color:C.muted}}>Day</div>
          {TIMES.map(t=><div key={t} style={{padding:"10px 8px",fontSize:10,fontWeight:700,color:C.muted,textAlign:"center",borderLeft:`1px solid ${C.border}`}}>{t}</div>)}
        </div>
        {DAYS.map(day=><div key={day} style={{display:"grid",gridTemplateColumns:"100px repeat(8,1fr)",borderBottom:`1px solid ${C.border}`,minHeight:60}}>
          <div style={{padding:"10px 12px",fontSize:11,fontWeight:700,color:C.text,display:"flex",alignItems:"center",background:C.bg}}>{day.slice(0,3)}</div>
          {TIMES.map((t,ti)=>{
            const cls=(SCHED[day]||[]).find(c=>c.t===t);
            return <div key={t} style={{borderLeft:`1px solid ${C.border}`,padding:3,position:"relative"}}>
              {cls&&<div style={{background:C[cls.col+"L"]||C.tealL,borderRadius:6,padding:"4px 7px",borderLeft:`3px solid ${C[cls.col]||C.teal}`,height:"100%",boxSizing:"border-box"}}>
                <div style={{fontSize:10,fontWeight:700,color:C[cls.col]||C.teal,lineHeight:1.2}}>{cls.sub}</div>
                <div style={{fontSize:8,color:C.muted}}>{cls.room}</div>
                <div style={{fontSize:8,color:C.muted}}>{cls.staff}</div>
              </div>}
            </div>;
          })}
        </div>)}
      </div>
    </div>
    <div style={{display:"flex",gap:7,marginTop:14,flexWrap:"wrap"}}>
      {[["teal","Theory Classes"],["green","Lab/Practical"],["indigo","Database"],["cyan","Networks"],["purple","OS"],["gold","Special"],["orange","Others"]].map(([col,lb])=><div key={lb} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",background:C.card,borderRadius:20,border:`1px solid ${C.border}`,fontSize:10,color:C.muted}}>
        <div style={{width:10,height:10,borderRadius:2,background:C[col]||C.teal}}/>{lb}
      </div>)}
    </div>
  </div>;
}

// ─── LIBRARY ────────────────────────────────────────────────
function LibraryModule({C}){
  const [tab,setTab]=useState("catalog");
  const [search,setSearch]=useState("");
  const BOOKS=[
    {id:"b1",title:"Introduction to Algorithms",author:"CLRS",category:"CS",available:3,total:5,isbn:"978-0262033848",due:null},
    {id:"b2",title:"Clean Code",author:"Robert C. Martin",category:"CS",available:0,total:3,isbn:"978-0132350884",due:"2025-02-05"},
    {id:"b3",title:"Design Patterns",author:"Gang of Four",category:"CS",available:2,total:4,isbn:"978-0201633610",due:null},
    {id:"b4",title:"The Pragmatic Programmer",author:"Hunt & Thomas",category:"CS",available:1,total:2,isbn:"978-0135957059",due:null},
    {id:"b5",title:"Operating System Concepts",author:"Silberschatz",category:"CS",available:4,total:6,isbn:"978-1118063330",due:null},
    {id:"b6",title:"Database System Concepts",author:"Korth & Sudarshan",category:"CS",available:0,total:4,isbn:"978-0078022159",due:"2025-02-08"},
  ];
  const ISSUED=[
    {student:"Priya Sharma",rollNo:"24CS001",book:"Clean Code",issueDate:"2025-01-20",dueDate:"2025-02-05",status:"Active"},
    {student:"Arjun Patel",rollNo:"24CS002",book:"Database System Concepts",issueDate:"2025-01-22",dueDate:"2025-02-08",status:"Active"},
    {student:"Rahul Kumar",rollNo:"24ME001",book:"Engineering Mathematics",issueDate:"2024-12-20",dueDate:"2025-01-05",status:"Overdue"},
  ];
  const filtered=BOOKS.filter(b=>b.title.toLowerCase().includes(search.toLowerCase())||b.author.toLowerCase().includes(search.toLowerCase()));
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Library Management" subtitle="Digital catalog · Issue/Return · Overdue tracking" C={C} action={<Btn color="teal" C={C}>+ Add Book</Btn>}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
      <StatCard icon="📚" label="Total Books" value="2,847" trend={5} color="teal" C={C}/>
      <StatCard icon="📤" label="Issued" value="234" color="blue" C={C}/>
      <StatCard icon="✅" label="Available" value="2,613" color="green" C={C}/>
      <StatCard icon="⚠️" label="Overdue" value="18" color="red" C={C}/>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      {[{id:"catalog",lb:"📚 Catalog"},{id:"issued",lb:"📤 Issued Books"},{id:"overdue",lb:"⚠️ Overdue"}].map(m=><button key={m.id} onClick={()=>setTab(m.id)} style={{padding:"7px 14px",borderRadius:9,border:`1px solid ${tab===m.id?C.teal:C.border}`,background:tab===m.id?C.teal:C.surface,color:tab===m.id?"#fff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>{m.lb}</button>)}
    </div>
    {tab==="catalog"&&<div>
      <div style={{maxWidth:300,marginBottom:14}}><Inp value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search books or author..." C={C}/></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
        {filtered.map(b=><div key={b.id} style={{background:C.card,borderRadius:12,padding:14,border:`1px solid ${C.border}`,boxShadow:C.shadow}}>
          <div style={{display:"flex",gap:11,marginBottom:10}}>
            <div style={{width:44,height:60,background:b.available?C.tealL:C.redL,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📗</div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:C.text,lineHeight:1.3,marginBottom:3}}>{b.title}</div><div style={{fontSize:10,color:C.muted}}>{b.author}</div><Chip color={b.available?"green":"red"} C={C}>{b.available?"Available":"All Issued"}</Chip></div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.muted,marginBottom:9}}>
            <span>Stock: {b.available}/{b.total}</span><span>ISBN: {b.isbn}</span>
          </div>
          <div style={{background:C.border,borderRadius:3,height:4,marginBottom:9}}><div style={{width:pct(b.available,b.total)+"%",background:b.available?C.green:C.red,height:"100%",borderRadius:3}}/></div>
          <div style={{display:"flex",gap:6}}>
            <button style={{flex:1,background:b.available?C.teal:"transparent",color:b.available?"#fff":C.muted,border:`1px solid ${b.available?C.teal:C.border}`,borderRadius:7,padding:"6px 0",fontSize:11,cursor:b.available?"pointer":"not-allowed",fontWeight:600}}>📤 Issue</button>
            <button style={{background:C.blueL,color:C.blue,border:"none",borderRadius:7,padding:"6px 11px",fontSize:11,cursor:"pointer"}}>ℹ️</button>
          </div>
        </div>)}
      </div>
    </div>}
    {tab==="issued"&&<div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,boxShadow:C.shadowM,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead style={{background:C.bg}}><tr>{["Student","Book","Issue Date","Due Date","Status","Actions"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>{ISSUED.map((iss,i)=><tr key={i} style={{borderTop:`1px solid ${C.border}`}}>
          <td style={{padding:"11px 12px"}}><div style={{fontSize:12,fontWeight:600,color:C.text}}>{iss.student}</div><div style={{fontSize:10,color:C.muted}}>{iss.rollNo}</div></td>
          <td style={{padding:"11px 12px",fontSize:12,color:C.text}}>{iss.book}</td>
          <td style={{padding:"11px 12px",fontSize:11,color:C.muted}}>{dateStr(iss.issueDate)}</td>
          <td style={{padding:"11px 12px",fontSize:11,color:iss.status==="Overdue"?C.red:C.muted}}>{dateStr(iss.dueDate)}</td>
          <td style={{padding:"11px 12px"}}><SBadge status={iss.status} C={C}/></td>
          <td style={{padding:"11px 12px"}}><div style={{display:"flex",gap:5}}>
            <button style={{background:C.green,color:"#fff",border:"none",borderRadius:6,padding:"4px 9px",fontSize:10,cursor:"pointer",fontWeight:600}}>📥 Return</button>
            {iss.status==="Overdue"&&<button style={{background:C.redL,color:C.red,border:"none",borderRadius:6,padding:"4px 9px",fontSize:10,cursor:"pointer",fontWeight:600}}>📢 Fine</button>}
          </div></td>
        </tr>)}</tbody>
      </table>
    </div>}
    {tab==="overdue"&&<div>
      {ISSUED.filter(i=>i.status==="Overdue").map((iss,i)=><div key={i} style={{background:C.redL,borderRadius:11,padding:14,border:`1px solid ${C.red}44`,marginBottom:9,display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:26}}>⚠️</span>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{iss.student} — {iss.book}</div><div style={{fontSize:11,color:C.red}}>Due: {dateStr(iss.dueDate)} · Fine: ₹{Math.max(1,Math.floor((Date.now()-new Date(iss.dueDate))/86400000))*2}</div></div>
        <button style={{background:C.red,color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",fontSize:11,cursor:"pointer",fontWeight:700}}>Collect Fine</button>
        <button style={{background:C.greenL,color:C.green,border:"none",borderRadius:8,padding:"7px 14px",fontSize:11,cursor:"pointer",fontWeight:700}}>Return</button>
      </div>)}
    </div>}
  </div>;
}

// ─── GAMIFICATION / LEADERBOARD ───────────────────────────────
function GamificationModule({C}){
  const [tab,setTab]=useState("leaderboard");
  const BADGES=[{id:"perfect_att",icon:"🌟",name:"Perfect Attendance",desc:"100% attendance in a month",color:"gold",earned:124},{id:"top_scorer",icon:"🏆",name:"Top Scorer",desc:"Highest marks in class",color:"teal",earned:56},{id:"hw_champion",icon:"📚",name:"Assignment Champion",desc:"All assignments on time",color:"blue",earned:89},{id:"scholar",icon:"🎓",name:"Dean's Scholar",desc:"CGPA above 9.0",color:"purple",earned:23},{id:"fast_learner",icon:"⚡",name:"Fast Learner",desc:"Completed all labs first",color:"orange",earned:45},{id:"team_player",icon:"🤝",name:"Team Player",desc:"Best group project",color:"green",earned:68}];
  const LB=MOCK_STUDENTS.map((s,i)=>({...s,points:(9-i)*120+Math.floor(Math.random()*80),rank:i+1,streak:Math.floor(Math.random()*14)+1})).sort((a,b)=>b.points-a.points).map((s,i)=>({...s,rank:i+1}));
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Gamification & Leaderboard" subtitle="Points · Badges · Streaks · Student engagement" C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
      <StatCard icon="🏆" label="Total Badges Earned" value="405" trend={12} color="gold" C={C}/>
      <StatCard icon="⚡" label="Avg Streak" value="8 days" trend={3} color="teal" C={C}/>
      <StatCard icon="🌟" label="Top Points" value={fmt(LB[0]?.points||0)} trend={5} color="purple" C={C}/>
      <StatCard icon="📈" label="Engagement Rate" value="87%" trend={8} color="green" C={C}/>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      {[{id:"leaderboard",lb:"🏆 Leaderboard"},{id:"badges",lb:"🏅 Badges"},{id:"points",lb:"💎 Points System"}].map(m=><button key={m.id} onClick={()=>setTab(m.id)} style={{padding:"7px 14px",borderRadius:9,border:`1px solid ${tab===m.id?C.teal:C.border}`,background:tab===m.id?C.teal:C.surface,color:tab===m.id?"#fff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>{m.lb}</button>)}
    </div>
    {tab==="leaderboard"&&<div>
      {LB.slice(0,3).length>0&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
        {[1,0,2].map(pos=>{const s=LB[pos];if(!s)return null;const medals=["🥇","🥈","🥉"];const sizes=[110,100,95];const cols=[C.gold,C.muted,C.orange];return <div key={s.id} style={{background:C.card,borderRadius:14,padding:16,border:`1px solid ${C.border}`,textAlign:"center",order:pos===1?-1:pos===2?1:0,boxShadow:pos===0?C.shadowL:C.shadowM}}>
          <div style={{fontSize:28,marginBottom:4}}>{medals[s.rank-1]}</div>
          <Av name={s.name} size={40} C={C}/>
          <div style={{fontWeight:700,fontSize:12,color:C.text,marginTop:6}}>{s.name}</div>
          <div style={{fontSize:22,fontWeight:900,color:cols[s.rank-1],marginTop:4}}>{fmt(s.points)}</div>
          <div style={{fontSize:9,color:C.muted}}>points · {s.streak} day streak 🔥</div>
        </div>;})}
      </div>}
      <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,boxShadow:C.shadowM,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead style={{background:C.bg}}><tr>{["Rank","Student","Points","Badges","Streak","CGPA"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{LB.map(s=><tr key={s.id} style={{borderTop:`1px solid ${C.border}`,background:s.rank<=3?C[s.rank===1?"gold":s.rank===2?"muted":"orange"]+"11":"transparent"}}>
            <td style={{padding:"10px 12px",fontSize:15,fontWeight:900,color:s.rank===1?C.gold:s.rank===2?C.muted:s.rank===3?C.orange:C.muted2}}>{s.rank<=3?["🥇","🥈","🥉"][s.rank-1]:s.rank}</td>
            <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={s.name} size={28} C={C}/><div><div style={{fontSize:12,fontWeight:600,color:C.text}}>{s.name}</div><div style={{fontSize:9,color:C.muted}}>{s.rollNo}</div></div></div></td>
            <td style={{padding:"10px 12px",fontSize:14,fontWeight:900,color:C.teal}}>{fmt(s.points)}</td>
            <td style={{padding:"10px 12px"}}><div style={{display:"flex",gap:2}}>{s.badges.map(b=><span key={b} style={{fontSize:14}}>{b==="perfect_att"?"🌟":b==="top_scorer"?"🏆":"📚"}</span>)}{!s.badges.length&&<span style={{fontSize:10,color:C.muted2}}>—</span>}</div></td>
            <td style={{padding:"10px 12px"}}><span style={{fontSize:11,fontWeight:700,color:C.orange}}>{s.streak} 🔥</span></td>
            <td style={{padding:"10px 12px",fontSize:13,fontWeight:700,color:s.cgpa>=8.5?C.green:s.cgpa>=7?C.gold:C.text}}>{s.cgpa}</td>
          </tr>)}
        </tbody></table>
      </div>
    </div>}
    {tab==="badges"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
      {BADGES.map(b=><div key={b.id} style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C[b.color]}44`,boxShadow:C.shadow}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
          <div style={{width:48,height:48,background:C[b.color+"L"]||C.goldL,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{b.icon}</div>
          <div><div style={{fontWeight:700,fontSize:13,color:C.text}}>{b.name}</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>{b.desc}</div></div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{background:C[b.color+"L"]||C.goldL,borderRadius:8,padding:"5px 10px",fontSize:12,fontWeight:700,color:C[b.color]||C.gold}}>{b.earned} students earned</div>
          <button style={{background:C[b.color+"L"]||C.tealL,color:C[b.color]||C.teal,border:"none",borderRadius:7,padding:"5px 10px",fontSize:11,cursor:"pointer",fontWeight:600}}>Award</button>
        </div>
      </div>)}
    </div>}
    {tab==="points"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>💎 Points Earning Rules</div>
        {[["📊","Daily Attendance","+10 pts"],["✅","Assignment Submitted","+15 pts"],["📝","Exam Passed","+50 pts"],["🏆","Top Scorer in Class","+100 pts"],["🌟","Perfect Month Attendance","+200 pts"],["📚","Book Issued & Returned","+5 pts"],["💬","Answered Peer Query","+8 pts"],["🎯","Project Submitted","+75 pts"]].map(([ic,lb,pts])=><div key={lb} style={{display:"flex",gap:10,marginBottom:9,padding:"8px 10px",background:C.bg,borderRadius:8}}>
          <span style={{fontSize:15}}>{ic}</span>
          <div style={{flex:1,fontSize:12,color:C.text}}>{lb}</div>
          <span style={{fontSize:12,fontWeight:700,color:C.teal}}>{pts}</span>
        </div>)}
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>🎁 Rewards & Redemption</div>
        {[["📜","Extra Study Material","500 pts"],["🏅","Special Badge","750 pts"],["📅","Leave Day","1000 pts"],["🎓","Certificate of Merit","1500 pts"],["💰","Scholarship Discount","2000 pts"]].map(([ic,lb,pts])=><div key={lb} style={{display:"flex",gap:10,marginBottom:9,padding:"10px 12px",background:C.bg,borderRadius:9,border:`1px solid ${C.border}`}}>
          <span style={{fontSize:18}}>{ic}</span>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.text}}>{lb}</div><div style={{fontSize:10,color:C.muted}}>Redeem with {pts}</div></div>
          <button style={{background:C.teal,color:"#fff",border:"none",borderRadius:7,padding:"5px 11px",fontSize:10,cursor:"pointer",fontWeight:600}}>Redeem</button>
        </div>)}
      </div>
    </div>}
  </div>;
}

// ─── LIVE CLASSES ────────────────────────────────────────────
function LiveClassModule({C}){
  const [active,setActive]=useState(null);
  const SESSIONS=[
    {id:"lc1",title:"Data Structures — Trees",teacher:"Dr. Ramesh Kumar",time:"9:00 AM - 10:00 AM",date:"Today",platform:"Zoom",link:"https://zoom.us/j/123456",students:52,status:"Live",recording:null},
    {id:"lc2",title:"Algorithm Design — DP",teacher:"Mrs. Priya Devi",time:"11:00 AM - 12:00 PM",date:"Today",platform:"Google Meet",link:"meet.google.com/abc-xyz",students:56,status:"Upcoming",recording:null},
    {id:"lc3",title:"OS Concepts — Scheduling",teacher:"Mr. Suresh Babu",time:"2:00 PM - 3:00 PM",date:"Yesterday",platform:"Zoom",link:null,students:49,status:"Completed",recording:"https://recording.url"},
  ];
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="Live Classes" subtitle="Zoom · Google Meet · Recording · Attendance tracking" C={C} action={<Btn color="teal" C={C}>+ Schedule Class</Btn>}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
      <StatCard icon="🔴" label="Live Now" value="1" color="red" C={C}/>
      <StatCard icon="📅" label="Today's Classes" value="3" trend={0} color="teal" C={C}/>
      <StatCard icon="📹" label="Recordings" value="47" trend={12} color="blue" C={C}/>
      <StatCard icon="📊" label="Avg Attendance" value="91%" trend={3} color="green" C={C}/>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {SESSIONS.map(s=><div key={s.id} style={{background:C.card,borderRadius:13,padding:16,border:`2px solid ${s.status==="Live"?C.red:C.border}`,boxShadow:s.status==="Live"?`0 0 0 3px ${C.red}22`:C.shadow,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <div style={{width:44,height:44,background:s.status==="Live"?C.redL:s.status==="Upcoming"?C.tealL:C.bg,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,position:"relative"}}>
          🎥
          {s.status==="Live"&&<div style={{position:"absolute",top:-4,right:-4,width:12,height:12,borderRadius:"50%",background:C.red,border:"2px solid "+C.card}}/>}
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
            <div style={{fontWeight:800,fontSize:14,color:C.text}}>{s.title}</div>
            {s.status==="Live"&&<span style={{background:C.red,color:"#fff",padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,animation:"pulse 1s infinite"}}>● LIVE</span>}
            {s.status!=="Live"&&<SBadge status={s.status} C={C}/>}
            <Chip color="blue" C={C}>{s.platform}</Chip>
          </div>
          <div style={{display:"flex",gap:14,fontSize:11,color:C.muted,flexWrap:"wrap"}}>
            <span>👩‍🏫 {s.teacher}</span><span>⏰ {s.time}</span><span>📅 {s.date}</span><span>👥 {s.students} students</span>
          </div>
        </div>
        <div style={{display:"flex",gap:7}}>
          {s.status==="Live"&&<button onClick={()=>setActive(s)} style={{background:C.red,color:"#fff",border:"none",borderRadius:9,padding:"8px 16px",fontSize:12,cursor:"pointer",fontWeight:700}}>🔴 Join Live</button>}
          {s.status==="Upcoming"&&<button style={{background:C.teal,color:"#fff",border:"none",borderRadius:9,padding:"8px 16px",fontSize:12,cursor:"pointer",fontWeight:700}}>📅 Join Link</button>}
          {s.status==="Completed"&&s.recording&&<button style={{background:C.blueL,color:C.blue,border:"none",borderRadius:9,padding:"8px 16px",fontSize:12,cursor:"pointer",fontWeight:700}}>📹 Watch Recording</button>}
          <button style={{background:C.bg,color:C.muted,border:`1px solid ${C.border}`,borderRadius:9,padding:"8px 12px",fontSize:11,cursor:"pointer"}}>⚙️</button>
        </div>
      </div>)}
    </div>
    {active&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.9)",zIndex:1000,display:"flex",flexDirection:"column"}} onClick={()=>setActive(null)}>
      <div style={{padding:"12px 18px",background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",gap:10}}>
        <div style={{background:C.red,width:10,height:10,borderRadius:"50%"}}/><span style={{color:"#fff",fontWeight:700,fontSize:13}}>{active.title} · LIVE</span>
        <span style={{color:"rgba(255,255,255,0.5)",fontSize:11}}>· {active.teacher}</span>
        <div style={{flex:1}}/>
        <span style={{color:"rgba(255,255,255,0.5)",fontSize:11}}>👥 {active.students} watching</span>
        <button onClick={()=>setActive(null)} style={{background:"#ff4444",color:"#fff",border:"none",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:700}}>✕ Leave</button>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:"rgba(255,255,255,0.4)"}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:60,marginBottom:12}}>🎥</div><div>Click "Join {active.platform}" to open in browser</div><div style={{marginTop:14}}><a href={active.link} target="_blank" rel="noopener noreferrer" style={{background:C.teal,color:"#fff",padding:"10px 24px",borderRadius:9,textDecoration:"none",fontWeight:700,fontSize:13}}>Join on {active.platform}</a></div></div>
      </div>
    </div>}
  </div>;
}

// ─── SMS & NOTIFICATIONS ─────────────────────────────────────
function SMSModule({C}){
  const [tab,setTab]=useState("compose");
  const HIST=[
    {id:1,type:"SMS",to:"All Parents (2847)",msg:"Fee reminder December",time:"Today 9:00 AM",delivered:2801,failed:46},
    {id:2,type:"Email",to:"All Staff (124)",msg:"Staff meeting tomorrow 3 PM",time:"Yesterday 2:00 PM",delivered:122,failed:2},
    {id:3,type:"App Push",to:"All Students (2847)",msg:"Exam timetable released",time:"2 days ago",delivered:2634,failed:213},
  ];
  return <div style={{padding:22,overflowY:"auto"}}>
    <PH title="SMS & Multi-Channel Alerts" subtitle="SMS · Email · Push Notifications · In-App · Telegram" C={C}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:18}}>
      {[["📱","SMS","94.2%","teal"],["📧","Email","97.1%","blue"],["🔔","Push","92.3%","purple"],["📲","In-App","99.4%","green"],["✉️","Telegram","88.7%","cyan"]].map(([ic,lb,rate,col])=><div key={lb} style={{background:C.card,borderRadius:11,padding:"12px 10px",border:`1px solid ${C.border}`,textAlign:"center",boxShadow:C.shadow}}>
        <div style={{fontSize:22}}>{ic}</div>
        <div style={{fontWeight:700,fontSize:11,color:C.text,marginTop:4}}>{lb}</div>
        <div style={{fontSize:13,fontWeight:900,color:C[col]||C.teal}}>{rate}</div>
        <div style={{fontSize:9,color:C.muted}}>delivery rate</div>
      </div>)}
    </div>
    <div style={{display:"flex",gap:8,marginBottom:18}}>
      {[{id:"compose",lb:"✉️ Compose"},{id:"history",lb:"📋 History"},{id:"templates",lb:"📄 Templates"}].map(m=><button key={m.id} onClick={()=>setTab(m.id)} style={{padding:"7px 14px",borderRadius:9,border:`1px solid ${tab===m.id?C.teal:C.border}`,background:tab===m.id?C.teal:C.surface,color:tab===m.id?"#fff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>{m.lb}</button>)}
    </div>
    {tab==="compose"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>📝 Compose Message</div>
        <div style={{marginBottom:10}}>
          <label style={{fontSize:11,fontWeight:600,color:C.muted,display:"block",marginBottom:4}}>Channel</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {[["📱","SMS"],["📧","Email"],["🔔","Push"],["✉️","All"]].map(([ic,lb])=><button key={lb} style={{padding:"6px 12px",borderRadius:7,border:`1px solid ${C.border}`,background:lb==="All"?C.teal:"transparent",color:lb==="All"?"#fff":C.muted,fontSize:11,cursor:"pointer"}}>{ic} {lb}</button>)}
          </div>
        </div>
        <div style={{marginBottom:10}}><label style={{fontSize:11,fontWeight:600,color:C.muted,display:"block",marginBottom:4}}>Recipients</label>
          <Sel value="" onChange={()=>{}} C={C} style={{width:"100%"}}><option>All Students (2,847)</option><option>All Parents (2,847)</option><option>All Staff (124)</option><option>B.Tech CSE 2024</option><option>Fee Defaulters</option><option>Custom Group</option></Sel>
        </div>
        <div style={{marginBottom:10}}><label style={{fontSize:11,fontWeight:600,color:C.muted,display:"block",marginBottom:4}}>Subject (for Email)</label>
          <Inp value="" onChange={()=>{}} placeholder="Email subject..." C={C}/>
        </div>
        <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:C.muted,display:"block",marginBottom:4}}>Message</label>
          <textarea rows={5} placeholder="Type your message here..." style={{width:"100%",background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 10px",fontSize:12,color:C.text,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
          <div style={{fontSize:10,color:C.muted,textAlign:"right",marginTop:3}}>0/160 chars</div>
        </div>
        <div style={{display:"flex",gap:7}}>
          <button style={{flex:1,background:C.teal,color:"#fff",border:"none",borderRadius:9,padding:"10px 0",fontSize:12,cursor:"pointer",fontWeight:700}}>📤 Send Now</button>
          <button style={{background:C.goldL,color:C.gold,border:"none",borderRadius:9,padding:"10px 14px",fontSize:12,cursor:"pointer",fontWeight:600}}>⏰ Schedule</button>
        </div>
      </div>
      <div style={{background:C.card,borderRadius:14,padding:18,border:`1px solid ${C.border}`,boxShadow:C.shadowM}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:12}}>📊 Recent Performance</div>
        {HIST.map(h=><div key={h.id} style={{marginBottom:10,padding:"10px 12px",background:C.bg,borderRadius:9,border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <div><span style={{fontWeight:700,fontSize:12,color:C.text}}>{h.type}</span><span style={{fontSize:11,color:C.muted}}> → {h.to}</span></div>
            <span style={{fontSize:10,color:C.muted2}}>{h.time}</span>
          </div>
          <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{h.msg}</div>
          <div style={{display:"flex",gap:10}}>
            <span style={{fontSize:11,color:C.green,fontWeight:600}}>✅ {h.delivered} delivered</span>
            {h.failed>0&&<span style={{fontSize:11,color:C.red,fontWeight:600}}>❌ {h.failed} failed</span>}
          </div>
        </div>)}
      </div>
    </div>}
    {tab==="history"&&<div style={{background:C.card,borderRadius:14,border:`1px solid ${C.border}`,boxShadow:C.shadowM,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead style={{background:C.bg}}><tr>{["Channel","Recipients","Message","Sent","Delivered","Time"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>{HIST.map(h=><tr key={h.id} style={{borderTop:`1px solid ${C.border}`}}>
          <td style={{padding:"11px 12px"}}><Chip color="teal" C={C}>{h.type}</Chip></td>
          <td style={{padding:"11px 12px",fontSize:11,color:C.muted}}>{h.to}</td>
          <td style={{padding:"11px 12px",fontSize:11,color:C.text}}>{h.msg}</td>
          <td style={{padding:"11px 12px",fontSize:12,fontWeight:700,color:C.text}}>{h.delivered+h.failed}</td>
          <td style={{padding:"11px 12px"}}><span style={{fontSize:12,fontWeight:700,color:C.green}}>{h.delivered}</span>{h.failed>0&&<span style={{fontSize:10,color:C.red}}> (-{h.failed})</span>}</td>
          <td style={{padding:"11px 12px",fontSize:11,color:C.muted}}>{h.time}</td>
        </tr>)}</tbody>
      </table>
    </div>}
  </div>;
}

// ─── ENHANCED HR (with Leave & Payroll Slip) ─────────────────
// ─── ROUTER ────────────────────────────────────────────────────
function renderPage(page,role,C){
  const map={
    saas:<SaasDashboard C={C}/>,institutions:<InstitutionsModule C={C}/>,billing:<BillingModule C={C}/>,
    dashboard:<InstDashboard C={C}/>,parent_home:<ParentPortal C={C}/>,student_home:<StudentHome C={C}/>,
    admissions:<AdmissionsCRM C={C}/>,students:<StudentsModule C={C}/>,attendance:<AttendanceModule C={C}/>,
    fees:<FeeModule C={C}/>,exams:<ExamsModule C={C}/>,assignments:<AssignmentsModule C={C}/>,
    whatsapp:<WhatsAppModule C={C}/>,certificates:<CertificateModule C={C}/>,placement:<PlacementPortal C={C}/>,
    ai:<AICenter C={C}/>,hr:<HRModule C={C}/>,analytics:<AnalyticsModule C={C}/>,
    branches:<BranchesModule C={C}/>,alumni:<AlumniModule C={C}/>,documents:<DocumentsModule C={C}/>,
    settings:<SettingsModule C={C}/>,
    timetable:<TimetableModule C={C}/>,library:<LibraryModule C={C}/>,
    gamification:<GamificationModule C={C}/>,live_class:<LiveClassModule C={C}/>,
    sms:<SMSModule C={C}/>,
  };
  return map[page]||<InstDashboard C={C}/>;
}

// ─── MAIN APP ──────────────────────────────────────────────────
export default function App(){
  const [dark,setDark]=useState(false);
  const [role,setRole]=useState(null);
  const [page,setPage]=useState("dashboard");
  const C=dark?D:L;

  const handleLogin=useCallback((r)=>{
    setRole(r);
    const firstPage=NAVS[r]?.[0]?.id||"dashboard";
    setPage(firstPage);
  },[]);

  if(!role) return <LoginScreen onLogin={handleLogin} dark={dark} toggleDark={()=>setDark(d=>!d)}/>;

  const nav=NAVS[role]||NAVS.inst_admin;
  const currentTitle=nav.find(n=>n.id===page)?.label||"Dashboard";

  return <div style={{display:"flex",height:"100vh",background:C.bg,fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
    <Sidebar role={role} active={page} onNav={setPage} dark={dark} toggleDark={()=>setDark(d=>!d)} onLogout={()=>setRole(null)} C={C}/>
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
      <TopBar title={currentTitle} C={C}/>
      <div style={{flex:1,overflowY:"auto"}}>
        {renderPage(page,role,C)}
      </div>
    </div>
  </div>;
}
