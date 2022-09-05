export namespace Ids {
	export enum Param {
		mhp,
		mmp,
		str,
		def,
		int,
		mr,
		agi,
		luk
	}

	export enum ExtraParam {
		/** Hit Rate */
		hit,
		/** Evasion Rate */
		eva,
		/** Critical Rate */
		cri,
		/** Critical Evasion */
		cev,
		/** Magic Evasion */
		mev,
		/** Magic Reflection */
		mrf,
		/** Counter Attack */
		cnt,
		/** HP Regeneration */
		hrg,
		/** MP Regeneration */
		mrg
	}

	export enum SpecialParam {
		/** Target Rate */
		tgr,
		/** Guard Effect */
		grd,
		/** Recovery Effect */
		rec,
		/** Pharmacology */
		pha,
		/** MP Cost Rate */
		mcr,
		/** Physical Damage */
		pdr,
		/** Magic Damage */
		mdr,
		/** Floor Damage */
		fdr,
		/** Experience */
		exr
	}

	export enum Damage {
		none,
		'HP Damage',
		'MP Damage',
		'HP Regeneration',
		'MP Regeneration',
		'HP Drain',
		'MP Drain'
	}

	export enum SpecialEffect {
		SPECIAL_EFFECT_ESCAPE
	}

	export enum SlotType {
		Normal,
		'Dual Wield'
	}

	/**
	 * @type {Trait['TRAIT_SPECIAL_FLAG']}
	 */
	export enum SpecialFlag {
		FLAG_ID_AUTO_BATTLE,
		FLAG_ID_GUARD,
		FLAG_ID_SUBSTITUTE
		// FLAG_ID_PRESERVE_TP
	}
}
