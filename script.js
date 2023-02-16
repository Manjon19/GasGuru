const buscar = document.getElementById("buscar");
const ca = document.getElementById("CCAA");
const btn_loc = document.getElementById("location");
btn_loc.addEventListener("click", geoLocalizacion);

let arrayAPI = [];
// Array que contiene los municipios y su información
let locationList;
// Array que contiene las comunidades autónomas y su información
let ccaaList;
// Array que se llena con los datos de gasolineras de un municipio a partir de su ID
let munGasList = [];
let generador = "";
// lat y lon son variables que se llenan con la latitud y longitud del usuario, obtenidas mediante geolocalización.
let lat = "";
let lon = "";
// Array que contiene los datos de gasolineras de un municipio, pero con los nombres de las variables en español, en lugar de inglés
let munGasListTrad = [];
// Array que se llena con los datos de gasolineras cercanas a la ubicación del usuario. Se utiliza en la función showCloseGas() para mostrar las gasolineras en la pantalla.
let closeGasList = [];

/* El método geoLoacalizacion() utiliza la API de geolocalización del navegador para obtener
 la ubicación actual del usuario. Si la API está disponible, el método llama a la función "getCurrentPosition"
  para obtener la posición actual del usuario. 
  
  Después de obtener la posición actual del usuario, el método utiliza la función "setTimeout" para esperar un segundo 
  antes de realizar más operaciones. Durante este tiempo de espera, se utilizan las coordenadas de latitud y longitud 
  obtenidas para llamar a la función rastreator() cuatro veces, cada vez con una dirección diferente: "norte", "sur", 
  "este" y "oeste".
  
  Finalmente, la función "getCloseGas" se llama con estas cuatro nuevas ubicaciones como parámetros.*/
function geoLocalizacion() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position);
    setTimeout(() => {
      nuevaCoordN = rastreator(lat, lon, 5, "norte");
      nuevaCoordS = rastreator(lat, lon, 5, "sur");
      nuevaCoordE = rastreator(lat, lon, 5, "este");
      nuevaCoordO = rastreator(lat, lon, 5, "oeste");
      getCloseGas(nuevaCoordS, nuevaCoordN, nuevaCoordE, nuevaCoordO);
    }, 1000);
  }
}

/* Este método toma como entrada una ubicación geográfica representada por su latitud y longitud, 
  una distancia en kilómetros y una dirección en la cual se desea mover esa ubicación. Luego, 
  devuelve una nueva ubicación  geográfica que se encuentra a una distancia determinada en la dirección 
  especificada. */
function rastreator(lat, long, distance, direction) {
  const earthRadius = 6371; // Radio de la Tierra en kilómetros
  const latRads = (lat * Math.PI) / 180; // Convertir latitud a radianes
  const longRads = (long * Math.PI) / 180; // Convertir longitud a radianes
  const distanceKm = distance; // Distancia en kilómetros

  // Convertir distancia en kilómetros a distancia en grados de latitud y longitud
  const dLat = (distanceKm / earthRadius) * (180 / Math.PI);
  const dLong =
    ((distanceKm / earthRadius) * (180 / Math.PI)) / Math.cos(latRads);

  // Calcular nueva latitud y longitud en grados
  let newLatDeg, newLongDeg;
  switch (direction) {
    case "norte":
      newLatDeg = lat + dLat;
      newLongDeg = long;
      break;
    case "sur":
      newLatDeg = lat - dLat;
      newLongDeg = long;
      break;
    case "este":
      newLatDeg = lat;
      newLongDeg = long + dLong;
      break;
    case "oeste":
      newLatDeg = lat;
      newLongDeg = long - dLong;
      break;
    default:
      return null;
  }

  return { latitud: newLatDeg, longitud: newLongDeg };
}

/* Dentro del método, se extraen las coordenadas de la posición del usuario 
(latitud y longitud) a partir del objeto pos, y se asignan a las variables lat 
y lon, respectivamente. */
async function position(pos) {
  const crd = pos.coords;
  lat = crd.latitude;
  lon = crd.longitude;
}

getLocationList();
getCCAAList();

/* El método busqueda() es una función asíncrona que realiza una búsqueda de precios 
de combustibles en una ubicación especificada. */
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
      let nuevoElemento = traductor(elemento);
      createGasCard(nuevoElemento);
      munGasListTrad.push(nuevoElemento);
      if (filteredList.length - 1 == index) {
        generador = "";
      }
    }
    createGasCard(nuevoElemento);
    munGasListTrad.push(nuevoElemento);
    if (filteredList.length - 1 == index) {
      generador = "";
    }
  } else {
    document.getElementById("contenedorResultados").innerHTML =
      "<h3 class='notFound'>Municipio no encontrado...</h3>";
  }
}

/* El método traductor() es una función que recibe un objeto elemento que representa un registro
 de precios de combustibles, y devuelve un nuevo objeto con las mismas propiedades, pero con nombres 
 de propiedad modificados y valores formateados. */
function traductor(elemento) {
  let newElemento = {};
  for (let key in elemento) {
    switch (key) {
      case "Precio Gasoleo A":
        if (elemento[key] == "") {
          newElemento["PrecioGasoleoA"] = "N/A";
        } else {
          newElemento["PrecioGasoleoA"] = elemento[key] + "€";
        }
        break;
      case "Precio Gasolina 95 E5":
        if (elemento[key] == "") {
          newElemento["PrecioGasolina95"] = "N/A";
        } else {
          newElemento["PrecioGasolina95"] = elemento[key] + "€";
        }

        break;
      case "Precio Gasolina 98 E5":
        if (elemento[key] == "") {
          newElemento["PrecioGasolina98"] = "N/A";
        } else {
          newElemento["PrecioGasolina98"] = elemento[key] + "€";
        }
        break;
      default:
        newElemento[key] = elemento[key];
        break;
    }
  }
  return newElemento;
}

