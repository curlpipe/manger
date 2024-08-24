<script setup>
import { onUpdated } from 'vue';
import mermaid from 'mermaid';

mermaid.initialize({ 
    startOnLoad: false, 
    theme: "neutral",
});

const props = defineProps({
    instructions: Object,
});

const generateSVG = async () => {
    var instructions_mermaid = 'flowchart TD\n';

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

onUpdated(() => {
    generateSVG();
});

generateSVG();

</script>

<template>
    <div id="instructions"></div>
</template>
