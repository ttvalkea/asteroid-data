import React from 'react'
import './App.css'
import { ClosestAsteroid } from './components/ClosestAsteroid'
import { LargestDiameterAsteroids } from './components/LargestDiameterAsteroids'

function App() {
  return (
    <div className="App">
      <h1>Asteroid Info</h1>
      <ClosestAsteroid />
      <LargestDiameterAsteroids />
    </div>
  )
}

export default App
