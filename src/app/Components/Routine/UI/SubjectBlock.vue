<template>
    <div v-if="subject" class="table-cell-content" :style="style">
        <slot>
            <span>
                {{ subject["subject"] }}
            </span>
            <span> - </span>
            <span class="font-sm">
                {{ subject["teacher"] }}
            </span>
        </slot>
    </div>
</template>
<script>
import { invertColor } from '@/app/utils/helpers';
export default {
    props: {
        subject: { default: null },
    },
    computed: {
        style() {
            if (this.subject) {
                return {
                    "background-color": this.subject.color,
                    color: invertColor(this.subject.color, true),
                };
            }

            return {};
        },
    },
};
</script>
<style></style>
