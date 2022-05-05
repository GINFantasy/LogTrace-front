import { Route,Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import './assets/styles/App.scss'

function App() {
  
  return (
    <>
       <Routes>
        <Route path="/*" element={ <Layout/>}></Route>
      </Routes>
    </>
  )
}

export default App
