import React from 'react'
import { mediaPath } from '../../env'
import './AddAndSelect.css'
import { motion } from 'framer-motion'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { useState,useEffect } from 'react'
import { TextField } from '@mui/material'
export default function AddAndSelect(props) {
    const [date, setdate] = useState(props.date)
    function handleDate(e){
        setdate(e)
    }
    const handleChangeDate=props.handleChangeDate
    const changeDate=(date)=>{
        handleChangeDate(date)
    }
    useEffect(()=>{
        changeDate(date)
    }
    ,[date])
    console.log(props)
    return (
        <div className={props.className}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0.4, 1.1, 1] }} transition={{ duration: 0.5 }} className='alert'>
                <img src={mediaPath + props.icon} className='alertIcon' />
                <div className='alertTitle'>Select date and confirm </div>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker

                        inputFormat='DD/MM/YYYY'
                        value={date}
                        onChange={(e)=>handleDate(e.toDate())}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                </LocalizationProvider>
                <div className='alertOptions'>
                    {props.activate}
                </div>
            </motion.div>
        </div>
    )
}
