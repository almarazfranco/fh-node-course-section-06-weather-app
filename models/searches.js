import axios from "axios"
import fs from 'fs'

export default class Searches {

  history = []
  filePath = './db/history.json'

  constructor(lang) {
    this.readFile()
    this.lang = lang
  }

  async city (place = '') {
    try {

      const instance = axios.create(
        {
          baseURL: `https://api.mapbox.com/search/geocode/v6/forward`,
          params: {
            'q': place,
            'limit': 5,
            'language': this.lang == 'en' ? 'en' : 'es',
            'access_token': process?.env?.MAPBOX_KEY
          } 
        }
      )

      const { data } = await instance.get();

      if(data.features.length === 0) {
        return {
          err: this.lang == 'en'
          ? "Not found"
          : 'No encontrado',
        }
      }

      console.log('datxxxxxxa', data.features[0].id)

      return data?.features.map(e => (
        {
          id: e.id,
          lat: e.geometry.coordinates[1],
          lon: e.geometry.coordinates[0],
          name: e.properties.full_address
        }
      ))

    } catch {
      return {
        err: this.lang == 'en'
        ? "No place found"
        : 'No se encontró ningún lugar',
      }
    }

  }

  async weather (lat, lon) {

    const lang = this.lang

    try {

      const instance = axios.create(
        {
          baseURL: 'https://api.openweathermap.org/data/2.5/weather',
          params: {
            lat,
            lon,
            units: 'metric',
            appid: process?.env?.OPENWEATHER_KEY,
            lang: lang == 'en' ? 'en' : 'es',
          }
        }
      )

      const { data } = await instance.get();

      return {
        description: data?.weather[0]?.description,
        temp: data?.main?.temp,
        temp_min: data?.main?.temp_min,
        temp_max: data?.main?.temp_max,
        humidity: data?.main?.humidity,
        time () {
          const month = {
            en: [
              "January", "February", "March", "April", "May", "June", 
              "July", "August", "September", "October", "November", "December"
            ],
            sp: [
              "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
              "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ],
          };

          const currentUTC = new Date();
          const timezoneOffsetInMilliseconds = data?.timezone * 1000;

          const currentTime = new Date(currentUTC.getTime() + timezoneOffsetInMilliseconds)

          const date = lang == 'en'
          ? `${month.en[currentTime.getMonth()]} ${currentTime.getDate()}`
          : `${currentTime.getDate()} de ${month.sp[currentTime.getMonth()]}`

          const hour = `${currentTime.getUTCHours()}:${currentTime.getUTCMinutes()}`;
          return {
            date,
            hour
          }
        }
      }

    } catch {
      return {
        err: lang == 'en'
        ? "No climate data found"
        : 'No se encuentraron datos del clima',
      }
    }
  }

  saveHistory (place = {}) {

    const history = this.history

    if(history.some(p => p.id == place.id)) return
    history.unshift(place)

    if(history.length > 5) {
      this.history = history.slice(0, 5);
    } else {
      this.history = history
    }
    this.saveFile()
  }


  saveFile() {

    const data = {
      history: this.history
    }

    fs.writeFileSync(this.filePath, JSON.stringify(data))

  }


  readFile () {
    let data = fs.readFileSync(this.filePath, {encoding:'utf-8'})

    if(data == '') return;

    data = JSON.parse(data)
    
    this.history = data.history
  }



}