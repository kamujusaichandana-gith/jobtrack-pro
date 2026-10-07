import { Service, computed, inject, Injectable, signal } from '@angular/core';
import { Application } from '../models/application.model';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Service()
export class ApplicationService {
  private http = inject(HttpClient);

  private apiUrl = 'https://jobtrack-pro-api-tnkd.onrender.com/applications';
  applications = signal<Application[]>([]);

    totalApplications = computed(() => {
      return this.applications().length;
    });

    totalInterviews = computed(() => {
      return this.applications().filter(
        application => application.status === 'Interview'
      ).length;
    });

    totalOffers = computed(() => {
      return this.applications().filter(
        application => application.status === 'Offer'
      ).length;
    });

    getApplications(): Observable<Application[]> {
      return this.http.get<Application[]>(this.apiUrl);
    }

    addApplication(application: Application): Observable<Application> {
      return this.http.post<Application>(this.apiUrl, application);
    }

    deleteApplication(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    updateApplication(
      id: string,
      application: Application
    ): Observable<Application> {
        return this.http.put<Application>(
        `${this.apiUrl}/${id}`,
        application
      );
    }
    

    getApplicationById(id: string): Application | undefined {
      return this.applications().find(
        application => application.id === id
      );
    }
}
