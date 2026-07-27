import React from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <div className="about">
      <h1>About FoodShare</h1>
      <p>
        FoodShare is a food donation platform that connects people who have extra food
        with people who need it.
      </p>

      {/* Button to navigate to the Next Page */}
      <button onClick={() => navigate('/donate')} style={{ marginTop: '20px', padding: '10px 15px', cursor: 'pointer' }}>
        Go to Donate Food →
      </button>
    </div>
  );
}

export default About;