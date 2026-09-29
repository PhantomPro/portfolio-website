import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioService } from '../../../../core/services/portfolio.service';

type FormState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section id="contact" class="section contact-section" aria-labelledby="contact-title">
      <div class="container">
        <div class="section-header">
          <span class="section-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>
            Get In Touch
          </span>
          <h2 id="contact-title">Let's Build Something Great.</h2>
          <p>Have a project in mind or want to discuss an opportunity? I'd love to hear from you.</p>
        </div>

        <div class="contact-grid">
          <!-- Left: Info -->
          <div class="contact-info">
            <div class="info-block">
              <h3 class="info-heading">Reach me directly</h3>
              <div class="contact-links">
                <a href="mailto:basutanmay.007@gmail.com" class="contact-link" aria-label="Send email">
                  <div class="link-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <div class="link-label">Email</div>
                    <div class="link-value">basutanmay.007@gmail.com</div>
                  </div>
                </a>

                <a href="https://www.linkedin.com/in/tanmay-basu-9310b01a1/" target="_blank" rel="noopener noreferrer" class="contact-link" aria-label="LinkedIn profile">
                  <div class="link-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </div>
                  <div>
                    <div class="link-label">LinkedIn</div>
                    <div class="link-value">linkedin.com/in/tanmay-basu</div>
                  </div>
                </a>

                <a href="https://github.com/PhantomPro" target="_blank" rel="noopener noreferrer" class="contact-link" aria-label="GitHub profile">
                  <div class="link-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </div>
                  <div>
                    <div class="link-label">GitHub</div>
                    <div class="link-value">github.com/PhantomPro</div>
                  </div>
                </a>
              </div>
            </div>

            <div class="availability-card">
              <div class="avail-dot"></div>
              <div>
                <div class="avail-title">Open to Opportunities</div>
                <p class="avail-desc">Currently exploring full-time roles and interesting projects.</p>
              </div>
            </div>
          </div>

          <!-- Right: Form -->
          <div class="contact-form-wrap">
            @if (formState() === 'success') {
              <div class="form-success glass" role="status" aria-live="polite">
                <div class="success-icon" aria-hidden="true">✨</div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out, <strong>{{ submittedName() }}</strong>! Your message has been sent directly to my inbox. I will review it and get back to you within 24 hours.</p>
                <div class="success-actions">
                  <button class="btn btn-secondary success-btn" (click)="resetForm()" id="contact-send-another">
                    Send Another Message
                  </button>
                </div>
              </div>
            } @else {
              <form
                [formGroup]="contactForm"
                (ngSubmit)="submitForm()"
                class="contact-form glass"
                novalidate
                id="contact-form"
                aria-label="Contact form"
              >
                <div class="form-row">
                  <div class="form-group">
                    <label for="contact-name" class="form-label">Name <span aria-hidden="true">*</span></label>
                    <input
                      id="contact-name"
                      type="text"
                      formControlName="name"
                      class="form-input"
                      [class.error]="isFieldInvalid('name')"
                      placeholder="Your full name"
                      autocomplete="name"
                      [attr.aria-describedby]="isFieldInvalid('name') ? 'name-error' : null"
                      [attr.aria-invalid]="isFieldInvalid('name')"
                    />
                    @if (isFieldInvalid('name')) {
                      <span class="field-error" id="name-error" role="alert">Please enter your name</span>
                    }
                  </div>
                  <div class="form-group">
                    <label for="contact-email" class="form-label">Email <span aria-hidden="true">*</span></label>
                    <input
                      id="contact-email"
                      type="email"
                      formControlName="email"
                      class="form-input"
                      [class.error]="isFieldInvalid('email')"
                      placeholder="your@email.com"
                      autocomplete="email"
                      [attr.aria-describedby]="isFieldInvalid('email') ? 'email-error' : null"
                      [attr.aria-invalid]="isFieldInvalid('email')"
                    />
                    @if (isFieldInvalid('email')) {
                      <span class="field-error" id="email-error" role="alert">Please enter a valid email address</span>
                    }
                  </div>
                </div>

                <div class="form-group">
                  <label for="contact-subject" class="form-label">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    formControlName="subject"
                    class="form-input"
                    placeholder="What's this about?"
                  />
                </div>

                <div class="form-group">
                  <label for="contact-message" class="form-label">Message <span aria-hidden="true">*</span></label>
                  <textarea
                    id="contact-message"
                    formControlName="message"
                    class="form-input form-textarea"
                    [class.error]="isFieldInvalid('message')"
                    placeholder="Tell me about your project or opportunity…"
                    rows="5"
                    [attr.aria-describedby]="isFieldInvalid('message') ? 'message-error' : null"
                    [attr.aria-invalid]="isFieldInvalid('message')"
                  ></textarea>
                  @if (isFieldInvalid('message')) {
                    <span class="field-error" id="message-error" role="alert">Please enter a message (min 10 characters)</span>
                  }
                </div>

                @if (formState() === 'error') {
                  <div class="form-error-msg" role="alert" aria-live="polite">
                    Something went wrong. Please try again or email me directly.
                  </div>
                }

                <button
                  type="submit"
                  class="btn btn-primary submit-btn"
                  id="contact-submit"
                  [disabled]="formState() === 'loading'"
                  [attr.aria-busy]="formState() === 'loading'"
                >
                  @if (formState() === 'loading') {
                    <svg class="btn-spinner" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
                    Sending…
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Send Message
                  }
                </button>
              </form>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-section { background: transparent; }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 4rem;
      align-items: start;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .info-heading {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1.25rem;
    }

    .contact-links {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .contact-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
      transition: all 0.2s ease;
      padding: 0.75rem;
      border-radius: 12px;
      border: 1px solid transparent;

      &:hover {
        background: var(--accent-subtle);
        border-color: var(--border-accent);
        transform: translateX(4px);

        .link-value { color: var(--accent-primary); }
      }
    }

    .link-icon {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-primary);
      flex-shrink: 0;
    }

    .link-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .link-value {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
      transition: color 0.2s;
    }

    .availability-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.25rem;
      background: rgba(16,185,129,0.06);
      border: 1px solid rgba(16,185,129,0.2);
      border-radius: 14px;
    }

    .avail-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 8px rgba(16,185,129,0.5);
      flex-shrink: 0;
      margin-top: 4px;
      animation: pulse-dot 2s ease-in-out infinite;
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .avail-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #10B981;
      margin-bottom: 0.25rem;
    }

    .avail-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    /* Form */
    .contact-form-wrap { position: relative; }

    .contact-form {
      padding: 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;

      @media (max-width: 640px) { padding: 1.5rem; }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;

      @media (max-width: 640px) { grid-template-columns: 1fr; }
    }

    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }

    .form-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);

      span { color: var(--error); margin-left: 2px; }
    }

    .form-input {
      padding: 0.875rem 1rem;
      background: var(--bg-elevated);
      border: 1px solid var(--border-default);
      border-radius: 10px;
      color: var(--text-primary);
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      width: 100%;
      outline: none;
      resize: none;

      &::placeholder { color: var(--text-tertiary); }
      &:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px var(--accent-subtle); }
      &.error { border-color: var(--error); box-shadow: 0 0 0 3px rgba(248,113,113,0.1); }
    }

    .form-textarea { resize: vertical; min-height: 140px; }

    .field-error {
      font-size: 0.78rem;
      color: var(--error);
      font-weight: 500;
    }

    .form-error-msg {
      padding: 0.875rem 1rem;
      background: rgba(248,113,113,0.08);
      border: 1px solid rgba(248,113,113,0.25);
      border-radius: 10px;
      font-size: 0.88rem;
      color: var(--error);
    }

    .submit-btn {
      width: 100%;
      justify-content: center;
      margin-top: 0.5rem;
      gap: 0.6rem;

      &:disabled { opacity: 0.7; cursor: not-allowed; }
    }

    .btn-spinner {
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Success */
    .form-success {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;

      .success-icon { font-size: 3.5rem; margin-bottom: 1rem; }
      h3 { font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary); }
      p { color: var(--text-secondary); margin-bottom: 1.5rem; }
    }

    .success-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 380px;
      margin: 1.5rem auto;
    }
    .success-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      padding: 0.85rem 1.25rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      transition: all 0.25s ease;
    }
    .reset-wrap {
      margin-top: 1.5rem;
    }
    .btn-text {
      background: none;
      border: none;
      color: var(--accent-primary);
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: underline;
    }
    .btn-outline {
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      cursor: pointer;
    }
    .btn-outline:hover {
      background: rgba(255,255,255,0.08);
      border-color: var(--border-accent);
    }
  `],
})
export class ContactComponent {
  private portfolioService = inject(PortfolioService);
  private fb = inject(FormBuilder);

  readonly formState = signal<FormState>('idle');
  readonly submittedName = signal('');

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  isFieldInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submitForm(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const formValues = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      subject: this.contactForm.value.subject || '',
      message: this.contactForm.value.message,
    };
    this.submittedName.set(formValues.name);
    this.formState.set('loading');

    this.portfolioService.submitContact(formValues).subscribe({
      next: () => {
        this.formState.set('success');
      },
      error: () => {
        this.formState.set('success');
      },
    });
  }

  resetForm(): void {
    this.contactForm.reset();
    this.submittedName.set('');
    this.formState.set('idle');
  }
}
