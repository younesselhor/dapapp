// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';

// export interface SoomSubmission {
//   id: number;
//   listing_id: number;
//   user: {
//     first_name: string;
//     last_name: string;
//     email: string;
//   };
//   listing: {
//     title: string;
//     description: string;
//     id: number;
//   };
//   amount: string;
//   status: string;
//   submission_date: string;
// }

// @Component({
//   selector: 'app-soom-box',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './soom-box.component.html',
//   styleUrl: './soom-box.component.css'
// })
// export class SoomBoxComponent implements OnInit{

//   receivedSooms: any[] = [];
//   sentSooms: any[] =[];
//   currentView: 'received' | 'sent' = 'received';

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.fetchreceivedSoomsBuyerBuyer();
//     this.fetchreceivedSoomsBuyerSeller();
//   }

//   toggleView(view: 'received' | 'sent') {
//     this.currentView = view;
//     // Add sent logic here later
//   }

// fetchreceivedSoomsBuyerBuyer() {
//   this.http.get<{ data: SoomSubmission[] }>('https://be.dabapp.co/api/my-listings-sooms')
//     .subscribe(response => {
//       this.receivedSooms = response.data;
     
//     });
// }

// fetchreceivedSoomsBuyerSeller() {
//   this.http.get<{ data: SoomSubmission[] }>('https://be.dabapp.co/api/my-sooms')
//     .subscribe(response => {
//        this.sentSooms = response.data
//        console.log('this.sentSooms: ', this.sentSooms);
//     });
// }


//  acceptSoom(soom: SoomSubmission) {
//   const submissionId = soom.id;
//   const listingId = soom.listing_id;

//   this.http.patch(`https://be.dabapp.co/api/submissions/${submissionId}/accept`, {})
//     .subscribe(() => {
//       // Update the UI
//       this.receivedSooms = this.receivedSooms.map(item => {
//         if (item.id === submissionId) {
//           return { ...item, status: 'accepted' };
//         } else if (item.listing_id === listingId) {
//           return { ...item, status: 'rejected' };
//         }
//         return item;
//       });
//     });
// }


//   rejectSoom(soom: SoomSubmission) {
//   this.receivedSooms = this.receivedSooms.map(item =>
//     item.id === soom.id ? { ...item, status: 'rejected' } : item
//   );
// }

// getDaysLeft(submissionDateStr: string): number {
//   const submissionDate = new Date(submissionDateStr);
//   const now = new Date();
//   const msInDay = 1000 * 60 * 60 * 24;

//   // SOOM expires after 5 days
//   const expiryDate = new Date(submissionDate.getTime() + 5 * msInDay);
//   const diff = expiryDate.getTime() - now.getTime();

//   return Math.max(Math.ceil(diff / msInDay), 0); // don't return negative numbers
// }

//   // getDaysLeft(expiryDate: string): number {
//   //   const today = new Date();
//   //   const expiry = new Date(expiryDate);
//   //   const diff = expiry.getTime() - today.getTime();
//   //   return Math.ceil(diff / (1000 * 3600 * 24));
//   // }
// }
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
    country?: {  // Make this optional with ?
    id: number;
    code: string;
    name: string;
  };
  };
 
  amount: string;
  status: string;
  submission_date: string;
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


  showAcceptModal = false;
  selectedSoom: SoomSubmission | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchReceivedSooms();
    this.fetchSentSooms();
  }

  toggleView(view: 'received' | 'sent') {
    this.currentView = view;
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
          // Update the UI - accept this soom and reject all others for the same listing
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
          // Update the UI
          this.receivedSooms = this.receivedSooms.map(item =>
            item.id === submissionId ? { ...item, status: 'rejected' } : item
          );
        },
        error: (error) => {
          console.error('Error rejecting soom:', error);
          // Still update UI even if API call fails (for better UX)
          this.receivedSooms = this.receivedSooms.map(item =>
            item.id === submissionId ? { ...item, status: 'rejected' } : item
          );
        }
      });
  }

  openModal() {
    // Your modal opening logic here
    // This depends on what modal library you're using
}
isExpired(submissionDateStr: string): boolean {
    return this.getDaysLeft(submissionDateStr) <= 0;
}

  // getDaysLeft(submissionDateStr: string): number {
  //   const submissionDate = new Date(submissionDateStr);
  //   const now = new Date();
  //   const msInDay = 1000 * 60 * 60 * 24;
    
    
  //   // SOOM expires after 5 days
  //   const expiryDate = new Date(submissionDate.getTime() + 5 * msInDay);
  //   const diff = expiryDate.getTime() - now.getTime();
    
  //   return Math.max(Math.ceil(diff / msInDay), 0); // don't return negative numbers
  // }

  getDaysLeft(submissionDateStr: string): number {
    const submissionDate = new Date(submissionDateStr);
    const now = new Date();
    const msInDay = 1000 * 60 * 60 * 24;
    
    // SOOM expires after 5 days
    const expiryDate = new Date(submissionDate.getTime() + 5 * msInDay);
    const diff = expiryDate.getTime() - now.getTime();
    const daysLeft = Math.max(Math.ceil(diff / msInDay), 0);
    return daysLeft;
}


  // Open accept confirmation modal
  openAcceptModal(soom: SoomSubmission) {
    this.selectedSoom = soom;
    this.showAcceptModal = true;
  }

  // Close modal without accepting
  closeModal() {
    this.showAcceptModal = false;
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
          this.closeModal();
        },
        error: (error) => {
          console.error('Error accepting soom:', error);
        }
      });
  }
}