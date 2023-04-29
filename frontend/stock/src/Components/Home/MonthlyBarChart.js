import React from "react";
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

export default function MonthlyBarChart(props) {
  const [data, setdata] = React.useState(props.data)
  const change = () => {
    setdata([...data.reverse()])
    console.log(data)
  }
  return (
    <div style={{ width: "100%", height: "30vh",marginLeft:"-20%" }}>
      <ResponsiveContainer >
        <BarChart
          data={data}
          barSize={1}
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
          <Bar dataKey="Sales" fill="#27a300" />
          <Bar dataKey="Expenses" fill="#f00" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


