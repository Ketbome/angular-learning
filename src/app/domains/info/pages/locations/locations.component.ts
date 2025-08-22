import { afterNextRender, Component, resource, signal } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { environment } from '@env/environment';

@Component({
  selector: 'app-locations',
  imports: [GoogleMap, MapMarker],
  templateUrl: './locations.component.html',
})
export default class LocationsComponent {
  $origin = signal('');
  $options = signal<google.maps.MapOptions>({
    center: { lat: 40, lng: -20 },
    zoom: 4,
  });
  $positions = signal<google.maps.LatLngLiteral[]>([]);

  constructor() {
    afterNextRender(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        this.$origin.set(origin);
        this.$options.set({
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      });
    });
  }

  locationRs = resource({
    params: () => ({
      origin: this.$origin(),
    }),
    loader: async ({ params }) => {
      const url = new URL(`${environment.apiUrl}/api/v1/locations`);
      if (params.origin) {
        url.searchParams.set('origin', params.origin);
      }
      const response = await fetch(url);
      const data = await response.json();
      const positions = data.map(
        (location: { latitude: number; longitude: number }) => ({
          lat: location.latitude,
          lng: location.longitude,
        }),
      );
      this.$positions.set(positions);
      return data;
    },
  });
}
