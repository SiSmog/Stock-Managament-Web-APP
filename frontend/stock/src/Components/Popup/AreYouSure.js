import React, { Component } from 'react'
import { mediaPath } from '../../env'
import './AreYouSure.css'
import { motion } from 'framer-motion'
export default class AreYouSure extends Component {
    render() {
        return (
            <div  className={this.props.className}>
                <motion.div initial={{scale:0}} animate={{scale:[0.4,1.1,1]}} transition={{duration:0.5}} className='alert'>
                    <img src={mediaPath+this.props.icon} className='alertIcon'/>
                    <div className='alertTitle'>Are you sure?</div>
                    <div className='alertContent'>Do you really want to {this.props.content}?</div>
                    <div className='alertOptions'>
                        {this.props.activate}
                    </div>
                </motion.div>
            </div>
        )
    }
}
