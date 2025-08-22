import { Component, resource } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-locations',
  imports: [],
  templateUrl: './locations.component.html',
})
export default class LocationsComponent {
  locationRs = resource({
    loader: async () => {
      const response = await fetch(`${environment.apiUrl}/api/v1/locations`);
      const data = await response.json();
      return data;
    },
  });
}
