// Device-local data layer. No network requests and no cross-device sync.
const DB_KEY = 'amrith-local-db-v1'
const SESSION_KEY = 'amrith-local-session-v1'
const PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'ammuThiru1107'
const PEOPLE = {
  amogha: { id: 'local-amogha', display_name: 'Amogha', role: 'admin', timezone: 'Asia/Kolkata' },
  thrinath: { id: 'local-thrinath', display_name: 'Threeeenadh', role: 'member', timezone: 'America/Phoenix' },
}
const questions = [
  [1,'What is one little thing that made you smile today?'],
  [2,'What does growing together mean to you?'],[2,'What is something you hope we learn about each other?'],[2,'What do you think makes two people compatible despite their differences?'],
  [3,'What makes you feel at home with someone?'],[3,'What is one thing you want me to understand about you?'],[3,'What does respect mean to you in a relationship?'],
  [4,'What is one small gesture that makes you feel loved?'],[4,'What is a memory you want us to create?'],[4,'What would you want to remember about our first meeting?'],
  [5,'What is one dream you want to achieve?'],[5,"How can we support each other's careers?"],[5,'What is something you want to be completely honest about?'],
  [6,'ARE YOU READY TO MEET ME?'],[7,'How do you feel before we meet?'],[8,'In your own words, what would you like to say?'],
]
const chapterSeed = [
 ['A Little Warmth','Until I Found You','Stephen Sanchez','https://www.youtube.com/watch?v=9C7FGC-ibY4',`Some nights don't need long conversations or big promises.

Sometimes, all I want is to remind you that you are loved.

I hope you sleep peacefully tonight, knowing that somewhere, someone is smiling because you exist.

Goodnight, my favourite person. ❤️`],
 ['Growing Together','Shinunoga E-Wa','Fujii Kaze','https://www.youtube.com/watch?v=dawrQnvwMTY',`Questions I once carried:

"Will you really promise me that you will always treat me the same way till the end?"
"Will you forgive me if I did something that you hate?"
"Will you be the version that I built in my brain?"
"I want to sit alone in a peaceful environment, like we are lost in each other."
"Grow with you, who brings the best in me and I bring the best in you."
"You are 26, I'm 20. Your needs are different from mine. Would it affect?"

I didn't want a perfect person. I wanted someone with whom I could grow without having to lose myself.`],
 ['Feeling Like Home','Love Story','Taylor Swift','https://www.youtube.com/watch?v=8xg3vE8Ie_E',`"What if you take me for granted and leave me in grief?"
"You think like my mom, care like my brother and protect like my dad. I'll feel home with you."
"Would you disrespect me for anything?"

Maybe feeling at home isn't about a place. Maybe it's about being able to be yourself around someone without being afraid.`],
 ['The Little Things','Like My Father','Jax','https://www.youtube.com/watch?v=GCWl50HQZIM',`"I'll die for you if you bring me flowers and open the door for me to sit."
"I'm searching to give something as a mark of my presence, but everything I brought is not on my own."
"So I can only give you a hug which you can carry until you see me again."
"Will you meet me again before you leave India?"

Sometimes the smallest gestures mean more than the most expensive gifts. I never wanted grand things. I wanted thoughtful things.`],
 ['Across the Distance','Hey There Delilah',"Plain White T's",'https://www.youtube.com/watch?v=EbJtYqBYCV8',`"It's easy to love yourself than loving someone, and I see you as a person with same mindset."
"Would you fulfill all my dreams?"
"You shouldn't feel stressed in loving someone in any aspect, either career, future or anything."
"And I'm exactly feeling zero percent stress about you. I think I'm sure about you."
"Is it a prank or did you take any dare that you'll make me fall?"
"If not, I don't actually understand why you like me when there are hundred reasons to not love me."
"Is there anything that you are hiding with me? A bad thing?"

I don't want either of us to feel that love is an obstacle to our ambitions. I want us to become better people while supporting each other.`],
 ['The Anticipation','Blinding Lights','The Weeknd','https://www.youtube.com/watch?v=4NRXx6U8ABQ',`"I feel like you are perfect. Is there anything that you are hiding with me? A bad thing?"
"Always feel you are better than me, smarter than me, taller than me, hotter than me."
"So I wouldn't care giving my hand to you."

I have had so many questions in my mind. Some were serious, some were silly, and some were probably my overthinking.

But here we are.

I can't wait to see you.`],
 ['The Night Before','Perfect','Ed Sheeran','https://www.youtube.com/watch?v=2Vv-BfVoq4g',`Tomorrow is no longer just a date on the calendar.

It is a moment we have talked about, imagined, and waited for.

I don't know whether I'll be nervous, excited, silent, or smiling continuously.

But I know that tomorrow will become a memory.`],
 ['Finally, The Day','Perfect','Ed Sheeran','https://www.youtube.com/watch?v=2Vv-BfVoq4g',`THE COUNTDOWN IS OVER.
DECEMBER 04, 2026
WE FINALLY MADE IT HERE.

To the person who answered questions I once carried...

A giver always deserves another giver, and I will be your giver forever.

Will you hold my hand forever?`],
]
const checklistSeed = [
 ['Already fulfilled','Caring'],['Already fulfilled','Love'],['Already fulfilled','Height'],['Already fulfilled','Man'],['Already fulfilled','Mature'],['Already fulfilled','Intelligent'],['Already fulfilled','Efforts'],['Already fulfilled','Respect'],['Already fulfilled','Dancer'],['Already fulfilled','Shared goals'],['Already fulfilled','Responsibility'],['Already fulfilled','Support'],['Already fulfilled','Patience'],['Already fulfilled','Guidance'],
 ['Yet to be discovered','Trust'],['Yet to be discovered','Settled'],['Yet to be discovered','Family'],['Yet to be discovered','Acceptance'],['Yet to be discovered','Privacy'],['Yet to be discovered','Compatibility'],['Yet to be discovered','Consistency'],['Yet to be discovered','Honesty'],['Yet to be discovered','Loyalty'],['Yet to be discovered','Gym freak'],['Something we must understand together','Age gap'],
]
const milestonesSeed = [
 ['The beginning','How your story started.','2026-11-27'],['The conversations','Little moments that became important.',null],['The questions','Your doubts and his answers.',null],['The growing trust','The things you learned about each other.',null],['The little surprises','Thoughtful gestures and moments that made the distance feel smaller.',null],['The anticipation','Waiting to meet.',null],['The night before','What you both are feeling.',null],['A little more of us','The small memories and hopes you are carrying into this new chapter.',null],['December 4','The first meet, and the beginning of a new memory.','2026-12-04'],
]
function seed() {
  const chapters = chapterSeed.map((x,i)=>({id:i+1,chapter_number:i+1,chapter_date:`2026-12-${String(27+i).padStart(2,'0')}`,title:x[0],song_title:x[1],song_artist:x[2],song_url:x[3],message:x[4]}))
  // Correct the month boundary for the eight-day sequence.
  chapters.forEach((c,i)=>c.chapter_date=['2026-11-27','2026-11-28','2026-11-29','2026-11-30','2026-12-01','2026-12-02','2026-12-03','2026-12-04'][i])
  return {
    profiles:Object.values(PEOPLE), chapters,
    questions:questions.map((q,i)=>({id:i+1,chapter_id:q[0],question_text:q[1],sort_order:questions.slice(0,i).filter(x=>x[0]===q[0]).length+1})),
    responses:[], gallery_media:[],
    checklist_items:checklistSeed.map((x,i)=>({id:i+1,group_name:x[0],label:x[1],sort_order:i+1})),
    checklist_responses:[],
    story_milestones:milestonesSeed.map((x,i)=>({id:i+1,sort_order:i+1,title:x[0],description:x[1],event_date:x[2]})),
    promises:[],time_capsules:[],app_settings:[{key:'final_letter',value:'A giver always deserves another giver, and I will be your giver forever.\n\nWill you hold my hand forever? ❤️'}],
  }
}
function loadDB(){try{const raw=localStorage.getItem(DB_KEY);const data=raw?JSON.parse(raw):seed();const th=data.profiles?.find(p=>p.id==='local-thrinath');if(th)th.display_name='Threeeenadh';for(const c of data.chapters||[]){if(!c.song_url||c.song_url.includes('youtube.com')||c.song_url.includes('youtu.be')){c.song_title='A Little Instrumental';c.song_artist='SoundHelix';c.song_url='https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}}return data}catch{return seed()}}
let db=loadDB()
function persist(){localStorage.setItem(DB_KEY,JSON.stringify(db))}
let session=null
try{session=JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{}
const listeners=new Set()
function notify(){listeners.forEach(fn=>fn('SIGNED_IN',session))}
const auth={
 async getSession(){return {data:{session},error:null}},
 onAuthStateChange(fn){listeners.add(fn);return {data:{subscription:{unsubscribe:()=>listeners.delete(fn)}}}},
 async signInWithPassword({email,password}){const name=String(email||'').trim().toLowerCase();if(!['amogha','thrinath','threeeenadh'].includes(name)||password!==PASSWORD||PASSWORD==='SET_LOCAL_PASSWORD_IN_ENV')return {data:{user:null,session:null},error:{message:'Incorrect name or password. Check the local app password setup.'}};const person=PEOPLE[name==='threeeenadh'?'thrinath':name];session={user:{id:person.id,email:name+'@local.amrith'},access_token:'local-session'};localStorage.setItem(SESSION_KEY,JSON.stringify(session));notify();return {data:{user:session.user,session},error:null}},
 async signOut(){session=null;localStorage.removeItem(SESSION_KEY);listeners.forEach(fn=>fn('SIGNED_OUT',null));return {error:null}},
 async getUser(){return {data:{user:session?.user||null},error:null}},
}
function matches(row,filters){return filters.every(([key,val])=>row?.[key]===val)}
class Query{
 constructor(table){this.table=table;this.filters=[];this.sorts=[];this.mode='select';this.payload=null;this.single=false}
 select(){return this}
 eq(k,v){this.filters.push([k,v]);return this}
 order(k,opt={}){this.sorts.push([k,opt.ascending!==false]);return this}
 maybeSingle(){this.single=true;return this}
 insert(v){this.mode='insert';this.payload=v;return this}
 update(v){this.mode='update';this.payload=v;return this}
 upsert(v,opt={}){this.mode='upsert';this.payload=v;this.conflict=opt.onConflict?.split(',')||['id'];return this}
 delete(){this.mode='delete';return this}
 then(resolve,reject){return Promise.resolve().then(()=>this.run()).then(resolve,reject)}
 async run(){
   let rows=db[this.table]||(db[this.table]=[])
   if(this.mode==='insert'){
     const arr=Array.isArray(this.payload)?this.payload:[this.payload]
     for(const item of arr){const row={...item};if(row.id==null)row.id=crypto.randomUUID();if(!row.created_at)row.created_at=new Date().toISOString();rows.push(row)}
     persist();return {data:arr,error:null}
   }
   if(this.mode==='upsert'){
     const arr=Array.isArray(this.payload)?this.payload:[this.payload],out=[]
     for(const item of arr){let found=rows.find(r=>this.conflict.every(k=>r[k]===item[k]));if(found)Object.assign(found,item);else{found={...item};if(found.id==null)found.id=crypto.randomUUID();rows.push(found)}out.push(found)}
     persist();return {data:Array.isArray(this.payload)?out:out[0],error:null}
   }
   const selected=rows.filter(r=>matches(r,this.filters))
   if(this.mode==='update'){selected.forEach(r=>Object.assign(r,this.payload));persist();return {data:selected,error:null}}
   if(this.mode==='delete'){db[this.table]=rows.filter(r=>!matches(r,this.filters));persist();return {data:selected,error:null}}
   let result=selected.map(r=>({...r}))
   if(this.table==='chapters'&&String(this._select||'').includes('questions'))result=result.map(c=>({...c,questions:db.questions.filter(q=>q.chapter_id===c.id)}))
   for(const [k,asc] of this.sorts)result.sort((a,b)=>a[k]>b[k]?(asc?1:-1):a[k]<b[k]?(asc?-1:1):0)
   return {data:this.single?(result[0]||null):result,error:null}
 }
}
function from(table){const q=new Query(table);const select=q.select.bind(q);q.select=(columns='*')=>{q._select=columns;return select(columns)};return q}
const objectStores=new Map()
function openFiles(){return new Promise((resolve,reject)=>{const req=indexedDB.open('amrith-local-files',1);req.onupgradeneeded=()=>req.result.createObjectStore('files');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function fileOp(mode,path,value){const d=await openFiles();return new Promise((resolve,reject)=>{const tx=d.transaction('files',mode),store=tx.objectStore('files');let req;if(mode==='readwrite')req=store.put(value,path);else req=store.get(path);tx.oncomplete=()=>resolve(req?.result);tx.onerror=()=>reject(tx.error)})}
const storage={from(){return {
 async upload(path,file){await fileOp('readwrite',path,file);return {data:{path},error:null}},
 async remove(paths){const d=await openFiles();await new Promise((resolve,reject)=>{const tx=d.transaction('files','readwrite');paths.forEach(p=>tx.objectStore('files').delete(p));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});return {data:paths.map(name=>({name})),error:null}},
 async createSignedUrl(path){const blob=await fileOp('readonly',path);if(!blob)return {data:null,error:{message:'Local file not found'}};return {data:{signedUrl:URL.createObjectURL(blob)},error:null}}
}}}
export const sb={auth,from,storage,channel(){return {on(){return this},subscribe(){return this}}},async removeChannel(){}}
