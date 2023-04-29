import React from 'react'
import Navbar from '../Navbar/Navbar'
import './AddTicket.css'
import { TextField } from '@mui/material'
import { InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import Button from '../Button/Button'
import ArticleList from '../AddRestock/ArticleList'
import { useState } from 'react'
import setDateFormat from '../../Functions/SetDateFormat'
import uniqid from 'uniqid';
import { addTicket } from '../../Services/TicketService';
import SelectedArticle from '../SelectedArticle/SelectedArticle'
import { listArticle } from '../../Services/ArticleService';
import Toast from '../Toast/Toast'
import AddAndSelect from '../Popup/AddAndSelect'
export default function AddTicket() {
    const [search, setsearch] = useState("")
    const [prompt, setprompt] = useState(false)
    const [selected, setselected] = useState([])
    const [selectedInfo, setselectedInfo] = useState([])
    const [date, setdate] = useState(new Date())
    const [content, setcontent] = useState([])
    const [allcontent, setallcontent] = useState([])
    const [page, setpage] = useState(0)
    const [rowsPerPage, setrowsPerPage] = useState(10)
    const [pageSelected, setpageSelected] = useState(0)
    const [rowsPerPageSelected, setrowsPerPageSelected] = useState(10)
    const [quantity, setquantity] = useState(new Map())
    const [price, setprice] = useState(new Map())
    const [quantityError, setquantityError] = useState(new Map())
    const [priceError, setpriceError] = useState(new Map())
    const [toasts, settoasts] = useState([])


    const refresh = () => {
        listArticle().then((res) => {
            var allLines = []
            for (let i = 0; i < res.data.data.length; i++) {
                let obj = res.data.data[i]
                allLines.push(obj)
            }
            setselected([])
            setselectedInfo([])
            setcontent([...allLines])
            setallcontent([...allLines])
        })
    }
    const HandleSearch = (event) => {
        let val = event.target.value
        setsearch(val)
        if (allcontent.length != 0) {
            var newcontent = []
            if (val == "") {
                setcontent(allcontent)
                return
            }
            else {
                for (let i = 0; i < allcontent.length; i++) {
                    if (allcontent[i].name.toLowerCase().startsWith(val.toLowerCase())) {
                        newcontent.push(allcontent[i])
                    }
                }
            }
            setcontent(newcontent)
        }
    }



    React.useEffect(() => {
        refresh()
    }, []);


    const handleChangePage = (page) => {
        setpage(page)
    }
    const handleChangeRowsPerPage = (rowsPerPage) => {
        setrowsPerPage(rowsPerPage)
    }
    const handleChangePageSelected = (page) => {
        setpageSelected(page)
    }
    const handleChangeRowsPerPageSelected = (rowsPerPage) => {
        setrowsPerPageSelected(rowsPerPage)
    }
    const handleChangeSelected = (rows) => {
        setselected([...rows])
    }
    const handleChangeSelectedInfo = (rows) => {
        setselectedInfo([...rows])
    }
    const handleChangeQuantity = (quant) => {
        setquantity(quant)
    }
    const handleChangePrice = (price) => {
        setprice(price)
    }
    const handleChangeQuantityError = (quant) => {
        setquantityError(quant)
    }
    const handleChangePriceError = (price) => {
        setpriceError(price)
    }
    const handleChangeDate = (event) => {
        setdate(event)
    }
    const Add = () => {
        closePrompt()
        let temp = []
        let id = uniqid();
        for (let row of selectedInfo) {
            let temprow = {barcode:row.barcode,name:row.name,ticketid:id}
            temprow['date'] = setDateFormat(date)
            temprow['quantity'] = parseInt(quantity.get(row.barcode))
            temprow['unitprice'] = parseFloat(price.get(row.barcode))
            temp.push(temprow)
        }
        console.log(temp)
        addTicket(temp).then((res)=>{
            if(res.data.status){
                settoasts([...toasts,["Ticket added successfully",res.data.status]])
            }
            else{
                settoasts([...toasts,["Error ticket not added",res.data.status]])
            }
            refresh()

        })

    }
    const closePrompt=()=>{
        setprompt(false)
    }
    const openPrompt=()=>{
        setprompt(true)
    }
    const confirm=()=>{
        if(selected.length > 0){var fillError=false
        for (let row of selectedInfo) {
            if(quantity.get(row.barcode)==""||quantity.get(row.barcode)=="0"){
                setquantityError(prev => new Map([...prev, [row.barcode,true]]))
                fillError=true
            }else{
                setquantityError(prev => new Map([...prev, [row.barcode,false]]))
            }
            if(price.get(row.barcode)==""||price.get(row.barcode)=="0"){
                setpriceError(prev => new Map([...prev, [row.barcode,true]]))
                fillError=true
            }else{
                setpriceError(prev => new Map([...prev, [row.barcode,false]]))
            }
        }
        if(fillError){
            settoasts([...toasts,["All fields must be filled with numbers(>0)",false]])
            
        }else{
            console.log(fillError)
            openPrompt()
        }}else{
            settoasts([...toasts,["Please select an article",false]])
        }
    }
    const outOfStock=()=>{
        settoasts([...toasts,["Article is out of stock",false]])
    }
    const button = () => {
        return (
          <>
            <Button variant="secondary large" text="Cancel" onClick={closePrompt} />
            <Button variant="primary large" text="Ticket" onClick={Add} />
          </>)
      }
    return (
        <>
            <Navbar />
            <div className='AddTitle'>New Ticket</div>
            <div className='AddTicketContainer'>
                <div className='TicketformContainer'>
                    <div className='TicketbuttonContainer'>
                        <h1 className='TickettableTitle'>Articles</h1>
                        <TextField value={search} onChange={HandleSearch} sx={{ width: 33 / 100 }} size='small' placeholder='Search' InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )

                        }} />
                    </div>
                    <div className='TicketTableContainer'>
                        <ArticleList
                            key={content + selected + selectedInfo}
                            data={content}
                            selectedInfo={selectedInfo}
                            selected={selected}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            Ticket={true}
                            outOfStock={()=>outOfStock()}
                            handleChangeSelectedInfo={(rows) => handleChangeSelectedInfo(rows)}
                            handleChangeSelected={(rows) => handleChangeSelected(rows)}
                            handleChangePage={(page) => handleChangePage(page)}
                            handleChangeRowsPerPage={(rows) => { handleChangeRowsPerPage(rows) }} />
                    </div>
                </div>
                <div className='TicketformContainer'>
                    <div className='TicketbuttonContainer'>
                        <h1 className='TickettableTitle'>Selected</h1>
                        <Button variant="primary medium" text="Confirm" onClick={confirm}/>
                    </div>
                    <div className='TicketTableContainer'>
                        <SelectedArticle
                            key={selectedInfo + selected+Array.from(quantityError)+Array.from(priceError)}
                            selectedInfo={selectedInfo}
                            selected={selected}
                            page={pageSelected}
                            rowsPerPage={rowsPerPageSelected}
                            quantity={quantity}
                            price={price}
                            quantityError={quantityError}
                            priceError={priceError}
                            Ticket={true}
                            handleChangeSelectedInfo={(rows) => handleChangeSelectedInfo(rows)}
                            handleChangeSelected={(rows) => handleChangeSelected(rows)}
                            handleChangePage={(page) => handleChangePageSelected(page)}
                            handleChangeRowsPerPage={(rows) => { handleChangeRowsPerPageSelected(rows) }}
                            handleChangeQuantity={(quant) => handleChangeQuantity(quant)}
                            handleChangePrice={(price) => handleChangePrice(price)} 
                            handleChangeQuantityError={(quant) => handleChangeQuantityError(quant)}
                            handleChangePriceError={(price) => handleChangePriceError(price)} />
                    </div>
                </div>
            </div>
            <AddAndSelect className={prompt? "alertContainer":"displaynone"} date={date} handleChangeDate={handleChangeDate} activate={button()} icon="ticket.png" />
            {toasts.map((res) => {
        return <Toast text={res[0]} variant={res[1] ? "successToast" : "dangerToast"} />
      })}
        </>
    )
}