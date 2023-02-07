const buscar = document.getElementById("buscar");
let arrayAPI = [];
let locationList;
getLocationList();
buscar.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    console.log(locationList);
    let locationID = locationList.find(element => element.Municipio == buscar.value).IDMunicipio;
    getDataAPI(locationID);
  }
})


async function getLocationList() {
  await fetch("https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/Municipios/")
    .then(response => response.json())
    .then(data => {
      locationList = data;
    })
}
async function getDataAPI(locationId) {
  await fetch("https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/" + locationId)
    .then(response => response.json()).then(
      data => {
        console.log(data.ListaEESSPrecio);
      }
    )
}
