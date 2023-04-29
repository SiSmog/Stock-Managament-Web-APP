import React, {  useState } from "react";
import { PieChart, Pie, Cell,ResponsiveContainer,Legend } from "recharts";


const data = [
    { name: "Stocked", value: 400 },
    { name: "Sold", value: 300 },
];

const COLORS = ["#4b3f72", "#fca311"];


export default function TotalPieChart() {
    return (
        <div style={{ width: "100%", height: "35vh" }}>
            <ResponsiveContainer >
                <PieChart>
                    <Pie
                        startAngle={90}
                        endAngle={450}
                        paddingAngle={0}
                        data={data}
                        label
                        outerRadius={"80%"}
                        cursor={"pointer"}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell stroke="" key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
