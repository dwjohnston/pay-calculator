

export type EmployeeDetails = {
    firstName: string;
    lastName: string;
    paymentStartDate: Date;
    paymentEndDate: Date;
    annualSalary: number;
    superRate: number;
}

export type EmployeePayslip = {
    firstName: string;
    lastName: string;
    paymentStartDate: Date;
    paymentEndDate: Date;
    grossIncome: number;
    incomeTax: number;
    netIncome: number;
    super: number;
}

import {isFirstDayOfMonth, isLastDayOfMonth, differenceInMonths,differenceInCalendarMonths} from "date-fns"; 

type TaxBracket = {
    threshold: number; 
    rate: number; 
    offset:number; 
}

const taxBrackets = [
    {

        threshold: 18200,
        rate: 0,
        offset: 0,
    },
    {
        threshold: 37000,
        rate: 0.19,
        offset: 0,
    },
    {
        threshold: 80000,
        rate: 0.325,
        offset: 3572,
    },
    {
        threshold: 180000,
        rate: 0.37,
        offset: 17547
    },
    {

        threshold: Infinity,
        rate: 0.45,
        offset: 54547
    }
].sort((a, b) => { // It's important that these are sorted
    if (a.threshold < b.threshold) {
        return -1;
    }
    return 1; 
});

/**
 * This function performs no rounding. 
 */
export function calculateAnnualTax(grossIncome: number): number {

    if (grossIncome < 0) {
        throw new Error("grossIncome must be positive");
    }


    // I'm not really a fan of how I've done this.
    // The alternative is that you could add the 'previousThreshold' to each of the tax brackets, and do an Array.find(). 
    // I generally prefer the Array.prototype methods. 
    let previousThreshold = 0; 
    let bracketToUse = null as null | TaxBracket; 

    for (let taxBracket of taxBrackets) {
        if (grossIncome < taxBracket.threshold) {
            bracketToUse = taxBracket; 
            break; 
        }else {
            previousThreshold = taxBracket.threshold; 
        }        
    }

    if (!bracketToUse) {
        throw new Error("Something has gone wrong, no bracket found");
    }

    return bracketToUse.offset + ((grossIncome - previousThreshold) * bracketToUse.rate);
}

/** I'm going to assume here that the pay periods are _always_ some number of months, that start on the first of a month and end of the last of a month. 
 * 
 *  In New Zealand for example you paying fortnightly (every two weeks) is common. 
 *  And then of course maybe you would issue a payslip for just three days work. 
 *  But for the purpose of this exercise, that complicates things quite a lot. 
*/
export function calculatePayPeriodPercentage(date1: Date, date2: Date) : number{
    if (date1 > date2) {
        throw new Error("date1 must be earlier than date2");
    }

    if (!isFirstDayOfMonth(date1)){
        throw new Error("date1 must be the first day of a month!"); 

    }

    if (!isLastDayOfMonth(date2)){
        throw new Error("date2 must be the last day of a month!"); 
    }

    const nMonths = differenceInCalendarMonths(date2, date1) +1; // We can safely do this because we know it is the start and end of the month 
    return nMonths/12; 
}


export function generateEmployeePayslip(employeeDetails: EmployeeDetails): EmployeePayslip {

    const {
        annualSalary, 
        paymentStartDate,
        paymentEndDate, 
        superRate, 
        firstName,
        lastName
    } = employeeDetails; 

    const annualTax = calculateAnnualTax(annualSalary); 
    const payPeriodPercentage = calculatePayPeriodPercentage(paymentStartDate, paymentEndDate); 
    
    const monthlyGrossIncome = Math.floor(annualSalary * payPeriodPercentage);
    const monthlyTax = Math.ceil(annualTax * payPeriodPercentage);
    const monthlyNetIncome = monthlyGrossIncome - monthlyTax;
    const monthlySuper = Math.floor(monthlyGrossIncome * superRate);
    
    return {
        firstName, 
        lastName, 
        paymentEndDate, 
        paymentStartDate, 
        grossIncome: monthlyGrossIncome, 
        netIncome: monthlyNetIncome, 
        super: monthlySuper, 
        incomeTax: monthlyTax
    }

}