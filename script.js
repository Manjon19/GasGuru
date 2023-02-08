const buscar = document.getElementById("buscar");
const ca = document.getElementById("CCAA");
let arrayAPI = [];
let locationList;
let ccaaList;
let munGasList = [];
getLocationList();
getCCAAList();
buscar.addEventListener("keypress", async (event) => {
  if (event.key == "Enter") {
    let locationID = locationList.find(element => element.Municipio == buscar.value).IDMunicipio;

    getDataAPI(locationID);
    munGasList.forEach(elemento => {
      createGasCard(elemento);
    });
  }
})

function createGasCard(elemento) {
  console.log(elemento)
  let generado = ""
  generado += `
		<div class="carta" id="carta">
				<p><i>-Municipio: </i>${elemento.Municipio}</p>
        <p><i>-Diesel: </i>${elemento.PrecioGasoleoA}</p>
        <p><i>-Gasolina 95: </i>${elemento.PrecioGasolina95}</p>
        <p><i>-Gasolina 98: </i>${elemento.PrecioGasolina98}</p>
		</div>
		`
  document.getElementById("contenedorResultados").innerHTML = generado
}


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
        munGasList = data.ListaEESSPrecio;
      }
    )
}
