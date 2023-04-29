import React from 'react'
import { mediaPath } from '../../env';
import "./Navbar.css"
import SearchBarcode from './SearchBarcode/SearchBarcode';
import { motion,AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom';
export const Navbar = () => {
    const [toggle, settoggle] = React.useState(false)
    const menuVariants = {
        slidein: {
            right: 0,
            transition: { duration: 0.5 }
        },
        slideout: {
            right: "-100%",
            transition: { duration: 0.5, type: 'spring' }
        }
    }
    const barVariant1 = {
        clicked: {
            rotate: 45,
            translateY: 11,
            transition: { duration: 0.4 },

        },
        notclicked: {
            rotate: [0, 0, 0],
            transition: { duration: 0.5 }
        }
    }
    const barVariant2 = {
        clicked: {
            opacity: 0,
            transition: { duration: 0.2 }
        },
        notclicked: {
            opacity: 1,
            transition: { duration: 0.25 }
        }
    }
    const barVariant3 = {
        clicked: {
            rotate: -45,
            bot: 11,
            translateY: -11,
            transition: { duration: 0.4 }
        },
        notclicked: {
            rotate: [0, 0, 0],

            bot: 0,
            transition: { duration: 0.5 },
        }
    }
    const toggleSwitch = () => {
        settoggle(!toggle)
    }
    return (
        <div className='Navbar'>
            <Link to="/">
                <div className='home'>
                    <img className='logo' src={mediaPath + "warehouse.png"}></img>
                </div>
            </Link>
            <div className={toggle ? "displaynone" : 'elementsrow'}>
                <Link to="/"className='element'>Home</Link>
                <Link to="/art"className='element'>Articles</Link>
                <Link to="/res"className='element'>Restocks</Link>
                <Link to="/tic"className='element'>Tickets</Link>
            </div>
            <div className={toggle?"displaynone":'searchbarcontainer'}>
                <SearchBarcode />
            </div>
            <AnimatePresence>{toggle &&
                <motion.ul initial={{ right: "-100%" }} variants={menuVariants} animate={toggle ? 'slidein' : 'slideout'} exit='slideout' className="elementscolumn">
                <Link to="/"className='element'>Home</Link>
                <Link to="/art"className='element'>Articles</Link>
                <Link to="/res"className='element'>Restocks</Link>
                <Link to="/tic"className='element'>Tickets</Link>
                </motion.ul>}
            </AnimatePresence>
            <div className={toggle ? "hamburger  active" : "hamburger"} onClick={toggleSwitch}>
                <motion.span initial={{ rotate: [0, 0, 0], opacity: 1 }} variants={barVariant1} animate={toggle ? 'clicked' : 'notclicked'} className='bar'></motion.span>
                <motion.span initial={{ rotate: [0, 0, 0], opacity: 1 }} variants={barVariant2} animate={toggle ? 'clicked' : 'notclicked'} className='bar'></motion.span>
                <motion.span initial={{ rotate: [0, 0, 0], opacity: 1 }} variants={barVariant3} animate={toggle ? 'clicked' : 'notclicked'} className='bar'></motion.span>
            </div>
        </div>
    )
}
export default Navbar