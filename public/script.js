// public/script.js
let hospitals = [];
let currentService = 'bed';

// Load hospitals data on page load
async function loadHospitals() {
    try {
        const response = await fetch('/api/hospitals');
        hospitals = await response.json();
        loadComparison();
    } catch (error) {
        console.error('Error loading hospitals:', error);
    }
}

// Load comparison data
async function loadComparison() {
    const serviceType = document.getElementById('serviceType').value;
    currentService = serviceType;
    
    try {
        const response = await fetch(`/api/compare?service=${serviceType}`);
        const comparisonData = await response.json();
        displayComparison(comparisonData, serviceType);
        displayStatistics(comparisonData, serviceType);
    } catch (error) {
        console.error('Error loading comparison:', error);
    }
}

// Display comparison results
function displayComparison(data, serviceType) {
    const resultsContainer = document.getElementById('comparisonResults');
    const serviceLabels = {
        bed: 'Bed Charges (per day)',
        emergency: 'Emergency Charges',
        opd: 'OPD Charges'
    };
    
    if (data.length === 0) {
        resultsContainer.innerHTML = '<p class="no-data">No data available</p>';
        return;
    }
    
    const minCharge = Math.min(...data.map(h => h.charge));
    const maxCharge = Math.max(...data.map(h => h.charge));
    
    resultsContainer.innerHTML = data.map((hospital, index) => {
        let cardClass = 'hospital-card';
        let badge = '';
        
        if (hospital.charge === minCharge) {
            cardClass += ' cheapest';
            badge = '<span class="badge cheapest">Cheapest</span>';
        } else if (hospital.charge === maxCharge) {
            cardClass += ' most-expensive';
            badge = '<span class="badge expensive">Most Expensive</span>';
        }
        
        return `
            <div class="${cardClass}">
                ${badge}
                <div class="hospital-name">${hospital.name}</div>
                <div class="hospital-location">${hospital.city}, ${hospital.state}</div>
                <div class="charge-amount">₹${hospital.charge.toLocaleString('en-IN')}</div>
                <div class="charge-label">${serviceLabels[serviceType]}</div>
            </div>
        `;
    }).join('');
}

// Display statistics
function displayStatistics(data, serviceType) {
    if (data.length === 0) return;
    
    const charges = data.map(h => h.charge);
    const min = Math.min(...charges);
    const max = Math.max(...charges);
    const avg = charges.reduce((a, b) => a + b, 0) / charges.length;
    const median = charges.sort((a, b) => a - b)[Math.floor(charges.length / 2)];
    
    const serviceLabels = {
        bed: 'Bed Service',
        emergency: 'Emergency Service',
        opd: 'OPD Service'
    };
    
    document.getElementById('statistics').innerHTML = `
        <h3>Statistics for ${serviceLabels[serviceType]}</h3>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">₹${min.toLocaleString('en-IN')}</div>
                <div class="stat-label">Minimum Charge</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">₹${max.toLocaleString('en-IN')}</div>
                <div class="stat-label">Maximum Charge</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">₹${Math.round(avg).toLocaleString('en-IN')}</div>
                <div class="stat-label">Average Charge</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">₹${median.toLocaleString('en-IN')}</div>
                <div class="stat-label">Median Charge</div>
            </div>
        </div>
    `;
}

// Toggle add hospital form
function toggleAddForm() {
    const form = document.getElementById('addHospitalForm');
    form.classList.toggle('hidden');
}

// Add new hospital
async function addHospital(event) {
    event.preventDefault();
    
    const hospitalData = {
        name: document.getElementById('hospitalName').value,
        city: document.getElementById('hospitalCity').value,
        state: document.getElementById('hospitalState').value,
        charges: {
            bed: parseInt(document.getElementById('bedCharge').value),
            emergency: parseInt(document.getElementById('emergencyCharge').value),
            opd: parseInt(document.getElementById('opdCharge').value)
        }
    };
    
    try {
        const response = await fetch('/api/hospitals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(hospitalData)
        });
        
        if (response.ok) {
            alert('Hospital added successfully!');
            document.querySelector('#addHospitalForm form').reset();
            toggleAddForm();
            loadHospitals();
        } else {
            alert('Error adding hospital');
        }
    } catch (error) {
        console.error('Error adding hospital:', error);
        alert('Error adding hospital');
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadHospitals();
    
    // Add event listener for service type change
    document.getElementById('serviceType').addEventListener('change', loadComparison);
});
