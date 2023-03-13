import { useColorModeValue, Box} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { useAppContext } from "../context/state";
import featured from './../featured.json'
const ChartComponent = dynamic(() => import("../components/ChartComponent"), {
  ssr: false
});

const removeOutliers = data => {
  const sorted = data.sort((a, b) => a.value - b.value)
  const q1 = sorted[Math.floor(sorted.length / 4)]
  const q3 = sorted[Math.floor(sorted.length * 3 / 4)]
  const iqr = q3.value - q1.value
  const outlier = iqr * 1.5
  const filtered = sorted.filter(entry => entry.value > q1.value - outlier)

  return filtered.sort((a, b) => a.time - b.time)
}

const digest = data => {
  const serialized = data.map(({timestamp, floor_sell_value, ...rest}) => {
    const time = new Date(timestamp * 1000)
    return {
      time: time,
      value: floor_sell_value,
      ...rest
    }
  })
  
  const normalized = removeOutliers(serialized)
  // const normalized = serialized

  //remove steep price drops

  const smoothed = normalized.reduce((acc, curr) => {
    if (acc.length > 0) {
      const last = acc[acc.length - 1]

      const ratio = last.value / curr.value
  
      if (ratio < 0.2 || ratio > 5) {
        return [...acc]
      }
  
      return [...acc, curr]
    }
    
    return [acc]
  })

  console.log(smoothed)

  return smoothed.map(entry => ({...entry, time: entry.time.toISOString()}))
}

export default function Home() {
  const [priceData, setPriceData] = useState([])
  const { collection } = useAppContext()


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(`https://api.reservoir.tools/collections/daily-volumes/v1?id=${collection.collectionId}&limit=365`)
        const { collections } = await result.json()

        const data = digest(collections)

        setPriceData(data)
      } catch (e) {
        throw e
      }
    }
    fetchData()
  }, [collection])

  return <Box h="100vh">
    <Sidebar >

      <ChartComponent data={priceData} colors={{
        backgroundColor: useColorModeValue("#ffffff", "#020202"),
        lineColor: useColorModeValue("#805AD5", "#D6BCFA"),
        textColor: useColorModeValue("#020202", "#ffffff"),
        areaTopColor: useColorModeValue("#805AD588", "#D6BCFA88"),
        areaBottomColor: useColorModeValue("#805AD511", "#D6BCFA11"),
        volumeColor: useColorModeValue("#00000077", "#ffffff77"),
        watermarkColor: useColorModeValue("#00000011", "#ffffff11"),
        gridColor: useColorModeValue("#00000011", "#ffffff11"),
      }} />
    </Sidebar>

  </Box>
}


// BAYC 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D
// tubby 0xCa7cA7BcC765F77339bE2d648BA53ce9c8a262bD