import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subject, every, filter, from, map, of, pairwise, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnDestroy {

  chips: CaculateUnit[] = [];

  showWarning: boolean = false;

  /** 公式異動事件 */
  formulaChanged$ = new Subject<void>();

  /** 計算結果字串 */
  result: string = '';

  /** component destroy */
  destroy$ = new Subject<void>();

  // patterns
  private readonly WORKDAY_PATTERN = /^([0-9]+\.*[0-9]*[wdhm])+$/;
  private readonly OPERATOR_PATTERN = /^[\+\-\*\/]$/;
  private readonly NUMBER_PATTERN = /^[0-9]+\.*[0-9]*$/;

  constructor() {
    this.formulaChanged$.pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.validate()),
      filter(valid => {
        if (!valid) {
          // TODO: 警示公式不合法
        }
        return valid;
      }),
      switchMap(() => this.calculateResult()),
    ).subscribe({
      next: result => {
        this.result = result;
      },
      error: err => {
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').replace(/\s+/, '');

    let chip: CaculateUnit;
    if (this.WORKDAY_PATTERN.test(value)) {
      chip = new WorkdayCaculateUnit(value);
    } else if (this.OPERATOR_PATTERN.test(value)) {
      chip = new OperatorCaculateUnit(value);
    } else if (this.NUMBER_PATTERN.test(value)) {
      chip = new NumberCaculateUnit(value);
    } else {
      this.showWarning = true;
      return
    }

    this.chips.push(chip);
    event.chipInput.clear();
    this.formulaChanged$.next();
  }

  remove(index: number): void {
    this.chips.splice(index, 1);
    this.formulaChanged$.next();
  }

  drop(event: CdkDragDrop<CaculateUnit[]>) {
    moveItemInArray(this.chips, event.previousIndex, event.currentIndex);
    this.formulaChanged$.next();
  }

  getChipClass(chip: CaculateUnit): string {
    switch (chip.type) {
      case CaculateUnitType.WORKDAY:
        return 'workday-chip';
      case CaculateUnitType.OPERATOR:
        return 'operator-chip';
      case CaculateUnitType.NUMBER:
        return 'number-chip';
      default:
        return '';
    }
  }

  /** Validate formula */
  private validate(): Observable<boolean> {
    return from(this.chips).pipe(
      // first condition: <non op> <op> <non op>
      pairwise(),
      pairwise(),
      map(([firstPair, secondPair]) => {
        const [prev, curr]  = firstPair;
        const [, next] = secondPair;
        
        if (curr.type === CaculateUnitType.OPERATOR) {
          return prev.type !== CaculateUnitType.OPERATOR && next.type !== CaculateUnitType.OPERATOR;
        } else {
          return false;
        }
      }),
      every(isValid => isValid),
    );
  }

  private calculateResult(): Observable<string> {
    // TODO 實作計算邏輯
    return of(this.chips.map(c => c.rawValue).join(','));
  }

}

/**
 * 計算式單元
 */
class CaculateUnit {
  
  constructor(
    public readonly rawValue: string,
    public readonly type: CaculateUnitType,
  ) {}

}

/** 工時計算式單元 */
class WorkdayCaculateUnit extends CaculateUnit {

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
class OperatorCaculateUnit extends CaculateUnit {

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
class NumberCaculateUnit extends CaculateUnit {

  constructor(
    public override readonly rawValue: string,
  ) {
    super(rawValue, CaculateUnitType.NUMBER);
  }

  get value(): number {
    return Number(this.rawValue);
  }

}

enum CaculateUnitType {

  /** 工時格式 */
  WORKDAY = 'WORKDAY',

  /** 運算元 */
  OPERATOR = 'OPERATOR',

  /** 數字 */
  NUMBER = 'NUMBER',

}
