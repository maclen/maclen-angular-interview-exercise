import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { WeatherData } from './models/weather.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  stations: Array<{ name: string; stationIdentifier: string }> = [];
  currentWeather?: WeatherData;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.loadStations();
  }

  loadStations() {
    this.weatherService.getStations().subscribe({
      next: (stations) => {
        this.stations = stations;
      },
      error: (error) => {
        console.error('Error loading stations:', error);
      }
    });
  }

  onSelectStation(stationId: string) {
    if (stationId) {
      this.getWeatherForStation(stationId);
    }
  }

  getWeatherForStation(stationId: string) {
    this.weatherService.getCurrentWeather(stationId).subscribe({
      next: (weather) => {
        this.currentWeather = weather;
      },
      error: (error) => {
        console.error('Error loading weather:', error);
      }
    });
  }

  formatTemperature(temp: number | null | undefined): string {
    if (temp === null || temp === undefined) {
      return 'Temperature not available';
    }
    return `Temperature: ${temp.toFixed(1)}°C`;
  }
}
