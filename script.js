let table = document.getElementById("table")
let station = document.getElementById("station")
let stnprint = document.getElementById("stnprint")
let stationlookup = document.getElementById("station-lookup")
let finderstart = document.getElementById("3letterfinder")
let letterender = document.getElementById("letterstarter")
let loadingfile = document.getElementById("loading")
let popularstations = document.getElementById("popularstations")
// Load stations automatically
let stns = [];
let historylist = []
let isthishistory = false
let currentHistory = -1
fetch('uk_stations_full.json')
    .then(response => response.json())
    .then(data => stns = data)
    .then(()=>PopularButtons())
    .catch(error => console.error('Error loading stations:', error));
async function run() {
    table.style.display = "none";
    loadingfile.style.display = 'block'
    stnprint.innerHTML = "Loading"
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
    rows = []
    // table.style.display = "block";
    stationlookup.style.display = "none";
    letterender.style.display = "none";
    finderstart.style.display = "block";
    if (isthishistory == false){
      if (currentHistory != historylist.length-1){
        historylist = historylist.slice(0,currentHistory+1)
      }
      historylist.push(station.value)
      currentHistory++
    }
    else{
      isthishistory = false
    }
    console.log(historylist)

      const data = await getData(station.value);
      let stationName = getStationName(data);
      console.log(stationName)
      if (data?.services === null) {
        stnprint.innerHTML == "No upcomming departures from "+ stationName + "."
        loadingfile.style.display = 'none'
      }
      
    if (!data) return;
    const trains = extractTrainDetails(data);
    console.log(trains.length)
    // trains.forEach(train => {
    //     newRow(train.platform, train.realtimeDeparture, train.destination, train.operator);
    // });
    table.style.display = "block";
      for (let i = train = 0; i < trains.length; i++ ){
        let train = trains[i]
        newRow(train.platform, train.realtimeDeparture, train.destination, train.operator, train.status, train.statusd, train.origin, train.serviceUid, train.crs)
      }

      stnprint.innerHTML = "You are looking at Departures from " + stationName
      loadingfile.style.display = 'none'
  }
// function newRow(platform,departure,destionation,operator){
//     let row = document.createElement("div")
//     row.className = "row"
//     let platformElement = document.createElement("span")
//     platformElement.innerHTML = platform
//     let departureElement = document.createElement("span")
//     departureElement.innerHTML = departure
//     let destionationElement = document.createElement("span")
//     destionationElement.innerHTML = destionation
//     destionationElement.onclick = goNew(destination)
//     let operatorElement = document.createElement("span")
//     operatorElement.innerHTML = operator
//     row.appendChild(platformElement)
//     row.appendChild(departureElement)
//     row.appendChild(destionationElement)
//     row.appendChild(operatorElement)
//     table.appendChild(row)
// }
function newRow(platform, departure, destination, operator, status, statusd, origin, ServiceUid, crs) {
  let row = document.createElement("div")
  row.className = "row"

  let platformElement = document.createElement("span")
  platformElement.innerHTML = platform

  let departureElement = document.createElement("span");
  departureElement.innerHTML = departure;
  departureElement.style.cursor = "pointer"; // make it obvious it's clickable
  departureElement.title = `Open service ${ServiceUid}`;
  departureElement.onclick = () => {
    window.open(`./ServiceInfo/index.html#/${encodeURIComponent(ServiceUid)}`, "_blank");
  };

  let destinationElement = document.createElement("span")
  destinationElement.innerHTML = destination
  destinationElement.style.cursor = "pointer" // Optional: show pointer on hover
  destinationElement.onclick = () => betterGoNew(crs)

  let operatorElement = document.createElement("span")
  operatorElement.innerHTML = operator

  let statusElement = document.createElement("span")
  statusElement.innerHTML = status
  statusElement.title = statusd

  let originElement = document.createElement("span")
  originElement.innerHTML = origin
  originElement.style.cursor = "pointer" // Optional: show pointer on hover
  originElement.onclick = () => goNew(origin)


  row.appendChild(platformElement)
  row.appendChild(originElement)
  row.appendChild(departureElement)
  row.appendChild(destinationElement)
  row.appendChild(operatorElement)
  row.appendChild(statusElement)

  table.appendChild(row)
}
// async function getData(station){
//     const username = "rttapi_BayleyDuquetteSF";
//     const password = "bb79df0b52901909f8a5349aabccdbb5394b8d7e";
//     const credentials = `${username}:${password}`;
//     const encodedCredentials =  btoa(credentials); // For browser environments
//     const authorizationHeader = `Basic ${encodedCredentials}`
//     try {
//         const response = await fetch('https://api.rtt.io/api/v1/json/search/'+station, {
//             headers: {
//                 "Authorization": authorizationHeader
//             }
//         })
//         if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log(data)
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }
async function getData(station) {
    try {
        const response = await fetch('https://api-proxy.thomas-abadines.workers.dev/api/search/' + station);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        stnprint.innerHTML = "Error fetching Data"
        return null;
    }
}
function backButton(){
  if (currentHistory > 0){
    let number = currentHistory - 1
    currentHistory = number
    isthishistory = true
    gotoStation(historylist[number])
  }
  else{
    console.log("No more history")
  }
}
function forwardButton(){
  if (currentHistory < historylist.length-1){
  let number = currentHistory + 1
  currentHistory = number
  isthishistory = true
  gotoStation(historylist[number])
  }
  else{
    console.log("No more history")
  }
}
// function extractTrainDetails(data) {
//     return data.services.map(service => {
//     const detail = service.locationDetail;
//     return {
//         platform: detail.platform || "Unknown",
//         realtimeDeparture: detail.realtimeDeparture || "Unknown",
//         destination: detail.destination?.[0]?.description || "Unknown",
//         operator: service.atocName || "Unknown"
//     };
//     });
// }
function isCrsCodeIncluded(crsCode, stationList) {
  return stationList.some(station => station.crsCode === crsCode);
}
function gotoStation(code){
  station.value = code
  run()
}

