import { Component, HostListener, OnInit } from '@angular/core';
import { bank_cards, CreateCardDto } from '../../../../interfaces/user-interface';
import { AuthService } from '../../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BankCardService } from '../../../../services/bankCardService/bank-card.service';


interface Payment {
  id: number;
  user_id: number;
  listing_id: number;
  amount: string;
  payment_method_id: number | null;
  bank_card_id: number | null;
  payment_status: string;
  tran_ref: string;
  cart_id: string;
  resp_code: string | null;
  resp_message: string | null;
  verification_data: any;
  created_at: string;
  updated_at: string;
  total_amount: string | null;
  discounted_amount: string | null;
  currency: string;
  promo_code_id: number | null;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  listing: {
    id: number;
    title: string;
    description: string;
    price: string;
  };
  payment_method: any;
  bank_card: any;
}

interface PaymentHistoryResponse {
  success: boolean;
  message: string;
  data: {
    payments: Payment[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    };
    statistics: {
      total_payments: number;
      completed_payments: number;
      pending_payments: number;
      failed_payments: number;
      total_amount: string;
      average_amount: string;
    };
  };
}
@Component({
  selector: 'app-payment-card-user',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,],
  templateUrl: './payment-card-user.component.html',
  styleUrl: './payment-card-user.component.css'
})
export class PaymentCardUserComponent implements OnInit {

   payments: Payment[] = [];
  statistics: any = null;
  loading = true;
  error = '';

//   bankCards: bank_cards[] = [];
//   loading = true;
//   error = '';
//   showAddCardForm = false;
//   cardForm: FormGroup;


//   @HostListener('input', ['$event'])
// onInputChange(event: Event) {
//   const input = event.target as HTMLInputElement;

//   if (!input) return;

//   const id = input.id;
//   let value = input.value.replace(/\D/g, ''); // remove non-digits

//   if (id === 'cardNumber') {
//     // Format card number: 1234 5678 9012 3456
//     if (value.length > 16) {
//       value = value.slice(0, 16);
//     }
//     const formatted = value.match(/.{1,4}/g)?.join(' ') ?? value;
//     input.value = formatted;
//     this.cardForm.get('cardNumber')?.setValue(formatted, { emitEvent: false });

//   } else if (id === 'expiryDate') {
//     // Format expiry date: MM/YY
//     if (value.length > 4) {
//       value = value.slice(0, 4);
//     }

//     let formatted = value;
//     if (value.length >= 3) {
//       formatted = value.slice(0, 2) + '/' + value.slice(2);
//     }

//     input.value = formatted;
//     this.cardForm.get('expiryDate')?.setValue(formatted, { emitEvent: false });
//   }
// }



  constructor(private auth: AuthService,private fb: FormBuilder, private cardService : BankCardService) {
    // this.cardForm = this.fb.group({
    //   nameOnCard: ['', [Validators.required]],
    //   cardNumber: ['', [Validators.required]],
    //   // expiryDate: ['', [Validators.required]],
    //   expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    //   cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]]
    // });
  }

//   ngOnInit(): void {
//     this.getPaymentHistory();
//   }

// getPaymentHistory(){
//   this.cardService.getPaymentHistory().subscribe({
//     next: (res) => {
//       console.log('Payment history:', res);
//     },
//     error: (err) => {
//       console.error('Error fetching payment history:', err);
//     }
//   });
// }
  // getCard(){
  //   this.cardService.getCards().subscribe({
  //     next: (res) => {
  //       this.bankCards = res;
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching cards:', err);
  //       this.error = 'Failed to load cards.';
  //       this.loading = false;
  //     }
  //   });
  // }
  // // userData(){
  // //   this.auth.userProfile$.subscribe({
  // //     next: (res) => {
  // //       if (res && res.user && res.user.bank_cards) {
  // //         this.bankCards = res.user.bank_cards;
  // //       } else {
  // //         this.bankCards = [];
  // //       }
  // //       this.loading = false;
  // //     },
  // //     error: (err) => {
  // //       console.error('Error reading user profile from stream:', err);
  // //       this.bankCards = [];
  // //       this.error = 'Failed to load wishlist items.';
  // //       this.loading = false;
  // //     }
  // //   });
  // // }
  // toggleAddCardForm(): void {
  //   this.showAddCardForm = !this.showAddCardForm;
  //   if (!this.showAddCardForm) {
  //     this.cardForm.reset();
  //   }
  // }

