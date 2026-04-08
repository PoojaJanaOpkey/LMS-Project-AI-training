import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  private notificationService = inject(NotificationService);
  
  contactForm!: FormGroup;
  loading = false;
  submitted = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.markFormGroupTouched(this.contactForm);
      return;
    }

    this.loading = true;
    this.contactService.submitContactForm(this.contactForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = true;
        this.notificationService.showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
        this.contactForm.reset();
      },
      error: (error) => {
        this.loading = false;
        this.notificationService.showToast('Failed to send message. Please try again.', 'error');
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }
}
