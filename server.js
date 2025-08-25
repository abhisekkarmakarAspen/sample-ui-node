// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Sample hospital data with Indian hospitals
let hospitals = [
  {
    id: 1,
    name: "Apollo Hospital, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    charges: {
      bed: 2500,
      emergency: 1500,
      opd: 800
    }
  },
  {
    id: 2,
    name: "Fortis Hospital, Delhi",
    city: "Delhi",
    state: "Delhi",
    charges: {
      bed: 3000,
      emergency: 2000,
      opd: 1000
    }
  },
  {
    id: 3,
    name: "Manipal Hospital, Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    charges: {
      bed: 2800,
      emergency: 1800,
      opd: 900
    }
  },
  {
    id: 4,
    name: "Max Healthcare, Gurgaon",
    city: "Gurgaon",
    state: "Haryana",
    charges: {
      bed: 3500,
      emergency: 2200,
      opd: 1200
    }
  },
  {
    id: 5,
    name: "Kokilaben Hospital, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    charges: {
      bed: 4000,
      emergency: 2500,
      opd: 1100
    }
  },
  {
    id: 6,
    name: "AIIMS, Delhi",
    city: "Delhi",
    state: "Delhi",
    charges: {
      bed: 500,
      emergency: 200,
      opd: 50
    }
  },
  {
    id: 7,
    name: "Christian Medical College, Vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    charges: {
      bed: 1500,
      emergency: 800,
      opd: 300
    }
  },
  {
    id: 8,
    name: "Medanta Hospital, Gurgaon",
    city: "Gurgaon",
    state: "Haryana",
    charges: {
      bed: 3200,
      emergency: 2100,
      opd: 950
    }
  }
];

// API Routes

// Get all hospitals
app.get('/api/hospitals', (req, res) => {
  res.json(hospitals);
});

// Get hospital by ID
app.get('/api/hospitals/:id', (req, res) => {
  const hospital = hospitals.find(h => h.id === parseInt(req.params.id));
  if (!hospital) {
    return res.status(404).json({ error: 'Hospital not found' });
  }
  res.json(hospital);
});

// Add new hospital
app.post('/api/hospitals', (req, res) => {
  const { name, city, state, charges } = req.body;
  
  if (!name || !city || !state || !charges) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const newHospital = {
    id: hospitals.length + 1,
    name,
    city,
    state,
    charges: {
      bed: charges.bed || 0,
      emergency: charges.emergency || 0,
      opd: charges.opd || 0
    }
  };
  
  hospitals.push(newHospital);
  res.status(201).json(newHospital);
});

// Update hospital charges
app.put('/api/hospitals/:id', (req, res) => {
  const hospitalIndex = hospitals.findIndex(h => h.id === parseInt(req.params.id));
  if (hospitalIndex === -1) {
    return res.status(404).json({ error: 'Hospital not found' });
  }
  
  const { charges } = req.body;
  if (charges) {
    hospitals[hospitalIndex].charges = { ...hospitals[hospitalIndex].charges, ...charges };
  }
  
  res.json(hospitals[hospitalIndex]);
});

// Get comparison data
app.get('/api/compare', (req, res) => {
  const { service } = req.query;
  
  if (!service || !['bed', 'emergency', 'opd'].includes(service)) {
    return res.status(400).json({ error: 'Valid service type required (bed, emergency, opd)' });
  }
  
  const comparison = hospitals
    .map(hospital => ({
      name: hospital.name,
      city: hospital.city,
      state: hospital.state,
      charge: hospital.charges[service]
    }))
    .sort((a, b) => a.charge - b.charge);
  
  res.json(comparison);
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

