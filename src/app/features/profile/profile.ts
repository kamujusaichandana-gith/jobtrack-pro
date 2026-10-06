import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ProfileDetails {
  fullName: string;
  email: string;
  jobTitle: string;
  location: string;
}

const demoProfile: ProfileDetails = {
  fullName: 'Demo User',
  email: 'demo@jobtrackpro.com',
  jobTitle: 'Frontend Developer',
  location: 'Dallas, TX',
};

@Component({
  imports: [FormsModule],
  selector: 'app-profile',
  styleUrl: './profile.scss',
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  profile: ProfileDetails = { ...demoProfile };
  saved = false;

  ngOnInit(): void {
    const storedProfile = localStorage.getItem('jobTrackProfile');
    if (!storedProfile) {
      return;
    }

    try {
      const savedProfile = JSON.parse(storedProfile) as Partial<ProfileDetails>;
      this.profile = {
        fullName: savedProfile.fullName || demoProfile.fullName,
        email: savedProfile.email || demoProfile.email,
        jobTitle: savedProfile.jobTitle || demoProfile.jobTitle,
        location: savedProfile.location || demoProfile.location,
      };
    } catch {
      this.profile = { ...demoProfile };
    }
  }

  saveProfile(): void {
    localStorage.setItem('jobTrackProfile', JSON.stringify(this.profile));
    this.saved = true;
  }
}
