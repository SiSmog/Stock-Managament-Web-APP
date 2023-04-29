import React from 'react'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle'
import "./AddButton.css"
const AddButton = (props) => {
    const navigate=useNavigate()
    const Add=()=>{
        navigate(props.link)
    }
  return (
    <div className={props.fixed? "FixedContainer":'ChartButtonContainer'}>
        <IconButton onClick={()=>Add()}>
            <AddCircleIcon sx= {props.small?{width:40,height:40}:{width:60,height:60}} className={"ChartButton "+props.color}/>
        </IconButton>
    </div>
  )
}

export default AddButton