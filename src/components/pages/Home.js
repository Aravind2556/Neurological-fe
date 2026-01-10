import React, { useState, useEffect, useContext } from 'react'
import LiveChart from '../blocks/LiveChart'
import { DContext } from '../../context/Datacontext';
import Cognitive from './Cognitive';
import Speech from './Speech';

// function Home() {

//   const { BeURL} = useContext(DContext)

//   const [gripLevel, setGripLevel] = useState(null) // field 1
//   const [temperature, setTemperature] = useState(null) // field 2
//   const [fallDetect, setFallDetect] = useState(null) // field 3
//   const [batteryPercentage,setBatteryPercentage]=useState(null) //field 5
//   const [haertRate,setHeartRate]=useState(null) //field 6
//   const [spo2,setSPo2]=useState(null) // field 7

//   const [recentSpo2, setRecentSpo2] = useState(null)
//   const [recentHeartRate, setRecentHeartRate]=useState(null)

//   const [predict,setPredict]=useState(null)

//   const url = process.env.REACT_APP_ThinkSpeak_URL

//   const controls = {
//     show: true,
//     download: true,
//     selection: false,
//     zoom: false,
//     zoomin: true,
//     zoomout: true,
//     pan: true,
//     reset: true,
//     zoomEnabled: true,
//     autoSelected: 'zoom'
//   };

//   console.log("predict" , predict)

//   useEffect(() => {
//     const fetchData = async () => {
//       fetch(url)
//         .then(res => res.json())
//         .then(data => {
//           console.log("data:", data)
//           if (data && data.feeds && data.feeds.length > 0) {
//             const xAxis = data.feeds.map(feed => new Date(feed.created_at).getTime())

//             setGripLevel({
//               "x-axis": xAxis,
//               "y-axis": data.feeds.map(feed => Number(feed.field1) || 0),
//               color: "green",
//               seriesName: 'IR'
//             })

//             setTemperature({
//               "x-axis": xAxis,
//               "y-axis": data.feeds.map(feed => Number(feed.field2) || 0),
//               color: "red",
//               seriesName: 'RED'
//             })

//             setFallDetect({
//               "x-axis": xAxis,
//               "y-axis": data.feeds.map(feed => Number(feed.field3) || 0),
//               color: "orange",
//               seriesName: 'ECG'
//             })

//             setBatteryPercentage({
//               "x-axis": xAxis,
//               "y-axis": data.feeds.map(feed => Number(feed.field4) || 0),
//               color: "Fuchsia",
//               seriesName: 'SPO2'
//             })

//             setHeartRate({
//               "x-axis": xAxis,
//               "y-axis": data.feeds.map(feed => Number(feed.field5) || 0),
//               color: "green",
//               seriesName: 'HEMOBLOIN'
//             })

//             setSPo2({
//               "x-axis": xAxis,
//               "y-axis": data.feeds.map(feed => Number(feed.field6) || 0),
//               color: "Indigo",
//               seriesName: 'HEART RATE'
//             })

//             const recentSpo2value = data.feeds.slice(-1)[0].field4
//             setRecentSpo2(recentSpo2value)

//             const recentHeartRateValue = data.feeds.slice(-1)[0].field6
//             setRecentHeartRate(recentHeartRateValue)

//           }
//           else{
//             setGripLevel({
//               "x-axis": [],
//               "y-axis": [],
//               color: "black",
//               seriesName: 'Green'
//             })
//             setTemperature({
//               "x-axis": [],
//               "y-axis": [],
//               color: "black",
//               seriesName: 'RED'
//             })
//             setFallDetect({
//               "x-axis": [],
//               "y-axis": [],
//               color: "black",
//               seriesName: 'ECG'
//             })
//             setBatteryPercentage({
//               "x-axis": [],
//               "y-axis": [],
//               color: "#ED254E",
//               seriesName: 'SPO2'
//             })
//             setHeartRate({
//               "x-axis": [],
//               "y-axis": [],
//               color: "#00F874",
//               seriesName: 'HEMOBLOIN'
//             })
//             setSPo2({
//               "x-axis": [],
//               "y-axis": [],
//               color: "#2A4494",
//               seriesName: 'HEART RATE'
//             })

//           }
//         })
//         .catch(err => {
//           console.log("Error in fetching from Thinkspeak:", err)
//         })
//     };
//     let intervalId
//     if (url) {
//       fetchData();
//       // Optionally, set up polling for live data updates (e.g., every 30 seconds)
//       intervalId = setInterval(fetchData, 5000);
//     }

//     return () => clearInterval(intervalId); // Cleanup on component unmount
//   }, [url]);


