import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { environment } from '../environments/environment';
import { WeatherData } from './models/weather.model';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  const stationId = '0007W';
  const apiUrl = `${environment.weatherApiUrl}${stationId}/observations?limit=1`;
  const mockWeatherResponse = {
    features: [
      {
        properties: {
          temperature: {
            value: 20.5
          }
        }
      }
    ]
  };
  const mockStationsResponse = {
    features: [
      {
        properties: {
          name: 'Station 1',
          stationIdentifier: 'ID1'
        }
      },
      {
        properties: {
          name: 'Station 2',
          stationIdentifier: 'ID2'
        }
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getCurrentWeather', () => {
    it('should fetch current weather data and map it to WeatherData', () => {
      service.getCurrentWeather(stationId).subscribe((data: WeatherData) => {
        expect(data).toEqual({ temperature: 20.5 });
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockWeatherResponse);
    });

    it('should handle errors when fetching current weather data', () => {
      service.getCurrentWeather(stationId).subscribe(
        () => fail('Expected an error, not data'),
        (error) => {
          expect(error).toBeTruthy();
        }
      );

      const req = httpMock.expectOne(apiUrl);
      req.flush('Error fetching data', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('#getStations', () => {
    it('should fetch stations and map them correctly', () => {
      service.getStations().subscribe((stations) => {
        expect(stations.length).toBe(2);
        expect(stations).toEqual([
          { name: 'Station 1', stationIdentifier: 'ID1' },
          { name: 'Station 2', stationIdentifier: 'ID2' }
        ]);
      });

      const req = httpMock.expectOne(service['stationsUrl']);
      expect(req.request.method).toBe('GET');
      req.flush(mockStationsResponse);
    });

    it('should handle errors when fetching stations', () => {
      service.getStations().subscribe(
        () => fail('Expected an error, not data'),
        (error) => {
          expect(error).toBeTruthy();
        }
      );

      const req = httpMock.expectOne(service['stationsUrl']);
      req.flush('Error fetching data', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
