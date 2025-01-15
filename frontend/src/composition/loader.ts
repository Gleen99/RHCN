import {type Ref} from "vue";
import {ref} from "vue";

export type LoaderFunction = () => Promise<void>;
export type ErrorFunction = (err: any) => string;

export type UseLoaderResult = {
	loading: Ref<boolean>
	error: Ref<string|null>

	load: (func: LoaderFunction, iferror?: ErrorFunction|string, nodebug?: boolean) => Promise<void>
};

export function useLoader(): UseLoaderResult {
	const loading = ref<boolean>(true);
	const error = ref<string|null>(null);

	async function load(func: LoaderFunction, iferror?: ErrorFunction|string, nodebug?: boolean) {
		loading.value = true;
		try {
			await func();
		}
		catch(err: any) {
			if(!nodebug) {
				console.log("Error: ", err);
			}
			if(iferror) {
				if(typeof iferror === "function") {
					error.value = iferror(err);
				}
				else {
					error.value = iferror.toString();
				}
			}
			else {
				error.value = "Loading error";
			}
		}
		loading.value = false;
	}

	return {
		loading,
		error,
		load
	};
}
