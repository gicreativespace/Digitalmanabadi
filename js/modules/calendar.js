export function renderCalendarMarkup({state,T}){
 const locale=state.lang==="te"?"te-IN":"en-IN";
 const first=new Date(state.selectedYear,state.selectedMonth,1),count=new Date(state.selectedYear,state.selectedMonth+1,0).getDate(),offset=first.getDay();
 const month=new Intl.DateTimeFormat(locale,{month:"long",year:"numeric"}).format(first);
 const weekdays=Array.from({length:7},(_,i)=>new Intl.DateTimeFormat(locale,{weekday:"short"}).format(new Date(2026,0,4+i)));
 const eventDays=state.selectedMonth===10&&state.selectedYear===2026?[14,17,25]:[];
 const cells=Array.from({length:Math.ceil((offset+count)/7)*7},(_,i)=>{const n=i-offset+1;if(n<1||n>count)return '<span class="calendar-empty" aria-hidden="true"></span>';const d=new Date(state.selectedYear,state.selectedMonth,n);return '<button type="button" class="day '+(eventDays.includes(n)?"has-event ":"")+(state.selectedDate===n?"selected":"")+'" data-day="'+n+'" aria-label="'+new Intl.DateTimeFormat(locale,{dateStyle:"full"}).format(d)+'">'+new Intl.NumberFormat(locale).format(n)+'</button>'}).join("");
 const selected=new Date(state.selectedYear,state.selectedMonth,state.selectedDate);
 const message=eventDays.includes(state.selectedDate)?T("ఈ తేదీకి సంబంధించిన అన్ని కార్యక్రమాలు క్రింద కనిపిస్తాయి.","All events for this date appear below."):T("ఈ తేదీకి కార్యక్రమాలు నమోదు కాలేదు.","No events are recorded for this date.");
 return '<div class="calendar-title"><div class="calendar-month-nav"><button type="button" class="btn secondary" id="calendarPrev" aria-label="'+T("గత నెల","Previous month")+'">‹</button><strong>'+month+'</strong><button type="button" class="btn secondary" id="calendarNext" aria-label="'+T("తదుపరి నెల","Next month")+'">›</button></div><span>'+T("కార్యక్రమ తేదీలు ప్రత్యేకంగా గుర్తించబడతాయి","Event dates are highlighted")+'</span></div><div class="calendar-grid">'+weekdays.map(d=>"<b>"+d+"</b>").join("")+cells+'</div><div class="selected-event"><strong>'+T("ఎంచుకున్న తేదీ","Selected date")+": "+new Intl.DateTimeFormat(locale,{dateStyle:"full"}).format(selected)+'</strong><p>'+message+'</p></div>';
}
