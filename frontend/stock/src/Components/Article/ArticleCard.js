import { useEffect,useState } from 'react'
import { mediaPath} from '../../env'
import { listArticleById } from '../../Services/ArticleService.js'
import AreYouSure from '../Popup/AreYouSure'
import Button from '../Button/Button'
import "./ArticleCard.css"
import { deleteArticle } from '../../Services/ArticleService.js'
import { motion } from 'framer-motion'
import { useParams , useNavigate} from 'react-router-dom'

export const ArticleCard = () => {
  const [article, setarticle] = useState({
    adddate: "",
    barcode: 0,
    description: "",
    image: "",
    name: "a",
    quantity: 0,
  })
  const [prompt, setprompt] = useState(false)
  const [loaded, setloaded] = useState(false)
  const {barcode}= useParams()
  const navigate= useNavigate()

  const refresh=()=> {
    console.log(barcode)
    console.log("refreshed")
    listArticleById(barcode).then((res) => {
      setarticle(res.data.data )
      setloaded(true)
    })
  }
  useEffect(()=>{
    refresh()
  }
  , [])
  
  const openPrompt = () => {
    setprompt(true)
  }
  const closePrompt = () => {
    setprompt(false)
  }
  const del = (barcode) => {
    closePrompt()
    deleteArticle(barcode).then((res) => {
      navigate("/art")
      })
  }
  const edit=()=>{
    navigate("/art/edit/"+barcode)
  }
  const button = () => {
    return (
      <>
        <Button variant="secondary large" text="Cancel" onClick={() => closePrompt()} />
        <Button variant="danger large" text="Delete" onClick={() => del(article.barcode)} />
      </>)
  }
  if(loaded){
    return (
      <div>
        <><AreYouSure className={prompt ? "alertContainer" : "displaynone"} icon="remove.png" content="delete article" activate={button()} />
          <motion.div initial={{ left: "-35%" }} animate={{ left: "0%" }} transition={{ duration: 0.5 }} className='card'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <div className='name text'>
                {article.name}
              </div>
              <img className='image' src={mediaPath + article.image} />
              <div className='row'>
                <span className='row1 text'>#{article.barcode}</span>
                <span className='row2 text'>Quantity: {article.quantity}</span>
              </div>
              <div className='row'>
                <span className='row2 text'>Added on: {article.adddate.slice(0, 10)}</span>
              </div>
              <div className='description'>
                <div className=' text'>Description: </div>
                <div className="descriptionbox">{article.description}</div>
              </div>
              <div className='row'>
                <Button variant="warning" size="medium" text="Edit" onClick={()=> edit()}/>
                <Button variant='danger' text="Delete" size="medium" onClick={() => openPrompt()} />
              </div>
            </motion.div>
          </motion.div>
        </>
      </div>
    )
  }else{
    return (
      <div>
        <><AreYouSure className={prompt ? "alertContainer" : "displaynone"} icon="remove.png" content="delete article" activate={button()} />
          <motion.div initial={{ left: "-35%" }} animate={{ left: "0%" }} transition={{ duration: 0.5 }} className='card'>

          </motion.div>
        </>
      </div>
    )
  }
  
}

export default ArticleCard