import { useEffect, useState } from 'react'
import { mediaPath, ApiDelay } from '../../env'
import { listArticleById } from '../../Services/ArticleService.js'
import AreYouSure from '../Popup/AreYouSure'
import Button from '../Button/Button'
import "./EditArticle.css"
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Input from '../Input/Input'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { MobileDatePicker } from '@mui/x-date-pickers'
import Box from '@mui/material/Box'
import { updateArticle } from '../../Services/ArticleService.js'
import setDateFormat from '../../Functions/SetDateFormat'
import Toast from '../Toast/Toast'
const EditArticle = () => {
    const [adddate, setadddate] = useState("")
    const [description, setdescription] = useState("")
    const [img, setimg] = useState(mediaPath + "default.png")
    const [image, setimage] = useState("default.png")
    const [name, setname] = useState("")
    const [quantity, setquantity] = useState(0)
    const [prompt, setprompt] = useState(false)
    const [loaded, setloaded] = useState(false)
    const [nameerror, setnameerror] = useState(false)
    const [toasts, settoasts] = useState([])
    const { barcode } = useParams()
    const navigate = useNavigate()

    const refresh = () => {
        console.log(barcode)
        console.log("refreshed")
        listArticleById(barcode).then((res) => {
            const obj = res.data.data
            console.log(res)
            setadddate(new Date(obj.adddate))
            setname(obj.name)
            console.log("description:" + description)
            setimage(obj.image)
            setimg(mediaPath + obj.image)
            setquantity(obj.quantity)
            setdescription(obj.description)
        })
    }
    console.log(barcode)

    useEffect(() => {
        refresh()
    }
        , [])

    const openPrompt = () => {
        let error=nameerror
        if (name == "") {
            error = true
            setnameerror(true)
            settoasts([...toasts, ["Please enter article name", false]])
        } else {
            setnameerror(false)
            error = false
        }
        if(!error){
            setprompt(true)
        }
    }
    const closePrompt = () => {
        setprompt(false)
    }
    const Changename = (event) => {
        setname(event.target.value)
    }
    const Changedate = (event) => {
        setadddate(event)
    }
    const Changeimage = (event) => {
        if (event.target.value != "") {
            setimg(URL.createObjectURL(event.target.files[0]))
            setimage(event.target.files[0])
        }
    }
    const Edithandle = () => {
        closePrompt()
        console.log(adddate)
        let error = nameerror
        if (name == "") {
            error = true
            setnameerror(true)
            settoasts([...toasts, ["Please enter article name", false]])
        } else {
            setnameerror(false)
            error = false
        }
        if (error == false) {
            let form = new FormData()
            form.append("name", name)
            form.append("image", image)
            form.append("quantity", parseInt(quantity))
            form.append("description", description)
            form.append("adddate", setDateFormat(adddate))
            updateArticle(form, barcode).then((res) => {
                console.log(form)
                console.log(res.data.data)
                navigate("/art/" + barcode)
            })
        }
    }
    const Changedescription = (event) => {
        setdescription(event.target.value)
    }
    const button = () => {
        return (
            <>
                <Button variant="secondary large" text="Cancel" onClick={() => closePrompt()} />
                <Button variant="warning large" text="Edit" onClick={() => Edithandle()} />
            </>)
    }
    return (
        <>
            <AreYouSure className={prompt ? "alertContainer" : "displaynone"} icon="edit.png" content="update article" activate={button()} />
            <Navbar />
            <motion.div initial={{ left: "-35%" }} animate={{ left: "0%" }} transition={{ duration: 0.5 }} className='card'>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: ApiDelay, duration: 0.5 }}>
                    <Input variant="name" placeholder='Name' error={nameerror} type="text" value={name} onChange={Changename} />
                    <div className='wrapper'>
                        <input className='imginput' type='file' accept='image/*' onChange={Changeimage} />
                        <img className='image' src={img} />
                    </div>
                    <div className='row'>
                        <span className='row1 text'>#{barcode}</span>
                        <span className='row2 text'>Quantity: {quantity}</span>
                    </div>
                    <div className='rowadd'>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <MobileDatePicker
                                label="Add Date"
                                value={adddate}
                                onChange={(e) => Changedate(e.toDate())}
                                renderInput={({ inputRef, inputProps, InputProps }) => (
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: 'none',
                                        borderBottom: 1,
                                        borderColor: 'gray',
                                        color: 'black',
                                        textAlign: 'center',
                                        width: 10 / 10,
                                        margin: 0
                                    }}>
                                        <input className='date' ref={inputRef}{...inputProps} />{InputProps?.endAdornment}
                                    </Box>
                                )}
                            />
                        </LocalizationProvider>
                        <Input variant="quantity trans" placeholder='Quantity' type="text" value={quantity} />
                    </div>
                    <div className='descriptionInput'>
                        <div className=' text'>Description: </div>
                        <textarea placeholder='Enter a description here' className="descriptionBoxInput" value={description} onChange={Changedescription} />
                    </div>
                    <div className='outer' >
                        <Button variant="warning" size="medium" text="Edit" onClick={() => openPrompt()} />
                    </div>
                </motion.div>
            </motion.div>
            {toasts.map((res) => {
                return <Toast text={res[0]} variant={res[1] ? "successToast" : "dangerToast"} />
            })}
        </>
    )
}

export default EditArticle