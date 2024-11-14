import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WeatherService } from './weather.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let weatherService: WeatherService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AppComponent],
      providers: [WeatherService]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.inject(WeatherService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load stations on init', () => {
    const mockStations = [
      { name: 'Station 1', stationIdentifier: 'ID1' },
      { name: 'Station 2', stationIdentifier: 'ID2' }
    ];
    
    spyOn(weatherService, 'getStations').and.returnValue(of(mockStations));
    
    component.ngOnInit();
    fixture.detectChanges();
    
    expect(weatherService.getStations).toHaveBeenCalled();
    expect(component.stations).toEqual(mockStations);
  });

  it('should display weather data when station is selected', () => {
    const mockWeather = { temperature: 20.5 };
    spyOn(weatherService, 'getCurrentWeather').and.returnValue(of(mockWeather));
    
    component.getWeatherForStation('ID1');
    fixture.detectChanges();
    
    expect(component.currentWeather).toEqual(mockWeather);
  });
});