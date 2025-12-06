<script>
    import {storage} from "../services/storage.js";

    let username = $state('');
    let password = $state('');
    let showPassword = $state(false);
    let errors = $state({ username: '', password: '' });
    let touched = $state({ username: false, password: false });

    function validateField(field) {
        if (field === 'username') {
            if (!username.trim()) {
                errors.username = 'Username is required';
            } else {
                errors.username = '';
            }
        }

        if (field === 'password') {
            if (!password.trim()) {
                errors.password = 'Password is required';
            } else {
                errors.password = '';
            }
        }
    }

    function handleBlur(field) {
        touched[field] = true;
        validateField(field);
    }

    function handleLogin() {
        // Mark all as touched
        touched = { username: true, password: true };

        // Validate all fields
        validateField('username');
        validateField('password');

        // If there are errors, don't proceed
        if (errors.username || errors.password) {
            return;
        }

        // Save credentials to Chrome storage
        storage.set({
            orbitone_username: username,
            orbitone_password: password
        });

        console.log('Logging in...', { username, password });
    }

    async function getOrbitOneCredentials() {
        let orbitOneUsername = await storage.get("orbitone_username")
        let orbitOnePassword = await storage.get("orbitone_password")
    }
</script>

<div class="container">
    <div class="card">
        <!-- Logo Section -->
        <div class="logo-section">
            <div class="logo">
                <img width="120" height="120" src="https://orbitone-auth.cloverbaytechnologies.com/resources/8rdix/login/tms-theme/clover_bay.webp" />
            </div>
        </div>

        <h2 class="title">Login to your TimeSheet</h2>

        <!-- Username Input -->
        <div class="input-wrapper">
            <input
                    type="text"
                    bind:value={username}
                    class="input"
                    placeholder="Username"
                    onblur={() => handleBlur('username')}
            />
            {#if touched.username && errors.username}<p class="error error-padding">{errors.username}</p>{/if}
        </div>

        <!-- Password Input -->
        <div class="input-wrapper">
            <input
                    type={showPassword ? 'text' : 'password'}
                    bind:value={password}
                    class="input"
                    placeholder="Password"
                    onblur={() => handleBlur('password')}
            />
            {#if touched.password && errors.password}<p class="error error-padding">{errors.password}</p>{/if}
        </div>

        <!-- Login Button -->
        <button class="login-btn" onclick={handleLogin} disabled={isValid}>
            Login
        </button>

        <button class="login-btn" onclick={getOrbitOneCredentials}>
            Credential
        </button>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card {
        width: 100%;
        max-width: 440px;
        border-radius: 2rem;
    }

    .logo-section {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .logo {
        margin-bottom: 1rem;
    }

    .brand {
        font-size: 2.5rem;
        font-weight: 600;
        color: #e2e8f0;
        margin: 0;
        letter-spacing: -0.02em;
    }

    .error-padding {
        padding-top: 16px;
        padding-left: 12px;
    }

    .title {
        font-size: 1.5rem;
        font-weight: 500;
        color: #e2e8f0;
        text-align: center;
        margin: 0 0 2.5rem 0;
    }

    .input-wrapper {
        margin-bottom: 1.25rem;
    }

    .login-btn {
        width: 100%;
        padding: 1rem;
        background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
        border: none;
        border-radius: 1rem;
        font-size: 1.25rem;
        font-weight: 600;
        color: white;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .login-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }

    .login-btn:active {
        transform: translateY(0);
    }

    .forgot-link {
        display: block;
        text-align: center;
        margin-top: 2rem;
        color: #10b981;
        text-decoration: none;
        font-size: 1.125rem;
        font-weight: 500;
        transition: color 0.2s;
    }

    .forgot-link:hover {
        color: #34d399;
    }
</style>