function threeRandomStations(){
  let list = []
  for (let i = 0; i < 3; i++){
    let randomIndex2 = Math.floor(Math.random() * stns.length);
    let statione = stns[randomIndex2];
    // list.push({statione.crsCode, statione.stationName})
    list.push({ crsCode: statione.crsCode, stationName: statione.stationName })
  }
  return list
}
function PopularButtons(){
  // let button_one = document.createElement("button")
  // // button_one.onclick = gotoStation("LST")
  // button_one.onclick = ()=>{gotoStation("LST")}
  // button_one.innerText = "London Liverpool Street"
  // button_one.class = "popbut"
  // let button_two = document.createElement("button")
  // // button_two.onclick = gotoStation("EDB")
  // button_two.onclick = ()=>{gotoStation("EDB")}
  // button_two.innerText = "Edinburgh Waverly"
  // button_two.class = "popbut"
  // let button_three = document.createElement("button")
  // // button_three.onclick = gotoStation("CDF")
  // button_three.onclick = ()=>{gotoStation("CDF")}
  // button_three.innerText = "Cardiff Central"
  // button_three.class = "popbut"

  // let button_one2 = document.createElement("button")
  // // button_one2.onclick = gotoStation(list[0])
  // button_one2.onclick = ()=>{gotoStation(list[0].crsCode)}
  // button_one2.innerText = list[0].stationName
  // button_one2.class = "popbut"
  // let button_two2 = document.createElement("button")
  // // button_two2.onclick = gotoStation(list[1])
  // button_two2.onclick = ()=>{gotoStation(list[1].crsCode)}
  // button_two2.innerText = list[1].stationName
  // button_two2.class = "popbut"
  // let button_three2 = document.createElement("button")
  // button_three2.onclick = ()=>{gotoStation(list[2].crsCode)}
  // button_three2.innerText = list[2].stationName
  // button_three2.class = "popbut"
  // // button_three2.onclick = gotoStation(list[2])
  // popularstations.appendChild(button_one)
  // popularstations.appendChild(button_two)
  // popularstations.appendChild(button_three)
  // popularstations.appendChild(button_one2)
  // popularstations.appendChild(button_two2)
  // popularstations.appendChild(button_three2)

  let knownbuttons = [{CRS: "LST", Name: "London Liverpool Street"},{CRS: "EDB", Name: "Edinburgh Waverly"},{CRS: "CDF", Name: "Cardiff Central"}]
  for(let i = 0; i < 3; i++){
    let button_one = document.createElement("button")
    button_one.onclick = ()=>{gotoStation(knownbuttons[i].CRS)}
    button_one.innerText = knownbuttons[i].Name
    button_one.class = "popbut"
    popularstations.appendChild(button_one)
  }
  let list = threeRandomStations()
  console.log(list)
  for(let i = 0; i < 3; i++){
    let button_one2 = document.createElement("button")
    button_one2.onclick = ()=>{gotoStation(list[i].crsCode)}
    button_one2.innerText = list[i].stationName
    button_one2.class = "popbut"
    popularstations.appendChild(button_one2)
  }
}
function extractTrainDetails(data){
  let results = []
  if (data.services === null) {
    console.log("Services is null");
    stnprint.innerHTML = "No upcomming departures"
  }
  else{
    for (let i = 0; i < data.services.length; i ++){
      let service = data.services[i]
      console.log(service)
      console.log(i)
      let detail = service.locationDetail
      let plt = ""
      let ope =""
      let status
      let location
      // if (service.serviceType == "bus"){
      //   plt = "BUS"
      //   dep = detail.gbttBookedDeparture
      // }
      // else if (service.serviceType == "ship"){
      //   plt = "SHIP"
      //   dep = detail.gbttBookedDeparture
      // }
      // else{
      //   plt = detail.platform
      //   dep = detail.realtimeDeparture
      // }
      console.log(detail.platform)
      if (detail.serviceLocation == "AT_PLAT"){
        location = " - At Platform"
      }
      else if (detail.serviceLocation == "APPR_PLAT"){
        location = " - Approaching Platform"
      }
      else if (detail.serviceLocation == "APPR_STAT"){
        location = " - Approaching Station"
      }
      else if (detail.serviceLocation == "DEP_PREP"){
        location = " - Preparing to Depart"
      }
      else if (detail.serviceLocation == "DEP_READY"){
        location = " - Ready to Depart"
      }
      else if (detail.serviceLocation == null){
        location = " "
      }
      else{
        location = " - " + detail.serviceLocation
      }
      console.log(location)
      console.log(service.serviceType)

      if (service.serviceType == "bus"){
        plt = "BUS"
        dep = detail.gbttBookedDeparture
        status = "No info"
        statusd = ""
      }
      else if (service.serviceType == "ship"){
        plt = "SHIP"
        dep = detail.gbttBookedDeparture
        status = "No info"
        statusd = ""
      }
      else{
        plt = detail.platform + location
        dep = detail.gbttBookedDeparture
        if (detail.platform == null){
          plt = "No info"
        }
      }

      if (service.atocCode == "LD"){
        ope = "Lumo"
      }
      else{
        ope = service.atocName
      }
      if(detail.realtimeDeparture == detail.gbttBookedDeparture){
        if (service.serviceType == "train"){
        status = "On Time"
        statusd = ""
        }
      }
      else if (detail.realtimeDeparture != detail.gbttBookedDeparture){
        if (service.serviceType == "train"){
          if (detail.realtimeDeparture == null){
            status = "No info"
            statusd = ""
          }
          else{
            status = "Exp. " + detail.realtimeDeparture
            if (detail.realtimeDeparture > detail.gbttBookedDeparture){
              statusd = "Delayed"
            }
            else{
              statusd = "Early"
            }
          }
        }
      }
      if (detail.displayAs == "CANCELLED_CALL"){
        status = "Canceled"
        statusd = detail.cancelReasonLongText
      }
      // let des
      // if (detail.destination.length > 1){
      //   for (let i; i<detail.destination.length; i++){
      //     des = des + ", " + detail.destination?.[i]?.description
      //   }
      // }
      // else{
      //   des = detail.destination?.[0]?.description || "Unknown"
      // }
      let des = ""
      console.log(detail.destination.length)
      if (detail.destination.length > 1){
          for (let i = 0; i<detail.destination.length; i++){
              if (i == 0){
                  des = des + detail.destination?.[i]?.description
              }
              else{
                  des = des + ", " + detail.destination?.[i]?.description
              }
              console.log(des)
          }
        }
        else{
          des = detail.destination?.[0]?.description || "Unknown"
        }
      console.log(plt)
      console.log(detail.serviceUid)
      results.push({
        platform: plt || "Unknown",
        realtimeDeparture: dep || "Unknown",
        destination: des,
        operator: ope || "Unknown",
        status: status,
        statusd: statusd,
        origin: detail.origin?.[0]?.description || "Unknown",
        serviceUid: service.serviceUid,
        crs: detail.destination?.[0]?.tiploc
      })
    }
    return results
  }

}


