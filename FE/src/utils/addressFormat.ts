export const formatAddress = (address: any) =>
  address
    ? [
        address.street_address,
        address.apartment_suite,
        address.city,
        `${address.state} ${address.zip_code}`,
      ]
        .filter(Boolean)
        .join(', ')
    : 'N/A';
