"use client"
import React, { useState, useEffect } from "react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts"
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, CircularProgress,
} from "@mui/material"
import { Download } from "@mui/icons-material"
import useAuthStore from "../store/useAuthStore"
import styles from "../styles/field.module.css"

const ndviData = [
  { month: "Jan", value: 0.35 }, { month: "Feb", value: 0.45 },
  { month: "Mar", value: 0.65 }, { month: "Apr", value: 0.85 },
  { month: "May", value: 0.75 }, { month: "Jun", value: 0.55 },
  { month: "Jul", value: 0.35 }, { month: "Aug", value: 0.25 },
  { month: "Sep", value: 0.35 }, { month: "Oct", value: 0.45 },
  { month: "Nov", value: 0.65 }, { month: "Dec", value: 0.75 },
]

const degreeDaysData = [
  { month: "Jan", value: 0 }, { month: "Feb", value: 200 },
  { month: "Mar", value: 800 }, { month: "Apr", value: 1500 },
  { month: "May", value: 2200 }, { month: "Jun", value: 3000 },
  { month: "Jul", value: 3700 }, { month: "Aug", value: 4200 },
  { month: "Sep", value: 4700 }, { month: "Oct", value: 4792 },
  { month: "Nov", value: 4792 }, { month: "Dec", value: 4792 },
]

const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const ClimateCharts = (props) => {
  const store = useAuthStore()
  const fields = store.fields
  const field = fields.find((f) => f.id === props.id)

  const [precipitationData, setPrecipitationData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log("ClimateCharts mounted with props:", props)
    console.log("Field data:", field)
    
    const fetchPrecipitationData = async () => {
      if (!field || !field.lat || !field.long) {
        const errorMsg = "Invalid field coordinates."
        console.error(errorMsg)
        setError(errorMsg)
        setLoading(false)
        return
      }
  
      const startDate = "20230101"
      const endDate = "20231231"
      const url = `https://power.larc.nasa.gov/api/temporal/daily/point?start=${startDate}&end=${endDate}&latitude=${field.lat}&longitude=${field.long}&parameters=PRECTOTCORR&format=JSON&community=AG`
      
      console.log("Fetching precipitation data from URL:", url)
  
      try {
        const response = await fetch(url)
        if (!response.ok) {
          const errorMsg = `HTTP error! status: ${response.status}`
          console.error(errorMsg)
          throw new Error(errorMsg)
        }
  
        const data = await response.json()
        console.log("API response data:", data)
        
        const dailyData = data?.properties?.parameter?.PRECTOTCORR
        if (!dailyData) {
          const errorMsg = "No precipitation data found in response"
          console.error(errorMsg)
          throw new Error(errorMsg)
        }
  
        console.log("Daily precipitation data:", dailyData)
        
        const monthlyTotals = {}
        for (const dateStr in dailyData) {
          const monthIndex = parseInt(dateStr.substring(4, 6), 10) - 1
          const month = monthOrder[monthIndex]
          monthlyTotals[month] = (monthlyTotals[month] || 0) + dailyData[dateStr]
        }
  
        const precipitationArray = monthOrder.map(month => ({
          month,
          value: parseFloat((monthlyTotals[month] || 0).toFixed(2)),
        }))
  
        console.log("Processed monthly precipitation data:", precipitationArray)
        setPrecipitationData(precipitationArray)
      } catch (err) {
        console.error("Error in fetchPrecipitationData:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
  
    fetchPrecipitationData()
  }, [field])
  

  const renderChartContent = () => {
    console.log("Rendering chart content with precipitationData:", precipitationData)
    return (
      <>
        {/* NDVI Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>NDVI</h3>
            <button className={styles.downloadButton}><Download /></button>
          </div>
          <div className={styles.chartContent}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ndviData}>
                <XAxis dataKey="month" />
                <YAxis domain={[-0.35, 1.05]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#ff5722" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className={styles.ndviValue}>
              <div className={styles.valueBox}>0.66</div>
              <div className={styles.valueInfo}>Last updated 125 days ago</div>
            </div>
          </div>
        </div>

        {/* Precipitation Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Accumulated Precipitation</h3>
          </div>
          <div className={styles.chartContent}>
            {loading ? (
              <div className={styles.loader}>
                <CircularProgress />
                <div className={styles.loadingText}>Loading precipitation data...</div>
              </div>
            ) : error ? (
              <div className={styles.error}>
                Error: {error}
                <div className={styles.errorDetails}>Please check the console for more details</div>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={precipitationData}>
                    <defs>
                      <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2196f3" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} mm`, "Precipitation"]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#2196f3" 
                      fillOpacity={1} 
                      fill="url(#colorPrecip)" 
                      name="Precipitation"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className={styles.precipValue}>
                  <div className={styles.valueBox}>
                    {precipitationData.reduce((sum, d) => sum + d.value, 0).toFixed(2)} mm
                  </div>
                  <div className={styles.valueInfo}>2023 Total</div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    )
  }

  if (props.embedded) {
    console.log("Rendering embedded charts")
    return <div className={styles.embeddedCharts}>{renderChartContent()}</div>
  }

  console.log("Rendering full dialog charts")
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ style: { borderRadius: "16px", backgroundColor: "#f5f7fa" } }}
    >
      <FieldTable fields={[field]} />
      <div className={styles.dialogCharts}>
        {renderChartContent()}
        <h3 className={styles.chartTitle}>Growing Degree-Days</h3>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={degreeDaysData}>
            <defs>
              <linearGradient id="colorGDD" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff9800" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value}°C`, "Degree Days"]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#ff9800" 
              fillOpacity={1} 
              fill="url(#colorGDD)" 
              name="Degree Days"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Dialog>
  )
}

function FieldTable({ fields }) {
  console.log("Rendering FieldTable with fields:", fields)
  return (
    <TableContainer component={Paper}>
      <Table aria-label="field table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Latitude</TableCell>
            <TableCell>Longitude</TableCell>
            <TableCell>Area</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell>{field.name}</TableCell>
              <TableCell>{field.lat}</TableCell>
              <TableCell>{field.long}</TableCell>
              <TableCell>{field.area} ha</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ClimateCharts