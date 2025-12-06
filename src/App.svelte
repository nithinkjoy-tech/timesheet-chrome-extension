<script>
    import { fade } from 'svelte/transition';
    import Jira from "./lib/Jira.svelte";
    import Keka from "./lib/Keka.svelte";
    import OrbitOne from "./lib/OrbitOne.svelte";
    import TimeSheet from "./lib/TimeSheet.svelte";
    import HomePage from "./lib/HomePage.svelte";

    let currentStep = 1;

    function nextStep() {
        currentStep++;
    }
</script>

<main>
    {#key currentStep}
        <div class="step" in:fade out:fade>
            {#if currentStep === 1}
<!--                <TimeSheet next={nextStep}/>-->
                <HomePage next={nextStep}/>
<!--                <OrbitOne />-->
<!--                <Jira next={nextStep} />-->
            {:else if currentStep === 2}
                <Keka next={nextStep} />
            {/if}
        </div>
    {/key}
</main>

<style>
    .step {
        position: absolute;
        width: calc(100% - 40px);
    }
</style>
