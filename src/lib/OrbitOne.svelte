<script>
    let username = $state('CBT176');
    let password = $state('');
    let showPassword = $state(false);

    function handleLogin() {
        console.log('Logging in...', { username, password });
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
            />
        </div>

        <!-- Password Input -->
        <div class="input-wrapper">
            <input
                    type={showPassword ? 'text' : 'password'}
                    bind:value={password}
                    class="input"
                    placeholder="Password"
            />
        </div>

        <!-- Login Button -->
        <button class="login-btn" onclick={handleLogin}>
            Login
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
        padding: 2rem;
    }

    .card {
        width: 100%;
        max-width: 440px;
        border-radius: 2rem;
        padding: 3rem 2.5rem;
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
