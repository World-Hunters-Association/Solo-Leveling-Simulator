export namespace Codes {
	export enum Effect {
		EFFECT_RECOVER_HP = 11, // [static] HP回復
		EFFECT_RECOVER_MP = 12, // [static] MP回復
		EFFECT_ADD_STATE = 21, // [static] ステート付加
		EFFECT_REMOVE_STATE = 22, // [static] ステート解除
		EFFECT_ADD_BUFF = 31, // [static] 強化
		EFFECT_ADD_DEBUFF = 32, // [static] 弱体
		EFFECT_REMOVE_BUFF = 33, // [static] 強化の解除
		EFFECT_REMOVE_DEBUFF = 34, // [static] 弱体の解除
		EFFECT_SPECIAL = 41, // [static] 特殊効果
		EFFECT_GROW = 42, // [static] 成長
		EFFECT_LEARN_SKILL = 43, // [static] スキル習得
		EFFECT_COMMON_EVENT = 44 // [static] コモンイベント
	}

	export enum Trait {
		TRAIT_ELEMENT_RATE = 11, // [static] [耐性]-[属性有効度]
		TRAIT_DEBUFF_RATE = 12, // [static] [耐性]-[弱体有効度]
		TRAIT_STATE_RATE = 13, // [static] [耐性]-[ステート有効度]
		TRAIT_STATE_RESIST = 14, // [static] [耐性]-[ステート無効化]
		TRAIT_PARAM = 21, // [static] [能力値]-[通常能力値]
		TRAIT_XPARAM = 22, // [static] [能力値]-[追加能力値]
		TRAIT_SPARAM = 23, // [static] [能力値]-[特殊能力値]
		TRAIT_ATTACK_ELEMENT = 31, // [static] [攻撃]-[攻撃時属性]
		TRAIT_ATTACK_STATE = 32, // [static] [攻撃]-[攻撃時ステート]
		TRAIT_ATTACK_SPEED = 33, // [static] [攻撃]-[攻撃速度補正]
		TRAIT_ATTACK_TIMES = 34, // [static] [攻撃]-[攻撃追加回数]
		TRAIT_ATTACK_SKILL = 35, // @MZ [static] [攻撃]-[攻撃スキル]
		TRAIT_STYPE_ADD = 41, // [static] [スキル]-[スキルタイプ追加]
		TRAIT_STYPE_SEAL = 42, // [static] [スキル]-[スキルタイプ封印]
		TRAIT_SKILL_ADD = 43, // [static] [スキル]-[スキル追加]
		TRAIT_SKILL_SEAL = 44, // [static] [スキル]-[スキル封印]
		TRAIT_EQUIP_WTYPE = 51, // [static] [装備]-[武器タイプ装備]
		TRAIT_EQUIP_ATYPE = 52, // [static] [装備]-[防具タイプ装備]
		TRAIT_EQUIP_LOCK = 53, // [static] [装備]-[装備固定]
		TRAIT_EQUIP_SEAL = 54, // [static] [装備]-[装備封印]
		TRAIT_SLOT_TYPE = 55, // [static] [装備]-[スロットタイプ]
		TRAIT_ACTION_PLUS = 61, // [static] [その他]-[行動回数追加]
		TRAIT_SPECIAL_FLAG = 62 // [static] [その他]-[特殊フラグ]
		// TRAIT_COLLAPSE_TYPE = 63, // [static] [その他]-[消滅エフェクト]
		// TRAIT_PARTY_ABILITY = 64 // [static] [その他]-[パーティ能力]
	}
}
