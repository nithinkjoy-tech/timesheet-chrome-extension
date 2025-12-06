<script>
    let { onCloverbaySelect, onKekaSelect } = $props();

    let selectedOption = $state(null);

    const handleCloverbayClick = () => {
        selectedOption = 'cloverbay';
        console.log('Navigating to Cloverbay timesheet updation...');
        if (onCloverbaySelect) {
            onCloverbaySelect();
        }
    };

    const handleKekaClick = () => {
        selectedOption = 'keka';
        console.log('Navigating to Keka login...');
        if (onKekaSelect) {
            onKekaSelect();
        }
    };
</script>

<div>
    <h1 class="home-heading">Timesheet Management</h1>

    <div class="button-grid">
        <button
                class="option-button"
                onclick={handleCloverbayClick}
        >
            <div class="icon">🏢</div>
            <h2>Cloverbay Employees</h2>
            <p>Complete OrbitOne timesheet updation with Keka and Jira integration, plus get reminders for missed Keka logins</p>
        </button>

        <button
                class="option-button"
                onclick={handleKekaClick}
        >
            <div class="icon">👤</div>
            <h2>Keka Login Reminders Only</h2>
            <p>Receive daily reminders if you forget to log in to Keka</p>
        </button>
    </div>
</div>

<style>
    .home-heading {
        margin-top: 0;
    }

    h1 {
        margin-bottom: 12px;
        font-size: 32px;
        font-weight: 700;
        color: #fff;
    }

    .button-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 20px;
        width: 100%;
        margin-top: 24px;
    }

    .option-button {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 32px 24px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        color: #fff;
    }

    .option-button:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: #0066ff;
        box-shadow: 0 0 20px rgba(0, 102, 255, 0.3);
        transform: translateY(-2px);
    }

    .option-button:active {
        transform: translateY(0);
    }

    .icon {
        font-size: 48px;
        margin-bottom: 8px;
        filter: drop-shadow(0 0 10px rgba(0, 102, 255, 0.5));
    }

    .option-button h2 {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
        margin: 0;
    }

    .option-button p {
        font-size: 14px;
        color: #b1b1b8;
        margin: 0;
        line-height: 1.5;
    }

    @media (max-width: 640px) {
        .button-grid {
            grid-template-columns: 1fr;
        }

        h1 {
            font-size: 24px;
        }

        .option-button {
            padding: 24px 20px;
        }
    }
</style>
