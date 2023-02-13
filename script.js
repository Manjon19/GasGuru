const buscar = document.getElementById("buscar");
const ca = document.getElementById("CCAA");
let arrayAPI = [];
let locationList;
let ccaaList;
let munGasList = [];
let generador = "";
let lat = "";
let lon = "";
GeoLocation();

function GeoLocation() {
  if (navigator.geolocation) {
    let geo = navigator.geolocation.getCurrentPosition(position);
    setTimeout(() => { console.log(lat); }, 200)
  }
}

async function position(pos) {
  const crd = pos.coords;
  lat = crd.latitude;
  lon = crd.longitude;
  console.log(lat)
}

getLocationList();
getCCAAList();
buscar.addEventListener("keyup", (event) => {
  let locationID = locationList.find(element => element.Municipio == buscar.value).IDMunicipio;
  getDataAPI(locationID);
  for (let index = 0; index < munGasList.length; index++) {
    let elemento = munGasList[index];
    let nuevoElemento = {}
    for (let key in elemento) {
      switch (key) {
        case "Precio Gasoleo A":

          if (elemento[key] == "") {
            nuevoElemento["PrecioGasoleoA"] = "No disponible";
          } else {
            nuevoElemento["PrecioGasoleoA"] = elemento[key];
          }
          break;
        case "Precio Gasolina 95 E5":
          if (elemento[key] == "") {
            nuevoElemento["PrecioGasolina95"] = "No disponible";
          } else {
            nuevoElemento["PrecioGasolina95"] = elemento[key];
          }

          break;
        case "Precio Gasolina 98 E5":
          if (elemento[key] == "") {
            nuevoElemento["PrecioGasolina98"] = "No disponible";
          } else {
            nuevoElemento["PrecioGasolina98"] = elemento[key];
          }
          break;
        default:
          nuevoElemento[key] = elemento[key];
          break;
      }

    }
    createGasCard(nuevoElemento);
    if (munGasList.length - 1 == index) {
      generador = "";
    }


  }

});

function createGasCard(elemento) {
  console.log(generador)
  generador += `
		<div class="carta" id="carta">
				<p><i>-Municipio: </i>${elemento.Municipio}</p>
        <p><i>-Diesel: </i>${elemento.PrecioGasoleoA}</p>
        <p><i>-Gasolina 95: </i>${elemento.PrecioGasolina95}</p>
        <p><i>-Gasolina 98: </i>${elemento.PrecioGasolina98}</p>
		</div>
		`
  document.getElementById("contenedorResultados").innerHTML = generador;
  console.log(generador)
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
