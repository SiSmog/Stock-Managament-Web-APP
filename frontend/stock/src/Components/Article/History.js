import React from 'react'
import "./History.css"
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { motion } from 'framer-motion';
import { ApiDelay } from '../../env';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listArticleById } from '../../Services/ArticleService';
import CircularProgress from '@mui/material/CircularProgress';





const History = (props) => {

  const [rows, setrows] = useState([{ name: "Restock History", history: [] }, { name: "Ticket History", history: [] }])
  const [loaded, setloaded] = useState(true)
  const { barcode } = useParams()
  const [openRes, setOpenRes] = React.useState(true);
  const [openTic, setOpenTic] = React.useState(true);

  const refresh = () => {
    console.log(barcode)
    setrows([{ name: "Restock History", history: [] }, { name: "Ticket History", history: [] }])
    listArticleById(barcode).then((res) => {
      let ob = [{ name: "Restock History", history: res.data.Rhistory }, { name: "Ticket History", history: res.data.Thistory }]
      console.log(ob)
      setrows([...ob])
      setloaded(true)
    })
  }
  useEffect(() => {
    refresh()
  }, [barcode])
  if (loaded) {
    return (
      <motion.div key={rows} className='historyContainer' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table" sx={{ marginTop: 0 }}>
            <TableBody key={rows}>
                <React.Fragment >
                  <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell sx={{ width: 20 }}>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpenRes(!openRes)}
                      >
                        {openRes ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ fontSize: 40 }} component="th" scope="row">
                      {rows[0].name}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={openRes} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 0 }}>
                          <Table size="small" aria-label="purchases" sx={{ margin: 0 }}>
                            <TableHead >
                              <TableRow>
                                <TableCell align="center">Id</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">Unit Price</TableCell>
                                <TableCell align="center">Total Price</TableCell>
                                <TableCell align="center">Date</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows[0].history.map((historyRow, index) => (

                                <TableRow key={historyRow.identifier}>
                                  <TableCell align="center" component="th" scope="row">
                                    {historyRow.identifier}
                                  </TableCell>
                                  <TableCell align="center">{historyRow.quantity}</TableCell>
                                  <TableCell align="center">
                                    {Math.round(historyRow.unitprice * 100) / 100}
                                  </TableCell>
                                  <TableCell align="center">
                                    {Math.round(historyRow.unitprice * historyRow.quantity * 100) / 100}
                                  </TableCell>
                                  <TableCell align="center">{historyRow.date.slice(0, 10)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell sx={{ width: 20 }}>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpenTic(!openTic)}
                      >
                        {openTic ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ fontSize: 40 }} component="th" scope="row">
                      {rows[1].name}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={openTic} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 0 }}>
                          <Table size="small" aria-label="purchases" sx={{ margin: 0 }}>
                            <TableHead >
                              <TableRow>
                                <TableCell align="center">Id</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">Unit Price</TableCell>
                                <TableCell align="center">Total Price</TableCell>
                                <TableCell align="center">Date</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows[1].history.map((historyRow, index) => (

                                <TableRow key={historyRow.identifier}>
                                  <TableCell align="center" component="th" scope="row">
                                    {historyRow.identifier}
                                  </TableCell>
                                  <TableCell align="center">{historyRow.quantity}</TableCell>
                                  <TableCell align="center">
                                    {Math.round(historyRow.unitprice * 100) / 100}
                                  </TableCell>
                                  <TableCell align="center">
                                    {Math.round(historyRow.unitprice * historyRow.quantity * 100) / 100}
                                  </TableCell>
                                  <TableCell align="center">{historyRow.date.slice(0, 10)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>
    )
  }
  else {
    return (
      <div key={rows} className='historyContainer'>
        <Box sx={{ display: 'flex', width: 10 / 10, height: 5 / 10, flexDirection: 'row', justifyContent: "center", marginTop: "5vh" }}>
          <CircularProgress size={"6vw"} />
        </Box>
      </div>
    )
  }


}
export default History