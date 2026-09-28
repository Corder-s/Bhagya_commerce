package com.bhagya.commerce.analytics.domain;

import java.math.BigDecimal;
import java.time.Instant;

public class ForecastRecord {
    private String id;
    private String storeId;
    private String metricName; // NET_REVENUE, ORDER_COUNT, DEMAND_PRODUCT
    private int horizonDays;
    private BigDecimal forecastValue;
    private BigDecimal lowerBound;
    private BigDecimal upperBound;
    private String method; // WEIGHTED_MOVING_AVERAGE, EXPONENTIAL_SMOOTHING
    private int trainingWindowDays;
    private BigDecimal mae; // Mean Absolute Error from historical backtest
    private String limitations;
    private Instant generatedAt;

    public ForecastRecord() {
        this.generatedAt = Instant.now();
    }

    public ForecastRecord(
        String id,
        String storeId,
        String metricName,
        int horizonDays,
        BigDecimal forecastValue,
        BigDecimal lowerBound,
        BigDecimal upperBound,
        String method,
        int trainingWindowDays,
        BigDecimal mae,
        String limitations
    ) {
        this.id = id;
        this.storeId = storeId;
        this.metricName = metricName;
        this.horizonDays = horizonDays;
        this.forecastValue = forecastValue;
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.method = method;
        this.trainingWindowDays = trainingWindowDays;
        this.mae = mae;
        this.limitations = limitations;
        this.generatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getMetricName() { return metricName; }
    public void setMetricName(String metricName) { this.metricName = metricName; }

    public int getHorizonDays() { return horizonDays; }
    public void setHorizonDays(int horizonDays) { this.horizonDays = horizonDays; }

    public BigDecimal getForecastValue() { return forecastValue; }
    public void setForecastValue(BigDecimal forecastValue) { this.forecastValue = forecastValue; }

    public BigDecimal getLowerBound() { return lowerBound; }
    public void setLowerBound(BigDecimal lowerBound) { this.lowerBound = lowerBound; }

    public BigDecimal getUpperBound() { return upperBound; }
    public void setUpperBound(BigDecimal upperBound) { this.upperBound = upperBound; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public int getTrainingWindowDays() { return trainingWindowDays; }
    public void setTrainingWindowDays(int trainingWindowDays) { this.trainingWindowDays = trainingWindowDays; }

    public BigDecimal getMae() { return mae; }
    public void setMae(BigDecimal mae) { this.mae = mae; }

    public String getLimitations() { return limitations; }
    public void setLimitations(String limitations) { this.limitations = limitations; }

    public Instant getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(Instant generatedAt) { this.generatedAt = generatedAt; }
}
