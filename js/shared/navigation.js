export function createNavigationController({state,render}) {
function setupBottomNavigation(){
 const nav=document.querySelector("#bottomNav");
 nav.querySelector("#navHome").onclick=()=>{state.module=null;state.view="dashboard";render()};
 nav.querySelector("#navCalendar").onclick=()=>{state.module="Events & Calendar";state.view="module";render()};
 nav.querySelector("#navProfile").onclick=()=>{state.view="profile";render()};
 nav.querySelector("#navSettings").onclick=()=>{state.view="settings";render()};
}
function updateBottomNavigation(){
 const nav=document.querySelector("#bottomNav");
 const visible=Boolean(state.role && state.authenticated && state.role!=="superadmin");
 nav.hidden=!visible;
 document.body.classList.toggle("has-authenticated-role",visible);
 const active=state.view==="dashboard"?"navHome":state.view==="profile"?"navProfile":state.view==="settings"?"navSettings":state.view==="module" && state.module==="Events & Calendar"?"navCalendar":"";
 nav.querySelectorAll("button").forEach(button=>{
  const selected=button.id===active;
  button.classList.toggle("active",selected);
  if(selected)button.setAttribute("aria-current","page");else button.removeAttribute("aria-current");
 });
}
 return {setup:setupBottomNavigation,update:updateBottomNavigation};
}
