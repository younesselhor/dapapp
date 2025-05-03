import { Component, OnInit } from '@angular/core';
import { SavedVehiclesComponent } from '../saved-vehicles/saved-vehicles.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { AuthUserDetails, MeResponse, Vehicle } from '../../../../interfaces/user-interface';




@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class ProfileCardComponent implements OnInit {
  user: MeResponse | null = null;
user2:any;
currentUser: AuthUserDetails | undefined

  savedVehicle: Vehicle = {
    type: 'Main Bike',
    model: 'KLX230 R',
    year: 2021,
    make: 'Kawasaki'
  };

  constructor(private auth : AuthService){}
  ngOnInit(): void{

    // this.auth.fetchUserProfileOnce();
    this.auth.userProfile$.subscribe((res)=>{
      this.currentUser = res?.user;
      console.log('this.currentUser: ', this.currentUser);
    })



}

}
