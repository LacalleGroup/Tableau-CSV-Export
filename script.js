document.addEventListener('DOMContentLoaded', () => {
    tableau.extensions.initializeAsync().then(() => {
        document.getElementById("exportBtn").addEventListener("click", exportToCSV);
    });
});

async function exportToCSV() {
    try {
        const worksheet = tableau.extensions.dashboardContent.dashboard.worksheets[0];
        const dataTable = await worksheet.getUnderlyingDataAsync();

        const data = dataTable.data;
        const columns = dataTable.columns.map(col => col.fieldName);

        // Create CSV Content
        let csvContent = columns.join(",") + "\n";
        data.forEach(row => {
            const rowValues = row.map(cell => `"${cell.formattedValue}"`);
            csvContent += rowValues.join(",") + "\n";
        });

        // Trigger File Download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "export.csv";
        link.click();
    } catch (error) {
        console.error("Error exporting CSV:", error);
        alert("Failed to export CSV. Please try again.");
    }
}