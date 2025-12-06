<script>
    let { next } = $props();

    let hoursWorked = $state("");
    let description = $state("");
    let submitError = $state("");

    let touched = $state({
        hoursWorked: false,
        description: false,
    });

    let errors = $state({
        hoursWorked: "",
        description: "",
    });

    const validateField = (field) => {
        if (field === 'hoursWorked') {
            if (!hoursWorked) {
                errors.hoursWorked = "Hours worked is required";
            } else if (isNaN(hoursWorked) || parseFloat(hoursWorked) <= 0) {
                errors.hoursWorked = "Please enter a valid number of hours";
            } else {
                errors.hoursWorked = "";
            }
        }

        if (field === 'description') {
            if (!description.trim()) {
                errors.description = "Description is required";
            } else {
                errors.description = "";
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
            hoursWorked: true,
            description: true,
        };

        // Validate all fields
        validateField('hoursWorked');
        validateField('description');

        // true only if all valid
        return !Object.values(errors).some(Boolean);
    };

    const handleNext = async () => {
        if (!validate()) return;

        console.log({ hoursWorked, description });

        // Here you would typically save the work log
        // For now, we'll just proceed to next step
        submitError = "";
        next();
    };
</script>

<div>
    <div class="step">Step 2 of 3</div>
    <h1>Log Work</h1>

    <div class="form">
        <input
                type="text"
                class="hours"
                placeholder="Hours worked (e.g., 2.5)"
                bind:value={hoursWorked}
                onblur={() => handleBlur('hoursWorked')}
        />
        {#if touched.hoursWorked && errors.hoursWorked}<p class="error">{errors.hoursWorked}</p>{/if}

        <textarea
                placeholder="Description of work done"
                bind:value={description}
                onblur={() => handleBlur('description')}
        ></textarea>
        {#if touched.description && errors.description}<p class="error">{errors.description}</p>{/if}

        <button onclick={handleNext}>
            Next
        </button>
        {#if submitError}<p class="error">{submitError}</p>{/if}
    </div>
</div>

<style>
    .step {
        color: #666;
        font-size: 14px;
        margin-bottom: 8px;
    }

    input[type="text"],
    textarea {
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        font-family: inherit;
        transition: border-color 0.2s;
    }

    .hours {
        width: unset;
    }

    textarea {
        min-height: 100px;
        resize: vertical;
    }

    .error {
        color: #de350b;
        font-size: 13px;
        margin-top: -12px;
    }
</style>
