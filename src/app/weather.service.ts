import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { WeatherData } from './models/weather.model';
import { environment } from '../environments/environment';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly apiUrl = environment.weatherApiUrl;
  private readonly stationsUrl = 'https://api.weather.gov/stations?limit=100';

  constructor(private http: HttpClient) { }

  getCurrentWeather(stationId: string): Observable<WeatherData> {
    const url = `${this.apiUrl}${stationId}/observations?limit=1`;
    console.log('Requesting weather data from:', url);
    return this.http.get<any>(url).pipe(
      map(response => {
        const feature = response.features[0];
        const properties = feature.properties;
        return {
          temperature: properties.temperature?.value 
          
        } as WeatherData;
      }),
      tap(response => {
        console.log('Response from getCurrentWeather:', response);
      }),
      catchError(error => {
        console.error('Error fetching current weather:', error);
        return throwError(() => error);
      })
    );
  }

  getStations(): Observable<any[]> {
    return this.http.get<any>(this.stationsUrl).pipe(
      map(response => response.features.map(feature => ({
        name: feature.properties.name,
        stationIdentifier: feature.properties.stationIdentifier
      })))
    );
  }
} 