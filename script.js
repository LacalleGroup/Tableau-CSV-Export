document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Tableau Extension...");

    // Initialize Tableau Extension
    tableau.extensions.initializeAsync().then(() => {
        console.log("Tableau API initialized successfully!");

        // Attach click event to export button
        document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    }).catch(err => {
        console.error("Error initializing Tableau API:", err);
    });
});

async function exportToCSV() {
    try {
        console.log("Export button clicked!");

        // Get active worksheet
        const dashboard = tableau.extensions.dashboardContent.dashboard;
        const worksheet = dashboard.worksheets[0]; // Assuming first worksheet is used
        console.log("Active worksheet:", worksheet.name);

        // Fetch underlying data
        const dataTable = await worksheet.getUnderlyingDataAsync();
        console.log("Retrieved data table:", dataTable);

        const data = dataTable.data;
        const columns = dataTable.columns.map(col => col.fieldName);

        // Build CSV content
        let csvContent = columns.join(",") + "\n";
        data.forEach(row => {
            const rowValues = row.map(cell => `"${cell.formattedValue}"`);
            csvContent += rowValues.join(",") + "\n";
        });

        // Trigger file download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "export.csv";
        link.click();

        console.log("CSV export completed!");
    } catch (error) {
        console.error("Error during export:", error);
        alert("Failed to export CSV. Check the console for details.");
    }
}