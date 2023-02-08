const buscar = document.getElementById("buscar");
const ca = document.getElementById("CCAA");
let arrayAPI = [];
let locationList;
let ccaaList;
let munGasList = [];
getLocationList();
getCCAAList();
buscar.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    let locationID = locationList.find(element => element.Municipio == buscar.value).IDMunicipio;

    getDataAPI(locationID);
    munGasList.forEach(elemento => {
      let nuevoElemento = {}
      for (let key in elemento) {
        switch (key) {
          case "Precio Gasoleo A":
            nuevoElemento["PrecioGasoleoA"] = elemento[key];
            break;
          case "Precio Gasolina 95":
            nuevoElemento["PrecioGasolina95"] = elemento[key];
            break;
          case "Precio Gasolina 98":
            nuevoElemento["PrecioGasolina98"] = elemento[key];
            break;
          default:
            nuevoElemento[key] = elemento[key];
            break;
        }
        createGasCard(nuevoElemento);
      }
    });
  }
})

function createGasCard(elemento) {
  console.log(elemento);
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
