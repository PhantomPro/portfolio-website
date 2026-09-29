import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Experience } from '../models/experience.model';
import { ApiResponse } from '../models/project.model';
import { FALLBACK_EXPERIENCES } from '../data/portfolio-fallback.data';

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  private readonly baseUrl = `${environment.apiUrl}/experiences`;

  constructor(private http: HttpClient) {}

  getExperiences(): Observable<ApiResponse<Experience[]>> {
    return this.http
      .get<ApiResponse<Experience[]>>(this.baseUrl)
      .pipe(catchError(() => of({ success: true, data: FALLBACK_EXPERIENCES })));
  }

  getExperienceById(id: string): Observable<ApiResponse<Experience>> {
    return this.http.get<ApiResponse<Experience>>(`${this.baseUrl}/${id}`);
  }

  createExperience(experience: Partial<Experience>): Observable<ApiResponse<Experience>> {
    return this.http.post<ApiResponse<Experience>>(this.baseUrl, experience);
  }

  updateExperience(id: string, experience: Partial<Experience>): Observable<ApiResponse<Experience>> {
    return this.http.put<ApiResponse<Experience>>(`${this.baseUrl}/${id}`, experience);
  }

  deleteExperience(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }
}
