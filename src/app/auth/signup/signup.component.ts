import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { first, of } from 'rxjs';
function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return { doesNotContainQuestionMark: true };

}

function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'test@example.com') {
    return of(null)
  }
  return of({ notUnique: true });
};


function equalValues(controlName1:string , controlName2:string) {
  return (control: AbstractControl) =>{
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;
    if (val1 === val2) {
      return null;
    }
    return { valuesNotEqual: true };
  }
 
}

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  imports: [ReactiveFormsModule],
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      asyncValidators: [emailIsUnique],
    }),
    passwords: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6), mustContainQuestionMark]
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6), mustContainQuestionMark]
      }),
    },
    {
      validators: [equalValues('password', 'confirmPassword')],
    }
  ),

    firstName: new FormControl('', {
      validators: [Validators.required]
    }),
    lastName: new FormControl('', {
      validators: [Validators.required]
    }),
    address: new FormGroup({
      street: new FormControl('', {
        validators: [Validators.required]
      }),
      city: new FormControl('', {
        validators: [Validators.required]
      }),
      number: new FormControl('', {
        validators: [Validators.required,]
      }),
      postalCode: new FormControl('', {
        validators: [Validators.required]
      }),
    }),

    role: new FormControl<'student' | 'teacher' | 'employee' | 'founder' | 'other'>('student', { validators: [Validators.required] }),
    source: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
    agree: new FormControl(false, { validators: [Validators.requiredTrue] })

  })

  onSubmit() {
    if(this.form.invalid) {
      console.log('Form is invalid');
      return;
    }
  }
  onReset() {
    this.form.reset({
      email: '',
      passwords: {
        password: '',
        confirmPassword: '',
      },
      firstName: '',
      lastName: '',
      address: {
        street: '',
        city: '',
        number: '',
        postalCode: '',
      },
      role: 'student',
      source: [false, false, false],
      agree: false,
    });
  }
  
}
