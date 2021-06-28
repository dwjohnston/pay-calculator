import { calculateAnnualTax, calculatePayPeriodPercentage, generateEmployeePayslip } from '.';

describe ("calculateTax", () => {
    it("calculates the right amount for the lowest bracket", () => {
        expect(calculateAnnualTax(60050)).toBe(11063.25); 
    }); 
})

describe("calculatePayPeriodPercentage", () => {

    it ("invalid dates throw an error", () => {
        // First date is later
        expect (() => calculatePayPeriodPercentage(new Date(2021, 0, 31), new Date(2021, 0, 1))).toThrow();

        // Not the start of the month
        expect (() => calculatePayPeriodPercentage(new Date(2021, 0, 2), new Date(2021, 0, 31))).toThrow();

        // Not the end of the month
        expect (() => calculatePayPeriodPercentage(new Date(2021, 0, 1), new Date(2021, 0, 14))).toThrow();


    }); 
    it("returns 1/12 for a single month", () => {
        expect (calculatePayPeriodPercentage(new Date(2021, 0, 1), new Date(2021, 0, 31))).toBe(1/12);
        
    }); 

    it("returns 1 for a whole year", () => {
        expect (calculatePayPeriodPercentage(new Date(2021, 0, 1), new Date(2021, 11, 31))).toBe(1);        
    }); 
}); 


describe("generateEmployeePayslip", () => {

    it ("generates the right results", () => {
        expect(generateEmployeePayslip({
            firstName: "David", 
            lastName: "Rudd", 
            annualSalary: 60050, 
            superRate: 0.09, 
            paymentStartDate: new Date(2021, 2, 1), 
            paymentEndDate: new Date(2021, 2, 31)
        })).toEqual({
            firstName: "David", 
            lastName: "Rudd", 
            paymentStartDate: new Date(2021, 2, 1), 
            paymentEndDate: new Date(2021, 2, 31),
            grossIncome: 5004, 
            incomeTax: 922, 
            netIncome: 4082, 
            super: 450
        }); 
        
        expect(generateEmployeePayslip({
            firstName: "Ryan", 
            lastName: "Chen", 
            annualSalary: 120000, 
            superRate: 0.10, 
            paymentStartDate: new Date(2021, 2, 1), 
            paymentEndDate: new Date(2021, 2, 31)
        })).toEqual({
            firstName: "Ryan", 
            lastName: "Chen", 
            paymentStartDate: new Date(2021, 2, 1), 
            paymentEndDate: new Date(2021, 2, 31),
            grossIncome: 10000, 
            incomeTax: 2696, 
            netIncome: 7304, 
            super: 1000
        }); 
    })
}); 