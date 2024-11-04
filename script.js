document.getElementById("generateBtn").addEventListener("click", generateAndDownloadQRCode);
document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);
document.getElementById("showHistoryBtn").addEventListener("click", toggleHistory);

const history = [];

async function generateAndDownloadQRCode() {
    const qrInput = document.getElementById("qrInput").value.trim();
    const qrImg = document.getElementById("qrImg");
    const errorMessage = document.getElementById("errorMessage");
    const size = document.getElementById("sizeSelector").value;
    const color = document.getElementById("colorSelector").value.replace("#", "");

    if (!qrInput) {
        errorMessage.textContent = "Please enter a valid URL or text.";
        qrImg.src = "";
        qrImg.style.display = "none"; // Hide the QR image
        document.querySelector(".buttons").style.display = "none"; // Hide buttons
        return;
    } else {
        errorMessage.textContent = "";
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrInput)}&size=${size}x${size}&color=${color}`;

    // Show the QR image
    qrImg.src = qrCodeUrl;
    qrImg.onload = () => {
        qrImg.style.display = "block"; // Show the QR image
        document.querySelector(".buttons").style.display = "block"; // Show buttons

        // Update download link for image download (if needed)
        const downloadLink = document.getElementById("downloadBtn");
        downloadLink.href = qrCodeUrl; // Set the download link to the QR code URL

        // Trigger PDF download on button click
        downloadLink.onclick = function() {
            downloadPDF(qrCodeUrl);
            return false; // Prevent default link behavior
        };
    };

    // Add to history
    history.push({ url: qrCodeUrl, size, color, content: qrInput });
    updateHistory();
}

function downloadPDF(qrCodeUrl) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Use the QR code URL and convert it to an image for the PDF
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Allow cross-origin requests
    img.src = qrCodeUrl;

    img.onload = () => {
        pdf.addImage(img, 'PNG', 10, 10, 180, 180); // Adjust dimensions and position
        pdf.save('qr-code.pdf'); // Download PDF
    };
}

function updateHistory() {
    const qrHistory = document.getElementById("qrHistory");
    qrHistory.innerHTML = history.map((item, index) => `
        <li>
            <img src="${item.url}" alt="QR Code ${index + 1}" width="50">
            Content: ${item.content}, Size: ${item.size}, Color: #${item.color}
            <button onclick="deleteQRCode(${index})">Delete</button>
        </li>
    `).join("");
}

function deleteQRCode(index) {
    history.splice(index, 1);
    updateHistory();
}

function copyLink(url) {
    navigator.clipboard.writeText(url)
        .then(() => alert("QR Code link copied to clipboard!"))
        .catch(err => alert("Failed to copy link: " + err));
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const modeToggleText = document.getElementById("darkModeToggle").textContent;
    document.getElementById("darkModeToggle").textContent = modeToggleText === "🌙" ? "☀️" : "🌙";
}

function toggleHistory() {
    const historyContainer = document.getElementById("historyContainer");
    historyContainer.style.display = historyContainer.style.display === "none" ? "block" : "none";
}
