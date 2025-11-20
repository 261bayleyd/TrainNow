let stops = document.getElementById("stops")
let date = document.getElementById("date").value
let today = new Date();
let year = today.getFullYear();
let month = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
let day = String(today.getDate()).padStart(2, '0');
let formattedDate = `${year}/${month}/${day}`;
date.value = formattedDate
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
    let Start = document.getElementById("Start").value
    let End = document.getElementById("End").value
    date = document.getElementById("date").value
    let time = document.getElementById("time").value
    let infotitle = document.getElementById("infotitle")
    let data = await getServiceInfo(Start,End,date,time)
    console.log(data)
    addServices(data)
    stops.style.display = "block"
}
function addServices(data){
    for (let i=0; i<data.services.length; i++){
        let row = document.createElement("div")

        let StartElement = document.createElement("span")
        StartElement.innerHTML = data.location.name

        let PlatformElement = document.createElement("span")
        PlatformElement.innerHTML = data.services[i].locationDetail.platform

        let DepartureElement = document.createElement("span")
        DepartureElement.innerHTML = data.services[i].locationDetail.gbttBookedDeparture

        let des = ""
        console.log(data.services[i].locationDetail.destination.length)
        if (data.services[i].locationDetail.destination.length > 1){
            for (let j = 0; j<data.services[i].locationDetail.destination.length; j++){
                console.log(data.services[i].locationDetail.destination?.[j]?.description)
                if (j == 0){
                    des = des + data.services[i].locationDetail.destination?.[j]?.description  
                }
                else{
                    des = des + ", " + data.services[i].locationDetail.destination?.[j]?.description
                }
                console.log(des)
            }
          }
          else{
            des = data.services[i].locationDetail.destination?.[0]?.description || "Unknown"
          }
        console.log(des)
        let ServiceElement = document.createElement("span")
        ServiceElement.innerHTML = des

        let OperatorElement = document.createElement("span")
        OperatorElement.innerHTML = data.services[i].atocName

        row.appendChild(StartElement)
        row.appendChild(PlatformElement)
        row.appendChild(DepartureElement)
        row.appendChild(ServiceElement)
        row.appen