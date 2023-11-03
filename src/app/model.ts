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

  /**
   * add another {@link WorkdayCaculateUnit}
   * 
   * @param other 
   * @returns number of minutes
   */
  add(other: WorkdayCaculateUnit): number {
    return this.minute + other.minute;
  }

  /**
   * minus another {@link WorkdayCaculateUnit}
   * 
   * @param other 
   * @returns number of minutes
   */
  minus(other: WorkdayCaculateUnit): number {
    return this.minute - other.minute;
  }

  /**
   * mulitply another {@link NumberCaculateUnit}
   * 
   * @param other 
   * @returns number of minutes
   */
  mulitply(other: NumberCaculateUnit): number {
    return this.minute * other.value;
  }

  /**
   * devided by another {@link NumberCaculateUnit}
   * 
   * @param other 
   * @returns number of minutes
   */
  devide(other: NumberCaculateUnit): number {
    return this.minute / other.value;
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

  

  /**
   * add another {@link NumberCaculateUnit}
   * 
   * @param other 
   * @returns number
   */
  add(other: NumberCaculateUnit): number {
    throw new Error('Not yet implemented.');
  }

  /**
   * minus another {@link NumberCaculateUnit}
   * 
   * @param other 
   * @returns number
   */
  minus(other: NumberCaculateUnit): number {
    throw new Error('Not yet implemented.');
  }

  /**
   * mulitply another {@link WorkdayCaculateUnit}
   * 
   * @param other 
   * @returns number of minutes
   */
  mulitply(other: WorkdayCaculateUnit): number {
    return this.value * other.minute;
  }

  /**
   * devided by another {@link WorkdayCaculateUnit}
   * 
   * @param other 
   * @returns number of minutes
   */
  devide(other: WorkdayCaculateUnit): number {
    return this.value / other.minute;
  }

}

/** work day format */
interface Workday {
  week: number,
  day: number,
  hour: number,
  minute: number,
}

export enum CaculateUnitType {

  /** 工時格式 */
  WORKDAY = 'WORKDAY',

  /** 運算元 */
  OPERATOR = 'OPERATOR',

  /** 數字 */
  NUMBER = 'NUMBER',

}
