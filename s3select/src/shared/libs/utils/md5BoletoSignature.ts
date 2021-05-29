import crypto from 'crypto';

interface IMd5BoletoSignatureProps {
  seller_tax_number: string;
  customer_tax_number: string;
  internal_id: string;
  interest: string;
  discount: string;
  late_fee: string;
  value: string;
  due_at: string;
  description: string;
}

export const md5BoletoSignature = ({
  seller_tax_number,
  customer_tax_number,
  internal_id,
  interest,
  discount,
  late_fee,
  value,
  due_at,
  description,
}: IMd5BoletoSignatureProps): string => {
  return crypto
    .createHash('md5')
    .update(
      seller_tax_number +
        customer_tax_number +
        internal_id +
        interest +
        discount +
        late_fee +
        value +
        due_at +
        description,
    )
    .digest('hex');
};
