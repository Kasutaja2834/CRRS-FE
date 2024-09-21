
 export interface Reservation {
    reservationId?: number;
    //now()
   // dateOfBooking: Date; paneb BE
    // @DateTimeFormat(pattern = "yyyy-MM-dd")
    dateFrom: Date;
    // @DateTimeFormat(pattern = "yyyy-MM-dd")
    dateTo: Date;
    customerId: number;
    carId: number;
    branchOfLoanId: number;
    branchOfReturnId: number; //return department
    amount: number//Double;
    loanId: number;
    refundId: number;

}
