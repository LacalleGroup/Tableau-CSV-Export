document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Tableau Extension...");

    tableau.extensions.initializeAsync().then(() => {
        console.log("Tableau API initialized successfully!");
        populateWorksheetDropdown();
    }).catch(err => {
        console.error("Error initializing Tableau API:", err);
    });

    // Attach click event to the export button
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
});

async function populateWorksheetDropdown() {
    try {
        const dashboard = tableau.extensions.dashboardContent.dashboard;
        const worksheetSelect = document.getElementById('worksheetSelect');

        if (dashboard.worksheets.length === 0) {
            alert("No worksheets available in this dashboard.");
            return;
        }

        dashboard.worksheets.forEach(ws => {
            const option = document.createElement('option');
            option.value = ws.name;
            option.text = ws.name;
            worksheetSelect.appendChild(option);
        });

        document.getElementById('exportBtn').disabled = false;
        console.log("Worksheet dropdown populated.");
    } catch (error) {
        console.error("Error populating worksheets:", error);
    }
}

async function exportToCSV() {
    try {
        const dashboard = tableau.extensions.dashboardContent.dashboard;
        const selectedWorksheetName = document.getElementById('worksheetSelect').value;
        const worksheet = dashboard.worksheets.find(ws => ws.name === selectedWorksheetName);

        if (!worksheet) {
            alert("Selected worksheet not found.");
            return;
        }

        console.log(`Exporting data from: ${worksheet.name}`);

        const options = {
            maxRows: 1000, // Change as needed
            includeAllColumns: true
        };
        const dataTable = await worksheet.getUnderlyingDataAsync(options);

        if (dataTable.data.length === 0) {
            alert("No data available for export.");
            return;
        }

        const columns = dataTable.columns.map(col => col.fieldName);

        // Build CSV content
        let csvContent = columns.join(",") + "\n";
        dataTable.data.forEach(row => {
            const rowData = row.map(cell => `"${cell.formattedValue}"`);
            csvContent += rowData.join(",") + "\n";
        });

        // Trigger file download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${worksheet.name}_export.csv`;
        link.click();

        console.log("CSV export completed!");
    } catch (error) {
        console.error("Error during CSV export:", error);
        alert("CSV export failed. See console for details.");
    }
}