import { format, sub } from 'date-fns';

interface ICustomDateProps {
  firstInstructionDesc?: string;
  secondInstructionDesc?: string;
}

interface IBoletoTax {
  bank_interest_rate?: {
    mode: string;
    start_date: Date;
    percentage: number;
    amount: number;
  } | null;
  late_fee?: {
    mode: string;
    amount: number;
    percentage: number;
    start_date: Date;
  } | null;
  discount?: {
    mode: string;
    limit_date: Date;
    amount: number;
    percentage: number;
  } | null;
  payment_limit_date?: Date;
  description: string;
  amount: number;
  custom_data?: Record<string, unknown>;
}

const boletoMinTaxValue = 0.01;

export const calcTaxBoleto = ({
  bank_interest_rate,
  late_fee,
  discount,
  payment_limit_date,
  amount,
  description,
  custom_data,
}: IBoletoTax): Omit<
  IBoletoTax,
  'amount' | 'payment_limit_date' | 'custom_data'
> => {
  let new_bank_interest_rate = bank_interest_rate;
  let new_late_fee = late_fee;
  const new_discount = discount;
  let new_description = description;

  if (bank_interest_rate) {
    if (
      bank_interest_rate.percentage &&
      (parseFloat((bank_interest_rate.percentage || 0).toFixed(2)) / 100) *
        amount <
        boletoMinTaxValue
    ) {
      new_bank_interest_rate = null;
    } else if (bank_interest_rate.percentage && new_bank_interest_rate) {
      new_bank_interest_rate.percentage = parseFloat(
        (bank_interest_rate.percentage || 0).toFixed(2),
      );
    }

    if (
      bank_interest_rate.amount &&
      parseFloat((bank_interest_rate.amount || 0).toFixed(2)) <
        boletoMinTaxValue
    ) {
      new_bank_interest_rate = null;
    } else if (bank_interest_rate.amount && new_bank_interest_rate) {
      new_bank_interest_rate.amount = parseFloat(
        (bank_interest_rate.amount || 0).toFixed(2),
      );
    }
  }

  if (late_fee) {
    if (
      late_fee.percentage &&
      (parseFloat((late_fee.percentage || 0).toFixed(2)) / 100) * amount <
        boletoMinTaxValue
    ) {
      new_late_fee = null;
    } else if (late_fee.percentage && new_late_fee) {
      new_late_fee.percentage = parseFloat(
        (late_fee.percentage || 0).toFixed(2),
      );
    }

    if (
      late_fee.amount &&
      parseFloat((late_fee.amount || 0).toFixed(2)) < boletoMinTaxValue
    ) {
      new_late_fee = null;
    } else if (late_fee.amount && new_late_fee) {
      new_late_fee.amount = parseFloat((late_fee.amount || 0).toFixed(2));
    }
  }

  if (discount) {
    if (discount.percentage && new_discount) {
      new_discount.percentage = parseFloat(
        (discount.percentage || 0).toFixed(2),
      );
    }

    if (discount.amount && new_discount) {
      new_discount.amount = parseFloat((discount.amount || 0).toFixed(2));
    }
  }

  if (payment_limit_date) {
    const boletoDate = sub(new Date(payment_limit_date), {
      days: 1,
    });
    const formattedDate = format(boletoDate, 'dd/MM/yyyy');

    new_description += `\n Não receber após dia ${formattedDate}`;
  }

  if (custom_data) {
    const new_custom_data = custom_data as ICustomDateProps;

    if (new_custom_data.firstInstructionDesc) {
      new_description += `\n\n${new_custom_data.firstInstructionDesc}`;
    }

    if (new_custom_data.secondInstructionDesc) {
      new_description += `\n\n${new_custom_data.secondInstructionDesc}`;
    }
  }

  return {
    late_fee: new_late_fee,
    bank_interest_rate: new_bank_interest_rate,
    discount: new_discount,
    description: new_description,
  };
};
