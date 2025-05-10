// Update date and time
function updateDateTime() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    document.getElementById('current-date').textContent = now.toLocaleDateString(undefined, dateOptions);
    document.getElementById('current-time').textContent = now.toLocaleTimeString(undefined, timeOptions);
}

// Initialize date/time and update every second
updateDateTime();
setInterval(updateDateTime, 1000);

// Mobile sidebar toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Add mobile menu button
const header = document.querySelector('.dashboard-header');
const menuButton = document.createElement('button');
menuButton.innerHTML = '☰';
menuButton.className = 'menu-button';
menuButton.onclick = toggleSidebar;
header.insertBefore(menuButton, header.firstChild);

// 3D Bar Chart Class
class BarChart3D {
    constructor(canvas, data, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.data = data;
        this.options = {
            barWidth: 40,
            barSpacing: 20,
            depth: 30,
            animationDuration: 1000,
            ...options
        };
        
        this.animationStart = null;
        this.currentValues = data.map(() => 0);
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    draw() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Calculate dimensions
        const totalBars = this.data.length;
        const totalWidth = (this.options.barWidth + this.options.barSpacing) * totalBars;
        const startX = (width - totalWidth) / 2;
        const maxValue = Math.max(...this.data.map(d => d.value));
        
        // Draw bars
        this.data.forEach((bar, index) => {
            const x = startX + index * (this.options.barWidth + this.options.barSpacing);
            const barHeight = (this.currentValues[index] / maxValue) * (height - 100);
            const y = height - barHeight - 50;
            
            // Draw 3D effect
            ctx.fillStyle = bar.color;
            
            // Front face
            ctx.fillRect(x, y, this.options.barWidth, barHeight);
            
            // Top face
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + this.options.depth, y - this.options.depth);
            ctx.lineTo(x + this.options.barWidth + this.options.depth, y - this.options.depth);
            ctx.lineTo(x + this.options.barWidth, y);
            ctx.fill();
            
            // Side face
            ctx.beginPath();
            ctx.moveTo(x + this.options.barWidth, y);
            ctx.lineTo(x + this.options.barWidth + this.options.depth, y - this.options.depth);
            ctx.lineTo(x + this.options.barWidth + this.options.depth, y + barHeight - this.options.depth);
            ctx.lineTo(x + this.options.barWidth, y + barHeight);
            ctx.fill();
            
            // Draw label
            ctx.fillStyle = '#2c3e50';
            ctx.textAlign = 'center';
            ctx.fillText(bar.label, x + this.options.barWidth / 2, height - 20);
            ctx.fillText(bar.value + '%', x + this.options.barWidth / 2, y - 10);
        });
    }
    
    animate(timestamp) {
        if (!this.animationStart) this.animationStart = timestamp;
        const progress = Math.min((timestamp - this.animationStart) / this.options.animationDuration, 1);
        
        // Update current values
        this.currentValues = this.data.map((bar, index) => {
            return bar.value * progress;
        });
        
        this.draw();
        
        if (progress < 1) {
            requestAnimationFrame((timestamp) => this.animate(timestamp));
        }
    }
}

// Random data generation functions
function generateRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomColor() {
    const colors = [
        '#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#1abc9c',
        '#e67e22', '#34495e', '#16a085', '#d35400', '#c0392b', '#2980b9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function updateChartData(chart, data) {
    chart.data = data;
    chart.animationStart = null;
    chart.currentValues = data.map(() => 0);
    chart.animate(performance.now());
}

// Initialize Production Chart with random data
function generateProductionData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
        label: month,
        value: generateRandomValue(75, 98),
        color: generateRandomColor()
    }));
}

// Initialize Defect Chart with random data
function generateDefectData() {
    const defectTypes = ['Type A', 'Type B', 'Type C', 'Type D', 'Type E', 'Type F'];
    return defectTypes.map(type => ({
        label: type,
        value: generateRandomValue(1, 5),
        color: generateRandomColor()
    }));
}

