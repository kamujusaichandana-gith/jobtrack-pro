import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import { Application } from '../../../core/models/application.model';
import { ApplicationService } from '../../../core/services/application';

@Component({
  imports: [],
  selector: 'app-application-list',
  styleUrl: './application-list.scss',
  templateUrl: './application-list.html',
})
export class ApplicationList implements OnInit {

  private applicationService = inject(ApplicationService);
  private cdr = inject(ChangeDetectorRef);

  applications: Application[] = [];
  filteredApplications: Application[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  selectedApplication: Application | null = null;
  editingApplication: Application | null = null;

  searchText: string = '';
  selectedStatus: string = 'All';

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.applicationService.getApplications().subscribe({
      next: (data: Application[]) => {
        this.isLoading = false;
        
        this.applications = data;
        this.filteredApplications = data;

        this.applicationService.applications.set(data);

        this.cdr.detectChanges();
      },

      error: (error: unknown) => {
        console.error('API Error:', error);

        this.isLoading = false;
        this.errorMessage = 'Unable to load applications. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  viewApplication(application: Application): void {
    this.editingApplication = null;
    this.selectedApplication = application;
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  searchApplications(searchText: string): void {
    this.searchText = searchText.trim();
    this.applyFilters();
  }

  editApplication(application: Application): void {
    this.selectedApplication = null;
    this.editingApplication = { ...application };
  }

  saveApplication(): void {
    if (!this.editingApplication) {
      return;
    }

    this.applicationService
      .updateApplication(
        this.editingApplication.id,
        this.editingApplication
      )
      .subscribe({
        next: () => {

          this.editingApplication = null;

          this.loadApplications();
        },
        error: (error: unknown) => {
          console.error('ERROR UPDATING APPLICATION:', error);
        }
      });
  }

  applyFilters(): void {
    this.filteredApplications = this.applications.filter(application => {

      const matchesSearch =
        application.company.toLowerCase().includes(this.searchText.toLowerCase()) ||
        application.position.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus =
        this.selectedStatus === 'All' ||
        application.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  deleteApplication(id: string): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this application?'
    );

    if (!confirmed) {
      return;
    }
    this.applicationService.deleteApplication(id).subscribe({
      next: () => {

        // Reload the table after deleting
        this.loadApplications();
      },
      error: (error: unknown) => {
        console.error('ERROR DELETING APPLICATION:', error);
      }
    });
  }
}