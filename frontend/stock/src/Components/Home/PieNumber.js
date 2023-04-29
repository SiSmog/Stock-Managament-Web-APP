import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import CountUp from 'react-countup';
import "./PieNumber.css"


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function PieNumber(props) {
    var data=[]
    if(props.value==0){
        data = [
            { name: "Group A", value: 1 },
        
        ];
    }else{
        data = [
            { name: "Group A", value: props.value },
        
        ];
    }



    var COLOR=""
    if(props.color=="blue"){
        COLOR = "#0088FE";
    }
    if(props.color=="yellow"){
        COLOR = "#FFBB28";
    }
    if(props.color=="red"){
        COLOR = "#FF8042";
    }
    

    var size="big "
    if(props.value>99999){
        size="normal "
    }
    if(props.value>99999999){
        size="tiny "
    }
    
    return (
        <div style={{ width: "100%", height: "25vh",cursor:"pointer" }}>
            <CountUp className={"CountUp "+size+props.color} duration={1.1} delay={0.5}  start={0} end={props.value} />
            <ResponsiveContainer >
                <PieChart cursor={"pointer"}  >
                    <Pie
                        data={data}
                        animationDuration={1000}
                        animationBegin={600}
                        labelLine={false}
                        outerRadius={"95%"}
                        innerRadius={"80%"}
                        fill="#8884d8"
                        dataKey="value"
                    >
                            <Cell stroke="" fill={COLOR} />

                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