// Initialize charts with random data
const productionChart = new BarChart3D(
    document.getElementById('productionChart'),
    generateProductionData(),
    { barWidth: 50, barSpacing: 30 }
);

const defectChart = new BarChart3D(
    document.getElementById('defectChart'),
    generateDefectData(),
    { barWidth: 60, barSpacing: 40 }
);

// Update charts every 5 seconds
setInterval(() => {
    updateChartData(productionChart, generateProductionData());
    updateChartData(defectChart, generateDefectData());
}, 5000);

// Add hover effects to KPI cards
document.querySelectorAll('.kpi-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add click handlers for navigation
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
        link.parentElement.classList.add('active');
    });
});

// Add responsive behavior
function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
}

window.addEventListener('resize', handleResize);

// Pie Chart Class
class PieChart {
    constructor(canvas, data, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.data = data;
        this.options = {
            animationDuration: 1000,
            ...options
        };
        
        this.animationStart = null;
        this.currentValues = data.map(() => 0);
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    draw() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.4;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        let startAngle = 0;
        const total = this.data.reduce((sum, item) => sum + item.value, 0);
        
        // Draw pie segments
        this.data.forEach((item, index) => {
            const endAngle = startAngle + (2 * Math.PI * this.currentValues[index]) / total;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            
            ctx.fillStyle = item.color;
            ctx.fill();
            
            // Draw label
            const labelAngle = startAngle + (endAngle - startAngle) / 2;
            const labelX = centerX + (radius * 0.7) * Math.cos(labelAngle);
            const labelY = centerY + (radius * 0.7) * Math.sin(labelAngle);
            
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '12px Arial';
            ctx.fillText(item.label, labelX, labelY);
            
            startAngle = endAngle;
        });
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
    
    animate(timestamp) {
        if (!this.animationStart) this.animationStart = timestamp;
        const progress = Math.min((timestamp - this.animationStart) / this.options.animationDuration, 1);
        
        this.currentValues = this.data.map((item, index) => {
            return item.value * progress;
        });
        
        this.draw();
        
        if (progress < 1) {
            requestAnimationFrame((timestamp) => this.animate(timestamp));
        }
    }
}

// Stacked Bar Chart Class
class StackedBarChart {
    constructor(canvas, data, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.data = data;
        this.options = {
            barWidth: 40,
            barSpacing: 20,
            animationDuration: 1000,
            ...options
        };
        
        this.animationStart = null;
        this.currentValues = data.map(() => ({ profit: 0, loss: 0 }));
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    draw() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        const totalBars = this.data.length;
        const totalWidth = (this.options.barWidth + this.options.barSpacing) * totalBars;
        const startX = (width - totalWidth) / 2;
        const maxValue = Math.max(...this.data.map(d => d.profit + d.loss));
        
        // Draw bars
        this.data.forEach((bar, index) => {
            const x = startX + index * (this.options.barWidth + this.options.barSpacing);
            const profitHeight = (this.currentValues[index].profit / maxValue) * (height - 100);
            const lossHeight = (this.currentValues[index].loss / maxValue) * (height - 100);
            const y = height - profitHeight - lossHeight - 50;
            
            // Draw profit bar
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(x, y, this.options.barWidth, profitHeight);
            
            // Draw loss bar
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(x, y + profitHeight, this.options.barWidth, lossHeight);
            
            // Draw label
            ctx.fillStyle = '#2c3e50';
            ctx.textAlign = 'center';
            ctx.fillText(bar.label, x + this.options.barWidth / 2, height - 20);
        });
    }
    
