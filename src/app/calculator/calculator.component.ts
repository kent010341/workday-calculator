import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {

  chips: CaculateUnit[] = [];

  showWarning: boolean = false;

  // patterns
  private readonly WORKDAY_PATTERN = /^([0-9]+\.*[0-9]*[wdhm])+$/;
  private readonly OPERATOR_PATTERN = /^[\+\-\*\/]$/;
  private readonly NUMBER_PATTERN = /[0-9]+\.*[0-9]*/;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').replace(' ', '');

    let chip: CaculateUnit;
    if (this.WORKDAY_PATTERN.test(value)) {
      chip = new CaculateUnit(value, CaculateUnitType.WORKDAY);
    } else if (this.OPERATOR_PATTERN.test(value)) {
      chip = new CaculateUnit(value, CaculateUnitType.OPERATOR);
    } else if (this.NUMBER_PATTERN.test(value)) {
      chip = new CaculateUnit(value, CaculateUnitType.NUMBER);
    } else {
      this.showWarning = true;
      return
    }

    this.chips.push(chip);
    event.chipInput.clear();
  }

  remove(index: number): void {
    this.chips.splice(index, 1);
  }

  drop(event: CdkDragDrop<CaculateUnit[]>) {
    moveItemInArray(this.chips, event.previousIndex, event.currentIndex);
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

enum CaculateUnitType {

  /** 工時格式 */
  WORKDAY = 'WORKDAY',

  /** 運算元 */
  OPERATOR = 'OPERATOR',

  /** 數字 */
  NUMBER = 'NUMBER',

}
