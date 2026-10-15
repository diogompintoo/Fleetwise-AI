package com.fleetwise.report;

import com.fleetwise.analytics.AnalyticsService;
import com.fleetwise.analytics.dto.AnomalyResponse;
import com.fleetwise.analytics.dto.FleetAnalyticsResponse;
import com.fleetwise.analytics.dto.VehicleAnalyticsResponse;
import com.fleetwise.company.Company;
import com.fleetwise.company.CompanyRepository;
import com.fleetwise.vehicle.Vehicle;
import com.fleetwise.vehicle.VehicleService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final AnalyticsService analyticsService;
    private final VehicleService vehicleService;
    private final CompanyRepository companyRepository;

    private static final Color PRIMARY_COLOR = new Color(30, 58, 138); // Blue 900
    private static final Color ACCENT_COLOR = new Color(37, 99, 235);  // Blue 600
    private static final Color HEADER_BG = new Color(241, 245, 249);   // Slate 100
    private static final Color ALT_ROW_BG = new Color(248, 250, 252);  // Slate 50
    private static final Color BORDER_COLOR = new Color(226, 232, 240);// Slate 200
    private static final Color ANOMALY_BG = new Color(254, 242, 242);  // Red 50
    private static final Color ANOMALY_TEXT = new Color(185, 28, 28);  // Red 700

    public byte[] generateFleetPdfReport(LocalDate from, LocalDate to, Long companyId) {
        FleetAnalyticsResponse fleet = analyticsService.getFleetAnalytics(from, to);
        List<AnomalyResponse> anomalies = analyticsService.detectAnomalies(from, to, BigDecimal.valueOf(15));
        List<Vehicle> vehicles = vehicleService.findAllEntities();

        if (companyId != null) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getCompany() != null && companyId.equals(v.getCompany().getId()))
                    .toList();
        }

        String companyName = resolveCompanyName(companyId);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 40, 40);
            PdfWriter writer = PdfWriter.getInstance(document, out);
            writer.setPageEvent(new PdfPageEventHelper() {
                @Override
                public void onEndPage(PdfWriter writer, Document doc) {
                    PdfPTable footer = new PdfPTable(1);
                    footer.setTotalWidth(523);
                    PdfPCell cell = new PdfPCell(new Phrase(
                            "FleetWise AI • Executive Fleet Performance Report • Confidential • Page " + writer.getPageNumber(),
                            FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY)));
                    cell.setBorder(Rectangle.NO_BORDER);
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    footer.addCell(cell);
                    footer.writeSelectedRows(0, -1, 36, 25, writer.getDirectContent());
                }
            });

            document.open();

            // 1. Header Banner
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{65f, 35f});

            PdfPCell titleCell = new PdfPCell();
            titleCell.setBorder(Rectangle.NO_BORDER);
            Paragraph brandTitle = new Paragraph("FleetWise AI", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, PRIMARY_COLOR));
            Paragraph subTitle = new Paragraph("Executive Fleet Performance & Analytics Report", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY));
            Paragraph compText = new Paragraph("Organization: " + companyName, FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY));
            titleCell.addElement(brandTitle);
            titleCell.addElement(subTitle);
            titleCell.addElement(compText);
            headerTable.addCell(titleCell);

            PdfPCell metaCell = new PdfPCell();
            metaCell.setBorder(Rectangle.NO_BORDER);
            metaCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Paragraph period = new Paragraph("Period: " + from.format(DateTimeFormatter.ISO_DATE) + " to " + to.format(DateTimeFormatter.ISO_DATE),
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.DARK_GRAY));
            period.setAlignment(Element.ALIGN_RIGHT);
            Paragraph generatedAt = new Paragraph("Generated: " + LocalDate.now().format(DateTimeFormatter.ISO_DATE),
                    FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY));
            generatedAt.setAlignment(Element.ALIGN_RIGHT);
            metaCell.addElement(period);
            metaCell.addElement(generatedAt);
            headerTable.addCell(metaCell);

            document.add(headerTable);
            document.add(new Paragraph(" "));

            // 2. Executive KPI Cards
            Paragraph kpiTitle = new Paragraph("1. Fleet Executive Summary", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, PRIMARY_COLOR));
            kpiTitle.setSpacingAfter(8f);
            document.add(kpiTitle);

            PdfPTable kpiTable = new PdfPTable(4);
            kpiTable.setWidthPercentage(100);
            kpiTable.setWidths(new float[]{25f, 25f, 25f, 25f});

            addKpiCell(kpiTable, "Total Distance", fleet.totalDistanceKm() + " km", ACCENT_COLOR);
            addKpiCell(kpiTable, "Total Fuel Cost", "€ " + (fleet.totalFuelCost() != null ? fleet.totalFuelCost().toPlainString() : "0.00"), ACCENT_COLOR);
            addKpiCell(kpiTable, "Avg Consumption", (fleet.averageConsumption() != null ? fleet.averageConsumption().toPlainString() : "0.0") + " L/100km", PRIMARY_COLOR);
            addKpiCell(kpiTable, "Cost / km", "€ " + (fleet.costPerKm() != null ? fleet.costPerKm().toPlainString() : "0.00"), PRIMARY_COLOR);

            document.add(kpiTable);
            document.add(new Paragraph(" "));

            // 3. Detected Anomalies
            Paragraph anomalyHeading = new Paragraph("2. Anomalies & Irregularities (>15% Variance)",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, PRIMARY_COLOR));
            anomalyHeading.setSpacingAfter(8f);
            document.add(anomalyHeading);

            if (anomalies == null || anomalies.isEmpty()) {
                PdfPTable okTable = new PdfPTable(1);
                okTable.setWidthPercentage(100);
                PdfPCell okCell = new PdfPCell(new Phrase("✓ No operational anomalies or excessive consumption variances detected for this period.",
                        FontFactory.getFont(FontFactory.HELVETICA, 9, new Color(22, 101, 52))));
                okCell.setBackgroundColor(new Color(240, 253, 244));
                okCell.setBorderColor(new Color(187, 247, 208));
                okCell.setPadding(8f);
                okTable.addCell(okCell);
                document.add(okTable);
            } else {
                PdfPTable anTable = new PdfPTable(5);
                anTable.setWidthPercentage(100);
                anTable.setWidths(new float[]{18f, 18f, 18f, 18f, 28f});

                addTableHeader(anTable, "Vehicle");
                addTableHeader(anTable, "Current");
                addTableHeader(anTable, "Baseline");
                addTableHeader(anTable, "Variation");
                addTableHeader(anTable, "Finding");

                for (AnomalyResponse an : anomalies) {
                    addTableCell(anTable, an.licensePlate(), ANOMALY_BG, ANOMALY_TEXT);
                    addTableCell(anTable, an.currentValue() != null ? an.currentValue().toPlainString() + " L" : "N/A", ANOMALY_BG, Color.DARK_GRAY);
                    addTableCell(anTable, an.baselineValue() != null ? an.baselineValue().toPlainString() + " L" : "N/A", ANOMALY_BG, Color.DARK_GRAY);
                    addTableCell(anTable, (an.variationPercent() != null ? an.variationPercent().toPlainString() : "0") + " %", ANOMALY_BG, ANOMALY_TEXT);
                    addTableCell(anTable, an.message() != null ? an.message() : "Spike observed", ANOMALY_BG, Color.DARK_GRAY);
                }
                document.add(anTable);
            }

            document.add(new Paragraph(" "));

            // 4. Vehicle Inventory & Performance Breakdown
            Paragraph vehicleHeading = new Paragraph("3. Vehicle Performance Breakdown",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, PRIMARY_COLOR));
            vehicleHeading.setSpacingAfter(8f);
            document.add(vehicleHeading);

            PdfPTable vTable = new PdfPTable(6);
            vTable.setWidthPercentage(100);
            vTable.setWidths(new float[]{18f, 22f, 15f, 15f, 15f, 15f});

            addTableHeader(vTable, "Plate");
            addTableHeader(vTable, "Vehicle");
            addTableHeader(vTable, "Distance");
            addTableHeader(vTable, "Fuel Cost");
            addTableHeader(vTable, "Consumption");
            addTableHeader(vTable, "Cost/km");

            boolean alt = false;
            for (Vehicle v : vehicles) {
                Color bg = alt ? ALT_ROW_BG : Color.WHITE;
                alt = !alt;

                VehicleAnalyticsResponse va = null;
                try {
                    va = analyticsService.getVehicleAnalytics(v.getId(), from, to);
                } catch (Exception ignored) {}

                addTableCell(vTable, v.getLicensePlate(), bg, Color.BLACK);
                addTableCell(vTable, v.getBrand() + " " + v.getModel(), bg, Color.DARK_GRAY);
                addTableCell(vTable, (va != null && va.totalDistanceKm() != null ? va.totalDistanceKm() : 0) + " km", bg, Color.DARK_GRAY);
                addTableCell(vTable, "€ " + (va != null && va.totalFuelCost() != null ? va.totalFuelCost().toPlainString() : "0.00"), bg, Color.DARK_GRAY);
                addTableCell(vTable, (va != null && va.averageConsumption() != null ? va.averageConsumption().toPlainString() : "0.0") + " L", bg, Color.DARK_GRAY);
                addTableCell(vTable, "€ " + (va != null && va.costPerKm() != null ? va.costPerKm().toPlainString() : "0.00"), bg, Color.DARK_GRAY);
            }

            document.add(vTable);
            document.close();

            return out.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate PDF report", e);
            throw new RuntimeException("Error generating fleet PDF report: " + e.getMessage(), e);
        }
    }

    public byte[] generateFleetCsvReport(LocalDate from, LocalDate to, Long companyId) {
        FleetAnalyticsResponse fleet = analyticsService.getFleetAnalytics(from, to);
        List<Vehicle> vehicles = vehicleService.findAllEntities();

        if (companyId != null) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getCompany() != null && companyId.equals(v.getCompany().getId()))
                    .toList();
        }

        StringBuilder csv = new StringBuilder();
        // UTF-8 BOM so Excel opens it with proper encoding
        csv.append('\uFEFF');

        // Header info
        csv.append("FleetWise AI — Executive Fleet Report\n");
        csv.append("Period,").append(from).append(" to ").append(to).append("\n");
        csv.append("Generated,").append(LocalDate.now()).append("\n\n");

        // KPI Overview
        csv.append("Metric,Value\n");
        csv.append("Total Distance (km),").append(fleet.totalDistanceKm()).append("\n");
        csv.append("Total Fuel Cost (EUR),").append(fleet.totalFuelCost() != null ? fleet.totalFuelCost() : "0").append("\n");
        csv.append("Total Liters (L),").append(fleet.totalLiters() != null ? fleet.totalLiters() : "0").append("\n");
        csv.append("Average Consumption (L/100km),").append(fleet.averageConsumption() != null ? fleet.averageConsumption() : "0").append("\n");
        csv.append("Cost per km (EUR/km),").append(fleet.costPerKm() != null ? fleet.costPerKm() : "0").append("\n\n");

        // Vehicle Breakdown
        csv.append("License Plate,Brand,Model,Fuel Type,Distance (km),Fuel Cost (EUR),Consumption (L/100km),Cost/km (EUR)\n");

        for (Vehicle v : vehicles) {
            VehicleAnalyticsResponse va = null;
            try {
                va = analyticsService.getVehicleAnalytics(v.getId(), from, to);
            } catch (Exception ignored) {}

            csv.append(v.getLicensePlate()).append(",")
                    .append(v.getBrand()).append(",")
                    .append(v.getModel()).append(",")
                    .append(v.getFuelType()).append(",")
                    .append(va != null && va.totalDistanceKm() != null ? va.totalDistanceKm() : 0).append(",")
                    .append(va != null && va.totalFuelCost() != null ? va.totalFuelCost().toPlainString() : "0.00").append(",")
                    .append(va != null && va.averageConsumption() != null ? va.averageConsumption().toPlainString() : "0.0").append(",")
                    .append(va != null && va.costPerKm() != null ? va.costPerKm().toPlainString() : "0.00").append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String resolveCompanyName(Long companyId) {
        if (companyId != null) {
            return companyRepository.findById(companyId)
                    .map(Company::getName)
                    .orElse("FleetWise Global");
        }
        return companyRepository.findAll().stream()
                .findFirst()
                .map(Company::getName)
                .orElse("FleetWise Demo Group");
    }

    private void addKpiCell(PdfPTable table, String label, String value, Color accentColor) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(HEADER_BG);
        cell.setBorderColor(BORDER_COLOR);
        cell.setPadding(8f);

        Paragraph pLabel = new Paragraph(label.toUpperCase(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, Color.GRAY));
        Paragraph pValue = new Paragraph(value, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, accentColor));
        cell.addElement(pLabel);
        cell.addElement(pValue);
        table.addCell(cell);
    }

    private void addTableHeader(PdfPTable table, String title) {
        PdfPCell cell = new PdfPCell(new Phrase(title, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE)));
        cell.setBackgroundColor(PRIMARY_COLOR);
        cell.setBorderColor(BORDER_COLOR);
        cell.setPadding(6f);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        table.addCell(cell);
    }

    private void addTableCell(PdfPTable table, String text, Color bg, Color textColor) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA, 8, textColor)));
        cell.setBackgroundColor(bg);
        cell.setBorderColor(BORDER_COLOR);
        cell.setPadding(5f);
        table.addCell(cell);
    }
}

