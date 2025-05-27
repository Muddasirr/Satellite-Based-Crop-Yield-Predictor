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
import FieldDetails from "./FieldDetails"


const FieldManagement = () => {
  const store = useAuthStore()
  const setfields = store.setfields
  const fields = store.fields
  const [expanded, setExpanded] = useState(true)
  const [selectedFields, setSelectedFields] = useState([])
  const [search, setSearch] = useState("")
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [fieldid, setFieldId] = useState("")
  const [activeTab, setActiveTab] = useState("status")
  const [analysis, setAnalysis] = useState("")
  const [loading, setLoading] = useState(false)
  const[main,setMain]= useState({});
  console.log(fields)
  useEffect(() => {
    getfields()
    getAnalysis(main)
  }, [main])

  const getAnalysis = async(main)=>{
    if (main==null){
      setAnalysis('failed to fetch analysis')
    }else {
    const input = `Here is some data about my field:

- Predicted Rice Yield: ${main.prediction} kg/ha
- Predicted Maize Yield: ${Math.floor(Math.random() * 1000 )} kg/ha

Current average prices in Pakistan:
- Rice (retail): PKR 200 to 250 per kg; Basmati (e.g., Kainat): ~PKR 262 per kg
- Maize (retail): PKR 87 to 186 per kg; Wholesale in Punjab: PKR 20–22/kg; in KPK: PKR 26–31/kg

Demand trends in Pakistan:
- Maize has high domestic demand , mainly for poultry and dairy feed.
- Rice is more export-focused, has high domestic demand as well and price-sensitive to international markets.

Based on the predicted yields, current market prices, and demand trends within Pakistan,
 please provide a **clear recommendation** on whether I should grow **rice or maize**
 . Do **not** ask further questions—just analyze this data and give me your suggestion 
 for what to plant for maximum profitability.
 Also say "you should grow rice" if rice is better and if maize is better say "you should grow maize" in the last sentence of ur analysis`


    try {
      const res = await fetch(`/api/chat?question=${encodeURIComponent(input)}`)
      const data = await res.json()
      setAnalysis(data.response)
    } catch (error) {
      console.error("Error fetching analysis:", error)
      setAnalysis("Failed to load yield analysis. Please try again later.")
    } finally {
      setLoading(false)
    }}
  }

  const getfields = async () => {
    const response = await axios.get("/api/fields/getfield")
    
    setfields(response.data.field)
  }

  const toggleExpand = () => setExpanded(!expanded)

  const filteredFields = fields?.filter((field) => field.name.toLowerCase().includes(search.toLowerCase()))

  const handleClick = (id) => {
    const main = fields.filter((field) => field.id == id)[0]
    setMain(main);
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


    if (
      analysis.includes("should grow maize") 

    ) {
      metrics.recommendedCrop = "Maize"
    } else if (
      analysis.includes("should grow rice") 
      ) {
      metrics.recommendedCrop = "Rice"
    } 

    return metrics
  }

  const metrics = extractMetrics()

  return (
    <div className={styles.container}>
     

      {/* Middle Panel - Fields List */}
      <div className={styles.fieldsList}>
        <div className={styles.fieldsListHeader}>
          <h2 className={styles.seasonTitle}>Season 2025</h2>
          {/* <p className={styles.hectareInfo}>4.2 ha</p> */}
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
          {/* <button className={styles.sortButton}>
            <span>Sort</span>
            <Sort className={styles.sortIcon} />
          </button> */}
        </div>

        <div className={styles.fieldsSection}>
          <div className={styles.fieldsSectionHeader} onClick={toggleExpand}>
            {expanded ? <ExpandLess className={styles.expandIcon} /> : <ExpandMore className={styles.expandIcon} />}
            <span className={styles.sectionTitle}>Fields</span>
            {/* <span className={styles.hectareCount}>4.2 ha</span> */}
          </div>

          {expanded && (
            <div className={styles.fieldsList}>
              {filteredFields?.map((field, index) => (
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
  <FieldDetails fields={fields} fieldId={fieldid} />
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

      <button className={styles.fab}>
        <Add />
      </button>
    </div>
  )
}

export default FieldManagement
