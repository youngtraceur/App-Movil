import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegAsistenciaPPage } from './reg-asistencia-p.page';

describe('RegAsistenciaPPage', () => {
  let component: RegAsistenciaPPage;
  let fixture: ComponentFixture<RegAsistenciaPPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegAsistenciaPPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
