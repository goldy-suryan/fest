import { Component, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
declare var stripe: any;
declare var elements: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  token;
  charge;

  constructor(private cd: ChangeDetectorRef, private http: HttpClient) { }

  ngAfterViewInit() {
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    const { token, error } = await stripe.createToken(this.card);
    // const customer = await stripe.customers.create({
    //   description: 'first customer',
    //   source: token.id
    // })

    if (error) {
      this.error = error;
    } else {
      if (token) {
        this.http.post('http://localhost:9876/payme', { token: token.id })
          .subscribe(charge => this.charge = charge);
      }
    }
  }
}
