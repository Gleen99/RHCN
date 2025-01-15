<script setup lang="ts">
import {computed, ref} from "vue";
import FieldLayout from "./FieldLayout.vue";
import Iplus from "@/components/images/Iplus.vue";
import Tag from "@/components/ui/Tag.vue";

const props = defineProps<{
    name: string
    label?: string
	labelSlug?: string
    extra?: string
    mandatory?: boolean
    placeholder?: string
    disabled?: boolean
    modelValue: string[]
}>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void
}>();

const value = computed({
    get(): string[] {
        return props.modelValue;
    },
    set(newValue: string[]) {
        emit("update:modelValue", newValue);
    }
});

const newTag = ref<string>("");

function addTag() {
	const newTagValue = newTag.value.trim().toLowerCase();
	if(!props.disabled && newTagValue.length > 0) {
		const tags = newTagValue.split(",").map(t => t.trim());
		let newValue = [...value.value];
		for(const tag of tags) {
			if (!newValue.includes(tag)) {
				newValue.push(tag);
			}
		}
		value.value = newValue;
		newTag.value = "";
	}
}

function deleteTag(idx: number) {
	console.log("deleteTag: " + idx);
	if(!props.disabled) {
		value.value = [
			...value.value.slice(0, idx),
			...value.value.slice(idx + 1)
		];
	}
}

const hasFocus = ref<boolean>(false);
function focusin() {
	hasFocus.value = true;
}

function focusout() {
	hasFocus.value = false;
}

const hasValue = computed<boolean>(() => {
	return newTag.value !== undefined && newTag.value !== null && newTag.value.length > 0;
});

</script>

<template>
    <field-layout class="FieldTags" :name="name" :mandatory="mandatory" :extra="extra" :label="label" :label-slug="labelSlug" :focus="hasFocus" :hasValue="hasValue">
		<div class="tag-input">
        	<input type="text" :id="name" :name="name" :placeholder="placeholder" v-model="newTag" :disabled="disabled" @keyup.enter="addTag" @focusin="focusin" @focusout="focusout"/>
			<div class="add" @click="addTag"><iplus/></div>
		</div>
		<template #bottom>
			<div class="tags">
				<tag v-for="(val, idx) in value" :key="val + idx" v-model="val" editable @delete="deleteTag(idx)" deletable/>
			</div>
		</template>
    </field-layout>
</template>

<style lang="scss">
.FieldTags {

	.tag-input {
		display: flex;
		align-items: center;
		gap: 13px;

		.add {
			flex: 0 0 35px;
			width: 35px;
			height: 35px;
			border-radius: $radius;
			background-color: $cborder;
			display: none;
			align-items: center;
			justify-content: center;
			cursor: pointer;

			.icon {
				width: 12px;
				height: 12px;
				color: $cwhite;
			}
		}

		input {
			flex: 1 1 0;
			display: block;
			appearance: none;
			border: $cborder solid 2px;
			padding: 10px 16px;
			font-family: $fontMain;
			font-size: $fsregular;
			font-weight: $fbold;
			color: $cformText;
			background-color: transparent;
			outline: none;
			width: 100%;

			&::placeholder {
				color: $cformPlaceholder;
			}
		}
	}

	&.full {
		.tag-input {
			.add {
				display: flex;
			}
		}
	}

	.tags {
		margin-top: $gap;
		display: flex;
		gap: $gap;
		flex-wrap: wrap;

		.Tag {
			gap: 0;

			.delete {
				margin-left: -10px;
			}
		}
	}
}
</style>