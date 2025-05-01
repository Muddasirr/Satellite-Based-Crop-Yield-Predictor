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

  useEffect(() => {
    getfields()
  }, [])

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
        <div className={styles.fieldDetails}>
          <div className={styles.fieldDetailsHeader}>
            <div className={styles.fieldTitleContainer}>
              <h2 className={styles.fieldTitle}>{fields.find((f) => f.id === fieldid)?.name || "Field 1"}</h2>
              <p className={styles.fieldSubtitle}>{fields.find((f) => f.id === fieldid)?.area || "4.2"} ha, Almonds</p>
            </div>
            <div className={styles.fieldActions}>
              <div className={styles.actionButton}>
                <div className={styles.actionIcon}>
                  <Download />
                </div>
                <span className={styles.actionText}>Prescription map</span>
              </div>
              <div className={styles.actionButton}>
                <div className={styles.actionIcon}>
                  <Download />
                </div>
                <span className={styles.actionText}>Soil sampling map</span>
              </div>
              <div className={styles.actionButton}>
                <div className={styles.actionIcon}>
                  <CloudUpload />
                </div>
                <span className={styles.actionText}>Upload data</span>
              </div>
              <button className={styles.moreButton}>...</button>
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
              className={`${styles.tabButton} ${activeTab === "fieldReport" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("fieldReport")}
            >
              Field report <span className={styles.proBadge}>PRO</span>
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "prescriptionMaps" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("prescriptionMaps")}
            >
              Prescription maps <span className={styles.proBadge}>PRO</span>
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "data" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("data")}
            >
              Data
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "yieldAnalysis" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("yieldAnalysis")}
            >
              Yield Analysis <span className={styles.proBadge}>PRO</span>
            </button>
          </div>

          <div className={styles.chartsContainer}>
            <ClimateCharts id={fieldid} open={false} handleClose={() => {}} embedded={true} />
          </div>
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
