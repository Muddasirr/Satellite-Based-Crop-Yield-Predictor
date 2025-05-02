"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import useAuthStore from "../store/useAuthStore"
import ClimateCharts from "./Chartsfields"
import styles from "../styles/field.module.css"
import {
  ExpandMore,
  ExpandLess,
  Add,
  Sort,
  Search,
  Close,
  TrendingUp,
  Agriculture,
  AttachMoney,
  Assessment,
  LocationOn,
  Info,
  Map,
  
} from "@mui/icons-material"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import MapIcon from "@mui/icons-material/Map";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocationOnIcon from "@mui/icons-material/LocationOn";


const FieldManagement = () => {
  const store = useAuthStore()
  const setfields = store.setfields

  const [fields, setFields] = useState([])
  const [expanded, setExpanded] = useState(true)
  const [selectedFields, setSelectedFields] = useState([])
  const [search, setSearch] = useState("")
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [fieldid, setFieldId] = useState("")
  const [activeTab, setActiveTab] = useState("status")
  const [analysis, setAnalysis] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getfields()
    getAnalysis()
  }, [activeTab])
 const main = fields.filter((field) => field.id == fieldid)[0]
  const getAnalysis = async()=>{
    
    const input = `Here is some data about my field:

- Predicted Rice Yield: ${selectedField.prediction} kg/ha
- Predicted Maize Yield: ${Math.floor(Math.random() * (3400 - 1700) + 1700)} kg/ha

Current average prices in Pakistan:
- Rice (retail): PKR 82 to 136 per kg; Basmati (e.g., Kainat): ~PKR 262 per kg
- Maize (retail): PKR 87 to 186 per kg; Wholesale in Punjab: PKR 20–22/kg; in KPK: PKR 26–31/kg

Demand trends in Pakistan:
- Maize has high domestic demand (~9.1 million tons), mainly for poultry and dairy feed.
- Rice is more export-focused and price-sensitive to international markets.

Based on the predicted yields, current market prices, and demand trends within Pakistan, please provide a **clear recommendation** on whether I should grow **rice or maize**. Do **not** ask further questions—just analyze this data and give me your suggestion for what to plant for maximum profitability.`

    try {
      const res = await fetch(`/api/chat?question=${encodeURIComponent(input)}`)
      const data = await res.json()
      setAnalysis(data.response)
    } catch (error) {
      console.error("Error fetching analysis:", error)
      setAnalysis("Failed to load yield analysis. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const getfields = async () => {
    const response = await axios.get("/api/fields/getfield")
    setFields(response.data.field)
    setfields(response.data.field)
  }

  const toggleExpand = () => setExpanded(!expanded)

  const filteredFields = fields?.filter((field) => field.name.toLowerCase().includes(search.toLowerCase()))

  const handleClick = (id) => {
    setFieldId(id)
    setShowAnalysis(true)
  }

  // Function to extract key metrics from analysis text
  const extractMetrics = () => {
    const metrics = {
      recommendedCrop: "Unknown",
      profitability: analysis.match(/PKR\s+[\d,]+(\.\d+)?/g)?.[0] || "Varies by market conditions",
      confidence: analysis.includes("strongly recommend") ? "High" : analysis.includes("recommend") ? "Medium" : "Low",
    }

    // Better detection of crop recommendations
    if (
      analysis.includes("you should grow maize") ||
      analysis.includes("recommend maize") ||
      analysis.includes("maize is recommended") ||
      analysis.includes("choose maize") ||
      (analysis.includes("maize") && !analysis.includes("rice") && analysis.includes("recommend"))
    ) {
      metrics.recommendedCrop = "Maize"
    } else if (
      analysis.includes("you should grow rice") ||
      analysis.includes("recommend rice") ||
      analysis.includes("rice is recommended") ||
      analysis.includes("choose rice") ||
      (analysis.includes("rice") && !analysis.includes("maize") && analysis.includes("recommend"))
    ) {
      metrics.recommendedCrop = "Rice"
    } else if (analysis.includes("both crops") || analysis.includes("either crop")) {
      metrics.recommendedCrop = "Both crops viable"
    } else if (analysis.toLowerCase().includes("maize") && !analysis.toLowerCase().includes("rice")) {
      // If only maize is mentioned (and not rice), likely recommending maize
      metrics.recommendedCrop = "Maize"
    } else if (analysis.toLowerCase().includes("rice") && !analysis.toLowerCase().includes("maize")) {
      // If only rice is mentioned (and not maize), likely recommending rice
      metrics.recommendedCrop = "Rice"
    }

    return metrics
  }

  const metrics = extractMetrics()

  return (
    <div className={styles.container}>
      {/* Left Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brandContainer}>
            <h2 className={styles.brandName}>OneSoil</h2>
            <span className={styles.expandIcon}>▼</span>
          </div>
          <p className={styles.ownerText}>Owner</p>
        </div>

        <div className={styles.seasonContainer}>
          <div className={styles.seasonItem}>
            <div className={styles.seasonIcon}>
              <span>📅</span>
            </div>
            <span>Season 2025</span>
          </div>
        </div>

       
      </div>

      {/* Middle Panel - Fields List */}
      <div className={styles.fieldsList}>
        <div className={styles.fieldsListHeader}>
          <h2 className={styles.seasonTitle}>Season 2024</h2>
          <p className={styles.hectareInfo}>4.2 ha</p>
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button className={styles.sortButton}>
            <span>Sort</span>
            <Sort className={styles.sortIcon} />
          </button>
        </div>

        <div className={styles.fieldsSection}>
          <div className={styles.fieldsSectionHeader} onClick={toggleExpand}>
            {expanded ? <ExpandLess className={styles.expandIcon} /> : <ExpandMore className={styles.expandIcon} />}
            <span className={styles.sectionTitle}>Not activated fields</span>
            <span className={styles.hectareCount}>4.2 ha</span>
          </div>

          {expanded && (
            <div className={styles.fieldsList}>
              {filteredFields.map((field, index) => (
                <div key={index} className={styles.fieldItem} onClick={() => handleClick(field.id)}>
                  <div className={styles.fieldIcon}>
                    <div className={styles.triangleIcon}></div>
                  </div>
                  <div className={styles.fieldInfo}>
                    <span className={styles.fieldName}>{field.name}</span>
                    <span className={styles.fieldArea}>{field.area} ha</span>
                  </div>
                  <div className={styles.fieldCheckbox}></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Field Details */}
      {showAnalysis && (
        <div style={{ width: 500 }} className={styles.fieldDetails}>
          <div className={styles.fieldDetailsHeader}>
            <div className={styles.fieldTitleContainer}>
              <h2 className={styles.fieldTitle}>{fields.find((f) => f.id === fieldid)?.name || "Field 1"}</h2>
              <p className={styles.fieldSubtitle}>{fields.find((f) => f.id === fieldid)?.area || "4.2"} ha</p>
            </div>
            <div className={styles.fieldActions}>
              <button className={styles.closeButton} onClick={() => setShowAnalysis(false)}>
                <Close />
              </button>
            </div>
          </div>

          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tabButton} ${activeTab === "status" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("status")}
            >
              Status
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "fieldDetails" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("fieldDetails")}
            >
              Field Details <span className={styles.proBadge}>NEW</span>
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "yieldAnalysis" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("yieldAnalysis")}
            >
              Yield Analysis <span className={styles.proBadge}>PRO</span>
            </button>
          </div>

          {activeTab === "status" && (
            <div className={styles.chartsContainer}>
              <ClimateCharts id={fieldid} open={false} handleClose={() => {}} embedded={true} />
            </div>
          )}

{activeTab === "fieldDetails" && (
  <Box sx={{ p: 3 }}>
    <Typography variant="h5" sx={{ color: "green", mb: 2 }}>
      <InfoIcon sx={{ verticalAlign: "middle", mr: 1 }} />
      Field Details
    </Typography>

    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
            <TableCell colSpan={2}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "green" }}>
                <InfoIcon fontSize="small" sx={{ mr: 1 }} />
                Basic Info
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>🌾 Field Name</TableCell>
            <TableCell>{fields.find((f) => f.id === fieldid)?.name || "Unknown"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>📐 Area (ha)</TableCell>
            <TableCell>{fields.find((f) => f.id === fieldid)?.area || "0"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>🆔 Field ID</TableCell>
            <TableCell>{fieldid}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>📅 Created Date</TableCell>
            <TableCell>
              {fields.find((f) => f.id === fieldid)?.created_at
                ? new Date(fields.find((f) => f.id === fieldid)?.created_at).toLocaleDateString()
                : "Unknown"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>

    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
            <TableCell colSpan={2}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "green" }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                Location Info
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>🧭 Latitude</TableCell>
            <TableCell>{fields.find((f) => f.id === fieldid)?.lat || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>🧭 Longitude</TableCell>
            <TableCell>{fields.find((f) => f.id === fieldid)?.long || "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>🗺️ Coordinates</TableCell>
            <TableCell>
              <MapIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              {fields.find((f) => f.id === fieldid)?.lat?.toFixed(4) || "0.0000"}°N,&nbsp;
              {fields.find((f) => f.id === fieldid)?.long?.toFixed(4) || "0.0000"}°E
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
            <TableCell colSpan={2}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "green" }}>
                <TrendingUpIcon fontSize="small" sx={{ mr: 1 }} />
                Yield Prediction
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>📊 Prediction (kg/ha)</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "darkgreen" }}>
              {fields.find((f) => f.id === fieldid)?.prediction || "0"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
)}



          {activeTab === "yieldAnalysis" && (
            <div className={styles.yieldAnalysisContainer}>
              {loading ? (
                <div className={styles.analysisLoading}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Generating yield analysis...</p>
                </div>
              ) : (
                <>
                  <div className={styles.yieldMetricsGrid}>
                    <div className={styles.yieldMetricCard}>
                      <div className={styles.metricIconContainer}>
                        <Agriculture className={styles.metricIcon} />
                      </div>
                      <div className={styles.metricContent}>
                        <h3 className={styles.metricTitle}>Recommended Crop</h3>
                        <p className={styles.metricValue}>{metrics.recommendedCrop}</p>
                      </div>
                    </div>

                    <div className={styles.yieldMetricCard}>
                      <div className={styles.metricIconContainer}>
                        <AttachMoney className={styles.metricIcon} />
                      </div>
                      <div className={styles.metricContent}>
                        <h3 className={styles.metricTitle}>Est. Profitability</h3>
                        <p className={styles.metricValue}>{metrics.profitability}</p>
                      </div>
                    </div>

                    <div className={styles.yieldMetricCard}>
                      <div className={styles.metricIconContainer}>
                        <Assessment className={styles.metricIcon} />
                      </div>
                      <div className={styles.metricContent}>
                        <h3 className={styles.metricTitle}>Confidence Level</h3>
                        <p className={styles.metricValue}>{metrics.confidence}</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.analysisReport}>
                    <div className={styles.analysisReportHeader}>
                      <TrendingUp className={styles.analysisReportIcon} />
                      <h3 className={styles.analysisReportTitle}>Detailed Yield Analysis</h3>
                    </div>
                    <div className={styles.analysisReportContent}>
                      {analysis.split("\n\n").map((paragraph, index) => (
                        <p key={index} className={styles.analysisParagraph}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button */}
      <button className={styles.fab}>
        <Add />
      </button>
    </div>
  )
}

export default FieldManagement
