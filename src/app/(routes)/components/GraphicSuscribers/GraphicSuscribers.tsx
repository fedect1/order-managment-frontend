"use client"


import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { dataGraphics } from "./GraphicSuscribers.data"

export function GraphicSuscribers() {
  return (
    <div className="m-5">
        <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                width={730}
                height={250}
                data={dataGraphics}
                margin={{top: 10, right: 30, left: 0, bottom:0}}
                >
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#887CFD" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#887CFD" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="hour"/>
                    <YAxis/>
                    <Tooltip/>
                    <Area
                        type="monotone"
                        dataKey="charge1"
                        stroke="#887CFD"
                        fillOpacity={1}
                        fill="url(#colorUv)"                       
                    />
                    <Area
                        type="monotone"
                        dataKey="charge2"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorPv)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  )
}
