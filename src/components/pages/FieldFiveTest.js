import React, { useContext, useMemo } from 'react'
import { DContext } from '../../context/Datacontext'
import CustomApexChart from '../blocks/LiveChart'

export const FieldFiveTest = () => {
    const {fieldFive , controls }=useContext(DContext)

    const filedFiveValue = Array.isArray(fieldFive?.['y-axis'])
        ? fieldFive['y-axis'].map(item => {
                const values = item.split(',').map(Number)
                return {
                    f1: values[0],
                    f2: values[1],
                }
            })
            : []
    
        const mainChartData = useMemo(() => {
            if (!filedFiveValue.length || !Array.isArray(fieldFive?.['x-axis'])) return []
    
            const xAxis = fieldFive['x-axis']
            const fKeys = ['f1', 'f2']
    
            // custom labels mapping
            const labelMap = {
                f1: 'IR',
                f2: 'RED',
            }
    
            return fKeys.map((key, index) => ({
                seriesName: labelMap[key],          // use custom label here
                "x-axis": xAxis,
                "y-axis": filedFiveValue.map(item => item[key]),
                color: ['red', 'green', 'blue', 'orange', 'purple', 'brown'][index]
            }))
        }, [filedFiveValue, fieldFive])
    
    
        const lastRowValues =
            Array.isArray(fieldFive?.['y-axis']) && fieldFive['y-axis'].length > 0
                ? fieldFive['y-axis'][fieldFive['y-axis'].length - 1]
                    .split(',')
                    .map(Number)
                : []
    
        const f3 = lastRowValues[2] ?? 0
        const f4 = lastRowValues[3] ?? 0

  return (
      <div className="px-3 md:px-10 py-6">
          {/* MAIN CARD */}
          <div className="bg-white border rounded-2xl shadow-lg p-6 space-y-6">

              {/* HEADER */}
              <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                     field5
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
                        Heart Rate / Spo2
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                          {[
                              { label: "Heart Rate", value: f3 },
                              { label: "Spo2", value: f4 },
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
                          Sensor Signal (IR – RED)
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