//   // Ai - ml predict
//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetch(`${BeURL}/fetch-ml-predict`, {
//         method: "GET",
//       })
//       .then(res=>res.json())
//       .then(data=>{
//         if(data.success){
//            setPredict(data.data)
//         }
//         else{

//         }
//       })

//         .catch((err) => console.log(err));
//     }, 5000); // 5000ms = 5 seconds

//     return () => clearInterval(interval);
//   }, []);

// console.log("predict" , recentHeartRate)

//   if (!gripLevel || !temperature || !fallDetect || !batteryPercentage || !haertRate || !spo2 ) {
//     return <div>Loading...</div>
//   }


//   return (
//     <div className="mx-auto px-4 py-4 space-y-6">

//       {/* MAIN CARD */}
//       <div className="bg-white shadow-xl rounded-2xl p-6 border w-full max-w-2xl mx-auto">

//         <h2 className="text-2xl font-bold text-blue-700 border-b pb-3 mb-4 tracking-wide">
//           Patient Sensor Health Report
//         </h2>

//         {/* IR & RED */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div className="p-4 border rounded-xl bg-gray-50 shadow-sm">
//             <p className="font-semibold text-gray-600">IR predict</p>
//             <p className="text-2xl font-bold text-gray-900">{predict?.["IR"] ?? "-"}</p>
//           </div>

//           <div className="p-4 border rounded-xl bg-gray-50 shadow-sm">
//             <p className="font-semibold text-gray-600">Red predict</p>
//             <p className="text-2xl font-bold text-gray-900">{predict?.["RED"] ?? "-"}</p>
//           </div>

//           <div className="p-4 border rounded-xl bg-gray-50 shadow-sm">
//             <p className="font-semibold text-gray-600">ECG predict</p>
//             <p className="text-2xl font-bold text-gray-900">{predict?.["ECG"] ?? "-"}</p>
//           </div>

//           <div className="p-4 border rounded-xl bg-gray-50 shadow-sm">
//             <p className="font-semibold text-gray-600">Hemoglobin predict</p>
//             <p className="text-2xl font-bold text-gray-900">{predict?.["hemoglobin_pred"] ?? "-"}</p>
//           </div>

//           <div className="p-4 border rounded-xl bg-gray-50 shadow-sm">
//             <p className="font-semibold text-gray-600">Heart Rate predict</p>
//             <p className="text-2xl font-bold text-gray-900">{recentHeartRate || "-"}</p>
//           </div>

//           <div className="p-4 border rounded-xl bg-gray-50 shadow-sm">
//             <p className="font-semibold text-gray-600">Spo2 predict</p>
//             <p className="text-2xl font-bold text-gray-900">{recentSpo2 || "-"}</p>
//           </div>
//         </div>

//         {/* HEADLINE */}
//         <div className="mb-4">
//           <h3 className="text-xl font-bold text-green-700 tracking-wide">
//            Prediction Summary
//           </h3>
//         </div>

//         {/* SPO2 */}
//         <div className="p-4 border rounded-xl bg-blue-50 shadow-sm mb-4">
//           <p className="font-semibold text-gray-700">Hemoglobin</p>
//           <p className={`mt-1 text-lg font-semibold ${predict?.["hb_category"] === "Normal" ? "text-green-700" : "text-red-600"
//             }`}>
//             Status: {predict?.["hb_category"]}
//           </p>
//         </div>

//         {/* Heart Rate */}
//         <div className="p-4 border rounded-xl bg-purple-50 shadow-sm mb-4">
//           <p className="font-semibold text-gray-700">Heart rate</p>
//           <p className={`mt-1 text-lg font-semibold ${predict?.["heart_rate_pred"] === "Normal" ? "text-green-700" : "text-red-600"
//             }`}>
//             Status: {predict?.["heart_rate_pred"]}
//           </p>
//         </div>
//       </div>

//       {/* CHARTS SECTION */}
//       <div className="w-full flex flex-wrap justify-center gap-4 mt-6">
//         {[gripLevel, temperature].map((chartData, i) => (
//           <div
//             className="border rounded-xl shadow-md bg-white w-full md:w-[45%] p-3"
//             key={i}
//           >
//             <LiveChart
//               data={[chartData]}
//               color={chartData.color}
//               title={chartData.seriesName}
//               lineStyle="straight"
//               lineWidth={2}
//               chartType="line"
//               controls={controls}
//             />
//           </div>
//         ))}
//       </div>
//     </div>

//   );
// }
function Home() {
  return (
    // <h1>Home</h1>
    <>
      <Cognitive />
      <Speech />
    </>

  )

}

export default Home


