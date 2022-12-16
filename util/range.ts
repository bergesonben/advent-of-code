// Assume well formed => start < end
export class IntRange {
	public length: number;
	constructor(public start: number, public end: number){
		this.length = end - start;
	}

	public overlaps(otherRange: IntRange): boolean {
		return this.start <= otherRange.end && otherRange.start <= this.end;
	}

	public getOverlapLength(otherRange: IntRange): number {
		if (!this.overlaps(otherRange)) return 0;

		return 0;
	}

	public combine(otherRange: IntRange): IntRange {
		return new IntRange(Math.min(this.start, otherRange.start), Math.max(this.end, otherRange.end));
	}
}


export const flattenRanges = (ranges: IntRange[]): IntRange[] => {
	if (ranges.length <= 1) return ranges;
	const retval = [...ranges];
	let again = true;
	
	while (again) {
		again = false;
		for (let i = 0; i < retval.length-1; i++) {				
			const curr = retval[i];
			for (let j = i+1; j < retval.length; j++) {
				const other = retval[j];
				if (curr.overlaps(other)) {
					const newRange = curr.combine(other);
					retval.splice(j,1);						
					retval.splice(i,1);
					retval.push(newRange);
					again = true;
					break;
				}
			}
			if (again) break;				
		}
	}

	return retval;
}