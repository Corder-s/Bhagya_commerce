package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.analytics.dto.ForecastResponse;
import com.bhagya.commerce.analytics.service.ForecastService;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GetForecastTool implements AITool {

    private final ForecastService forecastService;

    public GetForecastTool(ForecastService forecastService) {
        this.forecastService = forecastService;
    }

    @Override
    public String name() {
        return "getSalesForecast";
    }

    @Override
    public String description() {
        return "Generate an explainable revenue forecast with upper/lower confidence bounds, model hyperparameters, and transparent limitations disclaimers.";
    }

    @Override
    public AIToolCategory category() {
        return AIToolCategory.READ_ONLY;
    }

    @Override
    public boolean requiresConfirmation() {
        return false;
    }

    @Override
    public String requiredPermission() {
        return "ANALYTICS_VIEW";
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        String storeId = context.storeId() != null ? context.storeId() : "store_varanasi_silk";
        int horizonDays = 14;
        if (parameters.get("horizonDays") instanceof Number num) {
            horizonDays = num.intValue();
        }

        try {
            ForecastResponse forecast = forecastService.generateSalesForecast(storeId, horizonDays);
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("metricKey", forecast.metricKey());
            map.put("horizonDays", forecast.horizonDays());
            map.put("modelType", forecast.method());
            map.put("projectedTotal", forecast.forecastValue().toPlainString());
            map.put("lowerConfidenceBound", forecast.lowerBound().toPlainString());
            map.put("upperConfidenceBound", forecast.upperBound().toPlainString());
            map.put("meanAbsoluteError", forecast.meanAbsoluteError().toPlainString());
            map.put("confidenceLevel", forecast.confidenceIntervalLabel());
            map.put("explanation", forecast.method() + " based on " + forecast.trainingWindowDays() + " trailing days");
            map.put("limitationsDisclaimer", forecast.limitationsNotice());
            map.put("dataPointsCount", forecast.trajectory() != null ? forecast.trajectory().size() : 0);

            return AIToolResult.success(map);
        } catch (Exception e) {
            return AIToolResult.failure("Failed to generate sales forecast: " + e.getMessage());
        }
    }
}
