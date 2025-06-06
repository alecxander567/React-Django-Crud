import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Landingpage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landingpage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/api/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
        if (response.ok) {
          alert('Signup successful!');
          setUsername('');
          setEmail('');
          setPassword('');
        } else {
          alert(`Signup failed: ${data.error || 'Something went wrong'}`);
        }
    };

    const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/api/login/', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
    });

    const data = await response.json();

    if (response.ok) {
        setLoginEmail('');
        setLoginPassword('');
        setLoginError('');
        navigate('/Homepage');
    } else {
        setLoginError(data.error || 'Login failed');
      }
    };

  return (
    <div className="landingpage-container">
      <div className="overlay"></div>
        <ul className="animated-circles">
            {Array.from({ length: 10 }).map((_, i) => (
                <li key={i}></li>
            ))}
        </ul>

      <div className="content container text-center text-light d-flex flex-column justify-content-center align-items-center">
        <nav className="navbar navbar-dark w-100 mt-3">
          <div className="container d-flex justify-content-between align-items-center">
            <span className="navbar-brand fs-4">
              <i className="bi bi-database-fill me-2"></i>CRUD App
            </span>
            <div>
                <button className="btn btn-sm btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#loginModal">
                    Log in
                </button>
                <button className="btn btn-sm btn-outline-light" data-bs-toggle="modal" data-bs-target="#signupModal">
                    Sign up
                </button>
            </div>
          </div>
        </nav>

        <main className="mt-5 text-center">
          <h1 className="display-4 fw-bold animate-fade-in">Organize & Manage Data</h1>
          <p className="lead animate-fade-in delay-1">Powerful and intuitive CRUD operations</p>
          <button className="btn btn-light btn-lg px-4 mt-4 animate-fade-in delay-2" data-bs-toggle="modal" data-bs-target="#loginModal">
            <i className="bi bi-box-arrow-in-right me-2"></i> Get Started
          </button>
        </main>
      </div>

      {/* Log in Modal */}
      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-light">
            <div className="modal-header border-secondary">
              <h5 className="modal-title" id="loginModalLabel">
                Log In
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleLogin}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control bg-secondary text-light border-0"
                    placeholder="Enter email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control bg-secondary text-light border-0"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                {loginError && (
                  <div className="alert alert-danger" role="alert">
                    {loginError}
                  </div>
                )}
              </div>
              <div className="modal-footer border-secondary">
                <button
                  type="button"
                  className="btn btn-outline-light"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-light text-dark">
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

        {/* Sign up Modal */}
        <div className="modal fade" id="signupModal" tabIndex="-1" aria-labelledby="signupModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light">
            <div className="modal-header border-secondary">
                <h5 className="modal-title" id="signupModalLabel">Sign Up</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSignup}>
                <div className="modal-body">
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control bg-secondary text-light border-0"
                    value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input type="email" className="form-control bg-secondary text-light border-0"
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control bg-secondary text-light border-0"
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                </div>
                <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-outline-light" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-light text-dark">Sign up</button>
                </div>
            </form>
            </div>
        </div>
        </div>

    </div>
  );
}

export default Landingpage;
