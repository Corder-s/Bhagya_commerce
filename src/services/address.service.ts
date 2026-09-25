import type { Address } from "@/features/checkout/checkout-types";
import { checkoutStorage } from "@/lib/storage/checkout-storage";

/**
 * Address Service — client abstraction layer for address book management.
 * Future Spring Boot target: GET/POST/PUT /api/v1/customer/addresses
 */
export const addressService = {
  async getSavedAddresses(): Promise<Address[]> {
    return Promise.resolve(checkoutStorage.getSavedAddresses());
  },

  async saveAddress(address: Address): Promise<Address> {
    const addresses = checkoutStorage.getSavedAddresses();
    const newAddress: Address = {
      ...address,
      id: address.id || `addr_${Date.now()}`,
    };

    const updated = [newAddress, ...addresses.filter((a) => a.id !== newAddress.id)];
    checkoutStorage.saveSavedAddresses(updated);
    return Promise.resolve(newAddress);
  },

  async deleteAddress(id: string): Promise<void> {
    const addresses = checkoutStorage.getSavedAddresses();
    const filtered = addresses.filter((a) => a.id !== id);
    checkoutStorage.saveSavedAddresses(filtered);
    return Promise.resolve();
  },
};
