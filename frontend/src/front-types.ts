import {DataSet} from "@shared/baseTypes";
import {Component} from "vue";

export type SelectOption<T> = {
	label: string
	value: T
}

export type Confirmation = {
	title?: string
	titleSlug?: string
	text?: string
	textSlug?: string
	no?: string
	noSlug?: string
	yes?: string
	yesSlug?: string
	check?: string
	checkSlug?: string
}

export type GlobalController = {
	showWaitingScreen: (text?: string|null) => void
	hideWaitingScreen: () => void
	showError: (text?: string|null) => void
	showSuccess: (text?: string|null) => void
}

export type Tab = {
	label: string
	value: string
}


export type TableColumnDefinition = {
	key: string
	labelSlug: string
	type: string
	formatter?: string | CellFormatterDefinition
	width?: number
}

export type TablePagination = {
	itemsByPage: number
}

export type SuperTableConfiguration = {
	formatters: DataSet<CellFormatter>
}

export type CellFormatterDefinition = {name: string} & any
export type CellEditorDefinition = {name: string} & any

export type CellFormatter = Component;
export type CellEditor = Component;

export type SuperTableLoader = (options: {pagination?: any, filters?: any, sort?: any, projection?: any}) => Promise<any[]|PaginatedList<any>>
export type SuperTableCompletor = (items: any[]) => Promise<any[]>

export type SuperTableCrudOption = string | {
	collection: string
	filters?: any,
	sort?: any,
	projection?: any
	population?: any
}

export type PaginatedList<T> = {
	__pagination: {
		offset: number,
		limit: number,
		total: number
	},
	__list: Array<T>
}

export type SuperFormField = {
	key: string
	labelSlug: string
	placeholderSlug?: string
	type: string
	formatter?: string | CellFormatterDefinition
	editor?: string | CellEditorDefinition
	readonly?: boolean
	hideOnEdit?: boolean
	vertical?: boolean
	class?: string
}