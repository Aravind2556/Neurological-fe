import React, { useContext, useMemo } from 'react'
import { DContext } from '../../context/Datacontext'
import CustomApexChart from '../blocks/LiveChart'

export const MotorTest = () => {
    const { controls, fieldOne } = useContext(DContext)

    const filedOneValue = Array.isArray(fieldOne?.['y-axis'])
        ? fieldOne['y-axis'].map(item => {
            const values = item.split(',').map(Number)
            return {
                f1: values[0],
                f2: values[1],
                f3: values[2],
                f4: values[3],
                f5: values[4],
                f6: values[5]
            }
        })
        : []

    const mainChartData = useMemo(() => {
        if (!filedOneValue.length || !Array.isArray(fieldOne?.['x-axis'])) return []

        const xAxis = fieldOne['x-axis']
        const fKeys = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6']

        // custom labels mapping
        const labelMap = {
            f1: 'AX',
            f2: 'Aj',
            f3: 'AZ',
            f4: 'GX',
            f5: 'GJ',
            f6: 'GZ'
        }

        return fKeys.map((key, index) => ({
            seriesName: labelMap[key],       
            "x-axis": xAxis,
            "y-axis": filedOneValue.map(item => item[key]),
            color: ['red', 'green'][index]
        }))
    }, [filedOneValue, fieldOne])

    const lastRowValues =
        Array.isArray(fieldOne?.['y-axis']) && fieldOne['y-axis'].length > 0
            ? fieldOne['y-axis'][fieldOne['y-axis'].length - 1]
                .split(',')
                .map(Number)
            : []

    const f7 = lastRowValues[6] ?? 0
    const f8 = lastRowValues[7] ?? 0
    const f9 = lastRowValues[8] ?? 0
    const f10 = lastRowValues[9] ?? 0
    const f11 = lastRowValues[10] ?? 0
    const f12 = lastRowValues[11] ?? 0
    const f13 = lastRowValues[12] ?? 0

    return (
        <div className="px-3 md:px-10 py-6 bg-blue-50">
            {/* MAIN CARD */}
            <div className="bg-white border rounded-2xl shadow-lg p-6 space-y-6">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-700">
                        Motor Test Analysis
                    </h2>
                    <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                        Live Data
                    </span>
                </div>
                {/* CONTENT */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* LEFT – METRIC CARDS */}
                    <div className="lg:w-[30%] bg-gray-50 border rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase">
                            Motor Metrics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Tremor Intensity", value: f7 },
                                { label: "Tremor Frequency", value: f8 },
                                { label: "Angular Variance", value: f9 },
                                { label: "Movement Smoothness", value: f10 },
                                { label: "Tapping Rate", value: f11 },
                                { label: "Tapping Consistency", value: f12 },
                                { label: "Tapping Consistency", value: f13 },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                                >
                                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT – CHART */}
                    <div className="lg:w-[70%] bg-white border rounded-xl shadow-md p-4">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase">
                            Sensor Signal (AX – GZ)
                        </h3>

                        <CustomApexChart
                            data={mainChartData}
                            title=""
                            lineStyle="straight"
                            lineWidth={2}
                            chartType="line"
                            controls={controls}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
