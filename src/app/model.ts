/**
 * 計算式單元
 */
export class CaculateUnit {
  
  constructor(
    public readonly rawValue: string,
    public readonly type: CaculateUnitType,
  ) {}

}

/** 工時計算式單元 */
export class WorkdayCaculateUnit extends CaculateUnit {

  constructor(
    public override readonly rawValue: string,
  ) {
    super(rawValue, CaculateUnitType.WORKDAY);
  }

  get minute(): number {
    // TODO: 運算邏輯
    return 0;
  }

}

/** 運算元計算式單元 */
export class OperatorCaculateUnit extends CaculateUnit {

  constructor(
    public override readonly rawValue: string,
  ) {
    super(rawValue, CaculateUnitType.OPERATOR);
  }

  get value(): string {
    return this.rawValue;
  }

}

/** 運算元計算式單元 */
export class NumberCaculateUnit extends CaculateUnit {

  constructor(
    public override readonly rawValue: string,
  ) {
    super(rawValue, CaculateUnitType.NUMBER);
  }

  get value(): number {
    return Number(this.rawValue);
  }

}

export enum CaculateUnitType {

  /** 工時格式 */
  WORKDAY = 'WORKDAY',

  /** 運算元 */
  OPERATOR = 'OPERATOR',

  /** 數字 */
  NUMBER = 'NUMBER',

}
