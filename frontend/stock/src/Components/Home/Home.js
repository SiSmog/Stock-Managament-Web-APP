import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import Navbar from '../Navbar/Navbar'
import TopArticlesPieChart from './TopArticlesPieChart';
import PieNumber from './PieNumber';
import AddButton from './AddButton';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import "./Home.css"
import { IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { listDashboard } from '../../Services/DashboardService';
import useMediaQuery from '@mui/material/useMediaQuery';
/*
 N° articles added link:articles
 cost of all restocks link:restocks
 income from all tickets link:tickets
 circle sold/unsold products
 monthly bar chart profit and sales(this year)
 */

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Home = () => {
  const [nextDisabled, setnextDisabled] = useState(true)
  const [prevDisabled, setprevDisabled] = useState(false)
  const [BarChartClicked, setBarChartClicked] = useState(false)
  const [PieChartClicked, setPieChartClicked] = useState(false)
  const [active, setactive] = useState(0)
  const [pages, setpages] = useState(0)
  const [content, setcontent] = useState([])
  const [loaded, setloaded] = useState(false)
  const navigate = useNavigate()
  const goToArticles = () => {
    navigate("/art")
  }
  const goToRestocks = () => {
    navigate("/res")
  }
  const goToTickets = () => {
    navigate("/tic")
  }
  const refresh = () => {
    listDashboard().then((res) => {
      setcontent(res.data.data);
      setpages(res.data.data.monthlySales.length - 1)
      console.log(res.data.articleCount)
      setloaded(true)
    })
  }
  const matches = useMediaQuery('(max-width:800px)');




  useEffect(() => {
    refresh()
  }, [])
  useEffect(() => {
    setprevDisabled(pages == active)
    setnextDisabled(active == 0)
  }, [active])
  useEffect(() => {
    setprevDisabled(pages == active)
  }, [pages])





  const handleprev = () => {
    setactive(active + 1)
    console.log(active)
  }
  const handlenext = () => {
    setactive(active - 1)
  }
  const handleBarchartClick = () => {
    setBarChartClicked(!BarChartClicked)
  }
  const handlePiechartClick = () => {
    setPieChartClicked(!PieChartClicked)
  }

  if (loaded) {
    return (
      <>
        <Navbar />
        <div className='DashboardContainer'>
          <Box sx={{ width: '100%', height: "100%" }}>
            <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 10 }}>
              <Grid xs={4}>
                <Item>
                  <div className='cursorpointer' onClick={() => goToArticles()}>
                    <div className='ChartTitle blue'>Articles added</div>
                    <PieNumber color="blue" value={content.articleCount} />
                  </div>

                  <AddButton small={matches} link="/art/add" color="blue" />
                </Item>
              </Grid>
              <Grid xs={4}>
                <Item>
                  <div className='cursorpointer' onClick={() => goToRestocks()}>
                    <div className='ChartTitle yellow'>Quantity in stock</div>
                    <PieNumber color="yellow" value={content.totalRestockQuant-content.totalTicketQuant} />
                  </div>
                  <AddButton small={matches} link="/res/add" color="yellow" />
                </Item>
              </Grid>
              <Grid xs={4}>
                <Item>
                  <div className='cursorpointer' onClick={() => goToTickets()}>
                    <div className='ChartTitle red'>Quantity sold</div>
                    <PieNumber color="red" value={content.totalTicketQuant} />
                  </div>
                  <AddButton small={matches} link="/tic/add" color="red" />
                </Item>
              </Grid>
              <Grid xs={matches? 12:4}>
                <Item>
                  <div className='ChartTitlerow2'>Top Articles ({PieChartClicked? "sales":"income"})</div>
                  <TopArticlesPieChart key={PieChartClicked} onClick={handlePiechartClick}  data={PieChartClicked? content.topfiveart:content.topfiveartprice} />
                </Item>
              </Grid>
              <Grid xs={matches? 12:8}>
                <Item>
                  <div className='flexrowspace'>
                    <div className='ChartTitlerow2' >{BarChartClicked ? "Sold And Stocked" : "Income And Expenses"} ({content.monthlySales[active].year})</div>
                    <div className='flexrowspace'>
                      <IconButton disabled={prevDisabled} onClick={() => handleprev()} color='primary'>
                        <ArrowBackIosNewIcon sx={{width:"1.35vw",height:"1.35vw"}}/>
                      </IconButton>
                      <IconButton disabled={nextDisabled} onClick={() => handlenext()} color='primary'>
                        <ArrowForwardIosIcon sx={{width:"1.35vw",height:"1.35vw"}}/>
                      </IconButton>
                    </div>
                  </div>
                  <div onClick={() => handleBarchartClick()} style={{ width: "100%", height: "30vh" }}>
                    <ResponsiveContainer >
                      <BarChart
                        data={BarChartClicked ? content.monthlySales[active].quantitysales : content.monthlySales[active].pricesales}
                        margin={{
                          top: 5,
                          right: 15,
                          left: 15,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={BarChartClicked ? "Sold" : "Income"} fill="#27a300" />
                        <Bar dataKey={BarChartClicked ? "Stocked" : "Expenses"} fill="#f00" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Item>
              </Grid>
            </Grid>
          </Box>
        </div>
      </>

    )
  }
  else {
    return (
      <>
        <Navbar />
        <div className='DashboardContainer'>
          <Box sx={{ display: 'flex', width: 10 / 10, height: 5 / 10, flexDirection: 'row', justifyContent: "center", marginTop: "5vh" }}>
            <CircularProgress size={"6vw"} />
          </Box>
        </div>
      </>
    )
  }

}

export default Home