import React, { useState, useEffect } from "react"
import add from "date-fns/add"
import format from "date-fns/format"
import { getAsteroidsInArray, apiDateFormat } from "../utils/asteroidUtilities"
import { apiKey } from "../utils/apiKey"

export const LargestDiameterAsteroids = () => {
  const [asteroids2017To2019, setAsteroids2017To2019] = useState([])
 
  const getEveryNthDate = (startDate, endDate, intervalInDays) => {
    let currentDate = startDate
    const dates = []
    while (currentDate <= endDate) {
      dates.push(currentDate)
      currentDate = add(currentDate, {days: intervalInDays})
    }
    return dates
  }

  useEffect(() => {
    //NASA's API can return data in a maximum of one week period. We have to make several requests to get data from two whole years.
    const firstDateToFetchDataFor = new Date(2017, 0, 1)
    const lastDateToFetchDataFor = new Date(2018, 11, 31)
    const requestStartDates = getEveryNthDate(firstDateToFetchDataFor, lastDateToFetchDataFor, 7)

    let allAsteroids = []
    requestStartDates.forEach(date => {
      const endDate = add(date, {days: 6})
      fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${format(date, apiDateFormat)}&end_date=${format((endDate <= lastDateToFetchDataFor ? endDate : lastDateToFetchDataFor), apiDateFormat)}&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          //Map only the needed properties for storing to save some memory
          const arrayOfAsteroids = (getAsteroidsInArray(data)).map(asteroid => {
            return {
              date: asteroid.date,

              //For asteroid's diameter, using asteroid.estimated_diameter.kilometers.estimated_diameter_max here. Could also use estimated_diameter_min or an average of the two.
              diameter: asteroid.estimated_diameter.kilometers.estimated_diameter_max
            }
          })
          // The data comes in asynchronously, add to the existing data set
          allAsteroids = [...allAsteroids, ...arrayOfAsteroids]
          setAsteroids2017To2019(allAsteroids)
        })
        .catch(error => {
          console.log('Error fetching asteroids.', error)
        })
      }
    )
    
  }, [])  

  const getAsteroidLargestDiameterByMonth = (asteroids) => {
    const months = asteroids.map(asteroid => { 
      return {
        month: asteroid.date.getMonth(),
        year: asteroid.date.getFullYear()
      }
    })
    //Remove duplicates
    const differentMonths = months.filter((v,i,a)=>a.findIndex(t=>(t.month === v.month && t.year===v.year))===i)
    const diameterArray = []
    differentMonths.forEach(month => {
      const thisMonthsAsteroids = asteroids.filter(asteroid => asteroid.date.getMonth() === month.month && asteroid.date.getFullYear() === month.year)
      
      const largestDiameterThisMonth = Math.max.apply(Math, thisMonthsAsteroids.map(asteroid => asteroid.diameter))
      diameterArray.push({
        month: month.month, 
        year: month.year, 
        diameter: largestDiameterThisMonth
      })
    })

    return diameterArray
  }

  return asteroids2017To2019 ? (
    <div>
      <h2>Largest asteroids by estimated diameter from 2017 to end of 2018</h2>
      <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Estimated diameter (km)</th>
        </tr>
      </thead>
      <tbody>
        {getAsteroidLargestDiameterByMonth(asteroids2017To2019).map(diameterData => 
          <tr key={diameterData.month + '-' + diameterData.year}>
            <td>{diameterData.month+1 + '-' + diameterData.year}</td>
            <td>{diameterData.diameter.toFixed(2)}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  ) : (
    <div>Loading...</div>
  )
}