// Random station generator function
function getRandomStation() {
    if (stns.length === 0) {
        stnprint.innerHTML = 'Loading stations, please wait...';
        return;
    }

    const randomIndex = Math.floor(Math.random() * stns.length);
    let statione = stns[randomIndex];
    stnprint.innerHTML = `${statione.stationName} (${statione.crsCode})`;
    station.value = statione.crsCode
    run()
}
function getStationName(data) {
    return data?.location?.name || "Unknown Station";
}

// Station Code Finder Script
let stations = null;

// Load station data
fetch('uk_stations_full.json')
  .then(r => {
    if (!r.ok) throw new Error('Failed to load station data');
    return r.json();
  })
  .then(data => {
    stations = data;
  })
  .catch(err => {
    document.getElementById('finder').textContent = 'Failed to load station data.';
    console.error(err);
  });
function letterfinder(){
    if (stationlookup.style.display == "none"){
        stationlookup.style.display = "block";
        letterender.style.display = "block";
        finderstart.style.display = "none";
    }
    else{
        stationlookup.style.display = "none";
        letterender.style.display = "none";
        finderstart.style.display = "block";
    }
}

document.getElementById('lookupButton').addEventListener('click', () => {
  const input = document.getElementById('stationInput').value.trim().toLowerCase();
  const output = document.getElementById('finder');

  if (!stations) {
    output.textContent = 'Station data is still loading…';
    return;
  }

  // Search station by name (case-insensitive)
  const match = Object.values(stations).find(info => info.stationName.toLowerCase() === input);

  if (match) {
    output.textContent = `Station: ${match.stationName} → Code: ${match.crsCode}`;
    station.value = match.crsCode
    run()
  } else {
    output.textContent = 'Station not found.';
  }
});
// Live suggestions dropdown
document.addEventListener('DOMContentLoaded', () => {
  const stationInput = document.getElementById('stationInput');
  const suggestionsBox = document.createElement('div');
  suggestionsBox.id = 'suggestionsBox';
  suggestionsBox.style.border = '1px solid #000';
  suggestionsBox.style.display = 'none';
  suggestionsBox.style.position = 'absolute';
  suggestionsBox.style.backgroundColor = '#fff';
  suggestionsBox.style.maxHeight = '150px';
  suggestionsBox.style.overflowY = 'auto';
  suggestionsBox.style.zIndex = '1000';

  // Insert the suggestions box directly below the input
  stationInput.parentNode.appendChild(suggestionsBox);

  stationInput.addEventListener('input', () => {
    const query = stationInput.value.trim().toLowerCase();
    suggestionsBox.innerHTML = '';
    if (!query || !stations) {
      suggestionsBox.style.display = 'none';
      return;
    }

    // Find matching stations
    const matches = Object.values(stations)
      .filter(info => info.stationName.toLowerCase().startsWith(query))
      .slice(0, 5); // Show top 5 suggestions

    if (matches.length === 0) {
      suggestionsBox.style.display = 'none';
      return;
    }

    matches.forEach(match => {
      const suggestion = document.createElement('div');
      suggestion.textContent = match.stationName;
      suggestion.style.padding = '5px';
      suggestion.style.cursor = 'pointer';
      suggestion.addEventListener('click', () => {
        stationInput.value = match.stationName;
        suggestionsBox.style.display = 'none';
      });
      suggestionsBox.appendChild(suggestion);
    });

    suggestionsBox.style.display = 'block';
  });

  // Hide suggestions when clicking outside
  document.addEventListener('click', (event) => {
    if (event.target !== stationInput && event.target.parentNode !== suggestionsBox) {
      suggestionsBox.style.display = 'none';
    }
  });
});
function displayDisruptions(disruptions) {
  const container = document.getElementById("disruptionsContainer");
  if (!container) return;

  if (disruptions.length === 0) {
    container.innerHTML = "<p>No current major disruptions.</p>";
    return;
  }

  container.innerHTML = disruptions.map(d =>
    `<div style="border:1px solid red;padding:8px;margin:6px 0;">
      <strong>${d.title}</strong><br>${d.description}
    </div>`
  ).join("");
}
async function goNew(name) {
  try {
    const response = await fetch('uk_stations_full.json')
    const data = await response.json()
    const input = name.trim().toLowerCase()

    let match = null

    // 1. Exact match
    match = data.find(s => s.stationName.toLowerCase() === input)

    // 2. Full word match (input matches any full word in station name)
    if (!match) {
      const wordMatches = data.filter(s => {
        const words = s.stationName.toLowerCase().split(/\s+/)
        return words.includes(input)
      })
      if (wordMatches.length === 1) {
        match = wordMatches[0]
      } else if (wordMatches.length > 1) {
        match = wordMatches.sort((a, b) => a.stationName.length - b.stationName.length)[0]
      }
    }

    // 3. Match first word starts with input (e.g. "edinburgh" → "Edinburgh Waverley" not Park)
    if (!match) {
      const firstWordMatches = data.filter(s => {
        const firstWord = s.stationName.toLowerCase().split(" ")[0]
        return firstWord.startsWith(input)
      })
      if (firstWordMatches.length === 1) {
        match = firstWordMatches[0]
      } else if (firstWordMatches.length > 1) {
        match = firstWordMatches.sort((a, b) => a.stationName.length - b.stationName.length)[0]
      }
    }

    // 4. Contains match as last resort
    if (!match) {
      const containsMatches = data.filter(
        s => s.stationName.toLowerCase().includes(input)
      )
      if (containsMatches.length === 1) {
        match = containsMatches[0]
      } else if (containsMatches.length > 1) {
        match = containsMatches.sort((a, b) => a.stationName.length - b.stationName.length)[0]
      }
    }

    if (match) {
      station.value = match.crsCode
      run()
    }

  } catch (err) {
    stnprint.innerHTML