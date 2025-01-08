export type PriceOptions = {
	notCents?: boolean
	thousandSeparator?: string
}
export function formatPrice(price: number, suffix?: string|false, options?: PriceOptions): string {
	let negative = Math.sign(price) === -1;
	price = (options && options.notCents)? Math.abs(Math.round(price * 100)):Math.abs(Math.round(price));
	let int = Math.floor(price / 100);
	let intStr = "" + int;
	if((options === undefined) || (options === null) || (options.thousandSeparator !== "")) {
		let separator = (!options || (options.thousandSeparator === null) || (options.thousandSeparator === undefined))? "&nbsp;":options.thousandSeparator;
		let formattedInt = "";
		let part;
		for(let i = intStr.length; i > 0; i -= 3) {
			if(i >= 3) {
				part = intStr.substring(i - 3, i);
			}
			else if(i > 0) {
				part = intStr.substring(0, i);
			}
			else {
				part = null;
			}

			if(part !== null) {
				if(formattedInt.length > 0) {
					formattedInt =  part + separator + formattedInt;
				}
				else {
					formattedInt = part;
				}
			}
		}
		intStr = formattedInt;
	}
	let frac = price % 100;
	let fracStr;
	let absFrac = Math.abs(frac);
	if(absFrac < 10) {
		fracStr = "0" + absFrac;
	}
	else {
		fracStr = absFrac.toString();
	}

	if(isNaN(int) || isNaN(parseInt(fracStr))) {
		return "-";
	}
	else {
		let suffixStr;
		if(suffix) {
			suffixStr = suffix;
		}
		else {
			if(suffix === false) {
				suffixStr = '';
			}
			else {
				suffixStr = '&nbsp;€';
			}
		}
		return (negative? '-':'') + intStr + "," + fracStr + suffixStr;
	}
}

// export async function updateFile(filepath: string, targetDirectory: string, filenameTarget?: string): Promise<string> {
// 	if(filepath.startsWith("data:")) {
// 		let idx = filepath.indexOf(",");
// 		let fileData = filepath.substring(idx + 1);

// 		let filename = filenameTarget ? filenameTarget : (uuid() + ".pdf");
// 		let completeFilename = path.join(targetDirectory, filename);
// 		console.log("UPLOADPATH = ", uploadPath);
// 		let targetPath = path.join(uploadPath, targetDirectory);
// 		let completePath = path.join(uploadPath, completeFilename);

// 		console.log("mkdirp: ", targetPath);
// 		await mkdirp(targetPath);

// 		// --- create new
// 		console.log("write file: ", completeFilename);
// 		const buffer = Buffer.from(fileData, "base64");
// 		await fs.writeFile(completePath, buffer);

// 		return completeFilename;
// 	}
// 	else {
// 		return filepath;
// 	}
// }

export function capitalize(text?: string|null): string|null {
	if(text) {
		if(text.length > 0) {
			if(text.length > 1) {
				return text.substring(0, 1).toUpperCase() + text.substring(1);
			}
			else {
				return text.toUpperCase();
			}
		}
	}

	return text || null;
}





