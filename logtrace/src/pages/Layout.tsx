import {routes} from '../route/index'
import { Route,Routes } from 'react-router-dom'
import '../assets/styles/Layout.scss'
import { useState } from 'react'

export default function Layout(){


    return <div className="wrapper">
        <header>
            <div className="logo">LogTrace</div>
        </header>
        <div className='main-ct'>
            <Routes location={location}>
                {
                    routes.map((item,i) => 
                    <Route 
                        key={i} 
                        path={item.path} 
                        element={<item.component/>} 
                    >
                        {
                            item.children 
                            ? item.children.map((n,j)=><Route key={j} path={n.path} element={<n.component/>}/>)  
                            : <></>                                    
                        }
                    </Route>)                     
                }                        
            </Routes>
        </div>
    </div>
}