  // saveCard(): void {
  //   if (this.cardForm.valid) {
  //     const formValues = this.cardForm.value;

  //     const newCard: CreateCardDto = {
  //       card_type_id: 1,
  //       card_number: formValues.cardNumber,
  //       card_holder_name: formValues.nameOnCard,
  //       expiration_date: formValues.expiryDate,
  //       cvv: formValues.cvv
  //     };

  //     this.cardService.addCard(newCard).subscribe({
  //       next: (res) => {
  //         // this.cardForm.reset();
  //         // this.showAddCardForm = false;
  //         // console.log('resr:', res);
  //         //  this.bankCards = [...this.bankCards, res]; // Add the new card to the list:
  //         //  this.getCard(); // Refresh the card list
  //         const newCard = res.data;

  // this.cardForm.reset();
  // this.showAddCardForm = false;
  // this.bankCards = [...this.bankCards, newCard];
  // this.getCard(); // Refresh the card list
  //       },
  //       error: (err) => {
  //         console.error('Failed to save card:', err);
  //       }
  //     });
  //   } else {
  //     this.markFormGroupTouched(this.cardForm);
  //   }
  // }


  // // removeCard(card: bank_cards): void {
  // //   this.bankCards = this.bankCards.filter(c => c.card_type_id !== card.card_type_id);
  // //   localStorage.setItem('bankCards', JSON.stringify(this.bankCards));
  // // }

  // getLastFourDigits(cardNumber: string): string {
  //   return cardNumber.slice(-4);
  // }

  // // Helper to show validation errors
  // markFormGroupTouched(formGroup: FormGroup) {
  //   Object.values(formGroup.controls).forEach(control => {
  //     control.markAsTouched();
  //     if (control instanceof FormGroup) {
  //       this.markFormGroupTouched(control);
  //     }
  //   });
  // }


  // formatExpiry(dateStr: string): string {
  //   if (!dateStr || !dateStr.includes('/')) return 'Invalid Date';

  //   const [month, year] = dateStr.split('/');
  //   const fullYear = Number(year) < 100 ? `20${year}` : year; // handle '30' -> '2030'

  //   return `${month.padStart(2, '0')}/${fullYear}`;
  // }


  // getCardLogo(cardNumber: string): string {
  //   if (/^4/.test(cardNumber)) return 'pictures/visaLogo.png';
  //   if (/^5[1-5]/.test(cardNumber)) return '/pictures/visaLogo.png';
  //   if (/^3[47]/.test(cardNumber)) return '/pictures/visaLogo.png';
  //   if (/^6/.test(cardNumber)) return '/pictures/visaLogo.png';
  //   if (/^35/.test(cardNumber)) return '/pictures/visaLogo.png';
  //   if (/^62/.test(cardNumber)) return '/pictures/visaLogo.png';
  //   if (/^9/.test(cardNumber)) return '/pictures/visaLogo.png'; // Example
  //   return '/pictures/visaLogo.png';
  // }
  // setAsDefault(card: bank_cards): void {
  //   this.cardService.setDefaultCard(card.id).subscribe({
  //     next: () => {
  //       // Update the default status locally
  //       this.bankCards.forEach(c => c.is_default = false);
  //       card.is_default = true;
  //     },
  //     error: (err) => {
  //       console.error('Failed to set card as default:', err);
  //     }
  //   });
  // }

  // removeCard(card: bank_cards): void {
  //   if (confirm('Are you sure you want to delete this card?')) {
  //     this.cardService.deleteCard(card.id).subscribe({
  //       next: () => {
  //         this.bankCards = this.bankCards.filter(c => c.id !== card.id);
  //       },
  //       error: (err) => {
  //         console.error('Failed to delete card:', err);
  //       }
  //     });
  //   }
  // }

  
  ngOnInit(): void {
    this.getPaymentHistory();
  }

  getPaymentHistory(): void {
    this.loading = true;
    this.cardService.getPaymentHistory().subscribe({
      next: (res: PaymentHistoryResponse) => {
        if (res.success) {
          this.payments = res.data.payments;
          this.statistics = res.data.statistics;
        } else {
          this.error = 'Failed to load payment history';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching payment history:', err);
        this.error = 'Failed to load payment history';
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }



}