/* Este método crea una tarjeta de información de estación de gasolina en formato HTML y la agrega al contenedor
 de resultados. Toma un objeto "elemento" como entrada y usa sus propiedades para mostrar la información en la tarjeta. 
 El método usa un acumulador de texto llamado "generador" para agregar la información de la tarjeta en formato HTML y 
 finalmente lo agrega al contenedor de resultados mediante la propiedad "innerHTML" del elemento HTML correspondiente. */
function createGasCard(elemento) {
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
}

/* La función gasFilter() filtra las tarjetas de gas según el tipo de combustible seleccionado en el menú desplegable
 de filtro de combustible en la página web. La función comienza recuperando las tarjetas de gas de la página web y el 
 elemento select del menú desplegable de filtro. Después, para cada tarjeta de gas, se establece su estilo de visualización 
 en "flex" (es decir, se muestra) y se verifica si el valor del menú desplegable de filtro coincide con "diesel", "gasolina95"
  o "gasolina98". Si el valor coincide, se verifica si el precio del combustible correspondiente en la tarjeta es 
  "N/A" (no disponible). Si el precio es "N/A", se establece el estilo de visualización de la tarjeta en "none" (es decir, se oculta).  */
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

/* Esta función ordena la lista de gasolineras según el tipo de combustible y los muestra en orden ascendente de precio en
 una lista de tarjetas de gasolineras. La función obtiene el valor del elemento de entrada "cheapFilter" para determinar qué 
 tipo de combustible se va a ordenar. A continuación, utiliza la función "comparation" para comparar el precio de cada gasolinera 
 para ese tipo de combustible, y luego utiliza el método "sort" para ordenar la lista de gasolineras en función de los precios. 
 Luego, se llama a la función "createGasCard" para generar una nueva lista de tarjetas de gasolineras ordenadas. */
function orderByCheap() {
  let cheapFilter = document.getElementById("cheapFilter");
  let listaGasolineras = munGasListTrad;

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

  listaGasolineras.forEach((gasolinera, index) => {
    createGasCard(gasolinera);
    if (listaGasolineras.length - 1 == index) {
      generador = "";
      listaGasolineras = [];
    }
  });
}

/* La función comparation() es una función de comparación que se utiliza en la función orderByCheap() para 
ordenar una lista de objetos de gasolineras según su precio. */
function comparation(a, b) {
  if (b < a) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
}

/* Este método utiliza la función fetch para obtener datos desde un archivo JSON ubicado en la ruta especificada. 
Luego, convierte la respuesta a un objeto JSON utilizando el método response.json(), y finalmente asigna el objeto 
JSON resultante a la variable locationList. El método se define con la palabra clave async para que se ejecute de 
forma asíncrona y no bloquee la ejecución de otras partes del programa. */
async function getLocationList() {
  await fetch("./JSONS/Municipios.json")
    .then((response) => response.json())
    .then((data) => {
      locationList = data;
    });
}

/* Este método realiza una solicitud a un archivo JSON que contiene una lista de las Comunidades Autónomas de España 
  y guarda esa lista en la variable ccaaList. */
async function getCCAAList() {
  await fetch("./JSONS/CCAA.json")
    .then((response) => response.json())
    .then((data) => {
      ccaaList = data;
    });
}

/* Este método utiliza el método fetch para hacer una llamada a una API de precios de combustible en España. */
async function getCAMun(ccaaID) {
  await fetch(
    "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/" +
      ccaaID
  )
    .then((response) => response.json())
    .then((data) => {});
}

/* Este método usa una llamada a la API para obtener los precios de los combustibles de las estaciones de servicio de una 
ubicación determinada (identificada por locationId). La respuesta de la API se almacena en la variable munGasList. La función 
utiliza la palabra clave async para indicar que se espera una respuesta asincrónica de la API antes de continuar ejecutando el 
resto del código. */
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

/* Este método es una función asíncrona que recupera los datos de una lista de gasolineras desde un archivo 
JSON usando la función fetch. Luego, filtra la lista de gasolineras según su ubicación geográfica utilizando 
las coordenadas dadas como parámetros. Finalmente, se utiliza la función createGasCard para crear una tarjeta 
para cada gasolinera en la lista filtrada y agregarla al DOM.  */
async function getCloseGas(nuevaCoordS, nuevaCoordN, nuevaCoordE, nuevaCoordO) {
  await fetch("./JSONS/Gasolineras.json")
    .then((response) => response.json())
    .then((data) => {
      let filteredList = [];
      for (let i = 0; i < data.length; i++) {
        data[i]["Latitud"] = parseFloat(data[i]["Latitud"].replace(",", "."));
        data[i]["Longitud (WGS84)"] = parseFloat(
          data[i]["Longitud (WGS84)"].replace(",", ".")
        );
        if (
          nuevaCoordN["latitud"] > data[i]["Latitud"] &&
          nuevaCoordS["latitud"] < data[i]["Latitud"]
        ) {
          if (
            nuevaCoordE["longitud"] > data[i]["Longitud (WGS84)"] &&
            nuevaCoordO["longitud"] < data[i]["Longitud (WGS84)"]
          ) {
            filteredList.push(traductor(data[i]));
          }
        }
      }
      for (let index = 0; index < filteredList.length; index++) {
        let elemento = filteredList[index];
        createGasCard(elemento);
        if (filteredList.length - 1 == index) {
          generador = "";
        }
      }
    });
}
