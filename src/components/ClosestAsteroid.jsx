import React, { useState, useEffect } from "react"
import parse from "date-fns/parse"
import { getAsteroidsClosestMissDistanceInKm } from "../utils/asteroidUtilities"
import { AsteroidInfo } from "./AsteroidInfo"
import { apiKey } from "../utils/apiKey"

export const ClosestAsteroid = () => {
  const [closestAsteroid, setClosestAsteroid] = useState()
  const apiDateFormat = "yyyy-MM-dd"
  
  const getAsteroidsInArray = (rawApiData) => {
    const asteroidDates = rawApiData.near_earth_objects
    const allAsteroids = []
    for (const date in asteroidDates) {
      const arrayOfAsteroidsForADay = asteroidDates[date]

      //Add date prop to each asteroid
      arrayOfAsteroidsForADay.forEach(asteroid => {
        asteroid.date = parse(date, apiDateFormat, new Date())
      })

      allAsteroids.push(...arrayOfAsteroidsForADay)
    }

    return allAsteroids
  }

  useEffect(() => {
    // Get data of asteroids between two dates
    fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-12-19&end_date=2015-12-26&api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => {      

        const allAsteroids = getAsteroidsInArray(data)

        const theClosestAsteroid = allAsteroids.reduce(function(prev, curr) {
          //close_approach_data is an array. For comparing, pick the object with the minimum miss_distance
          return getAsteroidsClosestMissDistanceInKm(prev.close_approach_data) < getAsteroidsClosestMissDistanceInKm(curr.close_approach_data) ? prev : curr
        })
        setClosestAsteroid(theClosestAsteroid)        
      })
      .catch(error => {
        console.log('Error fetching asteroids.', error)
      })
  }, [])

  return closestAsteroid ? (
    <div>
      <h2>The asteroid that passed the closest to Earth between 19th December 2015 and 26th December 2015</h2>
      <AsteroidInfo
        asteroid={closestAsteroid}
      />
    </div>
  ) : (
    <div>Loading...</div>
  )
}