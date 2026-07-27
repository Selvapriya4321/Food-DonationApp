import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function FoodList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Call backend endpoint (e.g., http://localhost:5000/api/food)
    API.get('/food')
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data from backend:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading donations...</p>;

  return (
    <div>
      <h2>Available Food Donations</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong> - {item.quantity}
          </li>
        ))}
      </ul>

      {/* Navigation Buttons */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => navigate('/donate')}>← Back to Donate</button>
        <button onClick={() => navigate('/dashboard')}>Go to Dashboard →</button>
      </div>
    </div>
  );
}

export default FoodList;