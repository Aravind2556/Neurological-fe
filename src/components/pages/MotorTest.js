import React, { useContext, useMemo } from 'react'
import { DContext } from '../../context/Datacontext'
import CustomApexChart from '../blocks/LiveChart'

export const MotorTest = () => {
    const { filedOneValue, controls } = useContext(DContext)

    const chartData = useMemo(() => {
        if (!Array.isArray(filedOneValue) || filedOneValue.length === 0) {
            return []
        }
        // f1 → f6
        const fKeys = Object.keys(filedOneValue[0])

        // Create time-based x-axis
        const now = Date.now()
        const xAxis = filedOneValue.map((_, i) =>
            now - (filedOneValue.length - i) * 1000
        )

        return fKeys.map((key, index) => ({
            seriesName: key.toUpperCase(),
            "x-axis": xAxis,                              
            "y-axis": filedOneValue.map(item => item[key]), 
            color: ['red', 'green', 'blue', 'orange', 'purple', 'brown'][index]
        }))
    }, [filedOneValue])

    return (
        <div className="px-10">
            <div className="border rounded-xl shadow-md bg-white w-full p-4 mt-6">
                <CustomApexChart
                    data={chartData}
                    title="Motor Sensor Values"
                    lineStyle="straight"
                    lineWidth={2}
                    chartType="line"
                    controls={controls}
                />
            </div>
        </div>
    )
}
