# 🌿 Greenspace Change Detection in Vijayawada (2019–2024)

> A remote sensing + machine learning project using **Google Earth Engine (GEE)** to monitor greenspace dynamics in Vijayawada city over six years.  
> Implemented using **Sentinel-2 imagery**, and classified via **Random Forest (RF)** and **Support Vector Machine (SVM)** algorithms.

---

## 📌 Overview

This project analyzes the **temporal change in greenspace** across Vijayawada from 2019 to 2024.  
We applied supervised classification models on Sentinel-2 images using:

- 🧠 **Random Forest (RF)**
- 🤖 **Support Vector Machine (SVM)**

Each year’s image was processed individually for both models, followed by accuracy assessment and greenspace area extraction.

---

## 🛰️ Methodology

1. **Study Area Definition**  
   - Used shapefile of Vijayawada city as Area of Interest (AOI)

2. **Image Selection**  
   - Selected cloud-free Sentinel-2 imagery for each year

3. **Preprocessing**  
   - Image clipping, median composite, band selection

4. **Classification**  
   - Trained RF and SVM on manually labeled land cover points

5. **Postprocessing**  
   - Accuracy evaluation, confusion matrix, greenspace extraction

---

## 📁 Folder Structure

```
epics_project/
├── Main-Scripts/              # Year-wise GEE scripts (2019–2024)
├── VIJAYAWADA_BOUNDARY/       # Shapefile components for AOI
├── Outputs/                   # Combined LULC and Greenspace maps                    
├── README.md
└── LICENSE
```

---

## 📂 Key Output Visualizations

### 🗺️ Yearly LULC Maps (2019–2024) — Random Forest
<img src="Outputs/lulc_maps_rf_2019_2024.png" alt="LULC RF Maps" width="75%">

---

### 🗺️ Yearly LULC Maps (2019–2024) — SVM
<img src="Outputs/lulc_maps_svm_2019_2024.png" alt="LULC SVM Maps" width="75%">

---

### 🌿 Greenspace Extraction (RF)
<img src="Outputs/greenspace_rf_2019_2024.png" alt="Greenspace RF" width="75%">

---

### 🌿 Greenspace Extraction (SVM)
<img src="Outputs/greenspace_svm_2019_2024.png" alt="Greenspace SVM" width="75%">

---

## 📈 Greenspace Area Table (sq.km)

| Year | RF Model | SVM Model |
|------|----------|-----------|
| 2019 | 541.41   | 479.63    |
| 2020 | 575.25   | 645.75    |
| 2021 | 494.29   | 496.39    |
| 2022 | 451.76   | 430.99    |
| 2023 | 681.08   | 744.22    |
| 2024 | 552.07   | 624.63    |

---

## 📍 Study Area: Vijayawada

- 📍 Location: Andhra Pradesh, India  
- 🧭 AOI defined using a custom shapefile  
- 🗂️ Uploaded to GEE for spatial filtering

> The AOI shapefile can be found under:  
[`VIJAYAWADA_BOUNDARY/`](./VIJAYAWADA_BOUNDARY)

---


## 👩‍💻 Authors

- **Abhinaya Chalamalasetti**  
- **Vemuri Nikshipta**  
- **Rajulapati Nandini**  
---

## 🛠️ Tools & Tech

| Tool              | Purpose                          |
|-------------------|----------------------------------|
| Google Earth Engine | Satellite image processing      |
| Sentinel-2        | Multispectral satellite data     |
| Random Forest     | Land cover classification        |
| SVM               | Classification (comparison model)|
| Shapefiles        | AOI definition                   |
| PPT, Excel        | Visuals, graphs, analysis        |

---

## 📬 Feedback & Contributions

If you found this project helpful or inspiring:

- ⭐ Star the repo  
- 🛠️ Fork and contribute ideas  
- 💬 Reach out for collaborations

Let’s build smarter cities through smarter mapping! 🗺️🌱

---

