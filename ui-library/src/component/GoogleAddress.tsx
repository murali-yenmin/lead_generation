import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { GoogleAddressProps, Prediction } from '../interfaces/components';
import OutsideClick from '../utils/outsideClick';
import ErrorValidation from './ErrorValidation';

const libraries: 'places'[] = ['places'];

export const GoogleAddress = ({
  id = '',
  label,
  error,
  onChange,
  onSelect,
  placeholder = '',
  apiKey,
  required = false,
  value,
  sizeMax,
  sizeMin,
}: GoogleAddressProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);

  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && window.google) {
      // Avoid initializing twice
      if (!autocompleteServiceRef.current || !placesServiceRef.current) {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();

        const divElement = document.createElement('div');
        placesServiceRef.current = new window.google.maps.places.PlacesService(divElement);
      }
    }
  }, [isLoaded]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    onChange(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    if (autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: value,
          types: ['address'],
          componentRestrictions: { country: 'us' },
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        },
      );
    }
  };

  const handleSelect = (placeId: string, description: string) => {
    setSuggestions([]);
    setInput(description);

    if (placesServiceRef.current) {
      placesServiceRef.current.getDetails({ placeId }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const components = place.address_components || [];

          const getComponent = (type: string): string =>
            components.find((c) => c.types.includes(type))?.long_name || '';

          const streetNumber = getComponent('street_number');
          const route = getComponent('route');
          const apartment = getComponent('subpremise');
          const city = getComponent('locality') || getComponent('sublocality');
          const state = getComponent('administrative_area_level_1');
          const zip = getComponent('postal_code');

          const streetAddress = [streetNumber, route].filter(Boolean).join(' ');
          const fullAddress = [
            streetAddress,
            apartment ? `Apt/Suite ${apartment}` : '',
            city,
            state,
            zip,
          ]
            .filter(Boolean)
            .join(', ');

          onSelect({
            fullAddress: fullAddress,
            address: {
              streetAddress,
              apartment: apartment ?? '',
              city,
              state,
              zip,
              description: description,
            },
          });
        }
      });
    }
  };

  useEffect(() => {
    OutsideClick({
      wrapperRef,
      setIsOpen: (result: boolean) => {
        if (!result) setSuggestions([]);
      },
    });
  }, []);

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>; // Or a skeleton loader
  }

  return (
    <div className="google-input-wrapper form-control" ref={wrapperRef}>
      <input
        type="text"
        value={value || input}
        autoComplete="off"
        onChange={handleInputChange}
        className={`${error ? 'field-error' : ''}`}
        placeholder={placeholder}
        id={`google-input ${id}`}
      />
      {error && (
        <ErrorValidation
          errors={error}
          name={label?.toLowerCase()}
          sizeMax={sizeMax}
          sizeMin={sizeMin}
        />
      )}
      <label htmlFor={`google-input ${id}`} className="input-label">
        {label}
        {required && <span>*</span>}
      </label>
      {suggestions?.length > 0 && (
        <div className="address-list">
          {suggestions?.map((s) => (
            <button key={s.place_id} onClick={() => handleSelect(s.place_id, s.description)}>
              {s.description}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
