// Machine Status Dashboard JavaScript

// Update date and time
function updateDateTime() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    document.getElementById('current-date').textContent = now.toLocaleDateString(undefined, dateOptions);
    document.getElementById('current-time').textContent = now.toLocaleTimeString(undefined, timeOptions);
}

// Initialize charts for individual machines
function initializeMachineCharts() {
    const machines = ['A', 'B', 'C', 'D'];
    machines.forEach(machine => {
        const ctx = document.getElementById(`machine${machine}Chart`).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                datasets: [{
                    label: 'Efficiency',
                    data: generateRandomData(24, 70, 100),
                    borderColor: '#4CAF50',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 100
                    }
                }
            }
        });
    });
}

// Initialize overall performance chart
function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Machine A-101', 'Machine B-202', 'Machine C-303', 'Machine D-404'],
            datasets: [{
                label: 'Efficiency',
                data: [94.5, 0, 92.1, 78.3],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#4CAF50',
                    '#ff9800'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Efficiency (%)'
                    }
                }
            }
        }
    });
}

// Generate random data for charts
function generateRandomData(length, min, max) {
    return Array.from({length}, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// Update machine metrics
function updateMachineMetrics() {
    const machines = document.querySelectorAll('.machine-card');
    machines.forEach(machine => {
        const efficiency = machine.querySelector('.metric:nth-child(1) .metric-value');
        const uptime = machine.querySelector('.metric:nth-child(2) .metric-value');
        const temperature = machine.querySelector('.metric:nth-child(3) .metric-value');
        
        // Update efficiency
        const currentEfficiency = parseFloat(efficiency.textContent);
        const newEfficiency = Math.max(0, Math.min(100, currentEfficiency + (Math.random() - 0.5) * 2));
        efficiency.textContent = `${newEfficiency.toFixed(1)}%`;
        
        // Update temperature
        const currentTemp = parseFloat(temperature.textContent);
        const newTemp = Math.max(20, Math.min(80, currentTemp + (Math.random() - 0.5) * 2));
        temperature.textContent = `${newTemp.toFixed(1)}°C`;
        
        // Add warning class if temperature is too high
        if (newTemp > 55) {
            temperature.classList.add('warning');
        } else {
            temperature.classList.remove('warning');
        }
    });
}

// Initialize the dashboard
function initializeDashboard() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    initializeMachineCharts();
    initializePerformanceChart();
    
    // Update metrics every 5 seconds
    setInterval(updateMachineMetrics, 5000);
}

// Add event listeners for action buttons
function initializeActionButtons() {
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent;
            const machineId = this.closest('tr').querySelector('td').textContent;
            
            if (action === 'View Details') {
                alert(`Viewing details for ${machineId}`);
            } else if (action === 'Reschedule') {
                alert(`Rescheduling maintenance for ${machineId}`);
            }
        });
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeActionButtons();
}); 