package com.bhagya.commerce.storefront.controller;

import com.bhagya.commerce.storefront.dto.PublicStorefrontData;
import com.bhagya.commerce.storefront.service.StorefrontService;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/public/storefront")
public class PublicStorefrontController {

    private final StorefrontService storefrontService;

    public PublicStorefrontController(StorefrontService storefrontService) {
        this.storefrontService = storefrontService;
    }

    @GetMapping("/{storeSlug}")
    public ResponseEntity<PublicStorefrontData> getPublicStorefront(
            @PathVariable String storeSlug,
            @RequestHeader(value = "Host", required = false) String host,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch
    ) {
        PublicStorefrontData data = storefrontService.getPublishedStorefront(storeSlug, host);
        String etag = "\"sf-" + storeSlug + "-v" + data.version() + "\"";

        if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .eTag(etag)
                    .cacheControl(CacheControl.maxAge(60, TimeUnit.SECONDS).sMaxAge(300, TimeUnit.SECONDS).staleWhileRevalidate(600, TimeUnit.SECONDS).cachePublic())
                    .build();
        }

        return ResponseEntity.ok()
                .eTag(etag)
                .cacheControl(CacheControl.maxAge(60, TimeUnit.SECONDS).sMaxAge(300, TimeUnit.SECONDS).staleWhileRevalidate(600, TimeUnit.SECONDS).cachePublic())
                .body(data);
    }

    @GetMapping("/resolve")
    public ResponseEntity<PublicStorefrontData> resolveByHostname(
            @RequestHeader(value = "Host") String host
    ) {
        PublicStorefrontData data = storefrontService.getPublishedStorefront(null, host);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(60, TimeUnit.SECONDS).sMaxAge(300, TimeUnit.SECONDS).cachePublic())
                .body(data);
    }
}
