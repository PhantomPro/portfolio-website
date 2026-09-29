import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Project, ApiResponse } from '../models/project.model';
import { FALLBACK_PROJECTS } from '../data/portfolio-fallback.data';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly baseUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getProjects(category?: string, featured?: boolean): Observable<ApiResponse<Project[]>> {
    let params = new HttpParams();
    if (category && category !== 'all') params = params.set('category', category);
    if (featured !== undefined) params = params.set('featured', String(featured));

    return this.http.get<ApiResponse<Project[]>>(this.baseUrl, { params }).pipe(
      catchError(() => {
        let projects = [...FALLBACK_PROJECTS];
        if (category && category !== 'all') {
          projects = projects.filter((p) => p.category === category);
        }
        if (featured !== undefined) {
          projects = projects.filter((p) => p.featured === featured);
        }
        return of({ success: true, data: projects });
      })
    );
  }

  getProjectById(id: string): Observable<ApiResponse<Project>> {
    return this.http.get<ApiResponse<Project>>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => {
        const found =
          FALLBACK_PROJECTS.find(
            (p) =>
              p._id === id ||
              p.title.toLowerCase().replace(/[^a-z0-9]/g, '-') === id.toLowerCase()
          ) || FALLBACK_PROJECTS[0];
        return of({ success: true, data: found });
      })
    );
  }

  createProject(project: Partial<Project>): Observable<ApiResponse<Project>> {
    return this.http.post<ApiResponse<Project>>(this.baseUrl, project);
  }

  updateProject(id: string, project: Partial<Project>): Observable<ApiResponse<Project>> {
    return this.http.put<ApiResponse<Project>>(`${this.baseUrl}/${id}`, project);
  }

  deleteProject(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }
}
