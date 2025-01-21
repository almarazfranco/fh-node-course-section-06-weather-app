import {
    inquirerMenu,
    inquirerPauseInput,
    inquirerReadInput,
    inquirerSelectAppLanguague,
    inquirerSelectPlace
  } from "./helpers/inquirer.js"
import "colors"
import Searches from "./models/searches.js";
import traductions from "./language/traductions.js";
import "dotenv/config";


const main = async () => {

  //! =====> Set language
  const languague = await inquirerSelectAppLanguague()
  const {
    lng_appEnd,
    lng_appTitle,
    lng_menu,
    lgn_selectPlaceInput,
    lgn_searchCityInput,
    lgn_pauseButton
  } = traductions[languague]
  //! =====> End Set language

  let opt;

  const searches = new Searches(languague)
  do {

    opt = await inquirerMenu(lng_appTitle, lng_menu)

    let placesList;

    switch (opt) {
      case 1:
      const { citySearched } = await inquirerReadInput(lgn_searchCityInput.message.blue, 'citySearched', lgn_searchCityInput.err)

      placesList = await searches.city(citySearched)
        break;

      case 2:
        placesList = searches.history
        break;
      default:
        break;
    }

    if(opt != 0) {
      if(placesList?.err) {
        console.log('🚫 ' + `${'"' + citySearched + '" ' + placesList.err}`.red)
        return
      }
      const placeSelected = await inquirerSelectPlace(placesList, lgn_selectPlaceInput.cancel, lgn_selectPlaceInput.message)

      if(placeSelected.id == 0) break;

      const findSelectedPlace = placesList.find(e => e.id == placeSelected.id)

      searches.saveHistory(findSelectedPlace);

      const placeWeather = await searches.weather(findSelectedPlace.lat, findSelectedPlace.lon)
      
      console.clear()

      console.log("=================================================\n".blue)
      console.log(`🌎 ${findSelectedPlace.name} \n`.blue)

      console.log(`|| ${placeWeather.time().date}`.red)
      console.log(`|| ${placeWeather.time().hour}`.red)

      console.log(`\n🔔 ${languague == 'sp' ? 'Estado:' : 'Status:'} ${placeWeather.description.charAt(0).toUpperCase() + placeWeather.description.slice(1).toLowerCase()}`)
      console.log(`🌡️  ${languague == 'sp' ? 'Temperatura:' : 'Temperature:'} ${Math.round(placeWeather.temp)}°`)
      console.log(`🔻${Math.round(placeWeather.temp_min)}° /🔺${Math.round(placeWeather.temp_max)}°`)
      console.log(`💧 ${languague == 'sp' ? 'Humedad:' : 'Humidity:'} ${placeWeather.humidity}%`)
      
      console.log("\n=================================================".blue)
      await inquirerPauseInput(lgn_pauseButton)
    }

  } while (opt != 0);

  console.clear();

  console.log(`= > ${lng_appEnd} :)`.rainbow)


}

main()


