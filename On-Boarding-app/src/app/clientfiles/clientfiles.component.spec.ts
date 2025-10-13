import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientfilesComponent } from './clientfiles.component';

describe('ClientfilesComponent', () => {
  let component: ClientfilesComponent;
  let fixture: ComponentFixture<ClientfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientfilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
