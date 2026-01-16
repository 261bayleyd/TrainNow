let OperatorPrint = document.getElementById("OperatorPrint")
let PowerPrint = document.getElementById("PowerPrint")
let IdentityPrint = document.getElementById("IdentityPrint")
let ClassPrint = document.getElementById("ClassPrint")
let stops = document.getElementById("stops")
let serviceUid = document.getElementById("ServiceUid").value
async function Submit(){
    let rows = document.getElementsByClassName("row")
    console.log(rows.length)
    if (rows.length != 0){
      // for (let i = 0; i < rows.length; i++){
      //   let row = rows[i]
      //   // row.parentNode.removeChild(row)
      //   row.remove()
      // }
      document.querySelectorAll(".row").forEach(e => e.remove())
    }
    let serviceUid = document.getElementById("ServiceUid").value
    let date = document.getElementById("date").value
    let infotitle = document.getElementById("infotitle")
    let data = await getServiceInfo(serviceUid,date)
    console.log(data)
    let powerType
    console.log(data.origin[0].description)
    if (data.powerType == "EMU" || data.powerType == "E"){
      powerType = "Electric"
    }
    else if (data.powerType == "DMU" || data.powerType == "D"){
      powerType = "Diesel"
    }
    else if (data.powerType == null){
      powerType = data.serviceType
    }
    else{
      powerType = data.powerType
    }
    let passenger = ""
    let time = data.origin[0].publicTime
    if (data.isPassenger != true){
      passenger = " - Empty stock Movement"
      time = data.origin[0].workingTime
    }
    let classp = ""
    if (data.trainClass == "S"){
      classp = "Standard Class Only Seating"
    }
    else if (data.trainClass == "B"){
      classp = "First & Standard Class Seating"
    }
    else{
      classp = "First & Standard Class Seating"
    }
    let Ope = ""
    if (data.atocCode == "LD" || data.atocCode == "LF"){
      Ope = "Lumo"
    }
    else{
      Ope = data.atocName
    }
    OperatorPrint.innerHTML = Ope
    PowerPrint.innerHTML = powerType
    IdentityPrint.innerHTML = data.runningIdentity
    ClassPrint.innerHTML = classp
    infotitle.innerHTML = time + " " + data.origin[0].description + " To " + data.destination[0].description + passenger
    addStations(data)
    stops.style.display = "block"
}
function addStations(data){
    let location
    for (let i=0; i<data.locations.length; i++){
        if (data.locations[i].serviceLocation == "AT_PLAT"){
            location = " - At Platform"
          }
          else if (data.locations[i].serviceLocation == "APPR_PLAT"){
            location = " - Approaching Platform"
          }
          else if (data.locations[i].serviceLocation == "APPR_STAT"){
            location = " - Approaching Station"
          }
          else if (data.locations[i].serviceLocation == "DEP_PREP"){
            location = " - Preparing to Depart"
          }
          else if (data.locations[i].serviceLocation == "DEP_READY"){
            location = " - Ready to Depart"
          }
          else if (data.locations[i].serviceLocation == null){
            location = " "
          }
          else{
            location = " - " + data.locations[i].serviceLocation
          }
          let AssociationsText

        let row = document.createElement("div")
        let StationElement = document.createElement("span")
        StationElement.innerHTML = data.locations[i].description + location
        StationElement.onclick = () => {
          window.open(
            `/index.html#${encodeURIComponent(data.locations[i].tiploc)}`,
            "_blank"
          );
        };

        let AssociationsElement = document.createElement("span")
        if (data.locations[i].associations != null){

            for (let j=0;j<data.locations[i].associations.length; j++){
              let Divide = document.createElement("a")
              if (data.locations[i].associations[j].type == "next") {
                if (data.locations[0].associations != null &&
                    data.locations[0].associations[j] &&
                    data.locations[0].associations[j].type == "next") {
              
                  Divide.innerHTML = "This Train was: "
                    + data.locations[i].associations[j].associatedUid + " "
                } else {
                  Divide.innerHTML = "This Train Becomes: "
                    + data.locations[i].associations[j].associatedUid + " "
                }
              }
              else if (data.locations[i].associations[j].type == "join"){
                  Divide.innerHTML = "This Train joins with: "
                   + data.locations[i].associations[j].associatedUid + " "
              }
              else if (data.locations[i].associations[j].type == "divide"){
              Divide.innerHTML = "This Train Divides to: " + data.locations[i].associations[j].associatedUid + " "
              }
              else{
                Divide.innerHTML = data.locations[i].associations[j].type + ": " + data.locations[i].associations[j].associatedUid + " "
              }
              Divide.onclick = () => {
                  document.getElementById("ServiceUid").value = data.locations[i].associations[j].associatedUid
                  Submit()
                }
              AssociationsElement.appendChild(Divide)
          }
        }

        let ArrivalElement = document.createElement("span")
        ArrivalElement.innerHTML = data.locations[i].gbttBookedArrival ?? "";

        let departureElement = document.createElement("span")
        departureElement.innerHTML = data.locations[i].gbttBookedDeparture ?? "";

        let PlatformElement = document.createElement("span")
        PlatformElement.innerHTML = data.locations[i].platform ?? "No info";

        let DelayElement = document.createElement("span")
        if (data.locations[i].displayAs == "CANCELLED_CALL"){
            DelayElement.innerHTML = "Canceled"
            DelayElement.title = data.locations[i].cancelReasonLongText
          }
        else{
            DelayElement.innerHTML = data.locations[i].realtimeGbttArrivalLateness ?? data.locations[i].realtimeGbttDepartureLateness ?? ""
        }

        row.appendChild(StationElement)
        row.appendChild(AssociationsElement)
        row.appendChild(ArrivalElement)
        row.appendChild(departureElement)
        row.appendChild(PlatformElement)
        row.appendChild(DelayElement)

        row.className = "row"
        stops.appendChild(row)
    }
}
async function getServiceInfo(serviceUid,date) {
    try {
        const response = await fetch('https://api-proxy.thomas-abadines.workers.dev/api/service/' + serviceUid + "/" + date);
        console.log('https://api-proxy.thomas-abadines.workers.dev/api/service/' + serviceUid + "/" + date)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        console.log("Error fetching Data")
        return null;
    }
}
// CODE BELOW THIS LINE IS FROM CHATGPT
// ------------------------------------------------------------------------
// --- Auto-fill from URL (hash, query, or path) and auto-submit -----------
(function () {
  function todayYMD() {
    const now = new Date();
    const y = String(now.getFullYear());
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return { y, m, d };
  }

  function tryFromHash() {
    // Supports: #/SERVICE/YYYY/MM/DD  or  #/SERVICE   (defaults to today)
    if (!location.hash) return null;
    const raw = location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);

    if (parts.length >= 4) {
      const [service, y, m, d] = parts.slice(-4);
      if (/^\d{4}$/.test(y) && /^(0?[1-9]|1[0-2])$/.test(m) && /^(0?[1-9]|[12]\d|3[01])$/.test(d)) {
        return { service, y, m, d };
      }
    }
    if (parts.length >= 1) {
      const service = parts[parts.length - 1];
      const { y, m, d } = todayYMD();
      return { service, y, m, d };
    }
    return null;
  }

  function tryFromQuery() {
    // Supports: ?service=U9018&date=2025/11/08  OR  ?service=U9018 (defaults to today)
    const sp = new URLSearchParams(location.search);
    const service = sp.get("service");
    const date = sp.get("date");
    if (service && date) {
      const m = date.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
      if (m) return { service, y: m[1], m: m[2], d: m[3] };
    }
    if (service && !date) {
      const { y, m, d } = todayYMD();
      return { service, y, m, d };
    }
    return null;
  }

  function tryFromPath() {
    // Supports: …/SERVICE/YYYY/MM/DD  OR  …/SERVICE (defaults to today; needs SPA fallback to work locally)
    const parts = location.pathname.split("/").filter(Boolean);

    if (parts.length >= 4) {
      const [service, y, m, d] = parts.slice(-4);
      if (/^\d{4}$/.test(y) && /^(0?[1-9]|1[0-2])$/.test(m) && /^(0?[1-9]|[12]\d|3[01])$/.test(d)) {
        return { service, y, m, d };
      }
    }

    if (parts.length >= 1) {
      const last = parts[parts.length - 1];
      // Avoid treating the folder/page name as the service id
      if (last.toLowerCase() !== "serviceinfo") {
        const service = last;
        const { y, m, d } = todayYMD();
        return { service, y, m, d };
      }
    }
    return null;
  }

  function applyAndSubmit(found) {
    if (!found) return;
    const serviceInput = document.getElementById("ServiceUid");
    const dateInput = document.getElementById("date");
    if (!serviceInput || !dateInput) return;

    const mm = found.m.toString().padStart(2, "0");
    const dd = found.d.toString().padStart(2, "0");
    serviceInput.value = found.service;
    dateInput.value = `${found.y}/${mm}/${dd}`;

    if (typeof Submit === "function") Submit();
  }

  function initAutofill() {
    try {
      const found = tryFromHash() || tryFromQuery() || tryFromPath();
      applyAndSubmit(found);
    } catch (e) {
      console.error("Autofill-from-URL failed:", e);
    }
  }

  window.addEventListener("load", initAutofill);
  window.addEventListener("hashchange", initAutofill);
})();