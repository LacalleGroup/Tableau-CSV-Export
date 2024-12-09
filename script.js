document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Tableau Extension...");

    // Attempt to initialize the Tableau Extension
    tableau.extensions.initializeAsync().then(() => {
        console.log("Tableau API initialized successfully!");
    
        const dashboard = tableau.extensions.dashboardContent.dashboard;
        console.log("Dashboard Name:", dashboard.name);
        console.log("Worksheets in Dashboard:", dashboard.worksheets.map(ws => ws.name));
    
        const exportButton = document.getElementById('exportBtn');
        if (exportButton) {
            exportButton.addEventListener('click', exportToCSV);
        } else {
            console.error("Export button not found!");
        }
    }).catch(err => {
        console.error("Failed to initialize Tableau API:", err);
    });
});

async function exportToCSV() {
    try {
        const dashboard = tableau.extensions.dashboardContent.dashboard;
        const worksheet = dashboard.worksheets[0];

        const dataTable = await worksheet.getUnderlyingDataAsync();
        console.log("Data table retrieved:", dataTable);

        if (!dataTable || !dataTable.data.length) {
            throw new Error("No data found in the selected worksheet.");
        }

        const columns = dataTable.columns.map(col => col.fieldName);
        let csvContent = columns.join(",") + "\n";

        dataTable.data.forEach(row => {
            const rowData = row.map(cell => `"${cell.formattedValue}"`);
            csvContent += rowData.join(",") + "\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "export.csv";
        link.click();
    } catch (error) {
        console.error("Error during CSV export:", error);
        alert("CSV export failed. See the console for details.");
    }
}