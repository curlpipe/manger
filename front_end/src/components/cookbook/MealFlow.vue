<script setup>
import { onMounted, onUpdated } from 'vue';
import mermaid from 'mermaid';

mermaid.initialize({ 
    startOnLoad: false, 
    theme: "neutral",
});

const props = defineProps({
    instructions: Object,
});

var instructions_mermaid = null;

const generateSVG = async () => {
    instructions_mermaid = 'flowchart TD\n';

    props.instructions.forEach((instruction, ind) => {
        let timer_text = instruction.timer == null ? '' : ` for ${instruction.timer} minutes`;
        instructions_mermaid += `    i${ind}(${instruction.command}${timer_text})\n`;
        instruction.next.forEach(next => {
            instructions_mermaid += `    i${ind} --> i${next}\n`;
        });
    });

    const svgCode = await mermaid.render('mermaid-graph', instructions_mermaid);
    document.getElementById('instructions').innerHTML = svgCode.svg;
};

onMounted(async () => {
    await generateSVG();
});

onUpdated(async () => {
    await generateSVG();
});

</script>

<template>
    <div style="min-width: 500px;" id="instructions"></div>
</template>
