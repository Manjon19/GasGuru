const buscar = document.getElementById("buscar");
const ca = document.getElementById("CCAA");
let arrayAPI = [];
let locationList;
let ccaaList;
getLocationList();
getCCAAList();
let gen = "";
ccaaList.forEach(element => {
  gen += element.CCAA + "<br>";
})
ca.innerHTML = gen
buscar.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    let locationID = locationList.find(element => element.Municipio == buscar.value).IDMunicipio;

    let munGasList = getDataAPI(locationID);
    munGasList.forEach(elemento => {
      createGasCard(elemento);
    });
  }
})

async function getLocationList() {
  await fetch("./JSONS/Municipios.json")
    .then(response => response.json())
    .then(data => {
      locationList = data;
    })
}
async function getCCAAList() {
  await fetch("./JSONS/CCAA.json")
    .then(response => response.json())
    .then(data => {
      ccaaList = data;
    })
}
async function getCAMun(ccaaID) {
  await fetch("https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/" + ccaaID).then(response => response.json()).then(
    data => {
      console.log(data);
    }
  )
}
async function getDataAPI(locationId) {
  await fetch("https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/" + locationId)
    .then(response => response.json()).then(
      data => {
        console.log(data.ListaEESSPrecio);
      }
    )
}
