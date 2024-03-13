import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatGridListModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  expression = ""; //this is what the user sees
  codeExpression = ""; //this is what the code sees
  isOperatorLast : boolean = true;

  editExpression = (operation : string) => {
   
    this.isOperatorLast = false;

    if (operation == "d")
        this.codeExpression = this.codeExpression.substring(0, this.codeExpression.length - 1);
    else
        this.codeExpression += operation;
  
    this.updateExpression();
  }

  evalExpression = (expression : string) => {
    
    /*ORDER OF OPERATIONS:
      ()
      ^√
      ln sin cos tan
      !/*
      +-
    */

    //This function finds the order in which operations are executed and calls another function to solve it
    //FIND INNERMOST PARENTHESES:
    if (this.codeExpression.includes("(")) {
      let innermost_index = 0;
      let innermost_length = 0;
      let innermost_level = 0;

      let current_level = 0;

      for (let i = 0; i < this.codeExpression.length; i++) {

        if (this.codeExpression.charAt(i) == "(")
          current_level++;
        else if (this.codeExpression.charAt(i) == ")") {

          current_level--;
          continue;
        }
        
        if (current_level > innermost_level) {

          innermost_level = current_level;
          innermost_index = i;
          innermost_length = 2;
          continue;
        }
        if (current_level == innermost_level) {

          innermost_length++;
        }
      }

      let toReplace = this.codeExpression.substring(innermost_index, innermost_index + innermost_length);
      alert(toReplace)
      let replacingString = this.solveExpression(this.codeExpression.substring(innermost_index, innermost_index + innermost_length));
      alert(replacingString)
      this.codeExpression = this.codeExpression.replace(toReplace, replacingString);
      this.updateExpression();
      this.evalExpression(this.expression);
    }
    this.solveExpression(expression);
  }

  solveExpression = (expression : string) : string => {

    if (parseInt(expression.substring(1, expression.length - 1)) != Number.NaN)
      return expression.substring(1, expression.length - 1);

    if (expression.includes("^")) {

      let numSX = expression.substring(this.findNotNum(expression.substring(0, expression.indexOf("^") - 1), true), expression.indexOf("^") - 1)
      alert(numSX)
    }
    return expression;
  }

  findNotNum = (expression : string, reverseOrder : boolean) : number => {

    for (let i = reverseOrder ? expression.length-1 : 0; (reverseOrder && i >= 0) || (!reverseOrder && i < expression.length); i += reverseOrder ? -1 : 1) {

      if (expression.charAt(i) < '0' || expression.charAt(i) > '9') return i;
    }
    return 0;
  }

  updateExpression = () => {
    this.expression = this.codeExpression;
    this.expression = this.expression.replaceAll("s", "sin");
    this.expression = this.expression.replaceAll("c", "cos");
    this.expression = this.expression.replaceAll("t", "tan");
    this.expression = this.expression.replaceAll("l", "ln");
  }
}
