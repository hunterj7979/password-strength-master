import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "app-password-strength",
  templateUrl: "./password-strength.component.html",
  styleUrls: ["./password-strength.component.scss"],
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() public passwordToCheck: string;
  @Output() passwordStrength = new EventEmitter<boolean>();
  bar0: string;
  bar1: string;
  bar2: string;

  msg = "";

  private colors = ["red", "yellow", "green"];

  private static checkStrength(p) {
    let force = p.length;
    const regex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|=\-/"'`№₴¢€¥£°∞‰¿¡«»‚„§¶•—–…≠≤≥™©®]/g;

    const letters = /[a-zA-Z]+/.test(p);
    const digits = /[0-9]+/.test(p);
    const symbols = regex.test(p);

    const flags = [letters, digits, symbols];

    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    force += passedMatches * 10;

    force = passedMatches === 1 ? Math.min(force, 10) : force;
    force = passedMatches === 2 ? Math.min(force, 20) : force;
    force = passedMatches === 3 ? Math.min(force, 30) : force;

    return force;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes.passwordToCheck.currentValue;
    this.setBarColors(3, "#DDD");
    if (password) {
      if (password.length < 8) {
        this.setBarColors(3, "red");
        this.msg = "Please enter 8 or more characters";
        return;
      }

      const c = this.getColor(
        PasswordStrengthComponent.checkStrength(password)
      );
      this.setBarColors(c.idx, c.col);

      const pwdStrength = PasswordStrengthComponent.checkStrength(password);
      pwdStrength === 30
        ? this.passwordStrength.emit(true)
        : this.passwordStrength.emit(false);

      switch (c.idx) {
        case 1:
          this.msg = "Easy";
          break;
        case 2:
          this.msg = "Medium";
          break;
        case 3:
          this.msg = "Strong";
          break;
      }
    } else {
      this.msg = "";
    }
  }

  private getColor(s) {
    let idx = 0;
    if (s <= 10) {
      idx = 0;
    } else if (s <= 20) {
      idx = 1;
    } else if (s <= 30) {
      idx = 2;
    } else {
      idx = 3;
    }
    return {
      idx: idx + 1,
      col: this.colors[idx],
    };
  }

  private setBarColors(count, col) {
    for (let n = 0; n < count; n++) {
      this["bar" + n] = col;
    }
  }
}
