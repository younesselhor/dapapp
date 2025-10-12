import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export interface SoomSubmission {
  id: number;
  listing_id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  listing: {
    title: string;
    description: string;
    id: number;
    country?: {
      id: number;
      code: string;
      name: string;
    };
    images: {
      id: number;
      image_url: string;
      listing_id: number;
      created_at: string;
      updated_at: string;
    }[];
  };
  first_image?: string;
  amount: string;
  status: string;
  submission_date: string;
  min_soom: string;
}

@Component({
  selector: 'app-soom-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './soom-box.component.html',
  styleUrl: './soom-box.component.css'
})
export class SoomBoxComponent implements OnInit {
  receivedSooms: SoomSubmission[] = [];
  sentSooms: SoomSubmission[] = [];
  currentView: 'received' | 'sent' = 'received';

  isDropdownOpen = false;
  selectedNumber = 28;

  showAcceptModal = false;
  showAcceptedModal = false;
  selectedSoom: SoomSubmission | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchReceivedSooms();
    this.fetchSentSooms();
  }

  toggleView(view: 'received' | 'sent') {
    this.currentView = view;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectNumber(num: number) {
    this.selectedNumber = num;
    this.isDropdownOpen = false;
  }

  // Fetch sooms received by the current user (as seller)
  fetchReceivedSooms() {
    this.http.get<{ data: SoomSubmission[] }>('https://be.dabapp.co/api/my-listings-sooms')
      .subscribe({
        next: (response) => {
          this.receivedSooms = response.data;
        },
        error: (error) => {
          console.error('Error fetching received sooms:', error);
        }
      });
  }

  // Fetch sooms sent by the current user (as buyer)
  fetchSentSooms() {
    this.http.get<{ data: SoomSubmission[] }>('https://be.dabapp.co/api/my-sooms')
      .subscribe({
        next: (response) => {
          this.sentSooms = response.data;
        },
        error: (error) => {
          console.error('Error fetching sent sooms:', error);
        }
      });
  }

  acceptSoom(soom: SoomSubmission) {
    const submissionId = soom.id;
    const listingId = soom.listing_id;
    
    this.http.patch(`https://be.dabapp.co/api/submissions/${submissionId}/accept`, {})
      .subscribe({
        next: () => {
          this.receivedSooms = this.receivedSooms.map(item => {
            if (item.id === submissionId) {
              return { ...item, status: 'accepted' };
            } else if (item.listing_id === listingId && item.status === 'pending') {
              return { ...item, status: 'rejected' };
            }
            return item;
          });
        },
        error: (error) => {
          console.error('Error accepting soom:', error);
        }
      });
  }

  rejectSoom(soom: SoomSubmission) {
    const submissionId = soom.id;
    
    this.http.patch(`https://be.dabapp.co/api/submissions/${submissionId}/reject`, {})
      .subscribe({
        next: () => {
          this.receivedSooms = this.receivedSooms.map(item =>
            item.id === submissionId ? { ...item, status: 'rejected' } : item
          );
        },
        error: (error) => {
          console.error('Error rejecting soom:', error);
          this.receivedSooms = this.receivedSooms.map(item =>
            item.id === submissionId ? { ...item, status: 'rejected' } : item
          );
        }
      });
  }

  isExpired(submissionDateStr: string): boolean {
    return this.getDaysLeft(submissionDateStr) <= 0;
  }

  getDaysLeft(submissionDateStr: string): number {
    const submissionDate = new Date(submissionDateStr);
    const now = new Date();
    const msInDay = 1000 * 60 * 60 * 24;
    
    const expiryDate = new Date(submissionDate.getTime() + 5 * msInDay);
    const diff = expiryDate.getTime() - now.getTime();
    const daysLeft = Math.max(Math.ceil(diff / msInDay), 0);
    return daysLeft;
  }

  // Open accept confirmation modal
  openAcceptModal(soom: SoomSubmission) {
    this.selectedSoom = soom;
    this.showAcceptModal = true;
    this.showAcceptedModal = false;
  }

  // Close modal without accepting
  closeModal() {
    this.showAcceptModal = false;
    this.showAcceptedModal = false;
    this.selectedSoom = null;
  }

  closeAcceptedModal() {
    this.showAcceptedModal = false;
    this.selectedSoom = null;
  }

  confirmAcceptSoom() {
    if (!this.selectedSoom) return;

    const submissionId = this.selectedSoom.id;
    const listingId = this.selectedSoom.listing_id;
    
    this.http.patch(`https://be.dabapp.co/api/submissions/${submissionId}/accept`, {})
      .subscribe({
        next: () => {
          this.receivedSooms = this.receivedSooms.map(item => {
            if (item.id === submissionId) {
              return { ...item, status: 'accepted' };
            } else if (item.listing_id === listingId && item.status === 'pending') {
              return { ...item, status: 'rejected' };
            }
            return item;
          });
          this.showAcceptModal = false;
          this.showAcceptedModal = true;
        },
        error: (error) => {
          console.error('Error accepting soom:', error);
        }
      });
  }

  viewSellerInfo(soom: SoomSubmission) {
    // Implement view seller info logic
    console.log('View seller info for:', soom);
  }

  getInitials(firstName?: string, lastName?: string): string {
    if (!firstName && !lastName) return '??';
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }
}