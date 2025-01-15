import type {timestamp} from "@shared/types";
import {AnalyticsType} from "@shared/enums";
import {v1 as uuid} from "uuid";
import moment from "moment-timezone";
import {useApi} from "@/composition/api";

const SESSION_MAX_DURATION = 60 * 60 * 1000;	// 1 heure
enum keys {
	userId = "userId",
	session = "session",
}

export type Session = {
	id: string
	timestamp: timestamp
}

export type UseAnalyticsResult = {
	getSessionId: () => string
	getUserId: () => string
	sendAnalytics: (type: AnalyticsType, location: string, action: string, data?: any) => Promise<void>
	sendPageAnalytics: (path: string, title: string, location: string) => Promise<void>
	sendEventAnalytics: (action: string, location: string, data?: any) => Promise<void>
}

export function useAnalytics(): UseAnalyticsResult {
	return {
		getUserId,
		getSessionId,
		sendAnalytics,
		sendPageAnalytics,
		sendEventAnalytics
	};
}

function getUserId(): string {
	let userId = localStorage.getItem(keys.userId);
	if(!userId) {
		userId = uuid().toString();
		localStorage.setItem(keys.userId, userId!);
	}
	return userId!;
}
function getSessionId(): string {
	let session: Session;
	let sessionString = localStorage.getItem(keys.session);
	if(sessionString) {
		session = JSON.parse(sessionString) as Session;
		if(session.timestamp + SESSION_MAX_DURATION < moment.now()) {
			session.id = uuid();
		}
	}
	else {
		session = {
			id: uuid(),
			timestamp: 0
		};
	}
	session.timestamp = moment.now();
	localStorage.setItem(keys.session, JSON.stringify(session));
	return session.id;
}

async function sendPageAnalytics(path: string, title: string, location: string): Promise<void> {
	sendAnalytics(AnalyticsType.page, location, path, {title});
}

async function sendEventAnalytics(action: string, location: string, data?: any): Promise<void> {
	sendAnalytics(AnalyticsType.action, location, action, data);
}

async function sendAnalytics(type: AnalyticsType, location: string, action: string, data?: any): Promise<void> {
	if(localStorage.getItem('allLivecookCookiesAccepted') === 'true') {
		try {
			const {sendAnalytics} = useApi();

			const newAnalytics = {
				type,
				userId: getUserId(),
				sessionId: getSessionId(),
				location,
				action,
				data
			};
			await sendAnalytics(newAnalytics);
		} catch (err) {
			console.log("can't send analytics: ", err);
		}
	}
}