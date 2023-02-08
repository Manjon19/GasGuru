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

function createGasCard(){
  let generado=""
		generado+=`
		<div class="carta" id="carta">
				<p><i>-Municipio: </i>${elemento.Municipio}</p>	
        <p><i>-Diesel: </i>${elemento.Precio_Gasoleo_A}</p>	
        <p><i>-Gasolina 95: </i>${elemento.Precio_Gasolina_95}</p>	
        <p><i>-Gasolina 98: </i>${elemento.Precio_Gasolina_98}</p>	
		</div>  
		`
	document.getElementById("contenedorResultados").innerHTML = generado
}


async function getLocationList() {
  await fetch("./Municipios.json")
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
