import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private stationsUrl = 'https://api.weather.gov/stations?limit=100';

  constructor(private http: HttpClient) {}

  getStations(): Observable<any[]> {
    return this.http.get<any>(this.stationsUrl).pipe(
      map(response => response.features.map(feature => ({
        name: feature.properties.name,
        stationIdentifier: feature.properties.stationIdentifier
      })))
    );
  }

  getCurrentWeather(stationId: string): Observable<any> {
    const url = `https://api.weather.gov/stations/${stationId}/observations?limit=1`;
    console.log(url);
    
    return this.http.get<any>(url).pipe(
      map(response => {
        const properties = response.features[0].properties;
        return {
          temperature: properties.temperature.value,
        };
      })
    );
  }
} 