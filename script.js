document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Tableau Extension...");

    // Attempt to initialize the Tableau Extension
    tableau.extensions.initializeAsync()
        .then(() => {
            console.log("Tableau API initialized successfully!");

            // Log dashboard information
            const dashboard = tableau.extensions.dashboardContent.dashboard;
            console.log("Dashboard Name:", dashboard.name);
            console.log("Worksheets in Dashboard:", dashboard.worksheets.map(ws => ws.name));

            // Attach the export functionality to the button
            const exportButton = document.getElementById('exportBtn');
            if (exportButton) {
                console.log("Export button found. Adding click listener...");
                exportButton.addEventListener('click', exportToCSV);
            } else {
                console.error("Export button not found! Check the HTML element ID.");
            }
        })
        .catch(err => {
            console.error("Error initializing Tableau API:", err);
        });
});

async function exportToCSV() {
    try {
        console.log("Export button clicked!");

        // Retrieve the active dashboard
        const dashboard = tableau.extensions.dashboardContent.dashboard;

        // Log all worksheets for debugging
        console.log("Available worksheets:", dashboard.worksheets.map(ws => ws.name));

        // Use the first worksheet (adjust this logic if you have multiple worksheets)
        const worksheet = dashboard.worksheets[0];
        if (!worksheet) {
            console.error("No worksheet found in the dashboard!");
            return;
        }
        console.log("Active worksheet:", worksheet.name);

        // Retrieve underlying data from the worksheet
        console.log(`Fetching underlying data for worksheet: ${worksheet.name}`);
        const dataTable = await worksheet.getUnderlyingDataAsync();
        console.log("Data table successfully retrieved:", dataTable);

        // Log the column and row structure
        console.log("Columns:", dataTable.columns.map(col => col.fieldName));
        console.log("Number of rows:", dataTable.data.length);

        // Extract data for CSV
        const data = dataTable.data;
        const columns = dataTable.columns.map(col => col.fieldName);

        // Build the CSV content
        let csvContent = columns.join(",") + "\n";
        data.forEach(row => {
            const rowValues = row.map(cell => `"${cell.formattedValue}"`);
            csvContent += rowValues.join(",") + "\n";
        });

        console.log("CSV content successfully created. Preparing to download...");

        // Trigger file download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "export.csv";
        link.click();

        console.log("CSV export completed successfully!");
    } catch (error) {
        console.error("Error during CSV export:", error);

        // User-friendly error message
        alert("An error occurred while exporting data. Check the console for details.");
    }
}