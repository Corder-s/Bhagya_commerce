package com.bhagya.commerce.shipping.provider;

import com.bhagya.commerce.shipping.domain.DeliveryAttempt;
import com.bhagya.commerce.shipping.domain.PickupRequest;
import com.bhagya.commerce.shipping.domain.Shipment;
import com.bhagya.commerce.shipping.domain.ShippingLabel;
import com.bhagya.commerce.shipping.dto.CreateShipmentRequest;
import com.bhagya.commerce.shipping.dto.PickupRequestDto;
import com.bhagya.commerce.shipping.dto.ServiceabilityResponse;
import com.bhagya.commerce.shipping.dto.ShippingRateDto;
import com.bhagya.commerce.shipping.dto.ShippingRateRequest;
import com.bhagya.commerce.shipping.dto.TrackingResponse;
import java.util.List;

public interface ShippingProvider {
    String getProviderName();

    List<ShippingRateDto> getRates(ShippingRateRequest request);

    ServiceabilityResponse checkServiceability(String postalCode);

    Shipment createShipment(CreateShipmentRequest request, String orderNumber);

    boolean cancelShipment(String shipmentId);

    ShippingLabel generateLabel(String shipmentId, String trackingNumber);

    PickupRequest requestPickup(PickupRequestDto dto);

    TrackingResponse getTracking(String trackingNumber);
}
