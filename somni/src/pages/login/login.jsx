import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../utilities/components/auth-context';
import CsvUploader from '../../utilities/components/csv-uploader';
import './login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [enableCsvUpload, setEnableCsvUpload] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false); //tiene traccia dell'upload dei dati
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const user = await login(email, password);
        if (user) {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true'); //salva l'autenticazione dell'utente
        } else {
            alert('Login failed');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const user = await register(email, password, name, surname);
        if (user) {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true'); //salva l'autenticazione dell'utente
        } else {
            alert('Registration failed. Please, try again');
        }
    };

    return (
        <div className="login-container">
            <div className="sleeping-emoji">
                <img src="../../../img/sleeping.svg" alt="sleeping-emoji" />
            </div>

            <h1>Welcome to Somni</h1>
            {!isAuthenticated && (
                <form
                    className="login-form-style"
                    onSubmit={isRegistering ? handleRegister : handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {isRegistering && (
                        <>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Surname"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                required
                            />
                        </>
                    )}

                    {!isAuthenticated && (
                        <button className="auth-button" type="submit">
                            {isRegistering ? 'Register' : 'Login'}
                        </button>
                    )}
                </form>
            )}

            {!isRegistering && !isAuthenticated && (
                <button className="get-start-button-style" onClick={() => setIsRegistering(true)}>
                    Click here to start using Somni
                </button>
            )}

        

            {isAuthenticated && (
                <div className="upload-checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={enableCsvUpload}
                            onChange={(e) => setEnableCsvUpload(e.target.checked)}
                        />
                        Load sleep data
                    </label>
                    {enableCsvUpload && (
                        <CsvUploader onUploadSuccess={() => setUploadSuccess(true)} />
                    )}
                </div>
            )}

            {isAuthenticated && !enableCsvUpload && (
                <button className="go-to-dashboard-button" onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                </button>
            )}

            {isAuthenticated && enableCsvUpload && (
                <button
                    className="go-to-dashboard-button"
                    onClick={() => navigate('/dashboard')}
                    disabled={!uploadSuccess}>
                    {uploadSuccess ? 'Go to Dashboard' : 'Waiting for data to be uploaded...'}
                </button>
            )}
        </div>
    );
}

export default Login;
