const buscar = document.getElementById("buscar");
const ca = document.getElementById("CCAA");
const btn_loc = document.getElementById("location");
btn_loc.addEventListener("click", geoLocalizacion);
let arrayAPI = [];
let locationList;
let ccaaList;
let munGasList = [];
let generador = "";
let lat = "";
let lon = "";
let munGasListTrad = [];
let closeGasList = [];
//Metodo de localizacion para obtener gasolineras cercanas.
function geoLocalizacion() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position);
    setTimeout(() => {
      nuevaCoordN = rastreator(lat, lon, 0.5, "norte");
      nuevaCoordS = rastreator(lat, lon, 0.5, "sur");
      nuevaCoordE = rastreator(lat, lon, 0.5, "este");
      nuevaCoordO = rastreator(lat, lon, 0.5, "oeste");
      getCloseGas(nuevaCoordS, nuevaCoordN, nuevaCoordE, nuevaCoordO);
    }, 1300);
  }
}
function rastreator(lat, long, distance, direction) {
  const earthRadius = 6371; // Radio de la Tierra en kilómetros
  const latRads = (lat * Math.PI) / 180; // Convertir latitud a radianes
  const longRads = (long * Math.PI) / 180; // Convertir longitud a radianes
  const distanceDegs = (distance / earthRadius) * (180 / Math.PI); // Convertir distancia en km a grados
  let newLat, newLong;

  switch (direction) {
    case "norte":
      newLat = lat + distanceDegs;
      newLong = long;
      break;
    case "sur":
      newLat = lat - distanceDegs;
      newLong = long;
      break;
    case "este":
      newLat = lat;
      newLong = long + distanceDegs / Math.cos(latRads);
      break;
    case "oeste":
      newLat = lat;
      newLong = long - distanceDegs / Math.cos(latRads);
      break;
    default:
      return null;
  }

  const newLatDeg = (newLat * 180) / Math.PI; // Convertir nueva latitud a grados
  const newLongDeg = (newLong * 180) / Math.PI; // Convertir nueva longitud a grados
  return { latitud: newLatDeg, longitud: newLongDeg };
}
async function position(pos) {
  const crd = pos.coords;
  lat = crd.latitude;
  lon = crd.longitude;
}

getLocationList();
getCCAAList();

async function busqueda() {
  munGasListTrad = [];
  if (
    locationList.find(
      (element) => element.Municipio.toLowerCase() == buscar.value.toLowerCase()
    )
  ) {
    let locationID = locationList.find(
      (element) => element.Municipio.toLowerCase() == buscar.value.toLowerCase()
    ).IDMunicipio;

    await getDataAPI(locationID);
    let filteredList = munGasList.filter((elemento) => {
      return elemento.Municipio.toLowerCase().startsWith(
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
              nuevoElemento["PrecioGasoleoA"] = "N/A";
            } else {
              nuevoElemento["PrecioGasoleoA"] = elemento[key] + "€";
            }
            break;
          case "Precio Gasolina 95 E5":
            if (elemento[key] == "") {
              nuevoElemento["PrecioGasolina95"] = "N/A";
            } else {
              nuevoElemento["PrecioGasolina95"] = elemento[key] + "€";
            }

            break;
          case "Precio Gasolina 98 E5":
            if (elemento[key] == "") {
              nuevoElemento["PrecioGasolina98"] = "N/A";
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
      munGasListTrad.push(nuevoElemento);
      if (filteredList.length - 1 == index) {
        generador = "";
      }
    }
    console.log(munGasList);
  } else {
    document.getElementById("contenedorResultados").innerHTML =
      "Municipio no encontrado";
  }
}

function createGasCard(elemento) {
  //console.log(generador)
  generador += `
		<div class="carta" id="carta">
    <div class="stat-title">
				<p class="cardTitle">${elemento.Rótulo}</p>
    </div>
        <p><img src="./img/horario.png" alt="Horario"> ${elemento.Horario}</p>
        <p><img src="./img/direccion.png" alt="Direccion"> ${elemento.Dirección}</p>
        <p><img src="./img/municipio.png" alt="Municipio" id="imgMunicipio"> ${elemento.Municipio}</p>

        <div class="card-footer">
          <div class="stats">
              <div class="stat">
                <span class="label">diesel</span>
                <p class="value">${elemento.PrecioGasoleoA}</p>
              </div>
              <div class="stat">
                <span class="label">gas 95</span>
                <p class="value">${elemento.PrecioGasolina95}</p>
              </div>
              <div class="stat">
                <span class="label">gas 98</span>
                <p class="value">${elemento.PrecioGasolina98}</p>
              </div>
          </div>
        </div>

		</div>
		`;
  document.getElementById("contenedorResultados").innerHTML = generador;
  //console.log(generador)
}

//funcion en la que filtraremos las cartas en funcion de lo que seleccionemos
function gasFilter() {
  let cards = document.getElementsByClassName("carta");
  let gasFilter = document.getElementById("gasFilter");

  for (let i = 0; i < munGasListTrad.length; i++) {
    cards[i].style.display = "flex";
    if (gasFilter.value == "diesel") {
      if (munGasListTrad[i].PrecioGasoleoA == "N/A") {
        cards[i].style.display = "none";
      }
    }

    if (gasFilter.value == "gasolina95") {
      if (munGasListTrad[i].PrecioGasolina95 == "N/A") {
        cards[i].style.display = "none";
      }
    }

    if (gasFilter.value == "gasolina98") {
      if (munGasListTrad[i].PrecioGasolina98 == "N/A") {
        cards[i].style.display = "none";
      }
    }
  }
}

function orderByCheap() {
  let cheapFilter = document.getElementById("cheapFilter");
  const listaGasolineras = munGasListTrad;

  if (cheapFilter.value == "diesel") {
    listaGasolineras.sort((precio1, precio2) =>
      comparation(precio1.PrecioGasoleoA, precio2.PrecioGasoleoA)
    );
  }
  if (cheapFilter.value == "gasolina95") {
    listaGasolineras.sort((precio1, precio2) =>
      comparation(precio1.PrecioGasolina95, precio2.PrecioGasolina95)
    );
  }
  if (cheapFilter.value == "gasolina98") {
    listaGasolineras.sort((precio1, precio2) =>
      comparation(precio1.PrecioGasolina98, precio2.PrecioGasolina98)
    );
  }

  listaGasolineras.forEach((gasolinera) => {
    createGasCard(gasolinera);
  });
}

function comparation(a, b) {
  //metodo hecho para ordenar parametros
  if (b < a) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
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
async function getCloseGas(nuevaCoordS, nuevaCoordN, nuevaCoordE, nuevaCoordO) {
  await fetch("./JSONS/Gasolineras.json")
    .then((response) => response.json())
    .then((data) => {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (nuevaCoordN["latitud"] > element["Latitud"]) {
          console.log("hola");
          if (
            nuevaCoordN > element["Latitud"] &&
            nuevaCoordN < element["Latitud"]
          ) {
          }
        }
      }
    });
}
