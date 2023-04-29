import React from 'react'
import { useParams } from 'react-router-dom'
import ArticleCard from "./ArticleCard.js"
import Navbar from '../Navbar/Navbar.js'
import History from './History.js'
const Article = () => {
  const { barcode } = useParams()
  const [loaded, setloaded] = React.useState(false)
  const handleChange=()=>{
    setloaded(true)
  }
  return (
    <>
      <Navbar />
      <ArticleCard key={barcode} id={barcode} loaded={loaded}  />
      <History id={barcode} loaded={loaded} handleChange={handleChange} />
    </>
  )
}



export default Article



