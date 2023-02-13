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

buscar.addEventListener("keyup", (e) => {
  let locationID = locationList.find(
    (element) => element.Municipio.toLowerCase() == buscar.value.toLowerCase()
  ).IDMunicipio;
  getDataAPI(locationID);
  let filteredList = munGasList.filter((elemento) => {
    return elemento.Municipio.toLowerCase().includes(
      buscar.value.toLowerCase()
    );
  });
  for (let index = 0; index < filteredList.length; index++) {
    let elemento = filteredList[index];
    let nuevoElemento = {};
    for (let key in elemento) {
      switch (key) {
        case "Precio Gasoleo A":
          if (elemento[key] == "") {
            nuevoElemento["PrecioGasoleoA"] = "No disponible";
          } else {
            nuevoElemento["PrecioGasoleoA"] = elemento[key] + "€";
          }
          break;
        case "Precio Gasolina 95 E5":
          if (elemento[key] == "") {
            nuevoElemento["PrecioGasolina95"] = "No disponible";
          } else {
            nuevoElemento["PrecioGasolina95"] = elemento[key] + "€";
          }

          break;
        case "Precio Gasolina 98 E5":
          if (elemento[key] == "") {
            nuevoElemento["PrecioGasolina98"] = "No disponible";
          } else {
            nuevoElemento["PrecioGasolina98"] = elemento[key] + "€";
          }
          break;
        default:
          nuevoElemento[key] = elemento[key];
          break;
      }
    }
    createGasCard(nuevoElemento);
    if (filteredList.length - 1 == index) {
      generador = "";
    }
  }
  console.log(munGasList);
});

function createGasCard(elemento) {
  //console.log(generador)
  generador += `
		<div class="carta" id="carta">
				<p class="cardTitle">${elemento.Rótulo}</p>
        <p><img src="./img/diesel.png" alt="Diesel"> Diesel: ${elemento.PrecioGasoleoA}</p>
        <p><img src="./img/95.png" alt="Diesel"> Gasolina 95: ${elemento.PrecioGasolina95}</p>
        <p><img src="./img/98.png" alt="Diesel"> Gasolina 98: ${elemento.PrecioGasolina98}</p>
        <p><img src="./img/horario.png" alt="Diesel"> ${elemento.Horario}</p>
        <p><img src="./img/direccion.png" alt="Diesel"> ${elemento.Dirección}</p>
        <p><img src="./img/municipio.png" alt="Diesel"> ${elemento.Municipio}</p>

		</div>
		`;
  document.getElementById("contenedorResultados").innerHTML = generador;
  //console.log(generador)
}


//funcion en la que filtraremos las cartas en funcion de lo que seleccionemos
function gasFilter(elemento){
  
  let filteredData = elemento.filter(function(elemento) {
    return elemento.PrecioGasolina98 != null;
  });
  
  console.log(filteredData);



 /*  let filteredData = [];
  for (let i = 0; i < munGasList.length; i++) {
    if (gasFilter.value === gasolina98) {
      if(munGasList[i].PrecioGasolina98 == null){
        console.log("no gas 98")
      };
    }
  }

  //console.log(munGasList)
  console.log(gasFilter.value) */
  

}


async function getLocationList() {
  await fetch("./JSONS/Municipios.json")
    .then((response) => response.json())
    .then((data) => {
      locationList = data;
    });
}
async function getCCAAList() {
  await fetch("./JSONS/CCAA.json")
    .then((response) => response.json())
    .then((data) => {
      ccaaList = data;
    });
}
async function getCAMun(ccaaID) {
  await fetch(
    "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/" +
      ccaaID
  )
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
    });
}
async function getDataAPI(locationId) {
  await fetch(
    "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/" +
      locationId
  )
    .then((response) => response.json())
    .then((data) => {
      munGasList = data.ListaEESSPrecio;
    });
}
