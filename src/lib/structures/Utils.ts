import { AliasPiece, PieceContext } from '@sapphire/framework';

export class Utils<O extends Utils.Options = Utils.Options> extends AliasPiece<O> {
	public description: string;
	public constructor(context: PieceContext, options: O = {} as O) {
		super(context, { ...options, name: (options.name ?? context.name).toLowerCase() });
		this.description = options.description ?? '';
	}

	public onLoad() {
		// @ts-ignore ignore the name check
		this.container[this.name] = this;
	}
}

export interface UtilsOptions extends AliasPiece.Options {
	description?: string;
}

declare namespace Utils {
	export type Options = UtilsOptions;
}
