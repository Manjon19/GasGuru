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
    setTimeout(() => {
      console.log(lat);
    }, 200);
  }
}

async function position(pos) {
  const crd = pos.coords;
  lat = crd.latitude;
  lon = crd.longitude;
  console.log(lat);
}

getLocationList();
getCCAAList();

buscar.addEventListener("keyup", (event) => {
  let locationID = locationList.find(
    (element) => element.Municipio.toLowerCase() == buscar.value.toLowerCase()
  ).IDMunicipio;
  getDataAPI(locationID);
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
