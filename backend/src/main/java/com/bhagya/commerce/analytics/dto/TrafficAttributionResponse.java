package com.bhagya.commerce.analytics.dto;

import java.util.List;

public record TrafficAttributionResponse(
    List<TrafficSourcePoint> sources
) {}
