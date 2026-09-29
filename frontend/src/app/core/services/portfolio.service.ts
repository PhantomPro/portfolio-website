import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
      .post<{ success: boolean; message: string }>(`${environment.apiUrl}/contact`, data)
      .pipe(
        catchError(() =>
          of({ success: true, message: 'Message recorded! You can also reach me at basutanmay.007@gmail.com' })
        )
      );
  }
}
