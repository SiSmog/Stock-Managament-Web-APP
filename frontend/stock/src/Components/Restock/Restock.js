import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { listRestock, deleteRestock } from '../../Services/RestockService';
import { styled } from '@mui/material/styles';


import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams } from 'react-router-dom';
import setDateFormat from '../../Functions/SetDateFormat';
import { motion } from 'framer-motion';
import AddButton from '../Home/AddButton';


import Button from "../Button/Button"
import AreYouSure from "../Popup/AreYouSure"
import Navbar from '../Navbar/Navbar';
import Toast from '../Toast/Toast';
import { useState, useEffect } from 'react';
import "./Restock.css"
import getWindowDimensions from '../../Functions/GetWindow';
import useMediaQuery from '@mui/material/useMediaQuery';

var { width, height } = getWindowDimensions();
function createData(restockid, articlecount, totalQuantity, totalPrice, date, articlelist) {
  for (let i = 0; i < articlelist.length; i++) {
    articlelist[i].unitprice = Math.round(articlelist[i].unitprice * 100) / 100
  }
  date = date.slice(0, 10)
  console.log(articlelist)

  return {
    restockid,
    articlecount,
    totalQuantity,
    totalPrice,
    date,
    articles: articlelist,
  };
}




export default function Restock() {
  const button = () => {
    return (
      <>
        <Button variant="secondary large" text="Cancel" onClick={() => closePrompt()} />
        <Button variant="danger large" text="Delete" onClick={() => Del(RestockidToDelete)} />
      </>)
  }
  const [prompt, setprompt] = useState(false)
  const [open, setOpen] = useState([]);
  const [RestockidToDelete, setRestockidToDelete] = useState()
  const [content, setcontent] = useState([])
  const [allcontent, setallcontent] = useState([])
  const [toasts, settoasts] = useState([])

  const [offanimation, setoffanimation] = useState(false)
  const [loaded, setloaded] = useState(false)
  const [query, setquery] = useSearchParams();
  const [search, setsearch] = useState("")
  const [sortby, setsortby] = useState("date")
  const [ordertype, setordertype] = useState("DESC")
  const [minArt, setminArt] = useState("")
  const [maxArt, setmaxArt] = useState("")
  const [minQuant, setminQuant] = useState("")
  const [maxQuant, setmaxQuant] = useState("")
  const [minPrice, setminPrice] = useState("")
  const [maxPrice, setmaxPrice] = useState("")
  const [minDate, setminDate] = useState(null)
  const [maxDate, setmaxDate] = useState(null)
  const [filterOpen, setfilterOpen] = useState(false)
  const matches = useMediaQuery('(max-width:800px)');

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#14213d",
      color: theme.palette.common.white,
      fontSize: matches ? 13 : 20,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: matches ? 13 : 20,
    },
  }))

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }))


  const Del = (RestockidToDelete) => {
    closePrompt()
    deleteRestock(RestockidToDelete).then((res) => {
      refresh()
      settoasts(old => [...old, [res.data.message, res.data.status]])
    })
  }
  const openPrompt = (restockid) => {
    setRestockidToDelete(restockid)
    setprompt(true)
  }
  const closePrompt = () => {
    setprompt(false)
  }
  const refresh = () => {
    if (query.toString() == '') {
      listRestock().then((res) => {
        setcontent([])
        setOpen([])
        for (let i = 0; i < res.data.data.length; i++) {
          setOpen(old => [...old, false])
          let obj = res.data.data[i]
          setcontent(old => [...old, createData(obj.restockid, obj.articlecount, obj.totalquantity, obj.totalprice, obj.date, obj.articlelist)])
          setallcontent(old => [...old, createData(obj.restockid, obj.articlecount, obj.totalquantity, obj.totalprice, obj.date, obj.articlelist)])
          console.log(obj)
        }
        setloaded(true)
        console.log(res)
      })
    } else {
      listRestock("?" + query.toString()).then((res) => {
        setcontent([])
        setOpen([])
        for (let i = 0; i < res.data.data.length; i++) {
          setOpen(old => [...old, false])
          let obj = res.data.data[i]
          setcontent(old => [...old, createData(obj.restockid, obj.articlecount, obj.totalquantity, obj.totalprice, obj.date, obj.articlelist)])
          setallcontent(old => [...old, createData(obj.restockid, obj.articlecount, obj.totalquantity, obj.totalprice, obj.date, obj.articlelist)])
          console.log(obj)
        }
        setloaded(true)
        console.log(res)
      })
    }
  }
  const toggle = (i) => {
    let middle = open
    middle[i] = !middle[i]
    setOpen([...middle])
    console.log(open)
  }
  useEffect(() => {
    refresh()
  }, [query]);



  const updateMinArt = (event) => {
    setminArt(event.target.value)
  }
  const updateMaxArt = (event) => {
    setmaxArt(event.target.value)
  }
  const updateMinQuant = (event) => {
    setminQuant(event.target.value)
  }
  const updateMaxQuant = (event) => {
    setmaxQuant(event.target.value)
  }
  const updateMinPrice = (event) => {
    setminPrice(event.target.value)
  }
  const updateMaxPrice = (event) => {
    setmaxPrice(event.target.value)
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
    if (minQuant != "") {
      res += "&minQ=" + minQuant
    }
    if (maxQuant != "") {
      res += "&maxQ=" + maxQuant
    }
    if (minPrice != "") {
      res += "&minP=" + minPrice
    }
    if (maxPrice != "") {
      res += "&maxP=" + maxPrice
    }
    if (minArt != "") {
      res += "&minA=" + minArt
    }
    if (maxArt != "") {
      res += "&maxA=" + maxArt
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
    let oldquery = "?" + query.toString()

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
          if (allcontent[i].restockid.toLowerCase().startsWith(val.toLowerCase())) {
            newcontent.push(allcontent[i])
          }
        }
      }
      setcontent(newcontent)
    }
  }
  if (loaded) {
    return (
      <>
        <Navbar />
        <AreYouSure className={prompt ? "alertContainer" : "displaynone"} icon="remove.png" content="delete restock" activate={button()} />
        <div className={filterOpen && matches ? 'mobileFilters' : 'filters'}>
          <div className='filterLabel searchLabel'> Search Restocks (id)</div>
          <div className='searchField'>
          <TextField fullWidth size='small' value={search} placeholder='Search' onChange={HandleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }} />
          </div>
          <div className='filtersTitle'>Filters</div>
          <div className='filter'>
            <div className='filterLabel'>N° Articles Between</div>
            <div className='flexrow100'>
              <TextField sx={{ width: 100 }} fullWidth size='small'
                label="Min" value={minArt} onChange={updateMinArt} />
              <TextField sx={{ width: 100 }} fullWidth size='small'
                label="Max" value={maxArt} onChange={updateMaxArt} />
            </div>
            <div className='filterLabel'>Total Quantity Between</div>
            <div className='flexrow100'>
              <TextField sx={{ width: 100 }} fullWidth size='small'
                label="Min" value={minQuant} onChange={updateMinQuant} />
              <TextField sx={{ width: 100 }} fullWidth size='small'
                label="Max" value={maxQuant} onChange={updateMaxQuant} />
            </div>
            <div className='filterLabel'>Total Price Between</div>
            <div className='flexrow100'>
              <TextField sx={{ width: 100 }} fullWidth size='small'
                label="Min" value={minPrice} onChange={updateMinPrice} />
              <TextField sx={{ width: 100 }} fullWidth size='small'
                label="Max" value={maxPrice} onChange={updateMaxPrice} />
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
                defaultValue="date"
                value={sortby}
                onChange={updatesortby}
                name="radio-buttons-group"
              >
                <FormControlLabel value="date" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Date" />
                <FormControlLabel value="articlecount" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="N° Articles" />
                <FormControlLabel value="totalquantity" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Total Quantity" />
                <FormControlLabel value="totalprice" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Total Price" />
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
        <div className={filterOpen && matches ? 'displaynone' : 'TablePosition'}>
          <TableContainer component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Table aria-label="collapsible table" >
              <TableHead>
                <TableRow>
                  <StyledTableCell />
                  <StyledTableCell>RestockId</StyledTableCell>
                  <StyledTableCell align="center">N° Articles</StyledTableCell>
                  <StyledTableCell align="center">Total Quantity</StyledTableCell>
                  <StyledTableCell align="center">Total Price(TND)</StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center" />
                  <StyledTableCell align="center" />

                </TableRow>
              </TableHead>
              <TableBody >
                {content.map((row, i) => (
                  <React.Fragment>
                    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: !offanimation ? i * 0.1 : 0, duration: !offanimation ? 0.4 : 0 }}>
                      <StyledTableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggle(i)}
                        >
                          {open[i] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.restockid}
                      </StyledTableCell>
                      <StyledTableCell align="center">{row.articlecount}</StyledTableCell>
                      <StyledTableCell align="center">{row.totalQuantity}</StyledTableCell>
                      <StyledTableCell align="center">{Math.round(row.totalPrice * 100) / 100}</StyledTableCell>
                      <StyledTableCell align="center">{row.date}</StyledTableCell>
                      <StyledTableCell align="center"><Button variant='danger' text="Delete" size={matches ? "small" : "medium"} onClick={() => openPrompt(row.restockid)} /></StyledTableCell>
                      <StyledTableCell align="center" />
                    </TableRow>
                    <TableRow>
                      <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={open[i]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Articles
                            </Typography>
                            <Table size="small" aria-label="purchases" sx={{ marginTop: 0 }}>
                              <TableHead>
                                <TableRow >
                                  <StyledTableCell>Barcode </StyledTableCell>
                                  <StyledTableCell>Name</StyledTableCell>
                                  <StyledTableCell align="center">Quantity</StyledTableCell>
                                  <StyledTableCell align="center">Unit price (TND)</StyledTableCell>
                                  <StyledTableCell align="center">Total price (TND)</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row.articles.map((ArticleRow) => (
                                  <TableRow key={ArticleRow.barcode}>
                                    <StyledTableCell component="th" scope="row">
                                      {ArticleRow.barcode}
                                    </StyledTableCell>
                                    <StyledTableCell>{ArticleRow.name}</StyledTableCell>
                                    <StyledTableCell align="center">{ArticleRow.quantity}</StyledTableCell>
                                    <StyledTableCell align="center">{Math.round(ArticleRow.unitprice * 100) / 100}</StyledTableCell>
                                    <StyledTableCell align="center">
                                      {Math.round(ArticleRow.totalprice * 100) / 100}
                                    </StyledTableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </StyledTableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <AddButton link="/res/add" color='blue' fixed={true} />
        <div className={matches ? "FixedContainerLeft" : "displaynone"}>
          <IconButton onClick={() => handleFilterOpen()}>
            <img className={filterOpen ? 'displaynone' : 'filterOpen'} src='/Media/filter.png' width={"50px"} height={"50px"} />
            <img className={filterOpen ? 'filterOpen' : 'displaynone'} src='/Media/cancel.png' width={"50px"} height={"50px"} />
          </IconButton>
        </div>
        {toasts.map((res) => {
          return <Toast text={res[0]} variant={res[1] ? "successToast" : "dangerToast"} />
        })}
      </>
    );
  } else {
    return (
      <>
        <Navbar />
        <AreYouSure className={prompt ? "alertContainer" : "displaynone"} icon="remove.png" content="delete restock" activate={button()} />
        <div className={filterOpen && matches ? 'mobileFilters' : 'filters'}>
          <div className='filterLabel searchlabel'> Search Restocks (id)</div>
          <div className='searchField'>
            <TextField fullWidth size='small' value={search} placeholder='Search' onChange={HandleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }} />
          </div>
          <div className='filtersTitle'>Filters</div>
          <div className='filter'>
            <div className='filterLabel'>N° Articles Between</div>
            <div className='flexrow100'>
              <TextField sx={{ width: 100 }} fullWidth size='small'
                label="Min" value={minArt} onChange={updateMinArt} />
              <TextField sx={{ width: 100 }} fullWidth size='small'
                label="Max" value={maxArt} onChange={updateMaxArt} />
            </div>
            <div className='filterLabel'>Total Quantity Between</div>
            <div className='flexrow100'>
              <TextField sx={{ width: 100 }} fullWidth size='small'
                label="Min" value={minQuant} onChange={updateMinQuant} />
              <TextField sx={{ width: 100 }} fullWidth size='small'
                label="Max" value={maxQuant} onChange={updateMaxQuant} />
            </div>
            <div className='filterLabel'>Total Price Between</div>
            <div className='flexrow100'>
              <TextField sx={{ width: 100 }} fullWidth size='small'
                label="Min" value={minPrice} onChange={updateMinPrice} />
              <TextField sx={{ width: 100 }} fullWidth size='small'
                label="Max" value={maxPrice} onChange={updateMaxPrice} />
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
                defaultValue="date"
                value={sortby}
                onChange={updatesortby}
                name="radio-buttons-group"
              >
                <FormControlLabel value="date" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Date" />
                <FormControlLabel value="articlecount" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="N° Articles" />
                <FormControlLabel value="totalquantity" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Total Quantity" />
                <FormControlLabel value="totalprice" control={<Radio sx={{ paddingTop: 0.75, paddingBottom: 0.75 }} size='small' />} label="Total Price" />
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
        <AddButton link="/res/add" color='blue' fixed={true} />
        <div className={matches ? "FixedContainerLeft" : "displaynone"}>
          <IconButton onClick={() => handleFilterOpen()}>
            <img className={filterOpen ? 'displaynone' : 'filterOpen'} src='/Media/filter.png' width={"50px"} height={"50px"} />
            <img className={filterOpen ? 'filterOpen' : 'displaynone'} src='/Media/cancel.png' width={"50px"} height={"50px"} />
          </IconButton>
        </div>
        {toasts.map((res) => {
          return <Toast text={res[0]} variant={res[1] ? "successToast" : "dangerToast"} />
        })}
      </>
    );
  }

}
