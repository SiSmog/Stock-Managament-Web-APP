import * as React from 'react';
import { mediaPath } from '../../env.js';
import './ArtTable.css'
import { ApiDelay } from '../../env.js';


import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useSearchParams } from 'react-router-dom';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers';

import Toast from "../Toast/Toast"
import { listArticle, deleteArticle } from '../../Services/ArticleService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';
import Button from '../Button/Button.js';
import Navbar from '../Navbar/Navbar.js';
import AreYouSure from '../Popup/AreYouSure.js';
import setDateFormat from '../../Functions/SetDateFormat.js';
import AddButton from '../Home/AddButton.js';
import IconButton from '@mui/material/IconButton';



const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const ArtTable = () => {


  const [offanimation, setoffanimation] = useState(false)
  const [content, setcontent] = useState([])
  const [allcontent, setallcontent] = useState([])
  const [toasts, settoasts] = useState([])
  const [loaded, setloaded] = useState(false)
  const [prompt, setprompt] = useState(false)
  const [minFilter, setminFilter] = useState("")
  const [maxFilter, setmaxFilter] = useState("")
  const [minDate, setminDate] = useState(null)
  const [maxDate, setmaxDate] = useState(null)
  const [BarcodeToDelete, setBarcodeToDelete] = useState(0)
  const navigate = useNavigate()
  const [query, setquery] = useSearchParams();
  const [search, setsearch] = useState("")
  const [sortby, setsortby] = useState("adddate")
  const [ordertype, setordertype] = useState("DESC")
  const [filterOpen, setfilterOpen] = useState(false)
  const matches = useMediaQuery('(max-width:800px)');

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#14213d",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: matches? 14:20,
    },
  }))
  const refresh = () => {
    if (query.toString() == '') {
      console.log("not searched")
      listArticle().then((res) => {
        var allLines = []
        for (let i = 0; i < res.data.data.length; i++) {
          let obj = res.data.data[i]
          allLines.push(obj)
        }
        setcontent(allLines)
        setallcontent(allLines)
        setloaded(true)
      })
    }
    else {
      console.log("queried:" + "?" + query.toString())
      listArticle("?" + query.toString()).then((res) => {
        console.log("searched")
        var allLines = []
        for (let i = 0; i < res.data.data.length; i++) {
          let obj = res.data.data[i]
          allLines.push(obj)
        }
        console.log(allLines)
        setloaded(true)
        if (JSON.stringify(allLines) !== JSON.stringify(content)) {
          setcontent([])
          console.log("updated")
          setcontent(...[allLines])
          setallcontent(allLines)
        }
      })
    }
  }

  useEffect(() => {
    refresh()
  }, [query]);


  const del = (barcode) => {
    var verify = false
    closePrompt()
    deleteArticle(barcode).then((res) => {
      verify = res.data.status
      refresh()
      settoasts(old => [...old, [barcode, verify]])
    })

  }
  const selectArticle = (barcode) => {
    navigate("/art/" + barcode)
  }
  const AddArticle = () => {
    navigate("/art/add")
  }
  const button = () => {
    return (
      <>
        <Button variant="secondary large" text="Cancel" onClick={() => closePrompt()} />
        <Button variant="danger large" text="Delete" onClick={() => del(BarcodeToDelete)} />
      </>)
  }
  const openPrompt = (barcode) => {
    setBarcodeToDelete(barcode)
    setprompt(true)
  }
  const closePrompt = () => {
    setprompt(false)
  }
  const edit = (barcode) => {
    navigate("/art/edit/" + barcode)
  }

  const updateMinFilter = (event) => {
    setminFilter(event.target.value)
  }
  const updateMaxFilter = (event) => {
    setmaxFilter(event.target.value)
  }
  const updateMinDate = (event) => {
    setminDate(event)
  }
  const updateMaxDate = (event) => {
    setmaxDate(event)
  }
  const updatesortby = (event) => {
    setsortby(event.target.value)
  }
  const updateordertype = (event) => {
    setordertype(event.target.value)
  }
  const handleFilterOpen = () => {
    setfilterOpen(!filterOpen)
  }

  const ApplyFilters = () => {
    if (offanimation == true) {
      setoffanimation(false)
    }
    let res = ""
    if (minFilter != "") {
      res += "&min=" + minFilter
    }
    if (maxFilter != "") {
      res += "&max=" + maxFilter
    }
    if (minDate != null) {
      res += "&after=" + setDateFormat(new Date(minDate), true)
    }
    if (maxDate != null) {
      res += "&before=" + setDateFormat(new Date(maxDate), true)
    }
    if (sortby != "Date") {
      res += "&sortby=" + sortby
      res += "&order=" + ordertype
    }
    res = "?" + res.slice(1)
    console.log(res)
    let oldquery = "?" + query.toString()
    console.log(oldquery)

    if (res !== oldquery) {
      console.log(content)
      setcontent([])
      setallcontent([])
      setsearch("")
      setloaded(false)
      setquery(res)
    }
    setfilterOpen(false)
  }
  const HandleSearch = (event) => {
    let val = event.target.value
    setsearch(val)
    if (allcontent.length != 0) {
      if (offanimation == false) {
        setoffanimation(true)
      }
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
  if (loaded) {
    return (
      (
        <>
          <Navbar />
          <AreYouSure className={prompt ? "alertContainer" : "displaynone"} icon="remove.png" content="delete article" activate={button()} />
          <div className={filterOpen && matches ? 'mobileFilters' : 'filters'}>
            <div className='filterLabel'> Search Articles</div>
            <TextField fullWidth size='small' placeholder='Search' value={search} onChange={HandleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }} />
            <div className='filtersTitle'>Filters</div>
            <div className='filter'>
              <div className='filterLabel'> Quantity Between</div>
              <div className='flexrow100'>
                <TextField sx={{ width: 100 }} fullWidth size='small'
                  label="Min" value={minFilter} onChange={updateMinFilter} />
                <TextField sx={{ width: 100 }} fullWidth size='small'
                  label="Max" value={maxFilter} onChange={updateMaxFilter} />
              </div>
              <div className='filterLabel'> Date Between</div>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  inputFormat='DD/MM/YYYY'
                  label="After"
                  value={minDate}
                  onChange={updateMinDate}
                  renderInput={(params) => <TextField size='small' fullWidth {...params} />}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  inputFormat='DD/MM/YYYY'
                  label="Before"
                  value={maxDate}
                  onChange={updateMaxDate}
                  renderInput={(params) => <TextField margin='normal' size='small' fullWidth {...params} />}
                />
              </LocalizationProvider>
              <div className='filterLabel'>Sort By</div>
              <FormControl  >
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="adddate"
                  value={sortby}
                  onChange={updatesortby}
                  name="radio-buttons-group"
                >
                  <FormControlLabel value="adddate" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Date" />
                  <FormControlLabel value="name" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Name" />
                  <FormControlLabel value="barcode" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Barcode" />
                  <FormControlLabel value="quantity" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Quantity" />
                </RadioGroup>
              </FormControl>
              <div className='filterLabel'>Order</div>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="DESC"
                  value={ordertype}
                  onChange={updateordertype}
                  name="radio-buttons-group"
                >
                  <FormControlLabel value="DESC" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Descendant" />
                  <FormControlLabel value="ASC" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Ascendant" />
                </RadioGroup>
              </FormControl>
              <div className='CenterContainer'><Button variant="primary medium" text="Apply Filters" onClick={() => ApplyFilters()} /></div>
            </div>
          </div>
          <div className={filterOpen && matches?'displaynone':'TablePosition'}>
            <TableContainer component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} >
              <Table sx={{ minWidth: 1000 }} aria-label="customized table">

                <TableHead >
                  <TableRow>
                    <StyledTableCell align='center'>Image</StyledTableCell>
                    <StyledTableCell align="center">Barcode</StyledTableCell>
                    <StyledTableCell align="center">Name</StyledTableCell>
                    <StyledTableCell align="center">Quantity</StyledTableCell>
                    <StyledTableCell align="center">Add Date</StyledTableCell>
                    <StyledTableCell align="center" />
                    <StyledTableCell align="center" />
                    <StyledTableCell align="center" />
                  </TableRow>
                </TableHead>
                <TableBody >
                  {content.map((row, i) => (
                    <StyledTableRow component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: !offanimation ? i * 0.1 : 0, duration: !offanimation ? 0.4 : 0 }} key={row.barcode}>
                      <StyledTableCell sx={{ cursor: "pointer" }} onClick={() => selectArticle(row.barcode)} align='center' component="th" scope="row">
                        <img className='icon' src={mediaPath + row.image} />
                      </StyledTableCell>
                      <StyledTableCell sx={{ cursor: "pointer", fontSize: 1 }} onClick={() => selectArticle(row.barcode)} align="center">{row.barcode}</StyledTableCell>
                      <StyledTableCell sx={{ cursor: "pointer" }} onClick={() => selectArticle(row.barcode)} align="center">{row.name}</StyledTableCell>
                      <StyledTableCell sx={{ cursor: "pointer" }} onClick={() => selectArticle(row.barcode)} align="center">{row.quantity}</StyledTableCell>
                      <StyledTableCell sx={{ cursor: "pointer" }} onClick={() => selectArticle(row.barcode)} align="center">{row.adddate.slice(0, 10)}</StyledTableCell>
                      <StyledTableCell align="center"> <Button variant='warning' text="Edit" size="medium" onClick={() => edit(row.barcode)} /></StyledTableCell>
                      <StyledTableCell align="center"> <Button variant='danger' text="Delete" size="medium" onClick={() => openPrompt(row.barcode)} /></StyledTableCell>
                      <StyledTableCell align="center" />
                    </StyledTableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
          </div>
          <AddButton link="/art/add" color='blue' fixed={true} />
            <div className={matches ? "FixedContainerLeft" : "displaynone"}>
              <IconButton onClick={()=>handleFilterOpen()}>
                <img className={filterOpen?'displaynone':'filterOpen'} src='/Media/filter.png' width={"50px"} height={"50px"} />
                <img className={filterOpen?'filterOpen':'displaynone'} src='/Media/cancel.png' width={"50px"} height={"50px"} />
              </IconButton>
            </div>
          {toasts.map((res) => {
            return <Toast text={res[1] ? "Article #" + res[0] + " deleted successfully" : "Error article not deleted"} variant={res[1] ? "successToast" : "dangerToast"} />
          })}
        </>
      )
    )
  } else {
    return (
      <>
        <Navbar />
        <AreYouSure className={prompt ? "alertContainer" : "displaynone"} icon="remove.png" content="delete article" activate={button()} />
        <div className='filters'>
          <div className='filterLabel'> Search Articles</div>
          <TextField fullWidth size='small' value={search} placeholder='Search' onChange={HandleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }} />
          <div className='filtersTitle'>Filters</div>
          <div className='filter'>
            <div className='filterLabel'> Quantity Between</div>
            <div className='flexrow100'>
              <TextField sx={{ width: 100 }} fullWidth size='small'
                label="Min" value={minFilter} onChange={updateMinFilter} />
              <TextField sx={{ width: 100 }} fullWidth size='small'
                label="Max" value={maxFilter} onChange={updateMaxFilter} />
            </div>
            <div className='filterLabel'> Date Between</div>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                inputFormat='DD/MM/YYYY'
                label="After"
                value={minDate}
                onChange={updateMinDate}
                renderInput={(params) => <TextField size='small' fullWidth {...params} />}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                inputFormat='DD/MM/YYYY'
                label="Before"
                value={maxDate}
                onChange={updateMaxDate}
                renderInput={(params) => <TextField margin='normal' size='small' fullWidth {...params} />}
              />
            </LocalizationProvider>
            <div className='filterLabel'>Sort By</div>
            <FormControl  >
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="adddate"
                value={sortby}
                onChange={updatesortby}
                name="radio-buttons-group"
              >
                <FormControlLabel value="adddate" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Date" />
                <FormControlLabel value="name" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Name" />
                <FormControlLabel value="barcode" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Barcode" />
                <FormControlLabel value="quantity" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Quantity" />
              </RadioGroup>
            </FormControl>
            <div className='filterLabel'>Order</div>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="DESC"
                value={ordertype}
                onChange={updateordertype}
                name="radio-buttons-group"
              >
                <FormControlLabel value="DESC" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Descendant" />
                <FormControlLabel value="ASC" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Ascendant" />
              </RadioGroup>
            </FormControl>
            <div className='CenterContainer'><Button variant="primary medium" text="Apply Filters" onClick={() => ApplyFilters()} /></div>
          </div>
        </div>
        <div className='TablePosition loading'>
          <Box sx={{ display: 'flex', width: 10 / 10, height: 5 / 10, flexDirection: 'row', justifyContent: "center", marginTop: "5vh" }}>
            <CircularProgress size={"6vw"} />
          </Box>
        </div>
        <AddButton link="/art/add" color='blue' fixed={true} />
            <div className={matches ? "FixedContainerLeft" : "displaynone"}>
              <IconButton onClick={()=>handleFilterOpen()}>
                <img className={filterOpen?'displaynone':'filterOpen'} src='/Media/filter.png' width={"50px"} height={"50px"} />
                <img className={filterOpen?'filterOpen':'displaynone'} src='/Media/cancel.png' width={"50px"} height={"50px"} />
              </IconButton>
            </div>
        {toasts.map((res) => {
          return <Toast text={res[1] ? "Article #" + res[0] + " deleted successfully" : "Error article not deleted"} variant={res[1] ? "successToast" : "dangerToast"} />
        })}
      </>
    )
  }
}
export default ArtTable