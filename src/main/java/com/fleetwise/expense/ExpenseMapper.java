package com.fleetwise.expense;

import com.fleetwise.expense.dto.CreateExpenseRequest;
import com.fleetwise.expense.dto.ExpenseResponse;
import com.fleetwise.expense.dto.UpdateExpenseRequest;
import com.fleetwise.vehicle.Vehicle;

public final class ExpenseMapper {

    private ExpenseMapper() {}

    public static Expense toEntity(CreateExpenseRequest request, Vehicle vehicle) {
        return Expense.builder()
                .vehicle(vehicle)
                .date(request.date())
                .type(request.type().trim())
                .description(request.description() != null ? request.description().trim() : null)
                .amount(request.amount())
                .build();
    }

    public static void updateEntity(Expense expense, UpdateExpenseRequest request) {
        expense.setDate(request.date());
        expense.setType(request.type().trim());
        expense.setDescription(request.description() != null ? request.description().trim() : null);
        expense.setAmount(request.amount());
    }

    public static ExpenseResponse toResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getVehicle().getId(),
                expense.getDate(),
                expense.getType(),
                expense.getDescription(),
                expense.getAmount()
        );
    }
}
