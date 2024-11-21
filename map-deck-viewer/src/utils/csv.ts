export function createCSV(data: any[], headings: string[], fileName: string) {
    const csvData = [headings, ...data].join("\r");
    downloadBlob(csvData, fileName);
}


function downloadBlob(content: BlobPart, filename: string) {
    // Create a blob
    var blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);

    // Create a link to download it
    var pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', `${filename}.csv`);
    pom.click();
}