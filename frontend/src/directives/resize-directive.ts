import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import debounce from 'lodash.debounce';
import 'intersection-observer';

const defaultDelay = 150;

function getOptions(modifiers: any) {
	if (!modifiers) {
		return { delay: defaultDelay, initial: false }
	}
	const { initial = false } = modifiers;
	let delay = Object.keys(modifiers).map(k => parseInt(k)).find(v => !isNaN(v));
	delay = delay || defaultDelay;
	return { delay, initial }
}

function listenToVisible(element: Element, callback: () => void) {
	const options = {
		root: document.documentElement
	};

	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				callback();
				observer.disconnect();
			}
		});
	}, options);

	observer.observe(element);
	return observer;
}

function createResizeSensor(el: Element, opts: { value: (el: Element) => any, arg: string, options: any }) {
	const {value, arg, options} = opts;

	let callBack = () => value(el);
	switch (arg) {
		case 'debounce':
			callBack = debounce(() => value(el), options.delay);
			break;

		case 'throttle':
			callBack = debounce(() => value(el), options.delay, { leading: true, trailing: true, maxWait: options.delay });
			break;
	}

	const res = new ResizeSensor(el, callBack);
	if (options.initial) {
		value(el);
	}
	return res;
}

function mounted(el: any, opts: { value: any, arg: any, modifiers: any, _instance: any }) {
	const { value, arg, modifiers, _instance } = opts;
	if(!import.meta.env.SSR) {
		if (!value || typeof value !== 'function') {
			console.warn('v-resize should received a function as value');
			return;
		}
		const options = getOptions(modifiers);
		if (el.offsetParent) {
			createResizeSensor(el, {value, arg, options});
			return;
		}
		options.initial = true;
		el.__visibility__listener__ = listenToVisible(el, () => createResizeSensor(el, {value, arg, options}));
	}
}

function unmounted(el: any) {
	if(!import.meta.env.SSR) {
		if (el.__visibility__listener__) {
			el.__visibility__listener__.disconnect();
		}
		if (!el.resizeSensor) {
			return;
		}
		ResizeSensor.detach(el);
	}
}

export default {
	mounted,
	unmounted
}