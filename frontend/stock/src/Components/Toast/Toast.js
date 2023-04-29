import React, { Component } from 'react'
import { motion } from 'framer-motion'
import "./Toast.css"
export default class Toast extends Component {
    animationVariants = () => {
        const Variants = {
            slidein: {
                bottom:["0%","8%","8%","8%"],
                opacity:[0,1,1,1,0],
                transition:{duration:2}
            },
            
        }
        return Variants
    }

    render() {
        return (
            <motion.div variants={this.animationVariants()} animate={'slidein'} className={this.props.variant + " toast"}>{this.props.text}</motion.div>
        )
    }
}