    animate(timestamp) {
        if (!this.animationStart) this.animationStart = timestamp;
        const progress = Math.min((timestamp - this.animationStart) / this.options.animationDuration, 1);
        
        this.currentValues = this.data.map((bar, index) => ({
            profit: bar.profit * progress,
            loss: bar.loss * progress
        }));
        
        this.draw();
        
        if (progress < 1) {
            requestAnimationFrame((timestamp) => this.animate(timestamp));
        }
    }
}

// Generate random profit distribution data
function generateProfitDistributionData() {
    const categories = ['Raw Materials', 'Labor', 'Overhead', 'Marketing', 'R&D', 'Other'];
    return categories.map(category => ({
        label: category,
        value: generateRandomValue(5, 30),
        color: generateRandomColor()
    }));
}

// Generate random profit/loss data
function generateProfitLossData() {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    return quarters.map(quarter => ({
        label: quarter,
        profit: generateRandomValue(100, 500),
        loss: generateRandomValue(50, 200)
    }));
}

// Initialize new charts
const profitPieChart = new PieChart(
    document.getElementById('profitPieChart'),
    generateProfitDistributionData()
);

const profitLossChart = new StackedBarChart(
    document.getElementById('profitLossChart'),
    generateProfitLossData()
);

// Update all charts every 5 seconds
setInterval(() => {
    updateChartData(productionChart, generateProductionData());
    updateChartData(defectChart, generateDefectData());
    updateChartData(profitPieChart, generateProfitDistributionData());
    updateChartData(profitLossChart, generateProfitLossData());
}, 5000);

// CSV Data Processing
let qualityData = [];

// Data Table Functions
function populateDataTable(data) {
    const tbody = document.querySelector('#qualityTable tbody');
    tbody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.Product_ID}</td>
            <td>${item.Defect_Type}</td>
            <td data-severity="${item.Defect_Severity}">${item.Defect_Severity}</td>
            <td>${item.Defect_Location}</td>
            <td data-result="${item.Inspection_Result}">${item.Inspection_Result}</td>
        `;
        tbody.appendChild(row);
    });
}

function filterData(data, filter) {
    switch(filter) {
        case 'Pass':
            return data.filter(item => item.Inspection_Result === 'Pass');
        case 'Fail':
            return data.filter(item => item.Inspection_Result === 'Fail');
        case 'High':
            return data.filter(item => item.Defect_Severity === 'High');
        default:
            return data;
    }
}

function searchData(data, searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    return data.filter(item => 
        item.Product_ID.toLowerCase().includes(searchTerm) ||
        item.Defect_Type.toLowerCase().includes(searchTerm) ||
        item.Defect_Severity.toLowerCase().includes(searchTerm) ||
        item.Defect_Location.toLowerCase().includes(searchTerm) ||
        item.Inspection_Result.toLowerCase().includes(searchTerm)
    );
}

function exportToCSV(data) {
    const headers = ['Product_ID', 'Defect_Type', 'Defect_Severity', 'Defect_Location', 'Inspection_Result'];
    const csvContent = [
        headers.join(','),
        ...data.map(item => [
            item.Product_ID,
            item.Defect_Type,
            item.Defect_Severity,
            item.Defect_Location,
            item.Inspection_Result
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'quality_control_data.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event Listeners for Data Table
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    const filter = document.getElementById('filterSelect').value;
    let filteredData = filterData(qualityData, filter);
    filteredData = searchData(filteredData, searchTerm);
    populateDataTable(filteredData);
});

document.getElementById('filterSelect').addEventListener('change', (e) => {
    const filter = e.target.value;
    const searchTerm = document.getElementById('searchInput').value;
    let filteredData = filterData(qualityData, filter);
    filteredData = searchData(filteredData, searchTerm);
    populateDataTable(filteredData);
});

document.getElementById('exportBtn').addEventListener('click', () => {
    const filter = document.getElementById('filterSelect').value;
    const searchTerm = document.getElementById('searchInput').value;
    let filteredData = filterData(qualityData, filter);
    filteredData = searchData(filteredData, searchTerm);
    exportToCSV(filteredData);
});

// Update loadCSVData function to populate the table
async function loadCSVData() {
    try {
        const response = await fetch('Quality_Control_Dataset.csv');
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1); // Skip header row
        
        qualityData = rows.map(row => {
            const [Product_ID, Defect_Type, Defect_Severity, Defect_Location, Inspection_Result] = row.split(',');
            return {
                Product_ID,
                Defect_Type,
                Defect_Severity,
                Defect_Location,
                Inspection_Result
            };
        }).filter(row => row.Product_ID); // Filter out empty rows
        
        // Populate the data table
        populateDataTable(qualityData);
        
        // Update charts
        updateAllCharts();
    } catch (error) {
        console.error('Error loading CSV data:', error);
    }
}

// Data Analysis Functions
function analyzeDefectTypes() {
    const defectCounts = {};
    qualityData.forEach(item => {
        if (item.Defect_Type !== 'No Defect') {
            defectCounts[item.Defect_Type] = (defectCounts[item.Defect_Type] || 0) + 1;
        }
    });
    
    return Object.entries(defectCounts).map(([type, count]) => ({
        label: type,
        value: (count / qualityData.length) * 100,
        color: generateRandomColor()
    }));
}

function analyzeDefectSeverity() {
    const severityCounts = {
        High: 0,
        Medium: 0,
        Low: 0,
        None: 0
    };
    
    qualityData.forEach(item => {
        severityCounts[item.Defect_Severity]++;
    });
    
    return Object.entries(severityCounts).map(([severity, count]) => ({
        label: severity,
        value: (count / qualityData.length) * 100,
        color: generateRandomColor()
    }));
}

function analyzePassFailByLocation() {
    const locationData = {};
    
    qualityData.forEach(item => {
        if (!locationData[item.Defect_Location]) {
            locationData[item.Defect_Location] = { pass: 0, fail: 0 };
        }
        if (item.Inspection_Result === 'Pass') {
            locationData[item.Defect_Location].pass++;
        } else {
            locationData[item.Defect_Location].fail++;
        }
    });
    
    return Object.entries(locationData).map(([location, data]) => ({
        label: location,
        profit: data.pass,
        loss: data.fail
    }));
}

function calculateQualityMetrics() {
    const totalProducts = qualityData.length;
    const passedProducts = qualityData.filter(item => item.Inspection_Result === 'Pass').length;
    const failedProducts = totalProducts - passedProducts;
    const highSeverityDefects = qualityData.filter(item => item.Defect_Severity === 'High').length;
    
    return {
        passRate: (passedProducts / totalProducts) * 100,
        failRate: (failedProducts / totalProducts) * 100,
        highSeverityRate: (highSeverityDefects / totalProducts) * 100,
        qualityScore: ((passedProducts - highSeverityDefects) / totalProducts) * 100
    };
}

// Update KPI Cards with real data
function updateKPICards() {
    const metrics = calculateQualityMetrics();
    
    document.querySelector('.kpi-card:nth-child(1) .kpi-value').textContent = 
        metrics.passRate.toFixed(1) + '%';
    document.querySelector('.kpi-card:nth-child(2) .kpi-value').textContent = 
        metrics.failRate.toFixed(1) + '%';
    document.querySelector('.kpi-card:nth-child(3) .kpi-value').textContent = 
        (100 - metrics.highSeverityRate).toFixed(1) + '%';
    document.querySelector('.kpi-card:nth-child(4) .kpi-value').textContent = 
        metrics.qualityScore.toFixed(1) + '%';
}

// Update all charts with real data
function updateAllCharts() {
    // Update Production Chart (Defect Types)
    updateChartData(productionChart, analyzeDefectTypes());
    
    // Update Defect Chart (Severity Distribution)
    updateChartData(defectChart, analyzeDefectSeverity());
    
    // Update Profit/Loss Chart (Pass/Fail by Location)
    updateChartData(profitLossChart, analyzePassFailByLocation());
    
    // Update KPI Cards
    updateKPICards();
}

// Load CSV data when the page loads
loadCSVData();

// Update charts every 30 seconds instead of 5
setInterval(updateAllCharts, 30000); 