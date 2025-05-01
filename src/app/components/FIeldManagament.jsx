"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import useAuthStore from "../store/useAuthStore"
import ClimateCharts from "./Chartsfields"
import styles from "../styles/field.module.css"
import { ExpandMore, ExpandLess, Add, Sort, Search, Close, Download, CloudUpload } from "@mui/icons-material"

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
  const [analysis,setAnalysis]=useState("");
  

  useEffect(() => {
    getfields()
    getAnalysis()
  }, [activeTab])
 const main = fields.filter((field) => field.id == fieldid)[0]
  const getAnalysis = async()=>{
    
    const input = `Here is some data about my field:

- Predicted Rice Yield: ${fields.filter((field) => field.id == fieldid)[0].prediction} kg/ha
- Predicted Maize Yield: ${Math.floor(Math.random() * (3400 - 1700) + 1700)} kg/ha

Current average prices in Pakistan:
- Rice (retail): PKR 82 to 136 per kg; Basmati (e.g., Kainat): ~PKR 262 per kg
- Maize (retail): PKR 87 to 186 per kg; Wholesale in Punjab: PKR 20–22/kg; in KPK: PKR 26–31/kg

Demand trends in Pakistan:
- Maize has high domestic demand (~9.1 million tons), mainly for poultry and dairy feed.
- Rice is more export-focused and price-sensitive to international markets.

Based on the predicted yields, current market prices, and demand trends within Pakistan, please provide a **clear recommendation** on whether I should grow **rice or maize**. Do **not** ask further questions—just analyze this data and give me your suggestion for what to plant for maximum profitability.`;
const res = await fetch(`/api/chat?question=${encodeURIComponent(input)}`)
    const data = await res.json()
    setAnalysis(data.response)
    console.log(data.response)
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
            <span>Season 2024</span>
          </div>
        </div>

        <div className={styles.createGroupContainer}>
          <button className={styles.createGroupBtn}>
            <span className={styles.plusIcon}>+</span>
            Create group
          </button>
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
      {showAnalysis ? (
        <div style={{width:1000}} className={styles.fieldDetails}>
          <div className={styles.fieldDetailsHeader}>
            <div className={styles.fieldTitleContainer}>
              <h2 className={styles.fieldTitle}>{fields.find((f) => f.id === fieldid)?.name || "Field 1"}</h2>
              <p className={styles.fieldSubtitle}>{fields.find((f) => f.id === fieldid)?.area || "4.2"} ha, Almonds</p>
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
              className={`${styles.tabButton} ${activeTab === "yieldAnalysis" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("yieldAnalysis")}
            >
              Yield Analysis <span className={styles.proBadge}>sexy</span>
            </button>
          </div>

      { activeTab=='status' &&    <div className={styles.chartsContainer}>
            <ClimateCharts id={fieldid} open={false} handleClose={() => {}} embedded={true} />
          </div>}
          {
            activeTab=='yieldAnalysis'&&
        <div>
          {analysis}
          </div>
          }
        </div>
      ) : (
        <div className={styles.emptyState}>
       
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
