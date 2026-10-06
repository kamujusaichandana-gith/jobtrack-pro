import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../core/services/application';

@Component({
  imports: [RouterLink],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {

  private applicationService = inject(ApplicationService);

  totalApplications = this.applicationService.totalApplications;
  totalInterviews = this.applicationService.totalInterviews;
  totalOffers = this.applicationService.totalOffers;
  responseRate = computed(() => {
    const total = this.totalApplications();
    return total ? Math.round(((this.totalInterviews() + this.totalOffers()) / total) * 100) : 0;
  });

  statusMetrics = computed(() => {
    const applications = this.applicationService.applications();
    const statuses = [
      { label: 'Applied', color: 'blue' },
      { label: 'Interview', color: 'orange' },
      { label: 'Offer', color: 'green' },
      { label: 'Rejected', color: 'red' },
    ];

    return statuses.map((status) => {
      const count = applications.filter((application) => application.status === status.label).length;
      return {
        ...status,
        count,
        width: applications.length ? Math.max((count / applications.length) * 100, count ? 5 : 0) : 0,
      };
    });
  });

  weeklyActivity = computed(() => {
    const applications = this.applicationService.applications();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const dateKey = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
      return {
        label: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date),
        count: applications.filter((application) => application.dateApplied === dateKey).length,
      };
    });

    const maximum = Math.max(...days.map((day) => day.count), 1);
    return days.map((day) => ({
      ...day,
      height: day.count ? Math.max((day.count / maximum) * 100, 9) : 3,
    }));
  });

  recentApplications = computed(() =>
    [...this.applicationService.applications()]
      .sort((first, second) => second.dateApplied.localeCompare(first.dateApplied))
      .slice(0, 4),
  );

  ngOnInit(): void {
    this.applicationService.getApplications().subscribe({
      next: (data) => {
        this.applicationService.applications.set(data);
      },
      error: (error) => {
        console.error('ERROR LOADING DASHBOARD:', error);
      }
    });
  }
}
