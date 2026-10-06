import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../../core/services/application';

@Component({
  imports: [],
  selector: 'app-application-detail',
  styleUrl: './application-detail.scss',
  templateUrl: './application-detail.html',
})
export class ApplicationDetail {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private applicationService = inject(ApplicationService);

  id = String(this.route.snapshot.paramMap.get('id'));

  application = this.applicationService.getApplicationById(this.id);

  goBack() {
    this.router.navigate(['/applications']);
  }
}
