import React from 'react';

// --- You can replace these placeholders with your actual data ---

const universityLogo = 'https://upload.wikimedia.org/wikipedia/en/thumb/6/69/Southern_Luzon_State_University_Logo.png/250px-Southern_Luzon_State_University_Logo.png';
const universityName = 'Southern Luzon State University';
const universityAddress = 'SLSU Main Campus, Lucban, Quezon, Philippines';

const thesisTitle = 'DEVELOPMENT OF AN INTERACTIVE DIGITAL LEARNING AID FOR RADIOGRAPHIC POSITIONING TECHNIQUES AND PROCEDURES OF THE LOWER CERVICAL SPIN';

const proponents = [
  { name: 'Patricia Oabel', imageUrl: '/Images/pat.jpg' },
  { name: 'Crizha Jane de Veluz', imageUrl: '/Images/chriza.jpg' }
];

const adviserName = 'Dr. Manuel P. Delos Santos';
const collegeName = 'College of Allied Medicine';
const courseName = 'Bachelor of Science in Radiologic Technology';

function About() {
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    color: '#fff',
    backgroundColor: '#1a1a1a',
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  };

  const universityHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    justifyContent: 'flex-start'
  };

  const logoStyle = {
    width: '80px',
    height: 'auto',
    marginLeft: '15px'
  };

  const universityInfoStyle = {
    flex: 1,
    textAlign: 'center'
  };

  const proponentsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '50px',
    marginTop: '20px'
  };

  const proponentCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const proponentImageStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
    border: '3px solid #006400'
  };

  const sectionTitleStyle = {
    color: '#90ee90',
    borderBottom: '2px solid #444',
    paddingBottom: '5px',
    marginTop: '30px'
  };

  return (
    <div style={containerStyle}>
      {/* University Information */}
      <header style={universityHeaderStyle}>
        <img src={universityLogo} alt={`${universityName} Logo`} style={logoStyle} />
        <div style={universityInfoStyle}>
          <h1 style={{ margin: 0, color: '#90ee90' , marginRight: '80px'}}>{universityName}</h1>
          <p style={{ margin: 0 , marginRight: '80px'}}>{universityAddress}</p>
        </div>
      </header>

      <hr />

      {/* Rest of your component stays the same... */}
      {/* Thesis, Proponents, Adviser, College & Course */}

      {/* Thesis Title */}
      <div>
        <h2 style={sectionTitleStyle}>Thesis Title</h2>
        <br />
        <p style={{ fontSize: '1.2em', fontStyle: 'italic' }}>"{thesisTitle}"</p>
      </div>

      {/* Proponents */}
      <div>
        <h2 style={sectionTitleStyle}>Proponents</h2>
        <div style={proponentsContainerStyle}>
          {proponents.map((proponent, index) => (
            <div key={index} style={proponentCardStyle}>
              <img src={proponent.imageUrl} alt={proponent.name} style={proponentImageStyle} />
              <p><strong>{proponent.name}</strong></p>
            </div>
          ))}
        </div>
      </div>

      {/* Adviser */}
      <div>
        <h2 style={sectionTitleStyle}>Adviser</h2>
        <br />
        <p>{adviserName}</p>
      </div>

      {/* College and Course */}
      <footer style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #444' }}>
        <p style={{ margin: '5px 0' }}><strong></strong> {collegeName}</p>
      </footer>
        <p style={{ margin: '5px 0' }}><strong></strong> {courseName}</p>
    </div>
  );
}

export default About;
