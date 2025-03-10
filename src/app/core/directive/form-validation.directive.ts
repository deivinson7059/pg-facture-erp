// form-validation.directive.ts
import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[formControlValidation]',
  standalone: true
})
export class FormControlValidationDirective implements OnInit, OnDestroy {
  @Input('formControlValidation') control!: AbstractControl;
  
  private statusChanges$!: Subscription;
  
  constructor(private el: ElementRef<HTMLElement>) {}
  
  ngOnInit(): void {
    if (this.control) {
      // Validación inicial
      this.updateValidationClasses();
      
      // Suscribirse a cambios de validación
      this.statusChanges$ = this.control.statusChanges.subscribe(() => {
        this.updateValidationClasses();
      });
    }
  }
  
  private updateValidationClasses(): void {
    if (this.control.invalid && (this.control.dirty || this.control.touched)) {
      this.el.nativeElement.classList.add('is-invalid');
    } else {
      this.el.nativeElement.classList.remove('is-invalid');
    }
  }
  
  ngOnDestroy(): void {
    this.statusChanges$?.unsubscribe();
  }
}