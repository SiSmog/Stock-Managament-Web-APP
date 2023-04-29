import React, { Component } from 'react'
import { mediaPath, ApiDelay } from '../../env'
import Button from '../Button/Button'
import Input from '../Input/Input'
import Navbar from "../Navbar/Navbar"
import "./AddArticle.css"
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import Box from '@mui/material/Box';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { motion } from 'framer-motion'
import { addArticle } from '../../Services/ArticleService.js'
import Toast from '../Toast/Toast'
import setDateFormat from '../../Functions/SetDateFormat'

export default class AddArticle extends Component {
  constructor(props) {
    super(props)

    this.state = {
      toasts: [],
      barcodeerror: false,
      nameerror: false,
      img: mediaPath + "default.png",
      adddate: new Date(),
      barcode: "",
      description: "",
      image: "default.png",
      name: "",
    }
  }

  Changename = (event) => {
    this.setState({ name: event.target.value })
  }
  Changebarcode = (event) => {
    const re = /^([0-9]){0,12}$/;
    if (re.test(event.target.value)) {
      this.setState({ barcode: event.target.value })
    }
  }
  Changedate = (event) => {
    this.setState({ adddate: event })
  }
  Changeimage = (event) => {
    if (event.target.value != "") {
      this.setState({ img: URL.createObjectURL(event.target.files[0]) })
      this.setState({ image: event.target.files[0] })
    } 
  }
  Changedescription = (event) => this.setState({ description: event.target.value })
  Add = (barcode, name, image, quantity, description, date) => {
    var barcodeerror=this.state.barcodeerror
    var nameerror=this.state.nameerror
    if (name == "") {
      this.setState({ nameerror: true })
      nameerror=true
    } else {
      this.setState({ nameerror: false })
      nameerror=false
    }
    if (barcode == "") {
      this.setState({ barcodeerror: true })
      barcodeerror=true
    }
    else{
      this.setState({ barcodeerror: false })
      barcodeerror=false
    }
    if (nameerror && barcodeerror) {
      this.setState({ toasts: [...this.state.toasts, ["Please fill all the fields", false]] })
    }
    if (nameerror == true && barcodeerror == false) {
      this.setState({ toasts: [...this.state.toasts, ["Please enter article name", false]] })
    }
    if (nameerror == false && barcodeerror == true) {
      this.setState({ toasts: [...this.state.toasts, ["Please enter article barcode", false]] })
    }
    if(barcodeerror==false){
      if(/^[0-9]{12}$/.test(barcode)==false){
        barcodeerror=true
        this.setState({ barcodeerror: true,toasts: [...this.state.toasts, ["Barcode must be 12 digits", false]] })
      }else{
        this.setState({ barcodeerror: false })
      }
    }
    if (nameerror == false && barcodeerror == false) {
      let form = new FormData()
      form.append("name", name)
      form.append("barcode", barcode)
      form.append("image", image)
      form.append("quantity", parseInt(quantity))
      form.append("description", description)
      form.append("adddate", setDateFormat(date))
      addArticle(form).then((res) => {
        console.log(res)
        var verify = res.data.status
        if (verify == true) {
          this.setState({
            toasts: [...this.state.toasts, ["Article added successfully", verify]],
            barcodeerror: false,
            nameerror: false,
            img: mediaPath + "default.png",
            adddate: new Date(),
            barcode: "",
            description: "",
            image: "default.png",
            name: "",
          })
        }
        else{
          if(res.data.message=="Article already exists"){
            this.setState({ barcodeerror: true ,toasts: [...this.state.toasts, ["Article already exists", false]]})
          }
          else{
            this.setState({ toasts: [...this.state.toasts, [res.data.message, false]] })
          }
        }

      })
    }
  }
  render() {
    return (
      <>
        <Navbar />
        <div initial={{ left: "-35%" }} animate={{ left: "0%" }} transition={{ duration: 0.5 }} className='card'>
          <div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: ApiDelay, duration: 0.5 }}>
            <Input variant="name" placeholder='Name' error={this.state.nameerror} type="text" value={this.state.name} onChange={this.Changename} />
            <div className='wrapper'>
              <input className='imginput' type='file' accept='image/*' onChange={this.Changeimage} />
              <img className='image' src={this.state.img} />
            </div>
            <div className='rowadd'>
              <Input variant="barcode" error={this.state.barcodeerror} placeholder='Barcode' type="text" value={this.state.barcode} onChange={this.Changebarcode} />
              <Input variant="quantity trans" placeholder='Quantity' type="text" />
            </div>
            <div className='rowadd'>
              <div className='outer'>
                <div className='inner'>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <MobileDatePicker
                      label="Add Date"
                      value={this.state.adddate}
                      onChange={(e) => this.Changedate(e.toDate())}
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
                </div>
              </div>
              <Input variant="quantity trans" placeholder='Quantity' type="text" />
            </div>
            <div className='descriptionInput'>
              <div className=' text'>Description: </div>
              <textarea placeholder='Enter a description here' className="descriptionBoxInput" value={this.state.description} onChange={this.Changedescription}></textarea>
            </div>
            <div className='outer' >
              <Button variant="primary" size="medium" text="Add" onClick={() => this.Add(this.state.barcode, this.state.name, this.state.image, 0, this.state.description, this.state.adddate)} />
            </div>
          </div>
        </div>
        <div className='leftblock'>
          New Article
        </div>
        {this.state.toasts.map((res) => {
          return <Toast text={res[0]} variant={res[1] ? "successToast" : "dangerToast"} />
        })}
      </>
    )

  }
}