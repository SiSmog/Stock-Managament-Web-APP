import React from 'react'
import { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SearchBarcode.css"
import { listBarcode } from '../../../Services/ArticleService';
import { mediaPath } from "../../../env"
import Toast from '../../Toast/Toast';
const SearchBarcode = () => {

  const [value, setvalue] = useState("")
  const [toggle, settoggle] = useState(false)
  const [options, setoptions] = useState([])
  const [alloptions, setalloptions] = useState([])
  const [toasts, settoasts] = useState([])
  const navigate=useNavigate()
  let ref=useRef()


  const refresh = () => {
    listBarcode().then((res) => {
      var allLines = []
      for (let i of res.data.data) {
        allLines.push(i.barcode)
      }
      setalloptions(allLines)
      setoptions(allLines)
      console.log(allLines)
    })
  }
  useEffect(() => {
    refresh()
  }, [])


  useEffect(() => {
    const handler = (event) => {
     if (toggle && ref.current && !ref.current.contains(event.target)) {
      settoggle(false);
     }
    };
    document.addEventListener("click", handler);
    return () => {
     // Cleanup the event listener
     document.removeEventListener("click", handler);
    };
   }, [toggle]);



  const handleClick = () => {
    settoggle(!toggle)
  };
  const handleChange = (event) => {
    settoggle(true)
    const re = /^([0-9]){0,12}$/;
    if (re.test(event.target.value)) {
      setvalue(event.target.value)
      if (alloptions.length > 0) {
        if (event.target.value == "") {
          setoptions(alloptions)
          return
        }
        else {
          let newoptions = []
          for (let i of alloptions) {
            if (i.toString().startsWith(event.target.value.toString())) {
              newoptions.push(i)
            }
          }
          setoptions(newoptions)
        }
      }
    }
  }
  const selectOption = (barcode) => {
    setvalue(barcode)
    settoggle(false)
    ref.current.focus()
  }
  const goToArticle=()=>{
    console.log(value.length)
    if(value.length==12||value.length==null){
      navigate("/art/"+value)
    }else{
      settoasts(old => [...old, ["Barcode must be made of 12 numbers", false]])
    }
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      goToArticle()
    }
  }
  return (
    <div >
      <div className='searchContainer'>
        <div className='SearchBar'>
          <div className='hashtagContainer'>
            <span className='hashtag'>#</span>
          </div>
          <input ref={ref} className='searchInput' placeholder='Search article' value={value} onChange={handleChange} onKeyDown={(e)=>handleKeyDown(e)} onClick={handleClick} />
        </div>
        <div className="buttonsearch" onClick={()=>goToArticle()} >
          <img src={mediaPath + "parcel.png"} className="searchIcon"></img>
        </div>
      </div>
      <div className={toggle ? "options" : "displaynone"}>
        {options.map((barcode) => {
          return <div key={barcode} className='option' onClick={() => selectOption(barcode)} >{barcode}</div>
        })}
      </div>
      {toasts.map((res) => {
            return <Toast text={res[0]} variant={res[1] ? "successToast" : "dangerToast"} />
          })}
    </div>
  )
}

export default SearchBarcode