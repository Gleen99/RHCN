export type PasswordValidatorObject = {
	validate: (password: string, options: any) => string[]
}