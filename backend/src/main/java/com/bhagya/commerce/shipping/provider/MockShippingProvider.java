package com.bhagya.commerce.shipping.provider;

import com.bhagya.commerce.shipping.domain.DeliveryAttempt;
import com.bhagya.commerce.shipping.domain.PickupRequest;
import com.bhagya.commerce.shipping.domain.Shipment;
import com.bhagya.commerce.shipping.domain.ShipmentStatus;
import com.bhagya.commerce.shipping.domain.ShippingLabel;
import com.bhagya.commerce.shipping.dto.CreateShipmentRequest;
import com.bhagya.commerce.shipping.dto.PickupRequestDto;
import com.bhagya.commerce.shipping.dto.ServiceabilityResponse;
import com.bhagya.commerce.shipping.dto.ShipmentEventResponse;
import com.bhagya.commerce.shipping.dto.ShippingRateDto;
import com.bhagya.commerce.shipping.dto.ShippingRateRequest;
import com.bhagya.commerce.shipping.dto.TrackingResponse;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component("mockShippingProvider")
public class MockShippingProvider implements ShippingProvider {

    @Override
    public String getProviderName() {
        return "BHAGYA_SANDBOX_LOGISTICS";
    }

    @Override
    public List<ShippingRateDto> getRates(ShippingRateRequest request) {
        BigDecimal baseSurface = new BigDecimal("49.00");
        BigDecimal baseExpress = new BigDecimal("99.00");

        // Weight adjustments
        if (request.weightKg() != null && request.weightKg().compareTo(new BigDecimal("1.0")) > 0) {
            baseSurface = baseSurface.add(new BigDecimal("30.00"));
            baseExpress = baseExpress.add(new BigDecimal("50.00"));
        }

        // Free shipping rule: orders over ₹1500 have 0 standard rate
        if (request.declaredValueInr() != null && request.declaredValueInr().compareTo(new BigDecimal("1500.00")) >= 0) {
            baseSurface = BigDecimal.ZERO;
        }

        return List.of(
            new ShippingRateDto(
                "rate_delhivery_surface",
                "Delhivery",
                "SURFACE_STANDARD",
                "Delhivery Surface Express",
                "Delhivery",
                3,
                baseSurface,
                "INR",
                true,
                "NATIONAL"
            ),
            new ShippingRateDto(
                "rate_bluedart_air",
                "BlueDart",
                "AIR_PRIORITY",
                "BlueDart Air Cargo Express",
                "BlueDart",
                2,
                baseExpress,
                "INR",
                true,
                "NATIONAL"
            )
        );
    }

    @Override
    public ServiceabilityResponse checkServiceability(String postalCode) {
        if (postalCode == null || postalCode.length() != 6 || !postalCode.chars().allMatch(Character::isDigit)) {
            return new ServiceabilityResponse(postalCode, false, "NOT_SERVICEABLE", false, 0, List.of(), "Invalid Indian pincode format");
        }

        // Mock unserviceable remote areas (e.g. starting with 19 for certain high altitude areas)
        if (postalCode.startsWith("199")) {
            return new ServiceabilityResponse(postalCode, false, "NOT_SERVICEABLE", false, 0, List.of(), "Location not covered by courier network");
        }

        // Metros / tier 1 get 2-day delivery
        int days = postalCode.startsWith("560") || postalCode.startsWith("110") || postalCode.startsWith("400") ? 2 : 4;

        return new ServiceabilityResponse(
            postalCode,
            true,
            "DELIVERABLE",
            true,
            days,
            List.of("Delhivery Express", "BlueDart Logistics", "Shadowfax Prime"),
            "Standard & Express courier delivery available with COD support"
        );
    }

    @Override
    public Shipment createShipment(CreateShipmentRequest request, String orderNumber) {
        String trackingNumber = "DLH-" + (System.currentTimeMillis() % 100000000);
        String shipmentId = "ship_" + UUID.randomUUID().toString().substring(0, 8);
        Instant est = Instant.now().plus(3, ChronoUnit.DAYS);

        Shipment shipment = new Shipment(
            shipmentId,
            request.orderId(),
            request.carrier() != null ? request.carrier() : "Delhivery Express",
            trackingNumber,
            ShipmentStatus.MANIFESTED,
            est
        );
        shipment.setOrigin("Varanasi Artisan Hub, UP");
        shipment.setDestination("Customer Destination Hub");
        return shipment;
    }

    @Override
    public boolean cancelShipment(String shipmentId) {
        // Can be cancelled only before picked up
        return true;
    }

    @Override
    public ShippingLabel generateLabel(String shipmentId, String trackingNumber) {
        String labelId = "lbl_" + UUID.randomUUID().toString().substring(0, 8);
        String storageKey = "labels/" + shipmentId + "/shipping_label_" + trackingNumber + ".pdf";
        String downloadUrl = "/api/v1/merchant/shipments/" + shipmentId + "/label";
        return new ShippingLabel(labelId, shipmentId, storageKey, trackingNumber, downloadUrl);
    }

    @Override
    public PickupRequest requestPickup(PickupRequestDto dto) {
        String pickupId = "pkp_" + UUID.randomUUID().toString().substring(0, 8);
        String ref = "PKP-REF-" + (System.currentTimeMillis() % 1000000);
        return new PickupRequest(pickupId, dto.shipmentId(), dto.carrier(), dto.pickupDate(), ref, dto.notes());
    }

    @Override
    public TrackingResponse getTracking(String trackingNumber) {
        Instant now = Instant.now();
        List<ShipmentEventResponse> events = List.of(
            new ShipmentEventResponse("ev_1", "ORDER_CONFIRMED", "Order Placed & Payment Verified", "Order confirmed by Bhagya Commerce", "Varanasi Hub", now.minus(24, ChronoUnit.HOURS)),
            new ShipmentEventResponse("ev_2", "PROCESSING", "Handcrafted & Packed", "Artisan verified and packed in eco-friendly protective packaging", "Varanasi Workshop", now.minus(18, ChronoUnit.HOURS)),
            new ShipmentEventResponse("ev_3", "SHIPPED", "Handed over to Courier Partner", "Surface container scanned into national logistics grid", "Varanasi Logistics Gateway", now.minus(10, ChronoUnit.HOURS)),
            new ShipmentEventResponse("ev_4", "OUT_FOR_DELIVERY", "Out for Delivery", "Courier associate is on the way to delivery address", "Local Distribution Hub", now.minus(1, ChronoUnit.HOURS))
        );

        return new TrackingResponse(
            trackingNumber,
            "Delhivery Express",
            trackingNumber,
            "OUT_FOR_DELIVERY",
            "Today by 7:00 PM",
            "Local Hub",
            3,
            events
        );
    }
}
