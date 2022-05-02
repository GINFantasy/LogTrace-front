import { useState } from 'react'
import { Route,Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import './assets/styles/App.scss'

function App() {
  
  return (
    <div className="App">
       <Routes>
        <Route path="/*" element={ <Layout/>}></Route>
      </Routes>
    </div>
  )
}

export default App
