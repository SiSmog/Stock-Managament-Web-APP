import React, { useState } from "react";
import { PieChart, Pie, Cell,Legend,ResponsiveContainer,Tooltip } from "recharts";
import useMediaQuery from '@mui/material/useMediaQuery';


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042","#8338ec","#ff99c8"];


export default function TopArticlesPieChart(props) {
    var data=[] 
    if(props.data.length==1){
        data=[{name:'nothing',totalquant: 0}]
    }else{
        data=props.data
    }

    const [label, setlabel] = useState(false)

    const handleLabel=()=>{
        setlabel(true)
    }
    return (
        <div style={{ width: "100%", height: "30vh" }}>
            <ResponsiveContainer >
                <PieChart onClick={props.onClick}>
                    <Pie
                        data={data}
                        label={label}
                        onAnimationEnd={handleLabel}
                        outerRadius={"60%"}
                        fill="#8884d8"
                        dataKey="totalquant"
                    >
                        {data.map((entry, index) => {
                            return (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                        })}
                    </Pie>
                    <Tooltip/>
                    <Legend iconSize={10}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}