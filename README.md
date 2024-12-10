
# **Tableau Force CSV Export**  

## **1. Introduction**  
The Tableau CSV Export Extension solves common export issues when using Tableau Server or Tableau Online. It ensures that files are exported as true CSVs instead of incorrectly formatted TSVs (while still labelled as CSVs). 

Additionally, platforms like Meta Ads can flag errors in formatting (even if the formatting is correct) if the first few rows are null values. This extension will automatically sort rows by number of nulls to avoid these this issue.


## **2. Features**  
- ✅ Correct CSV formatting (resolves tab-separated file issues)  
- ✅ Automatic row sorting to avoid null values in first row


## **3. Installation**  

### **Prerequisites**  
- Tableau Server or Tableau Online access  

### **Installation Steps**  
1. **Download:** Download the `.trex` file from this repository.
2. **Add to Tableau:**   
   - Open your Tableau dashboard.  
   - Navigate to the worksheet where you want the export feature.  
   - Add an Extension object from the Dashboard pane.  
   - Select *My Extensions* and upload the `.trex` file.  

3. **Configure Settings:**   
   - No further configuration needed—ready to use!  
