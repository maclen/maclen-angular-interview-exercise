import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  stations: string[] = [];
  currentWeather: any;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {

    this.weatherService.getStations().subscribe(stations => {
      this.stations = stations;
    });
  }

  onSelectStation(stationName: string) {

    this.weatherService.getCurrentWeather(stationName).subscribe(weather => {
      this.currentWeather = weather;
    });
  }
}
