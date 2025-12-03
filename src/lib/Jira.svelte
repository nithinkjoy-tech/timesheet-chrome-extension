<script>
    import { getInProgressTask } from "../services/jiraService.js"
    let { next } = $props();

    let jiraUrl = $state("");
    let jiraEmail = $state("");
    let apiToken = $state("");
    let authError = $state("")

    let project = $state("SWAD");
    let status = $state("In-Progress");

    let editingProject = $state(false);
    let editingStatus = $state(false);

    let touched = $state({
        jiraUrl: false,
        jiraEmail: false,
        apiToken: false,
    });

    let errors = $state({
        jiraUrl: "",
        jiraEmail: "",
        apiToken: "",
    });

    // Derived state to check if form is valid
    let isValid = $derived(() => {
        const hasJiraUrl = jiraUrl && /^https:\/\/.+\.(atlassian\.net|jira\.com)\/?$/i.test(jiraUrl);
        const hasEmail = jiraEmail && /\S+@\S+\.\S+/.test(jiraEmail);
        const hasToken = apiToken && apiToken.length >= 10;
        return hasJiraUrl && hasEmail && hasToken;
    });

    const validateField = (field) => {
        if (field === 'jiraUrl') {
            if (!jiraUrl || !/^https:\/\/.+\.(atlassian\.net|jira\.com)\/?$/i.test(jiraUrl)) {
                errors.jiraUrl = "Enter a valid Jira cloud URL";
            } else {
                errors.jiraUrl = "";
            }
        }

        if (field === 'jiraEmail') {
            if (!jiraEmail || !/\S+@\S+\.\S+/.test(jiraEmail)) {
                errors.jiraEmail = "Enter a valid email";
            } else {
                errors.jiraEmail = "";
            }
        }

        if (field === 'apiToken') {
            if (!apiToken || apiToken.length < 10) {
                errors.apiToken = "Enter a valid API token";
            } else {
                errors.apiToken = "";
            }
        }
    };

    const handleBlur = (field) => {
        touched[field] = true;
        validateField(field);
    };

    const validate = () => {
        // Mark all as touched
        touched = {
            jiraUrl: true,
            jiraEmail: true,
            apiToken: true,
        };

        // Validate all fields
        validateField('jiraUrl');
        validateField('jiraEmail');
        validateField('apiToken');

        // true only if all valid
        return !Object.values(errors).some(Boolean);
    };

    const handleNext = async () => {
        if (!validate()) return;
        console.log({ jiraUrl, jiraEmail, apiToken });
        let [resp, err] = await getInProgressTask({jiraUrl, jiraEmail, apiToken}, project, status)
        console.log({err})
        if (err !== null) {
            return authError = "Connection failed, Please check your credentials."
        }
        authError = "";
        next();
    };
</script>

<div>
    <div class="step">Step 1 of 3</div>
    <h1>Connect to Jira</h1>

    <div class="form">
        <input
                type="text"
                placeholder="Jira URL ex: https://id.atlassian.net"
                bind:value={jiraUrl}
                onblur={() => handleBlur('jiraUrl')}
        />
        {#if touched.jiraUrl && errors.jiraUrl}<p class="error">{errors.jiraUrl}</p>{/if}

        <input
                type="email"
                placeholder="Your Jira Email"
                bind:value={jiraEmail}
                onblur={() => handleBlur('jiraEmail')}
        />
        {#if touched.jiraEmail && errors.jiraEmail}<p class="error">{errors.jiraEmail}</p>{/if}

        <input
                type="password"
                placeholder="API Token"
                bind:value={apiToken}
                onblur={() => handleBlur('apiToken')}
        />
        {#if touched.apiToken && errors.apiToken}<p class="error">{errors.apiToken}</p>{/if}

        <p>
            project =
            {#if editingProject}
                <input
                        type="text"
                        bind:value={project}
                        onblur={() => editingProject = false}
                        autofocus
                />
            {:else}
        <span
                onclick={() => editingProject = true}
                class="editable"
        >
            {project}
        </span>
            {/if}

            AND status =

            {#if editingStatus}
                <input
                        type="text"
                        bind:value={status}
                        onblur={() => editingStatus = false}
                        autofocus
                />
            {:else}
        <span
                onclick={() => editingStatus = true}
                class="editable"
        >
            "{status}"
        </span>
            {/if}
        </p>

        <button onclick={handleNext}>
            Next
        </button>
        {#if authError}<p class="error">{authError}</p>{/if}
    </div>
</div>

<style>
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .editable {
        cursor: pointer;
        text-decoration: underline;
        text-decoration-style: dotted;
    }

    .editable:hover {
        background-color: #f0f0f0;
    }
</style>
