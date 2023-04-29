import React from 'react'
import "./SearchBarcode.css"
import { useState, useEffect, useRef } from 'react'
import { listBarcode } from '../../../Services/ArticleService';
import SearchButton from './SearchButton'
export const SearchBarcode = () => {
  const [value, setvalue] = useState("")
  const [toggle, settoggle] = useState(false)
  const [options, setoptions] = useState([])
  const ref = useRef(null)
  const refresh = () => {
    listBarcode().then((res) => {
      var allLines = []
      for (let i of res.data.data) {
        allLines.push(i.barcode)
      }
      setoptions(allLines)
    })
  }
  useEffect(() => {
    refresh()
  }, []);

  const handleClick = () => {
    ref.current.focus();
    settoggle(!toggle)
  };
  const handleChange = (event) => {
    const re = /^([0-9]){0,12}$/;
    if (re.test(event.target.value)) {
      setvalue(event.target.value)
    }
  }
  const tapped = () => {
    console.log("barcode")
  }
  
  return (
    <div>
      <div className='searchContainer'>
        <div className='SearchBar'>
          <div className='hashtagContainer'>
            <span className='hashtag'>#</span>
          </div>
          <input className='searchInput' placeholder='Search article' value={value} ref={ref} onChange={handleChange} onClick={handleClick} onBlur={() => settoggle(false)} />
        </div>
        <SearchButton />
      </div>
      <div className={toggle ? "options" : "displaynone"}>
        {options.map((barcode) => {
          let minimonimo = barcode
          return <div className='option' onClick={setvalue(minimonimo)}>{barcode}</div>
        })}
      </div>
    </div>
  )
}
export default SearchBarcode
