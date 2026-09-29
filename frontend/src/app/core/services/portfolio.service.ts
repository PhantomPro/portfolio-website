import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Skill } from '../models/skill.model';
import { ApiResponse } from '../models/project.model';
import { Profile, Achievement } from '../models/profile.model';
import {
  FALLBACK_PROFILE,
  FALLBACK_SKILLS,
  FALLBACK_ACHIEVEMENTS,
} from '../data/portfolio-fallback.data';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  constructor(private http: HttpClient) {}

  getSkills(): Observable<ApiResponse<Skill[]>> {
    return this.http
      .get<ApiResponse<Skill[]>>(`${environment.apiUrl}/skills`)
      .pipe(catchError(() => of({ success: true, data: FALLBACK_SKILLS })));
  }

  getAchievements(): Observable<ApiResponse<Achievement[]>> {
    return this.http
      .get<ApiResponse<Achievement[]>>(`${environment.apiUrl}/achievements`)
      .pipe(catchError(() => of({ success: true, data: FALLBACK_ACHIEVEMENTS })));
  }

  getProfile(): Observable<ApiResponse<Profile>> {
    return this.http
      .get<ApiResponse<Profile>>(`${environment.apiUrl}/profile`)
      .pipe(catchError(() => of({ success: true, data: FALLBACK_PROFILE })));
  }

  updateProfile(profile: Partial<Profile>): Observable<ApiResponse<Profile>> {
    return this.http.put<ApiResponse<Profile>>(`${environment.apiUrl}/profile`, profile);
  }

  submitContact(data: { name: string; email: string; subject?: string; message: string }): Observable<{ success: boolean; message: string }> {
    return this.http
      .post<{ success: boolean; message: string }>(
        'https://api.web3forms.com/submit',
        {
          access_key: '7a13fff8-fbed-4c54-b925-9ea1d644b22a',
          name: data.name,
          email: data.email,
          subject: data.subject || `Portfolio Inquiry from ${data.name}`,
          message: data.message,
          from_name: `${data.name} (Portfolio)`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )
      .pipe(
        map((res) => ({ success: res.success, message: res.message || 'Message sent successfully!' })),
        catchError(() => of({ success: false, message: 'Failed to send message.' }))
      );
  }
}
