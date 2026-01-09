import { createContext, useEffect, useState } from "react";
import { THINGSPEAK_URL } from "../utils/ThinkSpeak";


export const DContext = createContext()

const DataContext = ({children}) => {

    const BeURL = process.env.REACT_APP_BeURL
    const [isAuth, setIsAuth] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)

    const [fieldOne, setFieldOne] = useState(null)
    const [fieldTwo, setFieldTwo] = useState(null)
    const [fieldThree, setFieldThree] = useState(null)
    const [fieldFour, setFieldFour] = useState(null)
    // const [fieldFive, setFieldFive] = useState(null)


    console.log("filedOne", fieldOne)
    console.log("filedOne",fieldOne)


    const [recentFieldOne, setRecentFieldOne] = useState(null)
    const [recentFieldTwo, setRecentFieldTwo] = useState(null)
    const [recentFieldThree, setRecentFieldThree] = useState(null)
    const [recentFieldFour, setRecentFieldFour] = useState(null)

    const [recentFieldFive, setRecentFieldFive] = useState(null)

    const [recentFieldSix, setRecentFieldSix] = useState(null)
    const [recentFieldSeven, setRecentFieldSeven] = useState(null)
    const [recentFieldEight, setRecentFieldEight] = useState(null)

    useEffect(()=>{
        fetch(`${BeURL}/checkauth`,{
            credentials: "include"
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.success){
                setIsAuth(true)
                setCurrentUser(data.user)
            }
            else{
                setIsAuth(false)
                setCurrentUser({})
            }
        })
        .catch(err=>{
            setIsAuth(null)
            setCurrentUser(null)
            console.log("Erron in fetching User:",err)
            alert("Trouble in connecting to the Server, please try again later.")
        })
    },[])


    const handleLogout = () => {
        fetch(`${BeURL}/logout`,{
            credentials: "include"
        })
        .then(res=>res.json())
        .then(data=>{
            alert(data.message)
            if(data.success){
                setIsAuth(false)
                setCurrentUser({})
            }
        })
        .catch(err=>{
            console.log("Erron in Logout:",err)
            alert("Trouble in connecting to the Server, please try again later.")
        })
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(THINGSPEAK_URL);
                const data = await res.json();
                if (data?.feeds?.length > 0) {
                    const xAxis = data.feeds.map(feed =>
                        new Date(feed.created_at).getTime()
                    );
                    // g1 → g13 structure
                    const groups = {};
                    for (let i = 1; i <= 16; i++) {
                        groups[`g${i}`] = [];
                    }
                    // Split field1 values
                    data.feeds.forEach(feed => {
                        if (!feed.field1) return;
                        const values = feed.field1
                            .split(',')
                            .map(v => Number(v) || 0);

                        values.forEach((value, index) => {
                            const key = `g${index + 1}`;
                            if (groups[key]) {
                                groups[key].push(value);
                            }
                        });
                    });

                    // Convert to chart series format
                    const seriesData = Object.keys(groups).map((key, index) => ({
                        "x-axis": xAxis,
                        "y-axis": groups[key],
                        color: `hsl(${index * 25}, 70%, 50%)`,
                        seriesName: key.toUpperCase()
                    }));
                    setFieldOne(seriesData);

                } else {
                    setFieldOne([]);
                }
            } catch (err) {
                console.log("Error in fetching from ThingSpeak:", err);
            }
        };

        let intervalId;
        if (THINGSPEAK_URL) {
            fetchData();
            intervalId = setInterval(fetchData, 5000);
        }

        return () => clearInterval(intervalId);
    }, [THINGSPEAK_URL]);

    const data = {isAuth, currentUser, setIsAuth, setCurrentUser, BeURL, handleLogout}

    return (
        <DContext.Provider value={data}>
            {children}
        </DContext.Provider>
    )
}

export default DataContext