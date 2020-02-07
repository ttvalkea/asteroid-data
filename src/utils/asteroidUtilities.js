import parse from "date-fns/parse"

export const apiDateFormat = "yyyy-MM-dd"

export const getAsteroidsClosestMissDistanceInKm = (closeApproachData) =>
  // miss_distance.kilometers is a string, so parsing is needed
  closeApproachData.reduce((min, p) => parseFloat(p.miss_distance.kilometers) < min ? parseFloat(p.miss_distance.kilometers) : min, parseFloat(closeApproachData[0].miss_distance.kilometers))

export const getAsteroidsInArray = (rawApiData) => {
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