import React from "react"
import { getAsteroidsClosestMissDistanceInKm } from "../utils/asteroidUtilities"

export const AsteroidInfo = (props) => {
  const { asteroid } = props
  const missDistance = getAsteroidsClosestMissDistanceInKm(asteroid.close_approach_data)
  return (
    <div>      
      <div>Name: {asteroid.name}</div>
      <div>Id: {asteroid.id}</div>
      <div>Miss distance (km): {missDistance.toFixed(0)}</div>
      <div><a href="https://cneos.jpl.nasa.gov/glossary/h.html">H (Absolute magnitude):</a> {asteroid.absolute_magnitude_h}</div>
      <div>Estimated minimum diameter (km): {asteroid.estimated_diameter.kilometers.estimated_diameter_min}</div>
      <div>Estimated maximum diameter (km): {asteroid.estimated_diameter.kilometers.estimated_diameter_max}</div>
    </div>
  )
}