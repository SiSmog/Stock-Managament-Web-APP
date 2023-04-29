import React from 'react';
import './App.css';
import ArtTable from './Components/ArtTable/ArtTable';
import Article from './Components/Article/Article.js';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState,useEffect } from 'react';
import Button from './Components/Button/Button';
import Home from './Components/Home/Home';
import AddArticle from './Components/AddArticle/AddArticle';
import EditArticle from './Components/EditArticle/EditArticle';
import Restock from './Components/Restock/Restock';
import Ticket from './Components/Ticket/Ticket'
import AddRestock from './Components/AddRestock/AddRestock';
import AddTicket from './Components/AddTicket/AddTicket';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/art" element={<ArtTable/>}/>
          <Route path="/res" element={<Restock/>}/>
          <Route path="/tic" element={<Ticket/>}/>
          <Route path="/art/min=1andmax=27" element={<ArtTable/>}/>
          <Route path="/art/:barcode" element={<Article/>} />
          <Route path="/art/add" element={<AddArticle/>} />
          <Route path="/art/edit/:barcode" element={<EditArticle/>} />
          <Route path="/res/add" element={<AddRestock/>} />
          <Route path="/tic/add" element={<AddTicket/>} />
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;
