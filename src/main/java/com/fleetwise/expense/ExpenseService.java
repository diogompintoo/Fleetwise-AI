package com.fleetwise.expense;

import com.fleetwise.common.exception.ResourceNotFoundException;
import com.fleetwise.expense.dto.CreateExpenseRequest;
import com.fleetwise.expense.dto.ExpenseResponse;
import com.fleetwise.expense.dto.UpdateExpenseRequest;
import com.fleetwise.vehicle.Vehicle;
import com.fleetwise.vehicle.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final VehicleService vehicleService;

    public List<ExpenseResponse> findAll() {
        return expenseRepository.findAll().stream().map(ExpenseMapper::toResponse).toList();
    }

    public List<ExpenseResponse> findByVehicle(Long vehicleId) {
        vehicleService.getEntity(vehicleId);
        return expenseRepository.findByVehicleId(vehicleId).stream()
                .map(ExpenseMapper::toResponse).toList();
    }

    public ExpenseResponse findById(Long id) {
        return ExpenseMapper.toResponse(getEntity(id));
    }

    public Expense getEntity(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", id));
    }

    @Transactional
    public ExpenseResponse create(CreateExpenseRequest request) {
        Vehicle vehicle = vehicleService.getEntity(request.vehicleId());
        Expense saved = expenseRepository.save(ExpenseMapper.toEntity(request, vehicle));
        return ExpenseMapper.toResponse(saved);
    }

    @Transactional
    public ExpenseResponse update(Long id, UpdateExpenseRequest request) {
        Expense expense = getEntity(id);
        ExpenseMapper.updateEntity(expense, request);
        return ExpenseMapper.toResponse(expenseRepository.save(expense));
    }

    @Transactional
    public void delete(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense", id);
        }
        expenseRepository.deleteById(id);
    }
}
